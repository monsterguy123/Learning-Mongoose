const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const zod = require('zod')
const {User,Course} = require('../db/index')

const userSchema = zod.string().email();
const passwordSchema = zod.string().min(6);

// User Routes
router.post('/signup', async (req, res) => {
    const username = req.headers.username;
    const password = req.headers.password;
    const user = userSchema.safeParse(username);
    const pass = passwordSchema.safeParse(password);
    if(!user.success || !pass.success){
        res.status(403).json({msg:"incorrect username and password"});
    }
    const userfind = await User.findOne({username});
    if(userfind){
        res.status(400).json({msg:"user has already been created"})
    }
    const response = await User.create({
        username,
        password
    })
    const result = await response.save();

    res.status(200).json({data:result,msg:"user has been successfully created!!!"})
});

router.get('/courses', async (req, res) => {
       const response = await Course.find({});
       res.status(200).json({msg:"courses data",data:response})
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
         const Id = req.params.courseId;
         const username = req.headers.username;
            const response = await User.updateOne(
                {username:username},
               {"$push":{purchasedCourse:Id}},
               {new:true}) 
         res.status(200).json({msg:"course has been purchased",data:response});  
});

router.get('/purchasedCourses', userMiddleware, async(req, res) => {
    const user = await User.findOne({
        username: req.headers.username
    });

    console.log(user);
    const courses = await Course.find({
        _id: {
            "$in": user.purchasedCourse
        }
    });

    res.json({
        courses: courses
    })
});

module.exports = router