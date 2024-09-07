const Role = require('../models/Roles');

module.exports = {

    create: async (req, res) => {
        try {
            const { name, company } = req.body;
            const role = new Role({ name, company });
            await role.save();
            res.status(201).json({ role });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    list: async (req, res) => {
        try {
            // const roles = await Role.find();
            // console.log("params",req.params.company_id);
            const company_id = req.params.company_id;
            const roles = await Role.find({company: company_id});

            res.json( roles );
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    remove: async (req, res) => {
        try {
            await Role.findByIdAndDelete(req.params.role_id);
            res.json({ message: 'Role removed' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}