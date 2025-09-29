const express = require("express")
const dotenv = require("dotenv")
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./router/authRoutes');
const jobsRouter = require('./router/jobsRouter');
const resumeRouter = require('./router/resumeRouter')




const app = express();

dotenv.config({
  path: __dirname + '/.env',
}
)
app.use(express.json())  // Config express to read a data 
app.use(cors())

const hostname = process.env.HOSTNAME
const port = process.env.PORT

const mongoDbURl = process.env.MONGO_DB_URL
const database = process.env.MONGO_DATABASE


//  app.get("/home",(req,res)=>{
//    res.send("This is from get request ")
//  })
if (!mongoDbURl || !database) {
  console.error("Mongo Db url missing ");
  return process.exit(1)
}


mongoose.connect(mongoDbURl, {
  dbName: database
}).then(() => {
  console.log("MongoDB Connected")
}).catch((err) => {
  console.error(err, "MongoDB Connection error")
})

//   app.use('/api/products',productsRouter)
//   app.use('/api/faqs', faqRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/jobs/', jobsRouter);
app.use('/api/job', resumeRouter)


// Global error handler to return JSON instead of HTML
app.use((err, req, res, next) => {
   console.error(err);
   const status = err.status || 500;
   const message = err.message || 'Internal server error';
   return res.status(status).json({ message });
})

app.listen(port, hostname, () => {
  console.log(`Server started at http://${hostname}:${port}`);
});//  app.get("/home",(req,res)=>{
//    res.send("This is from get request ")
//  })
