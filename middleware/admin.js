const zod = require('zod')
const {Admin} = require('../db/index')

const userSchema = zod.string().email();
const passwordSchema = zod.string().min(6);

// Middleware for handling auth
async function  adminMiddleware(req, res, next) {
    const username = req.headers.username;
    const password = req.headers.password;
    const user = userSchema.safeParse(username);
    const pass = passwordSchema.safeParse(password);
    if(!user.success || !pass.success){
       res.status(403).json({msg:"incorrect username and password"});
    }
    const admin = await Admin.findOne({username})
    if(!admin){
        res.status(400).json({msg:"No such admin exists"});
    }else{
        next();
    }
}

module.exports = adminMiddleware;