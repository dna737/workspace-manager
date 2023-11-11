require("dotenv").config();
const Workspace = require("./Schemas/Workspace");
const MongoClient = require("mongodb").MongoClient;

console.log(process.env.MONGO_URI);
const newWorkspace = new Workspace({
    workspaceName: "3qliuvbwlriey-esl118",
    paths: ["~/Desktop/essay.txt", "~/Desktop/rubric.txt"],
});

async function uploadData(jsonData) {
    const mongoURI = process.env.MONGO_URI;

    // Create a MongoDB client
    const client = new MongoClient(mongoURI, {});

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        // Select the database
        const db = client.db("Workflow_collection");

        // Select the collection
        const collection = db.collection("workspaces");
        // Insert JSON data into the collection
        const result = await collection.insertOne(jsonData);

        console.log(`Inserted ${result.insertedCount} documents`);
    } finally {
        await client.close();
        console.log("Connection closed");
    }
}

uploadData(newWorkspace);
