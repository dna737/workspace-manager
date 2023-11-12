const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let workspaceSchema = new Schema({
    workspaceName: {
        type: String,
    },
    paths: {
        type: Array,
    },
});

const Workspace = mongoose.model("Workspace", workspaceSchema);

module.exports = Workspace;
