require("dotenv").config();
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const authRouter = require('./authRouter.js')

const app = express()

app.use(express.json())
app.use(cors({origin: '*'}))
app.use("/auth", authRouter)

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => console.log('Connected to DB'))
  .catch((error) => console.log(error));

  app.listen(process.env.API_PORT, (error) => {
    error ? console.log(error) : console.log(`listening port ${process.env.API_PORT}`);
  });

