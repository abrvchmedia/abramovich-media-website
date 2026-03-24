import bcrypt from "bcryptjs";
import dbConnect from "@/backend/utils/dbConnect";
import AdminUser from "@/backend/models/AdminUser";
import { signToken } from "@/backend/middleware/auth";

export async function loginAdmin(email: string, password: string) {
  await dbConnect();

  const user = await AdminUser.findOne({ email: email.toLowerCase() });
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  const token = await signToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: { id: user._id, email: user.email, role: user.role },
  };
}
