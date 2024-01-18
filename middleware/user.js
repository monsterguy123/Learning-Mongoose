const zod = require('zod')
const {User} = require('../db/index')

const userSchema = zod.string().email();
const passwordSchema = zod.string().min(6);

async function userMiddleware(req, res, next) {
    const username = req.headers.username;
    const password = req.headers.password;
    const user = userSchema.safeParse(username);
    const pass = passwordSchema.safeParse(username);
    if(!user.success || !pass.success){
        res.status(403).json({msg:"incorrect username and password"});
    }
    const userfind = await User.findOne({username});
    if(!userfind){
        res.status(400).json({msg:"incorrect user plz try again"})
    }else{
        next();
    } 
}

module.exports = userMiddleware;