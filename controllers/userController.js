const User = require(`${__dirname}/../models/userModel`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const ApiError = require(`${__dirname}/../utils/apiError`);
const factory = require(`${__dirname}/../utils/handlerFactory`);

const filterObj = (obj, ...allowedFields) =>
  Object.keys(obj).reduce((acc, el) => {
    if (allowedFields.includes(el)) acc[el] = obj[el];
    return acc;
  }, {});

exports.getUsers = factory.getAll(User, "User");

exports.getOneUser = factory.getOne(User, "User");

exports.changeUser = factory.updateOne(User, "User");

exports.deleteUser = factory.deleteOne(User, "User");

exports.getProfile = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateProfile = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new ApiError(400, "fail", "Password cannot be updated in this page.")
    );
  }

  const filteredObj = filterObj(req.body, "name", "email");

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredObj, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    message: "User data updated successfully",
    date: {
      user: updatedUser,
    },
  });
});

exports.deleteProfile = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });

  res.status(204).json({
    status: "success",
    message: "User deleted successfully",
    date: null,
  });
});
