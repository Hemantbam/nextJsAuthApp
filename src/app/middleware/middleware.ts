import jwt from "jsonwebtoken";

export function verifyToken(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  const secret = process.env.JWT_ACCESS_SECRET_TOKEN;
  if (!secret) {
    return res.status(500).json({ message: "JWT secret not configured" });
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  });
}
