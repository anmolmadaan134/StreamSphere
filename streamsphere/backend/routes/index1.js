const express = require('express')
const router = express.Router();
const authRoutes = require("./authRouter")
const userRoutes = require("./userRouter")
const videoRoutes = require("./videoRouter")

router.get('/status',(req,res)=>{
    res.json({status:"API is running"})
})

router.use("/auth",authRoutes)
router.use("/users",userRoutes)
router.use("/videos",videoRoutes)

module.exports = router;