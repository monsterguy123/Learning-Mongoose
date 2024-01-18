const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://deepakbisht9891:DeepakB123@cluster0.gbv2ifz.mongodb.net/').then(()=>{
    console.log("db is connected");
});

const AdminSchema = new mongoose.Schema({
       username:{type:String,required:true},
       password:{type:String,required:true},
});

const UserSchema = new mongoose.Schema({
    username:{type:String,required:true},
    password:{type:String,required:true},
    purchasedCourse:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    }],
});

const CourseSchema = new mongoose.Schema({
      title:String,
      description:String,
      imageLink:String,
      price:Number,
});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);

module.exports = {
    Admin,
    User,
    Course
}