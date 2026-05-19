import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { logActivity } from "@/services/logService";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    // Prevent self-deletion
    if ((session.user as any).id === id) {
        return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
    }

    const user = await User.findById(id);
    if (user) {
      await User.findByIdAndDelete(id);
      await logActivity(req, "DELETE_USER", "User", id, `Deleted user account: ${user.email}`);
    }

    return NextResponse.json({ message: "User deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await connectDB();
    const user = await User.findByIdAndUpdate(id, body, { new: true });
    
    if (user) {
      await logActivity(req, "CHANGE_ROLE", "User", id, `Modified user ${user.email}: ${JSON.stringify(body)}`);
    }

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

