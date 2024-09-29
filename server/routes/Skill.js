const express = require("express");
const router = express.Router();

const { create, list, remove } = require("../controllers/Skills");

router.post("/create", create);
router.get("/list", list);
router.delete("/remove/:skill_id", remove);

module.exports = router;
