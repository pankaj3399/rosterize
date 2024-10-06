const express = require("express");
const router = express.Router();

const {
  getLeaves,
  changeLeaveStatus,
  schedule,
  addSchedule,
  downloadSchedule,
  listProject,
  removeProject,
  listCompanyProject,
  getAllUsersLeaves,
  getAllUsersCompanyLeaves,
} = require("../controllers/DepartmentHead");

router.get("/listDepartmentHeadProjects", listProject);
router.get("/listComapanyProjects", listCompanyProject);
router.delete("/removeDepartmentHeadProjects/:project_id", removeProject);
router.get("/leaves", getLeaves);
router.post("/leave/status/:id", changeLeaveStatus);
router.get("/schedule", schedule);
router.post("/schedule", addSchedule);
router.get("/downloadschedule", downloadSchedule);
router.get("/getleaves", getAllUsersLeaves);
router.get("/getusersleaves", getAllUsersCompanyLeaves);

module.exports = router;
