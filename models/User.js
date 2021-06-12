var mongoose = require("mongoose");
var passwordLocalMongoose = require("passport-local-mongoose");
var UserSchmea = new mongoose.Schema({
    username: String,
    password: String
});
UserSchmea.plugin(passwordLocalMongoose);
module.exports = mongoose.model("User", UserSchmea);
