const Skill = require("../models/Skills");

module.exports = {
  create: async (req, res) => {
    try {
      const { name } = req.body;
      const skill = new Skill({ name });
      await skill.save();
      res.status(201).json({ skill });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  list: async (req, res) => {
    try {
      // const roles = await Role.find();
      // console.log("params",req.params.company_id);
      const skills = await Skill.find();

      res.json(skills);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  remove: async (req, res) => {
    try {
      await Skill.findByIdAndDelete(req.params.skill_id);
      res.json({ message: "Skill removed" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
