require("dotenv").config();
const { MongoClient } = require("mongodb");

async function retrieveData(workName) {
    const mongoURI = process.env.MONGO_URI || "-1";

    // Create a MongoDB client
    const client = new MongoClient(mongoURI, {});

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db("Workflow_collection");

        const collection = db.collection("workspaces");

        const query = { workspaceName: workName };

        const results = await collection.find(query).toArray();

        for (const result of results) {
            const paths = result.paths;
            console.log(paths);
        }
    } finally {
        await client.close();
        console.log("Connection closed");
    }
}

retrieveData("jf83lsi890--workspace2");
