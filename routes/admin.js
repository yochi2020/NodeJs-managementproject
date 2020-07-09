var express = require('express');
var router = express.Router();
var project = require('../models/project-add')
var multer =   require('multer')
var fs =require('fs')

//Upload
var storage = multer.diskStorage({
  destination:(err,file,cb)=>{
    cb(null,'public/images')
  },
  filename:(req,file,cb)=>{
    cb(null,new Date().getTime()+file.originalname)
  }
})
var upload = multer({ storage:storage })



//ADD topic 
router.get('/admin-topic', async function(req, res, next) {
  await project.find((err,result)=>{
    res.render('admin/admin-topic',{result})
  })
});
router.post('/admin-topic',async function(req, res, next) {
 console.log(req.body.topic_name) 
  var data = new project({
    topic_name:req.body.topic_name
  })
  await project.saveNewClasses(data,async (err,result)=>{
    if(err) throw err
    await res.redirect('/admin/admin-topic')
  })
});

//Edit topic
router.post('/topic-edit',(req,res)=>{
  project.findByIdAndUpdate(req.body.id,{$set:{topic_name:req.body.topic_value}})
  .then(result=>{
    res.status(200).send(result)
  }).catch(err=>{
    console.log(err)
  })
})
//Delete topic
router.get('/topic-delete/:topic_name',(req,res)=>{
  project.findOne({topic_name:req.params.topic_name},(err,result)=>{
    for (let index = 0; index < result.class.length; index++) {
      fs.unlink("public/images/"+result.class[index].project_file,(err)=>{
        if(err) throw err
      })
    }
    project.deleteTopic(req.params.topic_name,(err,result)=>{
      if(err) throw err
      res.redirect('/')
    })
  })
  
})

//Delete project
router.get('/project-detete/:id/:topic_name/:file_name',async (req,res)=>{
 await project.updateOne({topic_name:req.params.topic_name},{$pull:{class:{_id:req.params.id}}})
 .then(result=>{
   console.log(req.params.file_name)
   fs.unlink("public/images/"+req.params.file_name,(err)=>{
     if(err) throw err
    res.send("ss")
   })
 }).catch(err=>{
   console.log(err)
  })
 })

//ADD project
router.get('/admin-project',async function(req, res, next) {
  await project.find((err,result)=>{
    if(err) throw err
    res.render('admin/admin-project',{result})
  })
});

router.post('/admin-project',upload.single('project_file'),async function(req, res, next) {
 var input=[]
 input['topic_name']=req.body.topic_name
 input['project_name']=req.body.project_name
 input['project_description']=req.body.project_description
 input['project_file']=req.file.filename
 input['project_date']=new Date()
 await project.saveProject(input,(err,result)=>{
   res.redirect('/admin/admin-edit')
 })
});

//Edit Project
router.get('/admin-edit',async function(req, res, next) {
  await project.find((err,result)=>{
    if(err) throw err
    res.render('admin/admin-edit',{result})
    })
});

module.exports = router;
