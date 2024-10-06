const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name for this role."],
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Skill = mongoose.model("Skill", skillSchema);

module.exports = Skill;
