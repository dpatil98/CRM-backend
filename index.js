// const { response } = require('express');
// const express  = require('express');

import express from "express";


import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";
import { UserRouter } from "./routes/usersRoutes.js";
import { DashboardRouter } from "./routes/dashboardRoutes.js";

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

//  async function deleteAllLeads() {
//     return await client.db("CRMUsers").collection("customers").deleteMany({});
// }

// deleteAllLeads();


// const a= CreateIndexText();
// async function CreateIndexText() {
   
//     console.log("Success")
//  return await  client.db("CRMUsers").collection("customers").createIndex({  status:"text" ,firstName:"text" ,lastName:"text",  email:"text" ,assignedEmp:"text"  , date:"text"  });
// }
// console.log(a , "Success")

// const a= CreateIndexText();
// async function CreateIndexText() {
   
//     console.log("Success")
//  return await  client.db("CRMUsers").collection("serviceRequestsData").createIndex({  status:"text",shortDesc:"text" ,firstName:"text" ,lastName:"text",  email:"text" ,assignedEmp:"text"  , date:"text"  });
// }
// console.log(a , "Success")

// const a= CreateIndexText();
// async function CreateIndexText() {
   
//     console.log("Success")
//  return await  client.db("CRMUsers").collection("users").createIndex({  firstName:"text" ,lastName:"text",  email:"text" , access_lvl :"text" });
// }
// console.log(a , "Success")


// const a= CreateIndexText();
// async function CreateIndexText() {
   
//     console.log("Success")
//  return await  client.db("CRMUsers").collection("contactsData").createIndex({  firstName:"text" ,lastName:"text",  email:"text" , addedBy :"text" , addedById:"text" , mobileNo:"text", address:"text" ,date:"text" });
// }
// console.log(a , "Success")


app.use("/users", UserRouter);
app.use("/Dashboard", DashboardRouter);


app.listen(PORT ,() => console.log("App is started at port :", PORT)
);
