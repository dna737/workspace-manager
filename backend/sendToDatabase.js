require("dotenv").config();
const Workspace = require("./Schemas/Workspace");
const MongoClient = require("mongodb").MongoClient;
const retrieveData = require("./backend");

const newWorkspace = new Workspace({
    workspaceName: "3qliuvbwlriey-esl118",
    paths: ["~/Desktop/essay.txt", "~/Desktop/rubric.txt"],
});

async function uploadData(jsonData, collectionName) {
    const dataExists = await retrieveData(jsonData.workspaceName, collectionName);

    if (dataExists) {
        console.log("Data already exists. Skipping upload.");
        return;
    }

    const mongoURI = process.env.MONGO_URI;

    const client = new MongoClient(mongoURI, {});

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db("Workflow_collection");

        const collection = db.collection(collectionName);
        const result = await collection.insertOne(jsonData);

        console.log(`Inserted ${result.insertedCount} documents`);
    } finally {
        await client.close();
        console.log("Connection closed");
    }
}

uploadData(newWorkspace, "workspaces");
