require("dotenv").config();
const Workspace = require("./Schemas/Workspace");
const MongoClient = require("mongodb").MongoClient;

const newWorkspace = new Workspace({
    workspaceName: "3qliuvbwlriey-esl118",
    paths: ["~/Desktop/essay.txt", "~/Desktop/rubric.txt"],
});

async function uploadData(jsonData, collectionName) {
    const mongoURI = process.env.MONGO_URI;

    const client = new MongoClient(mongoURI, {});

    try {
        await client.connect();
        //console.log("Connected to MongoDB");

        const db = client.db("Workflow_collection");

        const collection = db.collection(collectionName);

        //Check if data exists
        query = null;
        if (collectionName === "workspaces")
            query = { workspaceName: jsonData.workspaceName };
        else if (collectionName === "users")
            query = { username: jsonData.workspaceName };

        const results = await collection.find(query).toArray();
        if (results.length != 0)
            console.log("Data already exists. Skipping upload.");
        else {
            const result = await collection.insertOne(jsonData);
            //console.log(`Inserted ${result.insertedCount} documents`);
        }
    } finally {
        await client.close();
        //console.log("Connection closed");
    }
}

//TODO: remove this later.
/** 
uploadData(
    { username: "someOtherName", workspaces: ["someWorkspace"] },
    "users"
);*/

module.exports = uploadData;
