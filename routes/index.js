var express = require('express');
var router = express.Router();
var project = require('../models/project-add')
router.get('/', function(req, res, next) {
    project.find({},(err,result)=>{
        res.render('index',{result:result})
    })
});
router.get('/:project', function(req, res, next) {
    project.find({},(err,result_list)=>{
        project.find({topic_name:req.params.project},(err,result)=>{
            res.render('index',{result,result_list})
        })
    })
});

router.get('/view/:_id/:topic_name',(req,res)=>{
    project.findOne({topic_name:req.params.topic_name},(err,result)=>{
        if(result){
            var result_class;
            for (let i = 0; i < result.class.length; i++) {
                if(result.class[i]._id==req.params._id){
                    result_class=result.class[i]
                }
            }
            res.render('view-project',{result:result_class})
        }
        
    })
})
module.exports = router;
