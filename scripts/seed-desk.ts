import mongoose from "mongoose";
import { getDeskSeedRecords } from "../lib/desk/seedData";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is required.");
  process.exit(1);
}

async function seed() {
  await mongoose.connect(MONGODB_URI as string);
  const col = mongoose.connection.collection("deskrecords");
  const existing = await col.countDocuments();
  if (existing > 0 && process.argv[2] !== "--force") {
    console.log(`Desk already has ${existing} records. Pass --force to insert seed rows anyway.`);
    await mongoose.disconnect();
    return;
  }
  const rows = getDeskSeedRecords().map((r) => ({
    ...r,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  const result = await col.insertMany(rows);
  console.log(`Inserted ${result.insertedCount} desk records into the existing MongoDB database.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
