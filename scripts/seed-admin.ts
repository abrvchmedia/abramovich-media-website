import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI environment variable is required.");
  console.error("Usage: MONGODB_URI=<your-uri> npx tsx scripts/seed-admin.ts [email] [password]");
  process.exit(1);
}

const AdminUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
  },
  { timestamps: true }
);

async function seed() {
  await mongoose.connect(MONGODB_URI as string);

  const AdminUser =
    mongoose.models.AdminUser ||
    mongoose.model("AdminUser", AdminUserSchema);

  const email = process.argv[2] || "admin@abramovichmedia.com";
  const password = process.argv[3] || "admin123";

  const hashed = await bcrypt.hash(password, 12);

  await AdminUser.findOneAndUpdate(
    { email },
    { email, password: hashed, role: "admin" },
    { upsert: true, new: true }
  );

  console.log(`\n  Admin user seeded successfully!`);
  console.log(`  Email:    ${email}`);
  console.log(`  Password: ${password}`);
  console.log(`\n  Login at: http://localhost:3000/admin/login\n`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
