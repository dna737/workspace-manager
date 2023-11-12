require("dotenv").config();
const { MongoClient } = require("mongodb");
const { collection } = require("./Schemas/Workspace");
const retrieveData = require("./backend");

async function removeData(queryName, collectionName) {
    const dataExists = await retrieveData(queryName, collectionName);

    if (!dataExists) {
        console.log("Data doesn't exist. Skipping remove.");
        return;
    }

    const mongoURI = process.env.MONGO_URI || "-1";

    // Create a MongoDB client
    const client = new MongoClient(mongoURI, {});

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db("Workflow_collection");

        const collection = db.collection(collectionName);

        const query = { workspaceName: queryName };

        const result = await collection.deleteOne(query);
        console.log(`Deleted ${result.deletedCount} document`);
    }
    finally {
        await client.close();
        console.log("Connection closed");
    }
}

removeData("3qliuvbwlriey-esl118", "workspaces")