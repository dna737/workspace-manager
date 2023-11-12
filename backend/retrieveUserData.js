require("dotenv").config();
const { MongoClient } = require("mongodb");
const { collection } = require("./Schemas/Workspace");
const retrieveData = require("./backend");

async function retrieveUserData(queryName, password) {

    const mongoURI = process.env.MONGO_URI || "-1";
    

    // Create a MongoDB client
    const client = new MongoClient(mongoURI, {});

    returnData = {
        exist: false,
        workspaces: null
    }

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db("Workflow_collection");

        const collection = db.collection("users");

        const query = { username: queryName };

        const results = await collection.find(query).toArray();

        if (results.length == 0)
            console.log("No user found. Returning null")
        else {
            user = results[0];

            if (user.password === password) {
                returnData.exist = true;
                returnData.workspaces = await retrieveData(queryName,"users");
            }
            else
                console.log("Invalid password. Returning null");
        }
    } finally {
        await client.close();
        console.log("Connection closed");
    }
    console.log(returnData);
    return returnData;
}

retrieveUserData("hihihigrrb","okokok");