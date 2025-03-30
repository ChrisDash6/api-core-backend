const mongoose = require("mongoose");
let connections = {};

const connectToDB = async (dbName) => {
    mongoose.set('strictQuery', true);


    if (connections[dbName]) {
        console.log(`MongoDB Connection Ok. Connected to ${dbName}`);
        return connections[dbName]; // Return the existing connection
    }

    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: dbName, // ✅ Keep this, it's fine
        });

        connections[dbName] = connection;
        


        console.log(`MongoDB connected to ${dbName}`);

    } catch (error) {
        console.log(error);
    }
}

module.exports = connectToDB;