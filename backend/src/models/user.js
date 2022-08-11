const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      validate: {
        validator: (username) =>
          User.doesNotExist({username}),
        message: "Username already exists",
      },
    },
    email: {
      type: String,
      validate: {
        validator: (email) => User.doesNotExist({email}),
        message: "Email already exists",
      },
    },
    password: {
      type: String,
      required: true,
    },
  },
  {timestamps: true}
);

userSchema.pre("save", function () {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
});
userSchema.statics.doesNotExist = async function (field) {
  return (await this.where(field).countDocuments()) === 0;
};
userSchema.methods.comparePasswords = function (password) {
  return bcrypt.compareSync(password, this.password);
};
const User = mongoose.model("User", userSchema);
module.exports = User;
