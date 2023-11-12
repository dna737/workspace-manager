require("dotenv").config();
const { MongoClient } = require("mongodb");
const { collection } = require("./Schemas/Workspace");

async function retrieveData(queryName, collectionName) {
    const mongoURI = process.env.MONGO_URI || "-1";
    let paths = null;
    let workspaces = null;

    // Create a MongoDB client
    const client = new MongoClient(mongoURI, {});

    try {
        await client.connect();
        //console.log("Connected to MongoDB");

        const db = client.db("Workflow_collection");

        const collection = db.collection(collectionName);

        let query = null;
        if (collectionName === "workspaces")
            query = { workspaceName: queryName };
        else if (collectionName === "users") query = { username: queryName };
        const results = await collection.find(query).toArray();

        if (results.length == 0) {
            console.log("File not found. Returning null.");
            return paths;
        }

        if (collectionName === "workspaces") {
            for (const result of results) {
                paths = result.paths;
                console.log(paths);
            }
        } else {
            for (const result of results) {
                workspaces = result.workspaces;
            }
        }
    } finally {
        await client.close();
        //console.log("Connection closed");
    }
    return paths || workspaces;
}

//retrieveData("jf83lsi890--workspace2", "workspaces");
// retrieveData("fssfasf", "workspaces");
retrieveData("hallu", "users").then((result) => console.log(result));
module.exports = retrieveData;
