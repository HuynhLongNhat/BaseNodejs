import userService from "../service/userService.js";

// Controller đăng nhập
const login = async (req, res) => {
  const { UserName, Password } = req.body;

  try {
    const token = await userService.loginUser(UserName, Password);
    return res.status(200).json({
      EM: "Đăng nhập thành công",
      EC: 0,
      DT: { token },
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      EM: error.message,
      EC: -1,
      DT: null,
    });
  }
};

// Controller đăng ký
const register = async (req, res) => {
  const { UserName, Password } = req.body;

  try {
    const result = await userService.registerUser(UserName, Password);
    return res.status(200).json({
      EM: "Đăng kí thành công",
      EC: 0,
      DT: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      EM: error.message,
      EC: -1,
      DT: null,
    });
  }
};

// Controller lấy thông tin tài khoản người dùng
const getUserAccount = async (req, res) => {
  try {
    const user = await userService.getUserInfo(req.user.userId);
    return res.status(200).json({
      EM: "Thông tin người dùng được trích xuất thành công",
      EC: 0,
      DT: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      EM: error.message,
      EC: -1,
      DT: null,
    });
  }
};

export default {
  login,
  register,
  getUserAccount,
};
