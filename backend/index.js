const express = require("express");
const ConnectDB = require("./config/db");
const adminRoutes = require("./routes/admin_routes");
const sellerRoutes = require("./routes/seller_routes");
const adminServices = require("./Services/admin_services");
const sellerServices = require("./Services/seller_services");
const UserRoutes = require("./routes/User_routes");
const UserServices = require("./Services/User_Services")

const app = express();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

const port = process.env.PORT || 8000;

ConnectDB();

app.get("/", (req, res) => {
  res.send("started");
});

app.use("/dnk", adminRoutes);
app.use("/dnk", adminServices);
app.use("/dnk/Seller", sellerRoutes);
app.use("/dnk/Seller", sellerServices);
app.use("/dnk/User", UserRoutes);
app.use("/dnk/User",UserServices);

app.listen(port, () => console.log(`Server is running at port ${port}`));
