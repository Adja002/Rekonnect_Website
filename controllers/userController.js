const User = require("../models/user");
const path = require("path");
const bcrypt = require("bcrypt");
const ejs = require("ejs");

const SALT_ROUNDS = 10;

exports.login = async (req, res) => {
  let message = null;

  const isAuthenticated = req.session.isAuthenticated;
  if (isAuthenticated) {
    res.redirect("/events");
    return;
  }

  if (req.method === "POST") {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });

      if (!user) {
        message = `Login has failed! Check your credentials carefully ${email}`;
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        message = "Invalid credentials.";
      }

      req.session.user = {
        id: user._id,
        email: user.email,
        role: user.role,
      };

      req.session.isAuthenticated = true;
      const redirectUrl =
        req.session.originalUrl || req.query.next || "/events";

      delete req.session.originalUrl;
      res.redirect(redirectUrl);
      return;
    } catch (error) {
      message = `Error during login: ${error}`;
    }
  }

  const content = await ejs.renderFile(
    path.join(__dirname, "..", "views", "login.ejs"),
    { message }
  );

  res.render("partials/layout", { body: content });
};

exports.signup = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);
    req.body.password = hashedPassword;

    const user = new User(req.body);

    await user.save();

    req.session.user = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    req.session.isAuthenticated = true;
    res.redirect("/events");
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).send(err.message);
    }

    console.error("Registration error:", err);
    res.status(500).send("An error has occurred during registration.");
  }
};

exports.createOrUpdateUser = async (req, res) => {
  let message = null;
  if (req.method === "POST") {
    try {
      const payload = req.body;

      const user = new User(payload);
      const password = Math.random().toString(36).slice(-8);
      user.password = await bcrypt.hash(password, SALT_ROUNDS);

      send_email(user.email, "Your password", `Your password is ${password}`);
      await user.save();
    } catch (error) {
      message = `Failed creating the user ${error.message} ${req.session.user}`;
    }
  }
  const content = await ejs.renderFile(
    path.join(__dirname, "..", "views", "addUsers.ejs"),
    { message }
  );

  res.render("partials/layout", {
    body: content,
  });
};

exports.signupPage = async (req, res) => {
  const years = [
    { value: 2023, label: "2023" },
    { value: 2024, label: "2024" },
  ];

  const content = await ejs.renderFile(
    path.join(__dirname, "..", "views", "signup.ejs"),
    { years }
  );

  res.render("partials/layout", { body: content });
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1; 
  const limit = 7; 
  const skip = (page - 1) * limit; 

  const totalUsers = await User.countDocuments();
  const totalPages = Math.ceil(totalUsers / limit);
  const users = await User.find().skip(skip).limit(limit);

  const content = await ejs.renderFile(
    path.join(__dirname, "..", "views", "users.ejs"),
    { users, page, totalPages }
  );

  res.render("partials/layout", {
    body: content,
  });
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      password,
      role,
      firstName,
      middleName,
      lastName,
      graduationYear,
      major,
      email,
      profilePicture,
    } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      {
        password,
        role,
        firstName,
        lastName,
        graduationYear,
        major,
        email,
      },
      { new: true }
    );
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (deleted) {
      return res.status(200).send("User deleted");
    }
    throw new Error("User not found");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/"); 
  });
};

exports.getProfile = async (req, res) => {
  res.send(req.user);
};
