const express = require("express");
const router = express.Router();

const { create, list, remove } = require("../controllers/Department");

router.post("/", create);
router.get("/:company_id", list);
router.delete("/:department_id", remove);

module.exports = router;
