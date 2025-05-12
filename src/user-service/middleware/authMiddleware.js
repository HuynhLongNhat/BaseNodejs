import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ EM: "Chưa xác thực người dùng", EC: -1, DT: null });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ EM: "Token không hợp lệ", EC: -1, DT: null });
    }

    req.user = user; // Gán thông tin user vào request
    next();
  });
};
