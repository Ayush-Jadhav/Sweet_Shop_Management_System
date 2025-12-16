const User = require("../models/user");
const OTP = require("../models/otpForRegister");
const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");
const { SendMail } = require("../utils/mailSender");

exports.sendOTP = async (req, res) => {
  try {
    const { email, number } = req.body;

    const isExist = await User.findOne({ email });
    if (isExist) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // generate otp for email verification
    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    console.log("otp", otp);

    // create otp for email verification and send mail
    const sendOTP = await OTP.create({ number, email, otp });

    SendMail({
      to: email,
      subject: "Email Verification Mail from Sweet Shop",
      html: `Your One Time Password is: <b>${otp.otp}</b>`,
    }).catch(console.error);

    return res.status(200).json({
      success: true,
      message: "OTP generates and sent successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

exports.signUp = async (req, res) => {
  try {
    const { fullName, email, number, role, password, confirmPassword, otp } =
      req.body;

    console.log("Received signup data:", req.body);
    // validate data
    if (
      !fullName ||
      !email ||
      !role ||
      !number ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirmPassword must be same",
      });
    }

    // verify otp
    const otpInDB = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    const originalOTP = otpInDB[0]?.otp;

    // Check if an OTP exists in the database
    if (!originalOTP) {
      return res.status(404).json({
        success: false,
        message: "No OTP found for this email.",
      });
    }

    // check if user already exists
    const isExist = await User.findOne({ email, number });
    if (isExist) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Ensure both are strings and compare
    if (otp?.trim() !== originalOTP.toString().trim()) {
      return res.status(400).json({
        success: false,
        message: `Incorrect OTP`,
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "confirmPassword must be same.",
      });
    }

    // hash password before storing, salt round 10
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      number,
      role,
      password: hashPassword,
    });

    return res.status(200).json({
      success: true,
      message: "User created Successfull",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
