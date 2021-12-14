import { request, response } from "express";
import jwt from "jsonwebtoken";

const auth = async( request, response, next) => {

    try {
        const token = request.header('x-auth-token');
        let decodedToken;
        // console.log("Auth Token ", process.env.Secret_Key);
        if(token){
            decodedToken= jwt.verify(token, process.env.Secret_Key);
            request.userID = decodedToken ?.id ;
            // console.log("tokenn", token);
            console.log("Req userID" ,request.userID);
            next();
        }       
        
         
    } catch (error) {

        
        console.log(error.message);
    }

}

export default auth ;