
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

dashboardrouter.post("/SearchLead", auth,async(request, response )=>{

   //await client.db("CRMUsers").collection("customers").find({}).toArray();
   const {searchThisLead} =request.body;
   console.log("Searching...");
    const FoundLeads =   await client.db("CRMUsers").collection("customers").find( { $text: { $search: searchThisLead} } ).toArray();
     (!FoundLeads[0])  ? response.json({message:"Not Found" }) : response.json({message:"Found" , result:FoundLeads});
   

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

dashboardrouter.post("/SearchServiceRequest", auth, async(request, response )=>{
    
    const {searchThisRequest} =request.body;
    console.log("Searching ServiceRequest...");
    const FoundResults =   await client.db("CRMUsers").collection("serviceRequestsData").find( { $text: { $search: searchThisRequest} } ).toArray();
    (!FoundResults[0])  ? response.json({message:"Not Found" }) : response.json({message:"Found" , result:FoundResults});
 
 });


// --------Contacts------------- 

dashboardrouter.get("/Contacts", async(request, response )=>{

    const customers = await GetContacts();
    response.json(customers);

})

dashboardrouter.post("/AddContact" , async(request, response )=>{

    const ServiceReq = request.body;
    ServiceReq.date=new Date().toISOString().slice(0,10);
    await PostContact(ServiceReq);
    response.json({message :"User Register Successfully" , status:"200" });
  
})

dashboardrouter.post("/EditContact", auth, async(request, response )=>{

    const{addedBy} =request.body;
    const contactData = request.body;
    
    const  AE_firstName = addedBy.split(" ")[0];
    const  AE_lastName = addedBy.split(" ")[1];

    
    const result = await CheckEmp(AE_firstName,AE_lastName);
    // const Emailresult = await CheckEmail(email);
    //  console.log("Add Lead",result);
    if(!result)
    {
      response.status(401).json({message :"invalid Employee Name" , status:"401" });  
    }
    else{
         await UpdateContact(contactData);
        
         response.json({message :"User Register Successfully" , status:"200" });

     }
    
});

dashboardrouter.post("/DeleteContact" , auth, async(request, response )=>{

    const {id} =request.body;
    const leadData = request.body; 
    // const  AE_firstName = assignedEmp.split(" ")[0];
    // const  AE_lastName = assignedEmp.split(" ")[1];

    
    // const result = await CheckEmp(AE_firstName,AE_lastName);
    const result = await  CheckContact(id);
    // const Emailresult = await CheckEmail(email);
    //  console.log("Delete result",id);
    if(!result)
    {
      response.status(401).json({message :"Invalid Customer" , status:"401" });  
    }
    else{
         await DeleteContact(id);
         console.log("Deleted", leadData);
         response.json({message :"Lead Deleted Successfully" , status:"200" });

     }
    
});

dashboardrouter.post("/SearchContacts", async(request, response )=>{
    
    const {searchThisContact} =request.body;
    console.log("Searching ServiceRequest...");
    const FoundResults =   await SearchContact(searchThisContact);
    (!FoundResults[0])  ? response.json({message:"Not Found" }) : response.json({message:"Found" , result:FoundResults});
 
 })

//-----------------Users--------------------

dashboardrouter.get("/AllUsers", async(request, response )=>{
    
    const users = await getAllUsers();
    // console.log(users);
    response.send(users);

});

dashboardrouter.post("/EditUser", auth, async(request, response )=>{

    const{email} =request.body;
    const userData = request.body;
    

    const Emailresult = await CheckUserEmail(email);
    //  console.log("Email Res",Emailresult);
    console.log( Object.keys(Emailresult).length);
    if(Object.keys(Emailresult).length>=2)
    {
      response.status(401).json({message :"Email Already Exists" , status:"401" });  
    }
    else{
         await UpdateUser(userData);
        //  console.log("userData", userData);
         response.json({message :"User Updated Successfully" , status:"200" });

     }
     
});

dashboardrouter.post("/DeleteUser", auth, async(request, response )=>{

    const{id} =request.body;
    const userData = request.body; 
    // const  AE_firstName = assignedEmp.split(" ")[0];
    // const  AE_lastName = assignedEmp.split(" ")[1];

    
    // const result = await CheckEmp(AE_firstName,AE_lastName);
    const result = await CheckUser(id);
    // const Emailresult = await CheckEmail(email);
    //  console.log("Delete result",id);
    if(!result)
    {
      response.status(401).json({message :"Invalid user" , status:"401" });  
    }
    else{
         await DeleteUser(id);
         console.log("Deleted", userData);
         response.json({message :"User Deleted Successfully" , status:"200" });

     }
    
});

dashboardrouter.post("/SearchUsers", auth,async(request, response )=>{

   //await client.db("CRMUsers").collection("customers").find({}).toArray();
   const {searchThisUser} =request.body;
   console.log("Searching...");
    const FoundUsers =   await client.db("CRMUsers").collection("users").find( { $text: { $search: searchThisUser} } ).toArray();
     (!FoundUsers[0])  ? response.json({message:"Not Found" }) : response.json({message:"Found" , result:FoundUsers});
   

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

// -----------------------ServiceReq Collection-------------------------------------
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


// -----------------------Contacts Collection-------------------------------------
async function GetContacts() {
    return await client.db("CRMUsers").collection("contactsData").find({}).toArray();
}


async function PostContact(contactData) {
    return await client.db("CRMUsers").collection("contactsData").insertOne(contactData);
}

async function UpdateContact(contactData) {
    return await client.db("CRMUsers").collection("contactsData").updateOne({_id : ObjectId(contactData.id) }, { $set: {  addedBy:contactData.addedBy, firstName:contactData.firstName ,lastName:contactData.lastName, email:contactData.email , addedById:contactData. addedById , address:contactData.address , date:contactData.date } });
}

async function SearchContact(searchThisRequest) {
    return await client.db("CRMUsers").collection("contactsData").find({ $text: { $search: searchThisRequest } }).toArray();
}

async function CheckContact(id) {
    return await client.db("CRMUsers").collection("contactsData").findOne( {_id : ObjectId(id) });

}

async function DeleteContact(id) {
    return await client.db("CRMUsers").collection("contactsData").deleteOne({_id : ObjectId(id)});
}

//------------users collection-------------------------

async function getAllUsers() {
    return await client.db("CRMUsers").collection("users").find({}).toArray();
}

async function CheckUserEmail(email) {
    return await client.db("CRMUsers").collection("users").find({ email: email }).toArray();
}

async function UpdateUser(user) {
    return await client.db("CRMUsers").collection("users").updateOne({_id : ObjectId(user.id) }, { $set: { firstName:user.firstName ,lastName:user.lastName, email:user.email ,access_lvl : user.access_lvl} });
}

async function DeleteUser(id) {
    return await client.db("CRMUsers").collection("users").deleteOne({_id : ObjectId(id)});

}

async function CheckUser(id) {
    return await client.db("CRMUsers").collection("users").findOne( {_id : ObjectId(id) });

}

export const DashboardRouter = dashboardrouter;