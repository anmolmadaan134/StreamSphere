const express  = require('express')
const morgan = require('morgan')
const dotenv = require('dotenv')
const routes = require('./routes/index1')
const {notFound,errorHandler} = require('./middleware/errorHandler')
const {videoQueue} = require('./queues/videoQueue')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const connectDB = require("./config/db")

const Redis = require('ioredis')
const client = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
});

client.on('error', (err) => {
    console.error('Redis connection error:', err);
});

app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'))


app.get("/",(req,res)=>{
    res.json({message:"Welcome to StreamSphere"})
})

app.use("/api",routes)

app.use(notFound)
app.use(errorHandler)

connectDB()

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
    
    
})