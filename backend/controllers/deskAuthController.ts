import bcrypt from "bcryptjs";
import dbConnect from "@/backend/utils/dbConnect";
import DeskUser from "@/backend/models/DeskUser";
import { signDeskToken } from "@/backend/middleware/deskAuth";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function signupDeskUser(input: {
  name: string;
  email: string;
  password: string;
  inviteCode?: string;
}) {
  const name = input.name.trim();
  const email = normalizeEmail(input.email);
  const password = input.password;

  if (name.length < 2) throw new Error("Name is required");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Valid email is required");
  }
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const requiredInvite = process.env.DESK_INVITE_CODE;
  if (requiredInvite && input.inviteCode !== requiredInvite) {
    throw new Error("Invalid invite code");
  }

  await dbConnect();

  const existing = await DeskUser.findOne({ email });
  if (existing) throw new Error("An account with that email already exists");

  const hashed = await bcrypt.hash(password, 12);
  const count = await DeskUser.countDocuments();
  const user = await DeskUser.create({
    name,
    email,
    password: hashed,
    role: count === 0 ? "admin" : "member",
  });

  const token = await signDeskToken({
    userId: user._id.toString(),
    email: user.email,
    role: `desk:${user.role}`,
  });

  return {
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

export async function loginDeskUser(email: string, password: string) {
  await dbConnect();

  const user = await DeskUser.findOne({ email: normalizeEmail(email) });
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  const token = await signDeskToken({
    userId: user._id.toString(),
    email: user.email,
    role: `desk:${user.role}`,
  });

  return {
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}
