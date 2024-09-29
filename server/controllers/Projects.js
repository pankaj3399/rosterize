const Project = require("../models/Projects");
const User = require("../models/User");
const Notification = require("../models/Notification");
const ClockInOut = require("../models/ClockInOut");

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
      });
      await project.save();

      const availableUsers = await User.find({
        primarySkill: primarySkill,
        role: "user",
        $or: [{ project: null }, { project: { $exists: false } }],
      }).limit(employee);

      if (availableUsers.length < employee) {
        return res.status(404).json({
          message: `Only ${availableUsers.length} user(s) available, but ${employee} were required`,
        });
      }

      const userUpdates = availableUsers.map(async (user) => {
        user.project = project._id;
        await user.save();

        const notification = new Notification({
          user: user._id,
          company: user.company,
          message: `You have been assigned to the project: ${projectName}`,
        });
        await notification.save();

        const startDate = new Date(startTime);
        const endDate = new Date(endTime);
        const startClockInTime = new Date(startTime);
        const endClockOutTime = new Date(endTime);

        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          const clockIn = new Date(currentDate);
          clockIn.setHours(startClockInTime.getUTCHours());
          clockIn.setMinutes(startClockInTime.getUTCMinutes());
          clockIn.setSeconds(0);

          const clockOut = new Date(currentDate);
          clockOut.setHours(endClockOutTime.getUTCHours());
          clockOut.setMinutes(endClockOutTime.getUTCMinutes());
          clockOut.setSeconds(0);

          const existingClockInOut = await ClockInOut.findOne({
            user: user._id,
            createdAt: { $gte: currentDate },
            assigned: true,
          });

          if (existingClockInOut) {
            existingClockInOut.clockIn = clockIn;
            existingClockInOut.clockOut = clockOut;
            existingClockInOut.project = project._id;
            await existingClockInOut.save();
          } else {
            const newClockInOut = new ClockInOut({
              user: user._id,
              company: user.company,
              clockIn: clockIn,
              clockOut: clockOut,
              project: project._id,
              assigned: true,
            });
            await newClockInOut.save();
          }

          currentDate.setDate(currentDate.getDate() + 1);
        }
      });

      await Promise.all(userUpdates);

      res.status(201).json({
        message: `Project created and assigned to ${availableUsers.length} user(s)`,
        project,
        assignedUsers: availableUsers.map((user) => user.email),
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  list: async (req, res) => {
    try {
      const { projectName } = req.query;
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

      res.json(projects);
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
