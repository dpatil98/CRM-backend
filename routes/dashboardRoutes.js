
import express from 'express';
import{client} from "../index.js"
import auth  from '../middleware/auth.js'
import { ObjectId } from 'mongodb';

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

dashboardrouter.post("/EditLead", auth, async(request, response )=>{

    const{assignedEmp ,email} =request.body;
    const leadData = request.body;
    
    const  AE_firstName = assignedEmp.split(" ")[0];
    const  AE_lastName = assignedEmp.split(" ")[1];

    
    const result = await CheckEmp(AE_firstName,AE_lastName);
    // const Emailresult = await CheckEmail(email);
    //  console.log("Add Lead",result);
    if(!result)
    {
      response.status(401).json({message :"invalid Employee Name " , status:"401" });  
    }
    else{
         await UpdateLead(leadData);
        //  console.log("LeadData", leadData);
         response.json({message :"User Register Successfully" , status:"200" });

     }
    
});

dashboardrouter.post("/DeleteLead", auth, async(request, response )=>{

    const{id} =request.body;
    const leadData = request.body; 
    // const  AE_firstName = assignedEmp.split(" ")[0];
    // const  AE_lastName = assignedEmp.split(" ")[1];

    
    // const result = await CheckEmp(AE_firstName,AE_lastName);
    const result = await CheckCustomer(id);
    // const Emailresult = await CheckEmail(email);
    //  console.log("Delete result",id);
    if(!result)
    {
      response.status(401).json({message :"Invalid Customer" , status:"401" });  
    }
    else{
         await DeleteLead(id);
         console.log("Deleted", leadData);
         response.json({message :"Lead Deleted Successfully" , status:"200" });

     }
    
});

// --------Service Requests-------------

dashboardrouter.get("/ServiceRequests", async(request, response )=>{

    const customers = await GetServiceRequests();
    response.json(customers);

})

dashboardrouter.post("/AddServiceRequest" , async(request, response )=>{

    const ServiceReq = request.body;
    ServiceReq.date=new Date().toISOString().slice(0,10);
    await postService(ServiceReq);
    response.json({message :"User Register Successfully" , status:"200" });
  
})

dashboardrouter.post("/EditServiceReq", auth, async(request, response )=>{

    const{assignedEmp} =request.body;
    const SRData = request.body;
    
    const  AE_firstName = assignedEmp.split(" ")[0];
    const  AE_lastName = assignedEmp.split(" ")[1];

    
    const result = await CheckEmp(AE_firstName,AE_lastName);
    // const Emailresult = await CheckEmail(email);
    //  console.log("Add Lead",result);
    if(!result)
    {
      response.status(401).json({message :"invalid Employee Name" , status:"401" });  
    }
    else{
         await UpdateServiceReq(SRData);
        //  console.log("LeadData", leadData);
         response.json({message :"User Register Successfully" , status:"200" });

     }
    
});

dashboardrouter.post("/DeleteServiceReq" , auth, async(request, response )=>{

    const {id} =request.body;
    const leadData = request.body; 
    // const  AE_firstName = assignedEmp.split(" ")[0];
    // const  AE_lastName = assignedEmp.split(" ")[1];

    
    // const result = await CheckEmp(AE_firstName,AE_lastName);
    const result = await  CheckServiceReq(id);
    // const Emailresult = await CheckEmail(email);
    //  console.log("Delete result",id);
    if(!result)
    {
      response.status(401).json({message :"Invalid Customer" , status:"401" });  
    }
    else{
         await DeleteServiceReq(id);
         console.log("Deleted", leadData);
         response.json({message :"Lead Deleted Successfully" , status:"200" });

     }
    
});






async function postLead(lead) {
    return await client.db("CRMUsers").collection("customers").insertOne(lead);
}

async function CheckEmail(email) {
    return await client.db("CRMUsers").collection("customers").findOne({ email: email });
}

async function CheckEmp(FName, LName) {
    return await client.db("CRMUsers").collection("users").findOne({  firstName:FName , lastName:LName });
}

async function UpdateLead(LeadData) {
    return await client.db("CRMUsers").collection("customers").updateOne({_id : ObjectId(LeadData.id) }, { $set: { status:LeadData.status ,firstName:LeadData.firstName ,lastName:LeadData.lastName, email:LeadData.email ,assignedEmp:LeadData.assignedEmp , date:LeadData.date} });
}

async function CheckCustomer(id) {
    return await client.db("CRMUsers").collection("customers").findOne( {_id : ObjectId(id) });

}

async function DeleteLead(id) {
    return await client.db("CRMUsers").collection("customers").deleteOne({_id : ObjectId(id)});
}

// --------------------------------------------------------------------
async function GetServiceRequests() {
    return await client.db("CRMUsers").collection("serviceRequestsData").find({}).toArray();
}


async function postService(SR) {
    return await client.db("CRMUsers").collection("serviceRequestsData").insertOne(SR);
}

async function UpdateServiceReq(SR) {
    return await client.db("CRMUsers").collection("serviceRequestsData").updateOne({_id : ObjectId(SR.id) }, { $set: { status:SR.status, firstName:SR.firstName ,lastName:SR.lastName, email:SR.email ,assignedEmp:SR.assignedEmp , date:SR.date} });
}

async function CheckServiceReq(id) {
    return await client.db("CRMUsers").collection("serviceRequestsData").findOne( {_id : ObjectId(id) });

}

async function DeleteServiceReq(id) {
    return await client.db("CRMUsers").collection("serviceRequestsData").deleteOne({_id : ObjectId(id)});
}

export const DashboardRouter = dashboardrouter;