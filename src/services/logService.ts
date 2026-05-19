import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import ActivityLog from "@/models/ActivityLog";

export async function logActivity(
  req: Request | NextRequest | null,
  action: string,
  targetType: string,
  targetId: string | undefined,
  details: string
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      console.warn("Attempted to log activity but no active admin session was found.");
      return;
    }

    const admin = session.user as any;
    
    let ipAddress = "";
    let userAgent = "";

    if (req) {
      ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";
      userAgent = req.headers.get("user-agent") || "";
    }

    await ActivityLog.create({
      adminId: admin.id,
      adminName: admin.name || "Admin",
      adminEmail: admin.email,
      action,
      targetType,
      targetId,
      details,
      ipAddress,
      userAgent,
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}
