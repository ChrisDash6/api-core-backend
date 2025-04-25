const RoleService = require("../service/roleService");
  

exports.addRole = async (req, res) => {
    try {  
      const response = await RoleService.createRole(req.body);
      return res.status(201).json(response);
    } catch (error) {
      console.error("Error Adding role:", error.message);
      return res.status(500).json({ error: "Failed to add role. " + error.message });
    }
};

exports.getAllRoles = async (req, res) => {
    try {
      const roles = await RoleService.fetchRoles();
      return res.status(200).json(roles);
    } catch (error) {
      console.error("Error Fetching roles:", error.message);
      return res.status(500).json({ error: "Fetching roles failed: " + error.message });
    }
};