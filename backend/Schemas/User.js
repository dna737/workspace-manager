const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let userSchema = new Schema({
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    workspaces: {
        type: Array,
    },
});
const User = mongoose.model("User", userSchema);
module.exports = User;
