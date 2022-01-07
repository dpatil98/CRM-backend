
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';

const userrouter = express.Router();

import{client} from "../index.js"
import Signupauth  from '../middleware/auth.js'
import { ObjectId } from 'mongodb';

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const sendmail = require('sendmail')();
// import  sendmail from 'sendmail';




userrouter.get("/", async(request, response )=>{

    const users = await getAllUsers();
    response.send(users);

});//for postman

userrouter.post("/Signup", Signupauth , async(request, response )=>{

    const{ email, password} =request.body;
    const user = request.body;
    // response.send(user);
    // const users = await postUser(user);

    // return response.json({message : "User Will have to login in to post a User"});
    const result = await CheckEmail(email);
    if(result)
    {
      response.status(401).json({message :"User Already exits " , status:"401" });  
    }
    else{

        
         user.password=await passwordHashing(password);
         await postUser(user);
         response.json({message :"User Register Successfully" , status:"200" });
     }
    
});

userrouter.post("/Login", async(request, response )=>{

    const{ email, password} = request.body;
    
    const EmailFound = await CheckEmail(email);
    if(!EmailFound)
    {
      response.status(401).send({message :"Wrong User Credentials"});  
    }
    else{
        
        const storedPassword = EmailFound.password;
        const isPasswordMatched = await bcrypt.compare(password,storedPassword);
        // response.send(isPasswordMatched);
        
        if(!isPasswordMatched)
        {
            // response.status(401).send({message :"Wrong User Credentials", password});
            response.status(401).json({message :"Wrong User Credentials", password});
        }
        else{

           const token= jwt.sign({id:EmailFound._id}, process.env.Secret_Key, {expiresIn:"1h"} );
            // response.send(EmailFound);
            response.status(200).json({user: EmailFound , token :token })
        }
       
         
        
      
     }
    
});

//Email checking and sending mail to user
userrouter.post("/ForgotPassword", async(request, response )=>{

    const{ email} = request.body;
    
    const EmailFound = await CheckEmail(email);
    if(!EmailFound)
    {
        response.status(401).send({message :"User Not Found!"});  
    }
    else{
         
        
        //creating one time link for 10 min

       const Secret = process.env.Secret_Key + EmailFound.password;
       const payload = {
                        
                        email : EmailFound.email,
                        id : EmailFound._id

       } 

       const ForgotToken = jwt.sign(payload , Secret, {expiresIn: '15m'});
    //    const link =`http://localhost:9000/users/reset-password/${EmailFound._id}/${ForgotToken}`;
       const link =`http://localhost:3000/reset-password?id=${EmailFound._id}&FT=${ForgotToken}`;

       //send email

        // sendmail({
        //     from: 'forpersonaluse98@gmail.com',
        //     to: 'dfordeepfake@gmail.com',
        //     subject: 'test sendmail',
        //     html: `Mail of test sendmail ${link}`,
        // }, function(err, reply) {
        //     console.log(err && err.stack);
        //     console.dir(reply);
        // });

         //response.status(200).json({message :" Reset link has been sent to ur Email!", Status :"200" })   
         response.status(200).json({message :"For Demo purpose reset link is Given here, otherwise it can be sent to Email Using Nodemailer" , link:link })   ;
     }
    
});

//receving pa
userrouter.post("/reset-password", async(request, response )=>{ 

    const {id , FT} =request.body;


    const idFound = await CheckID(id);
  
    if(!idFound ) 
    { 
        response.send({Status:"404"});

    }
    {
        //verifng token /using +idFound.password so it can only run once
        const Secret = process.env.Secret_Key + idFound.password;
        try {

            const payload  = jwt.verify( FT , Secret);
            response.send({User:idFound , Status:"200"}) ;
            
            
        } catch (error) {
            // console.log(error);
            response.send({ Error: error , Status:"404"});
        }
     
    } 
   

});


userrouter.post("/changing-password", async(request, response)  => {

    const {email , password } =request.body;


    const hashedpassword = await passwordHashing(password);

    const isPasswordChanged = await ChangePassword(email, hashedpassword);

    (isPasswordChanged) ? response.json({status:"200"}) : response.json({message:"Something Went Wrong! 😰"});

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

async function CheckEmail(email) {
    return await client.db("CRMUsers").collection("users").findOne({ email: email });
}

async function CheckID(_id) {
    return await client.db("CRMUsers").collection("users").findOne({ _id : ObjectId(_id) });
}

async function ChangePassword(email, hashedpassword) {
    return await client.db("CRMUsers").collection("users").updateOne({ email: email }, { $set: { password: hashedpassword } });
}