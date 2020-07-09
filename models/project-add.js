var mongoose = require('mongoose')
const mongoDB = "mongodb://localhost:27017/ManagementProject"

mongoose.connect(mongoDB,{
  useNewUrlParser:true
})


var classSchema = new mongoose.Schema({
  topic_name:{type:String},
  class:[{
    project_name:{type:String},
    project_description:{type:String},
    project_file:{type:String},
    project_date:{type:String}
}]
})
var Classes = mongoose.model("topics",classSchema)
module.exports=Classes

//saveTopic
module.exports.saveNewClasses=(newClasses,callback)=>{
  newClasses.save(callback)
}



module.exports.saveProject=(data,callback)=>{
  Classes.update({topic_name:data['topic_name']},
  {
    $push:{
      'class':{
        project_name:data['project_name'],
        project_description:data['project_description'],
        project_file:data['project_file'],
        project_date:data['project_date']
      }
    }},{upsert:true},callback)
}


module.exports.deleteTopic=(data,callback)=>{
  Classes.deleteOne({topic_name:data},callback)
}