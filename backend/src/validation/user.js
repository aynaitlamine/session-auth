const Joi = require("joi");

const validateSignUp = (user) => {
  const schema = Joi.object({
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),

    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/
      )
      .min(6)
      .max(16),
  });
  return schema.validate(user);
};

const validateSignIn = async (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/
      )
      .min(6)
      .max(16),
  });
  return schema.validate(user);
};

module.exports = {
  validateSignUp,
  validateSignIn,
};
