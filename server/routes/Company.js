// routes

const express = require("express");
const router = express.Router();

const {
  getCompany,
  postCompany,
  list,
  updateCompanyStatus,
  updateCompanyPlan,
} = require("../controllers/Company");
const { checkAuth } = require("../middleware/middleware");

router.get("/list", list);
router.get("/:company_id", getCompany);
router.post("/", postCompany);
router.post("/status", updateCompanyStatus);
router.post("/plan", updateCompanyPlan);

module.exports = router;
