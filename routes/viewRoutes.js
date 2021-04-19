const express = require("express");

const viewController = require(`${__dirname}/../controllers/viewController`);
const userController = require(`${__dirname}/../controllers/userController`);
const authController = require(`${__dirname}/../controllers/authController`);

const router = express.Router();

router.use(viewController.getAlerts);
router.route("/me").get(authController.verifyUser, viewController.getProfile);
router
  .route("/password-change")
  .get(authController.verifyUser, viewController.getPasswordChange);

router.route("/forgot-password").get(viewController.getPasswordForgot);

router.route("/reset-password/:token").get(viewController.getPasswordReset);

router
  .route("/update-profile")
  .post(authController.verifyUser, viewController.updateProfile);

router.use(authController.isLoggedIn);

router.route("/").get(viewController.getOverview);

router.route("/overview").get(viewController.getOverview);

router.route("/login").get(viewController.getLogin);

router.route("/signup").get(viewController.getSignup);

module.exports = router;
