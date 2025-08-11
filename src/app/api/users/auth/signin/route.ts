import { NextResponse } from "next/server";
import { User } from "../../../../entities/User";
import { dbConn } from "../../../../db/dbConfig";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    if (!dbConn.isInitialized) {
      await dbConn.initialize();
    }
    const { email, password } = await request.json();
    const userRepo = await dbConn.getRepository(User);

    const userDetails = await userRepo.findOne({ where: { email: email } });

    if (!userDetails) {
      throw new Error("USER_NOT_FOUND");
    }

    const comparePassword = await bcrypt.compare(
      password,
      userDetails.password
    );
    if (!comparePassword) {
      throw new Error("UNMATCHED_PASSWORD");
    }

    const refreshSecret = process.env.JWT_REFRESH_SECRET_TOKEN!;
    const accessSecret = process.env.JWT_ACCESS_SECRET_TOKEN!;

    const accessToken = jwt.sign(
      { id: userDetails.id, email: userDetails.email },
      accessSecret,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: userDetails.id, email: userDetails.email },
      refreshSecret,
      { expiresIn: "30d" }
    );

    return NextResponse.json(
      {
        success: true,
        message: "User Details fetched successfully",
        data: { accessToken: accessToken, refreshToken: refreshToken },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      if (error.message === "USER_NOT_FOUND")
        return NextResponse.json(
          {
            success: false,
            message: "No user details found for given email",
            data: [],
          },
          { status: 404 }
        );

      if (error.message === "UNMATCHED_PASSWORD") {
        return NextResponse.json(
          { success: false, message: "Incorrect Password" },
          { status: 401 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, message: "Internal server error" },
        { status: 500 }
      );
    }
  }
}
