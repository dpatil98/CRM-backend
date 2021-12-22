import { request, response } from "express";
import jwt from "jsonwebtoken";

 const Signupauth = async( request, response, next) => {



    try {
        const token = request.header('x-auth-token');
        const Accesslvl= request.header('x-auth-access');
        const mode= request.header('x-auth-mode');

        switch (mode) {
            case "addLead":
                { //only checks login
                    try {
                        
                        let decodedToken;
                        //  console.log("Auth Token ",token);
                        if(token){
                            decodedToken= jwt.verify(token, process.env.Secret_Key);
                            request.userID = decodedToken ?.id ;
                            // console.log("tokenn", token);
                            console.log("Req userID" ,request.userID);
                            next();
                        }       
                        else{
                            throw new Error("Access Denied");
                            }
                    } catch (error) {
                
                        response.send({message:error.message});
                        console.log(error.message);
                    }
                    
                    break;
                }


            case "addUser":
                {   
                    //checks access level only for admin and manager
                    console.log("Mode Swich",mode);
                    try {         
                        let decodedToken;
                        // console.log("Auth Token ", process.env.Secret_Key);
                        console.log(Accesslvl);
                        if(token && (Accesslvl==="Admin" || Accesslvl==="Manager")){
                            decodedToken= jwt.verify(token, process.env.Secret_Key);
                            request.userID = decodedToken ?.id ;
                            // console.log("tokenn", token);
                            console.log("Req userID" ,request.userID);
                            next();
                        }       
                        else{
                            throw new Error("Access Denied");
                            }

                        }       
                     catch (error) {
                
                        response.send({message:error.message});
                        console.log(error.message);
                    }
                   break; 
                }
            default:
                {
                    console.log("defailt switch")
                   break; 
                }
                
        }

        
    } catch (error) {

        response.send({message:error.message});
        console.log(error.message);
    }

}

export default Signupauth;

