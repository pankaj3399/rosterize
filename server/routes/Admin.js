const express = require("express");
const router = express.Router();

const {
  listReviews,
  changeReviewStatus,
  addPlan,
  listPlans,
  deletePlan,
  deleteReview,
  listEnquries,
  changeEnquiriesStatus,
  deleteEnquiry,
} = require("../controllers/Admin");

router.get("/reviews", listReviews);
router.post("/status", changeReviewStatus);
router.delete("/review/:reviewId", deleteReview);
router.post("/plan", addPlan);
router.get("/plans", listPlans);
router.delete("/plan/:planId", deletePlan);
router.get("/enquirieslist", listEnquries);
router.delete("/enquiry/:enquiryId", deleteEnquiry);
router.post("/enquiriesstatus", changeEnquiriesStatus);

module.exports = router;
