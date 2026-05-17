import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGO_URL = "mongodb://sanjana:MONGOATLAS@ac-grguyrp-shard-00-00.zbonz4q.mongodb.net:27017,ac-grguyrp-shard-00-01.zbonz4q.mongodb.net:27017,ac-grguyrp-shard-00-02.zbonz4q.mongodb.net:27017/HairCare?ssl=true&replicaSet=atlas-wwfnts-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster1";

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to MongoDB!");
  
  const hashedPassword = await bcrypt.hash("admin123", 7);
  const result = await mongoose.connection.db.collection("users").updateOne(
    { email: "admin@gmail.com" },
    { $set: { password: hashedPassword, role: "admin" } }
  );
  
  console.log("Admin update result:", result);

  await mongoose.disconnect();
}

main().catch(console.error);
