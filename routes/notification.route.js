const express = require("express");
const {
  createNotification,
  getUserNotifications,
  markAsRead,
  deleteNotification,
} = require("../controllers/notification.controller");

const router = express.Router();

router.post("/", createNotification); // Créer une notification
router.get("/:userId", getUserNotifications); // Récupérer les notifications d'un utilisateur
router.put("/:id/read", markAsRead); // Marquer comme lue
router.delete("/:id", deleteNotification); // Supprimer une notification

module.exports = router;
