const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const otpGenerator = require("otp-generator");
const Nodemailer = require("nodemailer");
const { MailtrapTransport } = require("mailtrap");

var transporter = Nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MY_MAIL,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
// Signin user
exports.signin = async (req, res, next) => {
  const { email, password } = req.body;
  console.log("Data received in signin controller:", req.body);

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide an email and password",
    });
  }

  try {
    // Check if user exists by email
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials " });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    sendToken(user, 200, res);
  } catch (err) {
    next(err); // Propagate error to the global error handler
  }
};

// Fonction pour générer un token et l'envoyer dans la réponse
const sendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d", // ou ce que tu veux
  });

  res.status(statusCode).json({
    success: true,
    token,
    user, // tu peux adapter ce que tu veux renvoyer ici
  });
};

// Register user
exports.signup = async (req, res, next) => {
  const { fullName, email, password, dateDeNaiss, sexe, country } = req.body;
  console.log("Data received in signup controller:", req.body);

  try {
    const user = await User.create({
      fullName,
      email,
      password,
      dateDeNaiss,

      sexe,
      country,
    });
    console.log("User created:", user);
    sendToken(user, 200, res);
  } catch (err) {
    next(err); // Propagate error to the global error handler
  }
};

exports.testMail = async (req, res) => {
  try {
    const recipients = req.body.recipients || ["saidaneeya3@gmail.com"];

    const info = await transporter.sendMail({
      from: `"Mailtrap Test" <${process.env.MY_MAIL}>`,
      to: recipients,
      subject: "You are awesome!",
      text: "Congrats for sending test email with Mailtrap!",
    });

    res.status(200).json({
      message: "Email sent successfully!",
      messageId: info.messageId,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Failed to send email", details: err.message });
  }
};

exports.verfMail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    const VerifCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verifCode = VerifCode;
    await user.save();
    const info = await transporter.sendMail({
      from: `"Wishit" <${process.env.MY_MAIL}>`,
      to: email,
      subject: "VerifCode",
      text: "Reset your password",
      html: `<p>Voici votre code de vérification : <b>${VerifCode}</b></p>`,
    });
    res.status(200).json({
      message: "Email sent successfully!",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to send email" });
    console.log(error);
  }
};

exports.VerifCode = async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user.verifCode !== code)
      res.status(400).json({
        message: "code incorrect",
        permission: false,
      });
    else user.verifCode = null;
    await user.save();
    res.status(200).json({
      message: "code is correct",
      permission: true,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed" });
    console.log(error);
  }
};
// resetPassword + HASH MDP
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to reset password" });
  }
};
