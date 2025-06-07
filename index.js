require("dotenv").config();

const express = require("express");
const connect = require("./config/ConnectDB");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
connect();

const PORT = process.env.PORT || 4000;
app.use(cors());
// Middleware
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.get("/api/hello", (req, res) => {
  res.json({ message: "Bonjour depuis le backend Node.js !" });
});

// Routes (Vérifiez que chaque require() renvoie bien un routeur)
app.use("/api/auth", require("./routes/Auth.route"));
app.use("/api/user", require("./routes/user.route"));
app.use("/api/post", require("./routes/Post.route"));
app.use("/api/gift", require("./routes/gift.route"));
app.use("/image", require("./routes/image.router"));
app.use("/api/message", require("./routes/message.route"));
app.use("/api/notification", require("./routes/notification.route"));

app.listen(PORT, () => {
  console.log("Serveur backend sur http://localhost:${PORT}", PORT);
});
