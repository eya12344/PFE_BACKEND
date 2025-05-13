const express = require("express");
const {
  createMessage,
  getAllMessages,
} = require("../controllers/message.controller");
const router = express.Router();

router.post("/", createMessage);
router.get("/:chatId", getAllMessages);

module.exports = router;
