import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@wintersummer.com" });
    
    if (existingAdmin) {
      existingAdmin.role = "superadmin";
      await existingAdmin.save();
      return NextResponse.json({ 
        message: "Existing account upgraded to Super Admin",
        email: "admin@wintersummer.com" 
      }, { status: 200 });
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("Admin@123", 12);
    
    await User.create({
      name: "Super Admin",
      email: "admin@wintersummer.com",
      password: hashedPassword,
      role: "superadmin",
    });

    return NextResponse.json({ 
      message: "Admin account created successfully",
      email: "admin@wintersummer.com",
      password: "Admin@123"
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
