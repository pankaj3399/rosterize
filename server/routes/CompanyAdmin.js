const express = require("express");
const router = express.Router();

const {
  updateCompany,
  DepartmentHeadList,
  HeadList,
} = require("../controllers/Company");

router.put("/:company_id", updateCompany);
router.get("/:company_id/:department_id", DepartmentHeadList);
router.get("/:company_id", HeadList);

module.exports = router;
