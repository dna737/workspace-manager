require("dotenv").config();
const Workspace = require("./Schemas/Workspace");
const MongoClient = require("mongodb").MongoClient;

//TODO: remove this sample workspace later.
const newWorkspace = new Workspace({
    workspaceName: "randomWorkspace",
    paths: ["~/Desktop/essay.txt", "~/Desktop/rubric.txt"],
});

async function uploadData(jsonData, collectionName, username = "") {
    const mongoURI = process.env.MONGO_URI;

    const client = new MongoClient(mongoURI, {});

    try {
        await client.connect();

        const db = client.db("Workflow_collection");

        const collection = db.collection(collectionName);

        //Check if data exists
        let query = null;
        if (collectionName === "workspaces") {
            jsonData.workspaceName = username + jsonData.workspaceName;
            query = { workspaceName: jsonData.workspaceName };
        } else if (collectionName === "users")
            jsonData.users = username + jsonData.users;
        query = { username: jsonData.users };

        const results = await collection.find(query).toArray();
        if (results.length != 0) {
        } else {
            const result = await collection.insertOne(jsonData);
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
// uploadData(newWorkspace, "workspaces");
