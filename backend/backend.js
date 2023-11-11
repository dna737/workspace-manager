require("dotenv").config();
const { MongoClient } = require("mongodb");

async function retrieveData(workName) {
    const mongoURI = process.env.MONGO_URI || "-1";

    // Create a MongoDB client
    const client = new MongoClient(mongoURI, {});

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        // Select the database
        const db = client.db("Workflow_collection");

        // Select the collection
        const collection = db.collection("workspaces");

        // Query to retrieve data
        const query = { workspaceName: workName };

        // Retrieve data from the collection based on the query
        const results = await collection.find(query).toArray();

        // Print out data
        for (const result of results) {
            const paths = result.paths;
            console.log(paths);
        }
    } finally {
        // Close the MongoDB connection
        await client.close();
        console.log("Connection closed");
    }
}

retrieveData("jf83lsi890--workspace2");
