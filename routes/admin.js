const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const zod = require('zod')
const {Admin,Course} = require('../db/index')

const userSchema = zod.string().email();
const passwordSchema = zod.string().min(6);

// Admin Routes
router.post('/signup', async (req, res) => {
     const username = req.headers.username;
     const password = req.headers.password;
     const user = userSchema.safeParse(username);
     const pass = passwordSchema.safeParse(username);
     if(!user.success || !pass.success){
        res.status(403).json({msg:"incorrect username and password"});
     }
     const admin = await Admin.findOne({username});
     if(admin){
        res.status(400).json({msg:"admin already exist"})
     }
     const createAdmin = await  Admin.create({
        username,
        password,
     })
     const response = await createAdmin.save()
     res.status(200).json({data:response,msg:"Admin has been created successfully"})
});

router.post('/courses', adminMiddleware, async (req, res) => {
    const course = req.body;
    try {
        const response =  await Course.create({
            title:course.title,
            description:course.description,
            imageLink:course.imageLink,
            price:course.price,
      });
        const result = await response.save();
        res.status(200).json({data:result , msg:"course has been created"})    
    } catch (error) {
           res.status(500).json({msg:error.message})     
    }
    
});

router.get('/courses', adminMiddleware, async (req, res) => {
       const response = await Course.find({});
       res.status(200).json({msg:"courses data",data:response})
});

module.exports = router;