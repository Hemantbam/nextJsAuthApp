import { NextResponse } from "next/server";
import { User } from "../../../../entities/User";
import { dbConn } from "../../../../db/dbConfig";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    if (!dbConn.isInitialized) {
      await dbConn.initialize();
    }

    const { email, password } = await request.json();

    if (!email?.trim() || !password?.trim()) {
      throw new Error("EMPTY_INPUT");
    }

    const userRepo = dbConn.getRepository(User);
    const userDetails = await userRepo.findOne({ where: { email: email } });

    if (userDetails) {
      throw new Error("USER_ALREADY_EXIST");
    }
    const userId = randomUUID();
    const hashPassword = await bcrypt.hash(password, 10);
    const addUser = userRepo.create({
      id: userId,
      email: email,
      password: hashPassword,
    });

    const result = await userRepo.save(addUser);

    if (!result) {
      throw new Error("SIGNUP_FAILED");
    }

    const refreshSecret = process.env.JWT_REFRESH_SECRET_TOKEN!;
    const accessSecret = process.env.JWT_ACCESS_SECRET_TOKEN!;

    const refreshToken = jwt.sign({ id: userId, email: email }, refreshSecret, {
      expiresIn: "1h",
    });

    const accessToken = jwt.sign({ id: userId, email: email }, accessSecret, {
      expiresIn: "1h",
    });

    return NextResponse.json({
      success: true,
      data: { accessToken: accessToken, refreshToken: refreshToken },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "EMPTY_INPUT") {
        return NextResponse.json(
          { success: false, message: "Email and password are required" },
          { status: 400 }
        );
      }
      if (error.message === "USER_ALREADY_EXIST") {
        return NextResponse.json(
          { success: false, message: "User already exists" },
          { status: 409 }
        );
      }
      if (error.message === "SIGNUP_FAILED") {
        return NextResponse.json(
          { success: false, message: "Failed to create user" },
          { status: 500 }
        );
      }

      console.error(error);
      return NextResponse.json(
        { success: false, message: "Internal server error" },
        { status: 500 }
      );
    } else {
      console.error("Unexpected non-error thrown:", error);
      return NextResponse.json(
        { success: false, message: "Unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
