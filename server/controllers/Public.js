const Plans = require("../models/Plans");
const Reviews = require("../models/Review");
const Enquiry = require("../models/Enquiry");
const User = require("../models/User");
const Company = require("../models/Company");
const bcrypt = require("bcryptjs");

module.exports = {
  listPlansAndReviews: async (req, res) => {
    try {
      //get the latest 3 plans
      const plans = await Plans.find().sort({ createdAt: -1 }).limit(3);
      const reviews = await Reviews.find({ status: "active" })
        .populate("user")
        .populate("company")
        .sort({ createdAt: -1 })
        .limit(2);
      res.send({ plans, reviews });
    } catch (error) {
      return res
        .status(500)
        .send(error.message || "Error fetching plans and reviews");
    }
  },
  postCompany: async (req, res) => {
    try {
      const {
        name,
        address,
        email,
        phone,
        password,
        UEN,
        subscriptionPlan,
        industry,
        website,
        message,
      } = req.body;

      if (
        !name ||
        !address ||
        !email ||
        !phone ||
        !password ||
        !UEN ||
        !subscriptionPlan ||
        !industry ||
        !website ||
        !message
      ) {
        return res
          .status(400)
          .send({ error: "Please provide all required fields" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        email,
        password: hashedPassword,
        role: "companyadmin",
        balanceOfAnnualLeaves: 16,
        balanceOfMedicalLeaves: 12,

        status: "active",
      });

      const savedUser = await user.save();

      const company = new Company({
        name,
        address,
        phone,
        UEN,
        subscriptionPlan,
        website,
        industry,
        message,
        createdBy: savedUser._id,
        status: "pending",
      });

      const savedCompany = await company.save();

      await User.findByIdAndUpdate(savedUser._id, {
        company: savedCompany._id,
      });

      res.send(savedCompany);
    } catch (error) {
      res
        .status(500)
        .send({ error: error.message || "Error creating company" });
    }
  },
  enquire: async (req, res) => {
    try {
      const { name, email, company, subject, message } = req.body;
      if (!name || !email || !company || !subject || !message) {
        return res
          .status(400)
          .send({ error: "Please provide all required fields" });
      }

      const enquiry = new Enquiry({
        name,
        email,
        company,
        subject,
        message,
        status: "active",
      });

      const savedEnquiry = await enquiry.save();
      res.send(savedEnquiry);
    } catch (error) {
      return res.status(500).send(error.message || "Error submitting enquiry");
    }
  },
};
