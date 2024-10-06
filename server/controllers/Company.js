const Company = require("../models/Company");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const sendMail = require("../helpers/Mail/sendMail");

module.exports = {
  getCompany: async (req, res) => {
    try {
      const company_id = req.params.company_id;
      const company = await Company.findById(company_id)
        .populate("createdBy")
        .populate("subscriptionPlan", "name");

      if (!company) {
        res.status(404).send("Company not found");
      } else {
        res.send(company);
      }
    } catch (error) {
      return res.status(500).send(error.message || "Error fetching company");
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
        return res.status(400).send("Please provide all required fields");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        email,
        password: hashedPassword,
        role: "companyadmin",
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
      res.status(500).send(error.message || "Error creating company");
    }
  },
  updateCompany: async (req, res) => {
    try {
      const company_id = req.params.company_id;
      const user_id = req.user._id;
      const { name, address, phone, UEN, email, industry, website } = req.body;
      const updatedCompany = await Company.findByIdAndUpdate(
        company_id,
        {
          name,
          address,
          phone,
          UEN,
          industry,
          website,
        },
        { new: true }
      );

      if (!updatedCompany) {
        res.status(500).send("Error updating company");
      }
      const updatedUser = await User.findByIdAndUpdate(
        user_id,
        { email },
        { new: true }
      );

      if (!updatedUser) {
        res.status(500).send("Error updating user");
      }

      console.log(updatedCompany, updatedUser);
      res.send("Updated Successfully");
    } catch (error) {
      return res.status(500).send(error.message || "Error updating company");
    }
  },
  deleteCompany: async (req, res) => {
    const company_id = req.params.company_id;

    const deletedCompany = await Company.findByIdAndDelete(company_id);

    if (!deletedCompany) {
      res.status(500).send("Error deleting company");
    }
    res.send(deletedCompany);
  },
  list: async (req, res) => {
    try {
      const { email } = req.query;
      const findCondition = {
        role: "companyadmin",
      };
      if (email && email != "") {
        findCondition.email = {
          $regex: `^${email}`,
          $options: "i",
        };
      }
      // in the created by field, search for the email id

      // const companies = await User.find(findCondition).populate('company');
      const companies = await User.find(findCondition).populate({
        path: "company",
        populate: {
          path: "subscriptionPlan",
          select: "range",
        },
      });

      // const companies = await Company.find().populate('createdBy');
      res.send(companies);
    } catch (error) {
      res.status(500).send(error.message || "Error fetching companies");
    }
  },
  updateCompanyStatus: async (req, res) => {
    try {
      const { company_id, status } = req.body;
      const updatedCompany = await Company.findByIdAndUpdate(
        company_id,
        { status },
        { new: true }
      );

      const user = await User.findOne({ company: company_id });

      if (!updatedCompany) {
        return res.status(500).send("Error updating company status");
      }

      const email = user?.email;
      const subject =
        status === "approved" ? "Company Approved" : "Company Rejected";
      const message =
        status === "approved"
          ? `Dear ${updatedCompany.name}, your company has been approved.`
          : `Dear ${updatedCompany.name}, unfortunately, your company has been rejected.`;
      // Send email
      const isSendMail = await sendMail(email, subject, message);
      console.log(isSendMail);

      if (isSendMail?.error)
        throw new Error(isSendMail.message || "Error sending email");

      return res.send(updatedCompany);
    } catch (error) {
      res.status(500).send(error.message || "Error updating company status");
    }
  },
  updateCompanyPlan: async (req, res) => {
    try {
      const { company_id, plan_id } = req.body;
      if (!company_id || !plan_id) {
        return res.status(400).send("Please provide company_id and plan_id");
      }
      const updatedCompany = await Company.findByIdAndUpdate(
        company_id,
        { subscriptionPlan: plan_id },
        { new: true }
      );
      if (!updatedCompany) {
        return res.status(500).send("Error updating company plan");
      }
      return res.send(updatedCompany);
    } catch (error) {
      res.status(500).send(error.message || "Error updating company plan");
    }
  },
  DepartmentHeadList: async (req, res) => {
    try {
      const { company_id, department_id } = req.params;

      const departmentHeads = await User.find({
        department: department_id,
        company: company_id,
        role: "departmenthead",
      });

      if (!departmentHeads.length) {
        return res.status(404).send("No department heads found");
      }

      res.send(departmentHeads);
    } catch (error) {
      res.status(500).send(error.message || "Error fetching department heads");
    }
  },
  HeadList: async (req, res) => {
    try {
      const { company_id } = req.params;

      const departmentHeads = await User.find({
        company: company_id,
        role: "departmenthead",
      });

      if (!departmentHeads.length) {
        return res.status(404).send("No department heads found");
      }

      res.send(departmentHeads);
    } catch (error) {
      res.status(500).send(error.message || "Error fetching department heads");
    }
  },
};
