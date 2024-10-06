const User = require("../../models/User");
const Leave = require("../../models/Leave");
const Company = require("../../models/Company");
const Review = require("../../models/Review");
const ClockInOut = require("../../models/ClockInOut");
const Status = require("../../models/Status");

const resetLeaveBalances = async () => {
  try {
    const today = new Date();
    const resetDate = new Date(today.getFullYear(), 0, 1);

    if (
      today.getDate() === resetDate.getDate() &&
      today.getMonth() === resetDate.getMonth()
    ) {
      await User.updateMany(
        {},
        {
          balanceOfAnnualLeaves: 16,
          balanceOfMedicalLeaves: 12,
        }
      );
      console.log("Leave balances have been reset for all users.");
    }
  } catch (error) {
    console.error("Error resetting leave balances:", error.message);
  }
};

module.exports = {
  superAdmin: async function () {
    try {
      const companiesCount = await Company.find({
        status: "approved",
      }).countDocuments();
      const comaniesToApprove = await Company.find({
        status: "pending",
      }).countDocuments();
      const reviewCount = await Review.find().countDocuments();

      return {
        companiesCount,
        comaniesToApprove,
        reviewCount,
      };
    } catch (error) {
      return error.message;
    }
  },
  companyAdmin: async function (userId, companyId) {
    try {
      const userCount = await User.find({
        company: companyId,
        role: {
          $in: ["user", "departmenthead"],
        },
      }).countDocuments();
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // 00:00:00
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // 23:59:59

      // get count of all leaves in the company where current date is between the start and end date of leave or on the start date of leave or on the end date of leave
      const leaveCount = await Leave.find({
        company: companyId,
        startDate: { $lte: endOfDay },
        endDate: { $gte: startOfDay },
      }).countDocuments();

      const medicalLeaveCount = await Leave.find({
        company: companyId,
        leaveType: "medical",
        startDate: { $lte: endOfDay },
        endDate: { $gte: startOfDay },
      }).countDocuments();

      const annualLeaveCount = await Leave.find({
        company: companyId,
        leaveType: "annual",
        startDate: { $lte: endOfDay },
        endDate: { $gte: startOfDay },
      }).countDocuments();

      return {
        userCount,
        leaveCount,
        medicalLeaveCount,
        annualLeaveCount,
      };
    } catch (error) {
      return error.message;
    }
  },
  departmentHead: async function (departmentId, companyId, user_id) {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // 00:00:00
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // 23:59:59

    const userCount = await User.find({
      company: companyId,
      department: departmentId,
      departmentHead: user_id,
      role: {
        $in: ["user", "departmenthead"],
      },
    }).countDocuments();
    // console.log('userCount', userCount);

    // get count of all leaves in the company where current date is between the start and end date of leave or on the start date of leave or on the end date of leave
    const leaveCount = await Leave.find({
      company: companyId,
      department: departmentId,
      departmentHead: user_id,
      status: "approved",
      startDate: { $lte: endOfDay },
      endDate: { $gte: startOfDay },
    })
      .populate({
        path: "user",
        match: { departmentHead: user_id },
      })
      .countDocuments();

    const medicalLeaveCount = await Leave.find({
      company: companyId,
      department: departmentId,
      departmentHead: user_id,
      leaveType: "medical",
      status: "approved",
      startDate: { $lte: endOfDay },
      endDate: { $gte: startOfDay },
    })
      .populate({
        path: "user",
        match: { departmentHead: user_id },
      })
      .countDocuments();

    const annualLeaveCount = await Leave.find({
      company: companyId,
      department: departmentId,
      departmentHead: user_id,
      leaveType: "annual",
      status: "approved",
      startDate: { $lte: endOfDay },
      endDate: { $gte: startOfDay },
    })
      .populate({
        path: "user",
        match: { departmentHead: user_id },
      })
      .countDocuments();

    const users = await User.find({
      company: companyId,
      department: departmentId,
      departmentHead: user_id,
    });

    const userIds = users.map((user) => user._id);

    const statusOnline = await Status.find({
      user: { $in: userIds },
      createdAt: { $gte: startOfDay, $lte: endOfDay },
      status: "online",
    }).populate("user");

    statusOnline.forEach((status) => {
      console.log(
        "status",
        status.user.firstName,
        status.user.lastName,
        status.user._id
      );
    });

    const statusOffline = users
      .map((user) => {
        const isOnline = statusOnline.find(
          (status) => status.user._id.toString() === user._id.toString()
        );
        if (!isOnline) return user;
      })
      .filter(Boolean);

    // users who are on leave today

    let leaveUsers = await Leave.find({
      company: companyId,
      departmentHead: user_id,
      startDate: { $lte: endOfDay },
      endDate: { $gte: startOfDay },
    }).populate({
      path: "user",
      match: { departmentHead: user_id },
    });

    // remove duplicates by user._id
    leaveUsers = leaveUsers.filter(
      (user, index, self) =>
        index === self.findIndex((t) => t.user._id === user.user._id)
    );

    return {
      userCount,
      leaveCount,
      medicalLeaveCount,
      annualLeaveCount,
      leaveUsers,
      statusOnline,
      statusOffline,
    };
  },
  user: async function (userId, departmentId, companyId) {
    try {
      await resetLeaveBalances();

      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // 23:59:59

      const users = await User.find({
        company: companyId,
        department: departmentId,
      });

      const userIds = users.map((user) => user._id);

      const statusOnline = await Status.find({
        user: { $in: userIds },
        createdAt: { $gte: startOfDay, $lte: endOfDay },
        status: "online",
      }).populate("user");

      const statusOffline = users
        .map((user) => {
          const isOnline = statusOnline.find(
            (status) => status.user._id.toString() === user._id.toString()
          );
          if (!isOnline) return user;
        })
        .filter(Boolean);

      // users who are on leave today

      let leaveUsers = await Leave.find({
        company: companyId,
        startDate: { $lte: endOfDay },
        endDate: { $gte: startOfDay },
      }).populate("user");

      // remove duplicates by user._id
      leaveUsers = leaveUsers.filter(
        (user, index, self) =>
          index === self.findIndex((t) => t.user._id === user.user._id)
      );

      // total number of hours clockedin current week

      const startOfWeek = new Date();
      startOfWeek.setHours(0, 0, 0, 0);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

      const endOfWeek = new Date();
      endOfWeek.setHours(23, 59, 59, 999);
      endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay()));

      const clockedInDocuments = await ClockInOut.find({
        user: userId,
        createdAt: { $gte: startOfWeek, $lte: endOfWeek },
      });

      let totalHoursWorked = 0;
      let totalHoursAssigned = 0;

      clockedInDocuments.forEach((doc) => {
        const clockIn = doc.clockIn;
        const clockOut = doc.clockOut;
        const diff = clockOut - clockIn;
        if (!doc.assigned) console.log("diff", diff);
        const hours = diff / 1000 / 60 / 60;

        if (clockIn && clockOut) {
          if (doc.assigned) {
            totalHoursAssigned += hours;
          } else {
            totalHoursWorked += hours;
          }
        }
      });

      totalHoursAssigned = Math.round(totalHoursAssigned);
      totalHoursWorked = Math.round(totalHoursWorked);

      //balance of Annual Leaves

      const user = await User.findById({
        _id: userId,
      });

      return {
        totalHoursAssigned,
        totalHoursWorked,
        annualLeaves: user.balanceOfAnnualLeaves,
        medicalLeaves: user.balanceOfMedicalLeaves,
        leaveUsers,
        statusOnline,
        statusOffline,
      };
    } catch (error) {
      return error.message;
    }
  },
};
