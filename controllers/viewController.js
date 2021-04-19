const Event = require("./../models/eventModel");

const catchAsync = require("./../utils/catchAsync");
const ApiError = require("./../utils/apiError");

exports.getOverview = (req, res, next) => {
  res.status(200).render("index", {
    title: "map your important events",
  });
};

exports.getLogin = (req, res, next) => {
  res.status(200).render("login", {
    title: "Login",
  });
};

exports.getSignup = (req, res, next) => {
  res.status(200).render("signup", {
    title: "Sign up",
  });
};

exports.getProfile = (req, res) => {
  res.status(200).render("account", {
    title: "My Profile",
  });
};

exports.getPasswordChange = (req, res) => {
  res.status(200).render("passwordChange", {
    title: "Change Password",
  });
};

exports.getPasswordForgot = (req, res) => {
  res.status(200).render("passwordForgot", {
    title: "Forgot Password",
  });
};

exports.getPasswordReset = (req, res) => {
  res.status(200).render("passwordReset", {
    title: "Reset Password",
    token: req.params.token,
  });
};

exports.updateProfile = catchAsync(async (req, res) => {
  const fields = {
    name: req.body.name,
    email: req.body.email,
  };

  const updatedUser = await User.findByIdAndUpdate(req.user.id, fields, {
    new: true,
    runValidators: true,
  });

  res.status(201).render("account", {
    title: "My Profile",
    user: updatedUser,
  });
});

exports.getAlerts = (req, res, next) => {
  if (req.query.alert === "booking-success")
    res.locals.alert = {
      message: `Booking was successful. If it doesn't show up in my tours, please check again after sometime!`,
      type: "success",
    };

  if (req.query.alert === "booking-failure")
    res.locals.alert = {
      message: `Booking was failure. Try again after sometime!`,
      type: "error",
    };

  next();
};
