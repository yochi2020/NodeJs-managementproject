var mongoose = require('mongoose')
var mongoDB = "mongodb://localhost:27017/ManagementProject"

mongoose.connect(mongoDB,{
    useNewUrlParser:true
})

var user =  mongoose.Schema({
    username:{type:String},
    password:{type:String}
})


var User=module.exports=mongoose.model("users",user)