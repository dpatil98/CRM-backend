
import express from 'express';
import{client} from "../index.js"
import auth  from '../middleware/auth.js'

const dashboardrouter = express.Router();



dashboardrouter.get("/Leads", async(request, response )=>{

    const customers = await client.db("CRMUsers").collection("customers").find({}).toArray();
    response.json(customers);

});


dashboardrouter.post("/", async(request, response )=>{

    const customer =request.body;
    const customers= await client.db("CRMUsers").collection("customers").insertOne(customer);
    response.send(customers);

});


dashboardrouter.post("/AddLead", auth , async(request, response )=>{

    const{email} =request.body;
    const lead = request.body;
    

    const result = await CheckEmail(email);
    //  console.log("Add Lead",result);
    if(result)
    {
      response.status(401).json({message :"Lead Already exits " , status:"401" });  
    }
    else{
        
        lead.date=new Date().toISOString().slice(0,10);
         await postLead(lead);
         response.json({message :"User Register Successfully" , status:"200" });
     }
    
});

async function postLead(lead) {
    return await client.db("CRMUsers").collection("customers").insertOne(lead);
}

async function CheckEmail(email) {
    return await client.db("CRMUsers").collection("customers").findOne({ email: email });
}

export const DashboardRouter = dashboardrouter;