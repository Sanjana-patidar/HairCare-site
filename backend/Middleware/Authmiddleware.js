import jwt from 'jsonwebtoken';

const authMiddleware = (req,res,next) =>{
     try{
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({Message:"Authorization header missing"});
        }

        const token = authHeader.split(" ")[1];
        if(!token){
            return res.status(401).json({Message:"Token missing"});
        }

        //  Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //  Attach user to request
        req.user = decoded;
         next();
     }
       catch(error){
          return res.status(401).json({Message: "Invalid or expire token"})
       }
}
export default authMiddleware;