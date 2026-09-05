import bcrypt from "bcryptjs";
import dbConnect from "@/backend/utils/dbConnect";
import DeskUser from "@/backend/models/DeskUser";
import AdminUser from "@/backend/models/AdminUser";
import {
  DEFAULT_DESK_EMAIL,
  DEFAULT_DESK_NAME,
  DEFAULT_DESK_PASSWORD,
} from "@/lib/desk/defaults";

async function setPasswordIfNeeded(
  user: { password: string; save: () => Promise<unknown> },
  password: string
) {
  const matches = await bcrypt.compare(password, user.password);
  if (matches) return;
  user.password = await bcrypt.hash(password, 12);
  await user.save();
}

export async function ensureDefaultAccounts() {
  await dbConnect();
  const email = DEFAULT_DESK_EMAIL;
  const password = DEFAULT_DESK_PASSWORD;
  const hashed = await bcrypt.hash(password, 12);

  const desk = await DeskUser.findOne({ email });
  if (!desk) {
    await DeskUser.create({
      name: DEFAULT_DESK_NAME,
      email,
      password: hashed,
      role: "admin",
    });
  } else {
    await setPasswordIfNeeded(desk, password);
    if (desk.role !== "admin") {
      desk.role = "admin";
      await desk.save();
    }
  }

  const admin = await AdminUser.findOne({ email });
  if (!admin) {
    await AdminUser.create({
      email,
      password: hashed,
      role: "admin",
    });
  } else {
    await setPasswordIfNeeded(admin, password);
  }
}
