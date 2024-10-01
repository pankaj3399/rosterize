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
        img,
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

      const availableUsers = await User.find({
        primarySkill: primarySkill,
        role: "user",
        $or: [{ project: null }, { project: { $exists: false } }],
      }).limit(employee);

      // Notify if no employees are available for the project
      if (availableUsers.length === 0) {
        // Create a notification about no available employees
        const noEmployeeNotification = new Notification({
          user: departmentHead,
          message: `No employees with the required primary skill (${primarySkill}) are available for the project: ${projectName}`,
          company: departmentHead, // Assuming departmentHead represents the company or person to notify
        });
        await noEmployeeNotification.save();
        await project.save();

        return res.status(404).json({
          message: `No employees with the primary skill are available for the project: ${projectName}`,
        });
      }

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

        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
          // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
          const dayOfWeek = currentDate.getUTCDay();

          // Only process weekdays (Monday to Friday)
          if (dayOfWeek !== 6 && dayOfWeek !== 0) {
            const clockIn = new Date(currentDate);
            clockIn.setUTCHours(startClockInTime.getUTCHours());
            clockIn.setUTCMinutes(startClockInTime.getUTCMinutes());
            clockIn.setUTCSeconds(0);

            const clockOut = new Date(currentDate);
            clockOut.setUTCHours(endClockOutTime.getUTCHours());
            clockOut.setUTCMinutes(endClockOutTime.getUTCMinutes());
            clockOut.setUTCSeconds(0);

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
          }

          // Move to the next day
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
