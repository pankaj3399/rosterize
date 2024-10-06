const Skill = require("../models/Skills");

module.exports = {
  create: async (req, res) => {
    try {
      const { name, company } = req.body;
      const skill = new Skill({ name, company });
      await skill.save();
      res.status(201).json({ skill });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  list: async (req, res) => {
    try {
      const { company } = req.query;

      if (!company) {
        return res.status(400).json({ message: "Company ID is required" });
      }

      const skills = await Skill.find({ company });

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
