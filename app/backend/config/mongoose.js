import mongoose from "mongoose";

export const mongooseConnection = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`Mongoose connected on port ${db.connection.port}`);
    } catch (err) {
        console.log(err.message);
    }
}
