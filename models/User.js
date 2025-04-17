const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Email invalide"],
    },
    password: {
      type: String,
      required: [true, "Please enter your Password"],
      minlength: [6, "Le mot de passe doit contenir au moins 6 caractères !"], // lenght 10
    },
    dateDeNaiss: { type: Date },
    sexe: {
      type: String,
      enum: ["Homme", "Femme"],
    },
    avatar: {
      type: String,
      default: "path/to/default-avatar.jpg",
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    phone: { type: String },
    verifCode: { type: String },

    bio: { type: String },
    // profession: { type: String },
    // Système d'amis

    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    closeFriends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
