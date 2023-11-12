require("dotenv").config();
const { MongoClient } = require("mongodb");
const { collection } = require("./Schemas/Workspace");
const retrieveData = require("./backend");

async function retrieveUserData(queryName, password) {

    const mongoURI = process.env.MONGO_URI || "-1";
    

    // Create a MongoDB client
    const client = new MongoClient(mongoURI, {});
    let dataExist = false;

    try {
        await client.connect();
        //console.log("Connected to MongoDB");

        const db = client.db("Workflow_collection");

        const collection = db.collection("users");

        const query = { username: queryName };

        const results = await collection.find(query).toArray();

        if (results.length == 0){
            //console.log("No user found. Returning false")
        }
        else {
            user = results[0];
            if (user.password === password)
                dataExist = true;
            else{
                //console.log("Invalid password. Returning false");
            }
        }
    } finally {
        await client.close();
        //console.log("Connection closed");
    }
    //console.log(dataExist);
    return dataExist;
}

module.exports = retrieveUserData;
//retrieveUserData("hihihi","kokokok");