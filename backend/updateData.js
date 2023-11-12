require("dotenv").config();
const { MongoClient } = require("mongodb");

async function updateData(queryName, collectionName, updatingData) {
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
        else if (collectionName == "users") query = { username: queryName };

        const results = await collection.find(query).toArray();
        if (results.length == 0)
            console.log("Data doesn't exist. Skipping update.");
        else {

            // Define the update operation
            const updateOperation = {
                $set: updatingData
            };

            // Update a single document
            const result = await collection.updateOne(query, updateOperation);
        }
    } finally {
        await client.close();
        //console.log("Connection closed");
    }
}

// const queryName = '3qliuvbwlriey-esl118';
// const collectionName = 'workspaces';
// const updatingDataFile = {
//     paths: ["1.txt","2.txt"]
// };

// updateData(queryName, collectionName, updatingDataFile);