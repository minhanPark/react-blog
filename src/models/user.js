import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new Schema({
  username: String,
  hashedPassword: String
});

//모델을 통해 만들어진 인스턴스에서 사용할수 있는 인스턴스 메소드
UserSchema.methods.setPassword = async function(password) {
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash;
};

UserSchema.methods.checkPassword = async function(password) {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result;
};

UserSchema.methods.serialize = function() {
  const data = this.toJSON();
  delete data.hashedPassword;
  return data;
};
UserSchema.methods.generateToken = function() {
  const token = jwt.sign(
    {
      _id: this.id,
      username: this.username
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );
  return token;
};

// 모델에서 사용가능한 스태틱 메소드
UserSchema.statics.findByUsername = function(username) {
  return this.findOne({ username });
};

const User = mongoose.model("User", UserSchema);
export default User;
