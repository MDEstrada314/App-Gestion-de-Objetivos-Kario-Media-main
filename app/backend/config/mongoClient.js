import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);
client.connect();

export const mongoClientConnection = async () => {
  try {
    await client.db("admin").command({ ping: 1 });
    console.log("MongoClient connected!");
  } catch (err) {
    console.log(err);
  }
};

export const db = client.db("karioMedia");