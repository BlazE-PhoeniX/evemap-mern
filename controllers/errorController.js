const ApiError = require(`${__dirname}/../utils/apiError`);

const castErrorDB = err => {
  const message = `Invalid value for ${err.path}: ${err.value}`;

  return new ApiError(400, "fail", message);
};

const validateErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Validation Errors: ${errors.join(". ")}`;

  return new ApiError(400, "fail", message);
};

const duplicateErrorDB = err => {
  const message = `${Object.keys(err.keyValue)[0]} ${
    Object.values(err.keyValue)[0]
  } already axists`;

  return new ApiError(400, "fail", message);
};

const JWTSignError = () => {
  return new ApiError(401, "fail", "JWT signature verification failed.");
};

const JWTExpiredTokenError = () => {
  return new ApiError(401, "fail", "JWT token has expired, login again");
};

const devErrorHandle = (err, req, res) => {
  console.error("Error: " + err);
  if (req.originalUrl.startsWith("/api")) {
    console.log(err);
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
      data: null,
    });
  }
};

const prodErrorHandle = (err, req, res) => {
  console.error("Error: ", err);
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.statusCode,
        message: err.message,
        data: null,
      });
    } else {
      return res.status(500).json({
        status: "error",
        message: "Something went wrong! , try again after sometime",
        data: null,
      });
    }
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  err.message = err.message || "Internal server error!";
  let error = { ...err };
  error.message = err.message;

  if (err.name === "CastError") error = castErrorDB(error);
  if (err.name === "ValidationError") error = validateErrorDB(error);
  if (err.code === 11000) error = duplicateErrorDB(error);
  if (err.name === "JsonWebTokenError") error = JWTSignError();
  if (err.name === "TokenExpiredError") error = JWTExpiredTokenError();

  if (process.env.NODE_ENV === "development") {
    devErrorHandle(error, req, res);
  } else if (process.env.NODE_ENV === "production") {
    prodErrorHandle(error, req, res);
  }
};
