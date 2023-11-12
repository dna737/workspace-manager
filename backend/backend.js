require("dotenv").config();
const { MongoClient } = require("mongodb");
const { collection } = require("./Schemas/Workspace");

async function retrieveData(queryName, collectionName) {

    const mongoURI = process.env.MONGO_URI || "-1";
    paths = null;

    // Create a MongoDB client
    const client = new MongoClient(mongoURI, {});

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db("Workflow_collection");

        const collection = db.collection(collectionName);

        const query = { workspaceName: queryName };

        const results = await collection.find(query).toArray();

        if (results.length == 0) {
            console.log("File not found. Returning null.")
            return paths
        }

        for (const result of results) {
            paths = result.paths;
            console.log(paths);
        }

    } finally {
        await client.close();
        console.log("Connection closed");
    }
    return paths;
}

//retrieveData("jf83lsi890--workspace2", "workspaces");
retrieveData("3qliuvbwlriey-esl118", "workspaces");
module.exports = retrieveData;