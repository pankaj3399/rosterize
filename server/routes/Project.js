const express = require("express");
const router = express.Router();

const { create, list, remove } = require("../controllers/Projects");

router.post("/create", create);
router.get("/list", list);
router.delete("/remove/:project_id", remove);

module.exports = router;
