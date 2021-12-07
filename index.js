// const { response } = require('express');
// const express  = require('express');

import express from "express";

import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();


console.log(process.env);
const app = express();

const PORT =  process.env.PORT;

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
            
const client = await createConnection();


app.get("/", (request, response )=>{

    
     response.send("Working! 😋");
 
 });


app.get("/users", async(request, response )=>{

    const users = await client.db("CRMUsers").collection("users").find({}).toArray();
    response.send(users);

});

app.post("/users", async(request, response )=>{

    const user=request.body;
    const use = await client.db("CRMUsers").collection("users").insertOne(user);
    response.send(use);

});


app.listen(PORT ,() => console.log("App is started at port :", PORT)
);
