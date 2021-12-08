
import express from 'express';

const userrouter = express.Router();

import{client} from "../index.js"

import bcrypt from 'bcrypt';



userrouter.get("/", async(request, response )=>{

    const users = await getAllUsers();
    response.send(users);

});

userrouter.post("/", async(request, response )=>{

    const user=request.body;
    const users = await postUser(user);
    response.send(users);

});

userrouter.post("/Signup", async(request, response )=>{

    const{ email, password} =request.body;
    const user = request.body;
    // response.send(user);
    // const users = await postUser(user);
    
    const result = await client.db("CRMUsers").collection("users").findOne({ email : email});
    if(result)
    {
      response.send({message :"User Already exits "});  
    }
    else{

        
         user.password=await passwordHashing(password);
         const done = await postUser(user);
         
        
         response.send({message :"User nonexits "});
     }
    
});




async function passwordHashing(password)
{   
    const rounds =10;
    const salted = await bcrypt.genSalt(rounds);
    // console.log(salted);
    const hashedpassword =  await bcrypt.hash(password,salted);
    // console.log(hashedpassword);
    return hashedpassword;

}



export const UserRouter = userrouter;

async function getAllUsers() {
    return await client.db("CRMUsers").collection("users").find({}).toArray();
}

async function postUser(user) {
    return await client.db("CRMUsers").collection("users").insertOne(user);
}

