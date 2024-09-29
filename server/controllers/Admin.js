const Review = require("../models/Review");
const Enquiry = require("../models/Enquiry");
const Company = require("../models/Company");
const User = require("../models/User");
const Plans = require("../models/Plans");

module.exports = {
  listReviews: async (req, res) => {
    try {
      const { rating } = req.query;
      const findCondition = {};
      if (rating) {
        findCondition.rating = rating;
      }
      const reviews = await Review.find(findCondition)
        .populate("company")
        .populate({ path: "user", populate: { path: "companyRole" } });
      res.send(reviews);
    } catch (error) {
      return res.status(500).send(error.message || "Error fetching reviews");
    }
  },
  changeReviewStatus: async (req, res) => {
    try {
      const { review_id, status } = req.body;

      if (!review_id || !status) {
        return res.status(400).send("Please provide review id and status");
      }

      // check if already two reviews are approved
      if (status === "active") {
        const approvedReviews = await Review.find({ status: "active" });
        if (approvedReviews.length >= 2) {
          return res
            .status(400)
            .send({ error: "Only two reviews can be approved" });
        }
      }

      const updatedReview = await Review.findByIdAndUpdate(
        review_id,
        { status },
        { new: true }
      );
      if (!updatedReview) {
        return res.status(500).send("Error updating review status");
      }
      return res.send(updatedReview);
    } catch (error) {
      res.status(500).send(error.message || "Error updating review status");
    }
  },
  deleteReview: async (req, res) => {
    try {
      const { reviewId: id } = req.params;
      if (!id) {
        return res.status(400).send("Please provide review id");
      }

      const deletedReview = await Review.findByIdAndDelete(id);

      if (!deletedReview) {
        return res.status(500).send("Error deleting review");
      }
      res.send(deletedReview);
    } catch (error) {
      return res.status(500).send(error.message || "Error deleting review");
    }
  },
  addPlan: async (req, res) => {
    try {
      const { name, range, cost } = req.body;
      if (!name || !range || !cost) {
        return res.status(400).send("Please provide all details");
      }
      const newPlan = new Plans({
        name,
        range,
        cost,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const savedPlan = await newPlan.save();
      res.send(savedPlan);
    } catch (error) {
      return res.status(500).send(error.message || "Error adding plan");
    }
  },
  listPlans: async (req, res) => {
    try {
      const plans = await Plans.find();
      res.send(plans);
    } catch (error) {
      return res.status(500).send(error.message || "Error fetching plans");
    }
  },
  deletePlan: async (req, res) => {
    try {
      const { planId: id } = req.params;
      console.log(id);
      if (!id) {
        return res.status(400).send("Please provide plan id");
      }
      const deletedPlan = await Plans.findByIdAndDelete(id);
      console.log(deletedPlan);
      if (!deletedPlan) {
        return res.status(500).send("Error deleting plan");
      }
      res.send(deletedPlan);
    } catch (error) {
      return res.status(500).send(error.message || "Error deleting plan");
    }
  },
  listEnquries: async (req, res) => {
    try {
      const { email } = req.query;
      const findCondition = {};
      if (email) {
        findCondition.email = { $regex: email, $options: "i" };
      }
      const enquiries = await Enquiry.find(findCondition);
      res.send(enquiries);
    } catch (error) {
      return res.status(500).send(error.message || "Error fetching enquiries");
    }
  },
  changeEnquiriesStatus: async (req, res) => {
    try {
      const { enquiry_id, status } = req.body;

      if (!enquiry_id || !status) {
        return res.status(400).send("Please provide enquiry id and status");
      }

      const updatedEnquiry = await Enquiry.findByIdAndUpdate(enquiry_id, {
        status,
      });
      if (!updatedEnquiry) {
        return res.status(500).send("Error updating enquiry status");
      }
      return res.send(updatedEnquiry);
    } catch (error) {
      res.status(500).send(error.message || "Error updating enquiry status");
    }
  },
  deleteEnquiry: async (req, res) => {
    try {
      const { enquiryId: id } = req.params;
      if (!id) {
        return res.status(400).send("Please provide enquiry id");
      }

      const deletedEnquiry = await Enquiry.findByIdAndDelete(id);

      if (!deletedEnquiry) {
        return res.status(500).send("Error deleting enquiry");
      }
      res.send(deletedEnquiry);
    } catch (error) {
      return res.status(500).send(error.message || "Error deleting enquiry");
    }
  },
};
