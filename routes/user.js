var express = require('express')
var router = express.Router()
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
var userlogin = require("../models/user-models")
const { localsName } = require('ejs')



//logout
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})
//login
router.get('/login',(req,res)=>{
    res.render('admin/admin-login')
  })
  router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/user/login', // กำหนด ถ้า login fail จะ redirect ไป /login
    successRedirect: '/admin/admin-edit' // ถ้า success จะไป /
  }),(req,res)=>{
      
  })

  // serializeUser และ seserialize จะใช้ร่วมกับ session เพื่อจะดึงค่า user ระหว่าง http request
// โดย serializeUser จะเก็บ ค่าไว้ที่ session
// ในที่นี้คือ cb(null, user._id_) - ค่า _id จะถูกเก็บใน session
// ส่วน derialize ใช้กรณีที่จะดึงค่าจาก session มาหาใน DB ว่าใช่ user จริงๆมั้ย
// โดยจะเห็นได้ว่า ต้องเอา username มา `User.findById()` ถ้าเจอ ก็ cb(null, user)
passport.serializeUser((user, cb) => {
    cb(null, user._id)
  })
  
  passport.deserializeUser((id, cb) => {
    userlogin.findById(id, (err, user) => {
      if (err) {
        return cb(err)
      }
      cb(null, user)
    })
  })

  passport.use(
    new LocalStrategy((username, password, cb) => {
        console.log("eiei")
      userlogin.findOne({username:username }, (err, user) => {
        if (err) {
          return cb(err)
        }
        if (!user) {
          return cb(null, false)
        }
        if (password==user.password) {
          return cb(null, user)
        }
        return cb(null, false)
      })
    })
  )


module.exports = router