const Leave = require("../models/Leave");
const User = require("../models/User");
const Department = require("../models/Department");
const Company = require("../models/Company");
const ClockInOut = require("../models/ClockInOut");
const Notification = require("../models/Notification");
const ExcelJS = require("exceljs");
const Project = require("../models/Projects");

module.exports = {
  getLeaves: async function (req, res) {
    try {
      const { status } = req.query;
      const department_id = req.department;
      const findCondition = {
        department: department_id,
        departmentHead: req.user._id,
      };
      if (status) findCondition.status = status;
      const leaves = await Leave.find(findCondition)
        .populate("user", "name email")
        .populate("department", "name")
        .populate("departmentHead")
        .populate("company", "name");
      return res.status(200).json(leaves);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  changeLeaveStatus: async function (req, res) {
    try {
      const { status } = req.body;
      const leaveId = req.params.id;
      const leave = await Leave.findById(leaveId);
      if (!leave) return res.status(404).json({ message: "Leave not found." });
      leave.status = status;
      await leave.save();

      // raise notification to user
      const notification = new Notification({
        user: leave.user,
        message: `Your leave request has been ${status} from ${leave.startDate} to ${leave.endDate}.`,
        company: leave.company,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await notification.save();

      // // reduce the leave balance from the user account

      // if (status === "approved") {
      //   const user = await User.findById(leave.user);
      //   const startDate = new Date(leave.startDate);
      //   const endDate = new Date(leave.endDate);
      //   const diffTime = Math.abs(endDate - startDate);
      //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      //   if (leave.leaveType === "annual") {
      //     user.leavesTaken += diffDays;
      //     // const leaveBalance = user.balanceOfAnnualLeaves;
      //     // user.balanceOfAnnualLeaves = leaveBalance - diffDays;
      //   } else {
      //     const medicalLeaveBalance = user.balanceOfMedicalLeaves;
      //     user.balanceOfMedicalLeaves = medicalLeaveBalance - diffDays;
      //   }

      //   await user.save();
      // }

      return res.status(200).json(leave);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  schedule: async function (req, res) {
    try {
      const { from, to } = req.query;
      if (!from || !to)
        return res
          .status(400)
          .json({ message: "Please provide from and to date." });

      const findCondition = {
        clockIn: { $gte: from, $lte: to },
        assigned: true,
        company: req.company,
      };
      if (req.department) {
        const users = await User.find({ department: req.department });
        findCondition.user = { $in: users.map((user) => user._id) };
      }

      const clockInOut = await ClockInOut.find(findCondition)
        .populate("user", "name email")
        .populate("project", "projectName")
        .populate("company", "name");

      return res.status(200).json(clockInOut);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  addSchedule: async function (req, res) {
    try {
      const { user, company, clockIn, clockOut, date, project_id } = req.body;

      if (!user || !company || !clockIn || !clockOut || !date || !project_id)
        return res.status(400).json({ message: "Please provide all fields." });

      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(startDate.getDate() + 1);

      if (clockIn === "OFF" && clockOut === "OFF") {
        const existingSchedule = await ClockInOut.findOneAndDelete({
          user,
          clockIn: { $gte: startDate, $lt: endDate },
          assigned: true,
        });
        if (existingSchedule) {
          return res
            .status(200)
            .json({ message: "Schedule removed successfully." });
        }
        return res.status(404).json({ message: "Schedule not found." });
      }

      const clockInUTC = new Date(clockIn);
      const clockOutUTC = new Date(clockOut);

      const clockInFormatted = clockInUTC.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      const clockOutFormatted = clockOutUTC.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const existingSchedule = await ClockInOut.findOne({
        user,
        clockIn: { $gte: startDate, $lt: endDate },
        assigned: true,
      });

      // Fetch project details
      const project = await Project.findById(project_id);
      if (!project) {
        return res.status(404).json({ message: "Project not found." });
      }

      if (existingSchedule) {
        existingSchedule.clockIn = clockInUTC;
        existingSchedule.clockOut = clockOutUTC;
        existingSchedule.project = project_id;
        await existingSchedule.save();

        const updatedNotification = new Notification({
          user,
          message: `Your schedule has been updated for the project ${project.name} on ${date}: from ${clockInFormatted} to ${clockOutFormatted}.`,
          company,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        await updatedNotification.save();
        return res.status(200).json(existingSchedule);
      }

      const newSchedule = new ClockInOut({
        user,
        company,
        clockIn: clockInUTC,
        clockOut: clockOutUTC,
        assigned: true,
        project: project_id,
      });
      await newSchedule.save();

      const notification = new Notification({
        user,
        message: `You have been scheduled to work on the new project ${project.name} on ${date} from ${clockInFormatted} to ${clockOutFormatted}.`,
        company,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await notification.save();

      return res.status(201).json(newSchedule);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  downloadSchedule: async function (req, res) {
    try {
      const { from, to } = req.query;
      if (!from || !to)
        return res
          .status(400)
          .json({ message: "Please provide from and to date." });

      const fromDate = new Date(from);
      const toDate = new Date(to);

      const findCondition = {
        clockIn: { $gte: fromDate, $lte: toDate },
        assigned: true,
        company: req.company,
      };

      if (req.department) {
        const users = await User.find({ department: req.department });
        findCondition.user = { $in: users.map((user) => user._id) };
      }

      const clockInOut = await ClockInOut.find(findCondition)
        .populate("user", "firstName email")
        .populate("company", "name")
        .sort({ clockIn: 1 });

      const workbook = new ExcelJS.Workbook();
      const sheetNames = [];

      if (clockInOut.length === 0) {
        return res
          .status(404)
          .json({ message: "No schedule found for the selected date range." });
      }

      for (const entry of clockInOut) {
        const { user, clockIn, clockOut } = entry;

        // if the sheetName exceeds 31 characters, truncate it
        let sheetName = `${user.email}`;
        if (sheetName.length > 30) {
          sheetName = sheetName.substring(0, 30);
        }

        if (!sheetNames.includes(sheetName)) {
          const worksheet = workbook.addWorksheet(sheetName);
          worksheet.columns = [
            { header: "Date", key: "date", width: 15 },
            { header: "Clock In", key: "clockIn", width: 20 },
            { header: "Clock Out", key: "clockOut", width: 20 },
          ];
          sheetNames.push(sheetName);
        }
        const worksheet = workbook.getWorksheet(sheetName);

        // Convert clockIn and clockOut to appropriate date and time formats
        const clockInDate = new Date(clockIn);
        const clockOutDate = new Date(clockOut);

        const formattedDate = `${clockInDate.getUTCDate()}/${
          clockInDate.getUTCMonth() + 1
        }/${clockInDate.getUTCFullYear()}`;

        // Format as hh:mm:ss (UTC)
        const formattedClockInTime = clockInDate.toISOString().slice(11, 19);
        const formattedClockOutTime = clockOutDate.toISOString().slice(11, 19);

        // Add a row with formatted date, clockIn, and clockOut
        worksheet.addRow({
          date: formattedDate,
          clockIn: formattedClockInTime,
          clockOut: formattedClockOutTime,
        });
      }

      const buffer = await workbook.xlsx.writeBuffer();

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=schedule.xlsx"
      );
      res.end(buffer);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  listProject: async (req, res) => {
    try {
      const { departmentHead_id, projectName } = req.query;
      const findCondition = {};
      if (projectName && projectName != "") {
        findCondition.projectName = {
          $regex: `^${projectName}`,
          $options: "i",
        };
      }
      if (departmentHead_id && departmentHead_id !== "") {
        findCondition.departmentHead = departmentHead_id;
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
  removeProject: async (req, res) => {
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
  listCompanyProject: async (req, res) => {
    try {
      const { company_id, projectName } = req.query;
      console.log(company_id);
      const departmentHeads = await User.find({
        company: company_id,
        role: "departmenthead",
      });

      if (departmentHeads.length === 0) {
        return res
          .status(404)
          .json({ message: "No department heads found for this company." });
      }

      // Extract department head IDs
      const departmentHeadIds = departmentHeads.map((head) => head._id);

      // Step 2: Build the project query conditions
      const findCondition = {
        departmentHead: { $in: departmentHeadIds },
      };

      if (projectName && projectName !== "") {
        findCondition.projectName = {
          $regex: new RegExp(projectName, "i"), // Case-insensitive regex search
        };
      }

      // Step 3: Find projects associated with the department heads
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
  getAllUsersLeaves: async function (req, res) {
    try {
      const { from, to, status } = req.query;
      const departmentId = req.department;
      const findCondition = {
        department: departmentId,
      };

      if (from && to) {
        findCondition.startDate = { $gte: new Date(from), $lte: new Date(to) };
      }

      if (status) {
        findCondition.status = status;
      }

      const leaves = await Leave.find(findCondition)
        .populate("user", "name email")
        .populate("department", "name")
        .populate("departmentHead")
        .populate("company", "name");

      if (leaves.length > 0) {
        return res.status(200).json(leaves);
      }

      return res
        .status(404)
        .json({ message: "No leaves found for the specified criteria." });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getAllUsersCompanyLeaves: async function (req, res) {
    try {
      const { from, to, status, companyId } = req.query;
      const company_Id = req.company;
      const findCondition = {
        company: company_Id,
      };

      // Date range condition
      if (from && to) {
        findCondition.startDate = { $gte: new Date(from), $lte: new Date(to) };
      }

      // Status condition
      if (status) {
        findCondition.status = status;
      }

      // Filter by companyId if provided
      if (companyId) {
        findCondition.company = companyId;
      }

      const leaves = await Leave.find(findCondition)
        .populate("user", "name email")
        .populate("department", "name")
        .populate("departmentHead")
        .populate("company", "name");

      if (leaves.length > 0) {
        return res.status(200).json(leaves);
      }

      return res
        .status(404)
        .json({ message: "No leaves found for the specified criteria." });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
