const Department = require("../models/Department");

module.exports = {
  create: async (req, res) => {
    try {
      const { name, company } = req.body;
      const department = new Department({ name, company });
      await department.save();
      res.status(201).json({ department });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  list: async (req, res) => {
    try {
      // const departments = await Department.find();
      // console.log("params",req.params.company_id);
      const company_id = req.params.company_id;
      const departments = await Department.find({ company: company_id });

      res.json(departments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  remove: async (req, res) => {
    try {
      await Department.findByIdAndDelete(req.params.department_id);
      res.json({ message: "Department removed" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
