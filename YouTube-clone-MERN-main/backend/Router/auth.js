require("dotenv").config();
require("../Database/database");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const userData = require("../Models/user");
const auth = express.Router();
const {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
} = require("../lib/tokens");
const requireAuth = require("./requireAuth");
const { OAuth2Client } = require('google-auth-library');

auth.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await userData.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "USER ALREADY EXISTS",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 11);
    const saveData = new userData({ name, email, password: hashedPassword });
    await saveData.save();

    //Create access token
    const accessToken = generateAccessToken(saveData);

    // Nodemailer configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Welcome to Kunal's YouTube Clone!",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
          <h1 style="color: #333;">Welcome to Kunal's YouTube Clone!</h1>
          <p style="color: #555;">Hello ${name},</p>
          <p style="color: #555;">We are excited to have you as a new member of our community! Thank you for joining.</p>
          <p style="color: #555;">Feel free to explore our platform and start sharing your videos with the world.</p>
          <p style="color: #555;">If you have any questions or need assistance, don't hesitate to reach out to us.</p>
          <p style="color: #555;">Best regards,</p>
          <p style="color: #555;">Kunal Sur</p>
        </div>
      `,
    };

    // Send the email (but do not block registration if it fails)
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending registration email:", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    // Always return registration success if user is created
    return res.status(201).json({
      message: "REGISTRATION SUCCESSFUL",
      user: {
        name: saveData.name,
        email: saveData.email,
      },
      token: accessToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

auth.post("/login", async (req, res) => {
  try {
    const { email1, password1 } = req.body;
    const user = await userData.findOne({ email: email1 });
    if (!user) {
      return res.status(404).json({ message: "USER DOESN'T EXIST" });
    }
    const checkPassword = await bcrypt.compare(password1, user.password);
    if (checkPassword) {
      const accessToken = generateAccessToken(user);
      return res.status(200).json({
        message: "LOGIN SUCCESSFUL",
        user: {
          name: user.name,
          email: user.email,
        },
        token: accessToken,
      });
    } else {
      return res.status(401).json({ message: "INVALID CREDENTIALS" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

auth.post("/resetlink", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userData.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "USER DOESN'T EXIST",
      });
    }

    const resetToken = jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: "30m",
    });
    const resetLink = `${process.env.BACKEND_URL}/${user?._id}/${resetToken}`;

    // Nodemailer configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset Link",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
          <h2 style="color: #333;">Password Reset</h2>
          <p style="color: #555;">Hello,</p>
          <p style="color: #555;">Click the following link to reset your password:</p>
          <p style="margin: 20px 0;">
            <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
          </p>
          <p style="color: #555;">This link is only valid for 30 minutes.</p>
          <p style="color: #555;">If you didn't request a password reset, please ignore this email.</p>
          <p style="color: #888;">Best regards,<br/>The YouTube Clone Team</p>
        </div>
      `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(400).json({
          message: "Error sending email",
        });
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).json({
          message: "Password reset link sent to your email",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

auth.get("/logout", (req, res) => {
  try {
    // Logic for logout if needed
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

auth.get("/userdata", requireAuth, async (req, res) => {
  try {
    const user = await userData.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * Google Login Endpoint
 * Receives Google ID token from frontend, verifies it, creates/returns user, and issues JWT.
 * POST /google-login
 * Body: { credential: string }
 */
auth.post('/google-login', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: 'Missing Google credential' });
    }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    // Verify the ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({ message: 'Invalid Google token' });
    }
    const { email, name, picture } = payload;
    if (!email) {
      return res.status(400).json({ message: 'Google account missing email' });
    }

    // Find or create user
    let user = await userData.findOne({ email });
    if (!user) {
      user = new userData({
        name: name || email,
        email,
        password: 'GOOGLE_OAUTH', // Not used, but required by schema
        profilePic: picture,
      });
      await user.save();
    } else if (!user.profilePic && picture) {
      user.profilePic = picture;
      await user.save();
    }

    // Issue JWT
    const accessToken = generateAccessToken(user);
    return res.status(200).json({
      message: 'GOOGLE LOGIN SUCCESSFUL',
      user: {
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
      },
      token: accessToken,
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Google login failed', error: error.message });
  }
});

module.exports = auth;
