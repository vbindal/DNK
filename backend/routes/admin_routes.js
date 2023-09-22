const Router = require("express").Router();
const adminControl = require("../controllers/admin_controllers");


// Router.post("/insertAdmin", async (req, res) => {
//   try {
//     // Create a new admin document
//     const newAdmin = new Admin({
//       "firstName": "John",
//       "lastName": "Doe",
//       "email": "admin56@example.com",
//       "OrganizationId": "org123",
//       "phoneNumber": "1234567890",
//       "password": "hashedPassword", 
//       "confirmPassword": "hashedPassword", 
//     });

//     await newAdmin.save();

//     res.status(200).json({ message: "Admin document created successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

Router.post("/admin/login", adminControl.login);
Router.post("/admin/updateAdminPasswords",adminControl.updateAdminPasswords);
Router.post("/admin/updateAdmin", adminControl.updateAdmin);
Router.post("/admin/forgot-password", adminControl.forgotPassword);
Router.post("/admin/reset-password/:token", adminControl.resetPassword);


module.exports = Router;
