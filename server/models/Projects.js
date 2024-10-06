const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: [true, "Please provide a project name for this project."],
  },
  departmentHead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide a HOD for this project."],
  },
  primarySkill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Skill",
    required: [true, "Please provide a primary skill for this project."],
  },
  secondarySkill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Skill",
  },
  thirdSkill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Skill",
  },
  fourthSkill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Skill",
  },
  employee: {
    type: Number,
    required: [true, "Please provide a no of employee for this project."],
  },
  startTime: {
    type: String,
    required: [true, "Please provide a start time for this project."],
  },
  endTime: {
    type: String,
    required: [true, "Please provide a end time for this project."],
  },
  img: {
    type: String,
    required: [true, "Please provide an image for this project."],
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

const Projects = mongoose.model("Projects", projectSchema);

module.exports = Projects;
