import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../models/index.js";

// Mã hóa mật khẩu người dùng
const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (password) => {
  return bcrypt.hashSync(password, salt);
};

// Đăng ký người dùng mới
const registerUser = async (UserName, Password) => {
  const hashPassword = hashUserPassword(Password);

  try {
    // Kiểm tra nếu email đã tồn tại trong hệ thống
    const existingUser = await db.User.findOne({ where: { UserName } });
    if (existingUser) {
      throw new Error("Tên người dùng  đã được đăng ký");
    }

    // Tạo người dùng mới trong database
    const newUser = await db.User.create({
      UserName,

      Password: hashPassword,
    });

    return {
      newUser,
    };
  } catch (error) {
    throw new Error("Lỗi khi đăng ký người dùng: " + error.message);
  }
};

// Đăng nhập và tạo JWT
const loginUser = async (UserName, Password) => {
  const user = await db.User.findOne({
    where: { UserName },
  });

  if (!user) {
    throw new Error("Tên người dùng hoặc mật khẩu không đúng");
  }

  const passwordMatch = bcrypt.compareSync(Password, user.Password);
  if (!passwordMatch) {
    throw new Error("Tên người dùng hoặc mật khẩu không đúng");
  }

  const token = jwt.sign(
    { userId: user.id, UserName: user.UserName },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  await user.update({ Token: token });
  return token;
};

// Lấy thông tin người dùng
const getUserInfo = async (id) => {
  const user = await db.User.findOne({ where: { id } });
  if (!user) throw new Error("Không tìm thấy người dùng");
  return user;
};

export default {
  registerUser,
  loginUser,
  getUserInfo,
};
