require("dotenv").config();
const { MongoClient } = require("mongodb");
const { collection } = require("./Schemas/Workspace");

async function removeData(queryName, collectionName) {
    const mongoURI = process.env.MONGO_URI || "-1";

    // Create a MongoDB client
    const client = new MongoClient(mongoURI, {});

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db("Workflow_collection");

        const collection = db.collection(collectionName);

        query = null;
        if (collectionName == "workspaces")
            query = { workspaceName: queryName };

        else if (collectionName == "users")
            query = { username: queryName};

        const results = await collection.find(query).toArray();
        if (results.length == 0)
            console.log("Data doesn't exist. Skipping remove.");
        else {
            const result = await collection.deleteOne(query);
            console.log(`Deleted ${result.deletedCount} document`);
        }
    } finally {
        await client.close();
        console.log("Connection closed");
    }
}

removeData("3qliuvbwlriey-esl118", "workspaces");
