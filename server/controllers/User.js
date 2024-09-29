const User = require("../models/User");
const brcypt = require("bcryptjs");
const ClockInOut = require("../models/ClockInOut");
const Status = require("../models/Status");
const Leave = require("../models/Leave");
const Review = require("../models/Review");
const Notification = require("../models/Notification");
const {
  companyAdmin,
  superAdmin,
  departmentHead,
  user: userFn,
} = require("../helpers/User/dashboard");
const XLSX = require("xlsx");
const { getUserWorkSummary } = require("../helpers/User/pdfSummary");
const { sendMail } = require("../helpers/Mail/sendMail");

module.exports = {
  getUser: async (req, res) => {
    try {
      const user_id = req.params.user_id;
      const user = await User.findById(user_id)
        .populate("companyRole")
        .populate("department");

      if (
        req.user.role !== "superadmin" &&
        req.user.id.toString() !== user_id
      ) {
        return res.status(403).send("Unauthorized");
      }

      if (!user) {
        res.status(404).send("User not found");
      } else {
        res.send(user);
      }
    } catch (error) {
      return res.status(500).send(error.message || "Error fetching user");
    }
  },
  createUser: async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        companyRole,
        department,
        phoneNo,
        role,
        primarySkill,
        secondarySkill,
        leaveEntitlement,
        departmentHead,
      } = req.body;
      // console.log(req.body);
      if (
        !firstName ||
        !email ||
        !companyRole ||
        !department ||
        !leaveEntitlement ||
        !primarySkill ||
        !secondarySkill
      ) {
        return res.status(400).send({ error: "All fields are required" });
      }

      const userExists = await User.findOne({ email });
      if (userExists) {
        return res
          .status(400)
          .send({ error: "User with this email already exists" });
      }

      const tempPassword = "password";
      const hashedPassword = brcypt.hashSync(tempPassword, 10);

      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        balanceOfAnnualLeaves: 16,
        role,
        companyRole,
        department,
        phoneNo,
        company: req.user.company,
        status: "active",
        leaveEntitlement,
        primarySkill,
        secondarySkill,
        departmentHead,
      });

      const savedUser = await newUser.save();

      if (!savedUser) {
        res.status(500).send({ error: "Error saving user" });
      }
      res.send(savedUser);
    } catch (error) {
      res.status(500).send({ error: error.message || "Error saving user" });
    }
  },
  updateUser: async (req, res) => {
    try {
      const user_id = req.params.user_id;
      const {
        firstName,
        lastName,
        email,
        phoneNo,
        emergencyContactName,
        emergencyContactNo,
        companyRole,
        department,
        employeeId,
      } = req.body;

      if (
        !firstName ||
        !lastName ||
        !email ||
        !phoneNo ||
        !emergencyContactName ||
        !emergencyContactNo
      ) {
        return res.status(400).send("All fields are required");
      }

      const user = await User.findById(user_id);
      if (!user) {
        return res.status(404).send("User not found");
      }

      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.phoneNo = phoneNo;
      user.emergencyContactName = emergencyContactName;
      user.emergencyContactNo = emergencyContactNo;
      user.updatedAt = new Date();
      if (companyRole) {
        user.companyRole = companyRole;
      }
      if (department) {
        user.department = department;
      }
      if (employeeId) {
        user.employeeId = employeeId;
      }

      const updatedUser = await user.save();
      if (!updatedUser) {
        return res.status(500).send("Error updating user");
      }
      res.send(updatedUser);
    } catch (error) {
      return res.status(500).send(error.message || "Error updating user");
    }
  },
  deleteUser: async (req, res) => {
    try {
      const user_id = req.params.user_id;
      const user = await User.findByIdAndDelete(user_id);
      if (!user) {
        res.status(404).send("User not found");
      } else {
        res.send(user);
      }
    } catch (error) {
      res.status(500).send(error.message || "Error deleting user");
    }
  },
  searchUser: async (req, res) => {
    try {
      const { email, departmenthead_id } = req.query;
      if (!email && email != "") {
        return res.status(400).send("Email is required");
      }
      const findCondition = {
        email: { $regex: `^${email}`, $options: "i" },
        company: req.user.company,
        role: { $in: ["departmenthead", "user"] },
      };
      if (departmenthead_id) {
        findCondition.departmentHead = departmenthead_id;
      }

      if (req.user.role === "departmenthead" || req.user.role === "user") {
        findCondition.department = req.department;
      }

      const users = await User.find(findCondition)
        .populate("companyRole")
        .populate("department");

      if (!users) {
        return res.status(404).send("User not found");
      }
      res.send(users);
    } catch (error) {
      return res.status(500).send(error.message || "Error searching for user");
    }
  },
  me: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(400).send({ error: "User not found" });
      }
      user.password = undefined;
      res.send({
        token: req.header("Authorization").replace("Bearer ", ""),
        user,
      });
    } catch (err) {
      return res.status(401).send({ error: "User not found" });
    }
  },
  list: async (req, res) => {
    try {
      const { email } = req.query;
      const findCondition = {
        company: req.company._id,
        status: "active",
        role: { $in: ["departmenthead", "user"] },
      };

      if (req.user.role === "departmenthead" || req.user.role === "user") {
        findCondition.department = req.user.department;
      }

      if (email && email != "") {
        findCondition.email = { $regex: `^${email}`, $options: "i" };
      }

      const users = await User.find(findCondition)
        .populate("companyRole")
        .populate("department")
        .populate("departmentHead")
        .populate("primarySkill")
        .populate("secondarySkill");

      res.send(users);
    } catch (error) {
      res.status(500).send("Error fetching users");
    }
  },
  listUnderHOD: async (req, res) => {
    try {
      const { email } = req.query;
      const findCondition = {
        departmentHead: req.user._id,
        company: req.company._id,
        status: "active",
        role: { $in: ["departmenthead", "user"] },
      };

      if (req.user.role === "departmenthead" || req.user.role === "user") {
        findCondition.department = req.user.department;
      }

      if (email && email != "") {
        findCondition.email = { $regex: `^${email}`, $options: "i" };
      }

      const users = await User.find(findCondition)
        .populate("companyRole")
        .populate("department")
        .populate("departmentHead")
        .populate("primarySkill")
        .populate("project", "projectName")
        .populate("secondarySkill");

      res.send(users);
    } catch (error) {
      res.status(500).send("Error fetching users");
    }
  },
  clockin: async (req, res) => {
    try {
      const { clockInTime } = req.body;
      const user = await User.findById(req.user.id);

      // console.log(clockInTime, user);
      if (!user) {
        return res.status(404).send("User not found");
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const clockin = await ClockInOut.findOne({
        user: req.user.id,
        createdAt: { $gte: today },
        assigned: false,
      });
      const clockIn = new Date();
      const [hours, minutes] = clockInTime.split(":");
      clockIn.setHours(parseInt(hours));
      clockIn.setMinutes(parseInt(minutes));
      clockIn.setSeconds(0);

      if (clockin) {
        clockin.clockIn = clockIn.toISOString();
        clockin.clockOut = null;
        await clockin.save();
      } else {
        const newClockin = new ClockInOut({
          user: req.user.id,
          company: req.user.company,
          clockIn: clockIn.toISOString(),
          clockOut: null,
        });
        await newClockin.save();
      }
      res.send("Clocked in successfully");
    } catch (error) {
      return res.status(500).send(error.message || "Error clocking in");
    }
  },
  clockout: async (req, res) => {
    try {
      const { clockOutTime } = req.body;
      if (!clockOutTime) {
        return res.status(400).send("Clock out time is required");
      }
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).send("User not found");
      }
      // check if user has already clocked in for the day
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const clockin = await ClockInOut.findOne({
        user: req.user.id,
        createdAt: { $gte: today },
        assigned: false,
      });
      // if user has already clocked in, set the current time as clock in time
      if (clockin.clockIn && !clockin.clockOut) {
        const clockOut = new Date();
        const [hours, minutes] = clockOutTime.split(":");
        clockOut.setHours(parseInt(hours));
        clockOut.setMinutes(parseInt(minutes));
        clockOut.setSeconds(0);
        clockin.clockOut = clockOut;
        await clockin.save();
        res.send("Clocked out successfully");
      } else {
        return res.status(400).send("You have not clocked in today");
      }
    } catch (error) {
      return res.status(500).send(error.message || "Error clocking out");
    }
  },
  getclockInOutStatus: async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const clockin = await ClockInOut.findOne({
        user: req.user.id,
        createdAt: { $gte: today },
        assigned: false,
      });

      if (clockin) {
        if (
          (clockin.clockIn && !clockin.clockOut) ||
          (clockin.clockIn && clockin.clockOut)
        ) {
          return res.send(clockin);
        } else {
          return res.send("You have clocked in for today");
        }
      }
      return res.send("You have not clocked in for today");
    } catch (error) {
      return res.send(error.message);
    }
  },
  getClockInFromToDate: async (req, res) => {
    try {
      const { from, to } = req.query;
      const clockin = await ClockInOut.find({
        user: req.user.id,
        createdAt: { $gte: from, $lte: to },
      });

      if (clockin) {
        return res.send(clockin);
      }

      return res.send("No clock in record found");
    } catch (error) {
      return res.send(error.message);
    }
  },
  setStatus: async (req, res) => {
    try {
      const { status, message } = req.body;
      if (!status) {
        return res.status(400).send("Status is required");
      }
      const user = req.user.id;
      const company = req.user.company;

      // if status is of same day update, else create new status
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const statusToday = await Status.findOne({
        user,
        company,
        createdAt: { $gte: today },
      });
      if (statusToday) {
        statusToday.status = status;
        statusToday.message = message;
        await statusToday.save();
        return res.send("Status updated successfully");
      }

      const newStatus = new Status({
        user,
        company,
        status,
        message,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await newStatus.save();
      res.send("Status updated successfully");
    } catch (error) {
      return res.status(500).send(error.message || "Error updating status");
    }
  },
  getStatus: async (req, res) => {
    try {
      const user = req.user.id;
      const company = req.user.company;

      // get status of the day

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const status = await Status.findOne({
        user,
        company,
        createdAt: { $gte: today },
      });

      if (status) {
        return res.send(status);
      }

      return res.send("No status found");
    } catch (error) {
      return res.status(500).send(error.message || "Error fetching status");
    }
  },
  getAllStatusMessages: async (req, res) => {
    try {
      const user = req.user.id;
      const company = req.user.company;

      const status = await Status.find({
        user,
        company,
      });

      const messages = status.map((stat) => stat.message);
      if (messages.length > 0) {
        return res.send(messages);
      }

      return res.send([]);
    } catch (error) {
      return res.status(500).send(error.message || "Error fetching status");
    }
  },
  applyLeave: async (req, res) => {
    try {
      const { from, to, reason, type } = req.body;
      if (!from || !to || !reason) {
        return res.status(400).send("All fields are required");
      }
      const user = req.user.id;
      const company = req.user.company;
      const department = req.user.department;
      const departmentHead = req.user.departmentHead;

      const numberOfDays = Math.ceil(
        (new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24)
      );
      // check if the user has this much leave balance

      const userData = User.findById(user);
      if (userData.balanceOfAnnualLeaves < numberOfDays) {
        return res.send({ error: "Insufficient leave balance" });
      }

      const newLeave = new Leave({
        user,
        departmentHead,
        company,
        department,
        leaveType: type,
        startDate: from,
        endDate: to,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await newLeave.save();
      res.send("Leave applied successfully");
    } catch (error) {
      return res.status(500).send(error.message || "Error applying for leave");
    }
  },
  getLeaves: async (req, res) => {
    try {
      const user = req.user.id;
      const company = req.user.company;
      const { from, to, status } = req.query;
      const findCondition = {
        user,
        company,
      };

      if (from && to) {
        findCondition.startDate = { $gte: from, $lte: to };
      }
      if (status) {
        findCondition.status = status;
      }

      const leaves = await Leave.find(findCondition);

      if (leaves.length > 0) {
        return res.send(leaves);
      }

      return res.send("No leave found");
    } catch (error) {
      return res.status(500).send(error.message || "Error fetching leaves");
    }
  },
  submitReview: async (req, res) => {
    try {
      const { title, rating, review } = req.body;
      if (!title || !rating || !review) {
        return res.status(400).send("All fields are required");
      }
      const user = req.user.id;
      const company = req.user.company;
      const newReview = new Review({
        user,
        company,
        title,
        rating,
        review,
        status: "inactive",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await newReview.save();
      res.send("Review submitted successfully");
    } catch (error) {
      return res.status(500).send(error.message || "Error submitting review");
    }
  },
  dashboard: async (req, res) => {
    try {
      const user_id = req.user._id;

      const company_id = req.user.company;
      const user = await User.findOne({ _id: user_id })
        .populate("companyRole")
        .populate("department");
      if (!user) {
        return res.status(404).send("User not found");
      }
      let data;

      switch (user.role) {
        case "superadmin":
          data = await superAdmin();
          return res.send(data);

        case "companyadmin":
          data = await companyAdmin(user_id, company_id);
          return res.send(data);

        case "departmenthead":
          data = await departmentHead(user.department, company_id, user_id);
          return res.send(data);

        case "user":
          data = await userFn(user_id, user.department, company_id);
          return res.send(data);

        default:
          return res.status(403).send("Unauthorized");
      }
    } catch (error) {
      return res.status(500).send(error.message || "Error fetching dashboard");
    }
  },
  downloadSchedule: async (req, res) => {
    try {
      const scheduleData = req.body;

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(scheduleData);

      XLSX.utils.book_append_sheet(workbook, worksheet, "Schedule");

      const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

      res.setHeader(
        "Content-Disposition",
        'attachment; filename="Schedule.xlsx"'
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      res.send(buffer);
    } catch (error) {
      return res
        .status(500)
        .send(error.message || "Error downloading schedule");
    }
  },
  notifications: async (req, res) => {
    try {
      const user_id = req.user._id;
      console.log(user_id);

      // order by latest first
      const notifications = await Notification.find({
        user: user_id,
        read: false,
      }).sort({ createdAt: -1 });
      res.send(notifications);
    } catch (error) {
      return res
        .status(500)
        .send(error.message || "Error fetching notifications");
    }
  },
  readNotification: async (req, res) => {
    try {
      const notification_id = req.params.notification_id;
      const notification = await Notification.findById(notification_id);
      if (!notification) {
        return res.status(404).send("Notification not found");
      }
      notification.read = true;
      await notification.save();
      res.send("Notification read");
    } catch (error) {
      return res
        .status(500)
        .send(error.message || "Error reading notification");
    }
  },
  createNotification: async (req, res) => {
    try {
      const { title, message, user } = req.body;
      if (!title || !message || !user) {
        return res.status(400).send("All fields are required");
      }
      const newNotification = new Notification({
        title,
        message,
        user,
        company: req.user.company,
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await newNotification.save();
      res.send("Notification created successfully");
    } catch (error) {
      return res
        .status(500)
        .send(error.message || "Error creating notification");
    }
  },
  pdfSummary: async (req, res) => {
    try {
      console.log(req.query);
      const userId = req.user._id;
      const { from, to } = req.query;
      console.log(from, to, userId);
      const workSummary = await getUserWorkSummary(userId, from, to);
      console.log(workSummary);
      res.json(workSummary);
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while fetching work summary." });
    }
  },
  sendResetCode: async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) throw new Error("Please provide Email ID");
      const user = await User.findOne({ email });
      if (!user) return res.status(404).send("User not found");

      const resetCode = crypto.randomInt(1000, 9999).toString();
      user.resetCode = resetCode;
      await user.save();

      await sendMail(
        user.email,
        "Your reset code",
        `Your reset code is ${resetCode}`
      );

      res.send("Reset code sent");
    } catch (error) {
      return res.status(500).send(error.message || "Failed to send reset code");
    }
  },
};
