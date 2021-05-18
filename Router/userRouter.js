const router    = require('express').Router()
const bcrypt    = require('bcrypt')
const jwt       = require('jsonwebtoken')
const User      = require('../models/userModel')
const auth      = require("../Auth/userAuth")

// SIGNUP API

router.post('/signup', async (req, res) => {
  try {
    let { firstname, lastname, email, phone, password } = req.body

    if (!email || !password)
      return res.status(400).json({ msg: 'Not all fields have been entered.' })
    if (password.length < 5)
      return res
        .status(400)
        .json({ msg: 'The password needs to be at least 5 characters long.' })

    const existingEmail = await User.findOne({ email: email })
    if (existingEmail)
      return res
        .status(400)
        .json({ msg: 'An account with this email already exists.' })

    const existingPhone = await User.findOne({ phone: phone })
    if (existingPhone)
      return res
        .status(400)
        .json({ msg: 'An account with this phone already exists.' })    

    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(password, salt)

    const newUser = new User({
      firstname,
      lastname,
      email,
      phone,
      password: passwordHash
    })
    const savedUser = await newUser.save()
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET)
    res.status(200)
    .json({
      token,
      msg:"You have successfully signup" ,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// SIGNIN API

router.post('/signin',  async (req, res) => {
  try {
    const { email, phone, password } = req.body

    if ((!email || !phone) && !password)
      return res.status(400).json({ msg: 'Not all fields have been entered.' })
    if(email) {
      const user = await User.findOne({ email: email })
      if (!user)
        return res
          .status(400)
          .json({ msg: 'No account with this email has been registered.' })
  
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials.' })
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
      res.json({
        token,
        user: {
          id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          phone: user.phone
        },
      })
    }
    else {
      const userPhone = await User.findOne({ phone: phone })
      if (!userPhone)
        return res
          .status(400)
          .json({ msg: 'No account with this phone has been registered.' })

          const isMatch = await bcrypt.compare(password, userPhone.password)
          if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials.' })
          const token = jwt.sign({ id: userPhone._id }, process.env.JWT_SECRET)
          res.json({
            token,
            user: {
              id: userPhone._id,
              firstname: userPhone.firstname,
              lastname: userPhone.lastname,
              email: userPhone.email,
              phone: userPhone.phone
            },
          })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get("/random", auth, async (req, res) => {

// Using inbuilt function 
//   function randomNumber(min, max) { 
//     var a = Math.random() * (max - min) + min;
//     return a.toFixed(0)
// } 

// console.log(randomNumber(20, 120000) )


  try {
    function genRandom(min, max) {
      var h = new Date().getSeconds()
      const t1 = new Date().getMilliseconds()
      var result
      const t2 = new Date().getMilliseconds()
      const t3 = new Date().getMilliseconds()
      const sec = (t3*h)
      console.log(t2)
      result = ((((max - min) * t1) / sec)).toFixed(0)
      console.log(result)
      if(result<20) {
          return result = ((((max - min) * t1) / t2)).toFixed(0)
      }
      else {
          return result
      }
    }
    var resp = genRandom(20, 120000)
    res.status(200)
        .json({random:resp})
  } catch (error) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
