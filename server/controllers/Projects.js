const Project = require("../models/Projects");
const User = require("../models/User");
const Notification = require("../models/Notification");
const ClockInOut = require("../models/ClockInOut");
const { DateTime } = require("luxon");

module.exports = {
  create: async (req, res) => {
    try {
      const {
        projectName,
        departmentHead,
        primarySkill,
        secondarySkill,
        thirdSkill,
        fourthSkill,
        employee,
        startTime,
        endTime,
        img,
        companyId,
      } = req.body;

      const project = new Project({
        projectName,
        departmentHead,
        primarySkill,
        secondarySkill: secondarySkill || undefined,
        thirdSkill: thirdSkill || undefined,
        fourthSkill: fourthSkill || undefined,
        employee,
        startTime,
        endTime,
        img,
      });
      await project.save();

      const availableUsers = await User.find({
        primarySkill: primarySkill,
        role: "user",
        company: companyId,
        $or: [{ project: null }, { project: { $exists: false } }],
      }).limit(employee);

      if (availableUsers.length === 0) {
        const noEmployeeNotification = new Notification({
          user: departmentHead,
          message: `No employees with the required primary skill (${primarySkill}) are available for the project: ${projectName}`,
          company: departmentHead,
        });
        await noEmployeeNotification.save();

        return res.status(201).json({
          message: `Project created but No employees with the primary skill are available for the project: ${projectName}`,
          project,
        });
      }

      if (availableUsers.length < employee) {
        return res.status(201).json({
          message: `Project created but only ${availableUsers.length} user(s) available, but ${employee} were required`,
          project,
        });
      }

      const clockInOutBulkData = [];
      const userUpdates = availableUsers.map(async (user) => {
        user.project = project._id;
        await user.save();

        const notification = new Notification({
          user: user._id,
          company: user.company,
          message: `You have been assigned to the project: ${projectName}`,
        });
        await notification.save();

        const startDate = DateTime.fromISO(startTime, { zone: "Asia/Kolkata" });
        const endDate = DateTime.fromISO(endTime, { zone: "Asia/Kolkata" });

        let currentDate = startDate;

        while (currentDate <= endDate) {
          const dayOfWeek = currentDate.weekday;

          if (dayOfWeek < 6) {
            const clockIn = currentDate.set({
              hour: startDate.hour + 5, // Add 5 hours
              minute: startDate.minute + 30, // Add 30 minutes
            });
            const clockOut = currentDate.set({
              hour: endDate.hour + 5,
              minute: endDate.minute + 30,
            });

            const clockInUTC = clockIn.toUTC().toISO();
            const clockOutUTC = clockOut.toUTC().toISO();

            // Check if a ClockInOut already exists for the current day
            const existingClockInOut = await ClockInOut.findOne({
              user: user._id,
              createdAt: { $gte: currentDate.toJSDate() },
              assigned: true,
            });

            if (existingClockInOut) {
              existingClockInOut.clockIn = clockInUTC;
              existingClockInOut.clockOut = clockOutUTC;
              existingClockInOut.project = project._id;
              await existingClockInOut.save();
            } else {
              clockInOutBulkData.push({
                user: user._id,
                company: user.company,
                clockIn: clockInUTC,
                clockOut: clockOutUTC,
                project: project._id,
                assigned: true,
              });
            }
          }

          currentDate = currentDate.plus({ days: 1 });
        }
      });

      await Promise.all(userUpdates);

      if (clockInOutBulkData.length > 0) {
        await ClockInOut.insertMany(clockInOutBulkData);
      }

      res.status(201).json({
        message: "Project created and assigned to user",
        project,
        assignedUsers: availableUsers.map((user) => user.email),
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  list: async (req, res) => {
    try {
      const { projectName, company } = req.query;
      const findCondition = {};
      if (projectName && projectName != "") {
        findCondition.projectName = {
          $regex: `^${projectName}`,
          $options: "i",
        };
      }

      const projects = await Project.find(findCondition)
        .populate("primarySkill")
        .populate("secondarySkill")
        .populate("thirdSkill")
        .populate("fourthSkill")
        .populate("departmentHead");

      const filteredProjects = projects.filter((project) => {
        return (
          project.departmentHead &&
          String(project.departmentHead.company) === company
        );
      });

      res.json(filteredProjects);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  remove: async (req, res) => {
    try {
      const { project_id } = req.params;

      const project = await Project.findByIdAndDelete(project_id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      await User.updateMany(
        { project: project_id },
        { $set: { project: null } }
      );

      await ClockInOut.deleteMany({ project: project_id });

      res.status(200).json({ message: "Project removed successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
