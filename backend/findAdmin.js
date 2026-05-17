import mongoose from "mongoose";

const MONGO_URL = "mongodb://sanjana:MONGOATLAS@ac-grguyrp-shard-00-00.zbonz4q.mongodb.net:27017,ac-grguyrp-shard-00-01.zbonz4q.mongodb.net:27017,ac-grguyrp-shard-00-02.zbonz4q.mongodb.net:27017/HairCare?ssl=true&replicaSet=atlas-wwfnts-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster1";

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to MongoDB!");
  
  const collections = await mongoose.connection.db.listCollections().toArray();
  const colNames = collections.map(c => c.name);
  console.log("Available Collections:", colNames);
  
  // Find admin users in collections
  for (const name of colNames) {
    if (name.toLowerCase().includes("user")) {
      const users = await mongoose.connection.db.collection(name).find({ role: "admin" }).toArray();
      console.log(`Admin Users in '${name}':`, users.map(u => ({ email: u.email, username: u.username })));
    }
  }

  await mongoose.disconnect();
}

main().catch(console.error);
