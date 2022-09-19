require("dotenv").config();
require("./config/database").connect();

const express = require('express')
const cors = require('cors')

const authRouter = require('./router/authRouter') 
const dataRouter = require('./router/dataRouter') 

const app = express()

app.use(express.json())
app.use(cors({origin: '*'}))
app.use("/auth", authRouter)
app.use("/data", dataRouter)

app.listen(process.env.API_PORT, (error) => {
    error ? console.log(error) : console.log(`listening port ${process.env.API_PORT}`);
  });