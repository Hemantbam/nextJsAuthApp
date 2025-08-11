import jwt from "jsonwebtoken";
export function decodeToken(token: string) {
  try {
    const decodeToken = jwt.decode(token);
    return decodeToken;
  } catch (error) {
    console.log(error);
  }
}
