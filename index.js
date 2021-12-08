// const { response } = require('express');
// const express  = require('express');

import express from "express";


import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";
import { UserRouter } from "./routes/usersRoutes.js";

dotenv.config();

// console.log(process.env);
const app = express();

const PORT =  process.env.PORT;

app.use(cors());

app.use(express.json());

// /myFirstDatabase?retryWrites=true&w=majority

const Mongo_URL=process.env.Mongo_URL;

// const Mongo_URL = "mongodb://localhost";

async function createConnection(){

    const client = new MongoClient(Mongo_URL);
    await client.connect();
    console.log("MongoDB Connected");
    return client;
}
            
export const client = await createConnection();
 

app.get("/", (request, response )=>{

    
     response.send("Working! 😋");
 
 });


//  async function deleteAllMovies() {
//     return await client.db("CRMUsers").collection("users").deleteMany({});
// }

// deleteAllMovies();

app.use("/users", UserRouter);


app.listen(PORT ,() => console.log("App is started at port :", PORT)
);
