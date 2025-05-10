const mongoose=require("mongoose")

mongoose.connect("mongodb://localhost:27017/LoginFormPractice")
.then(()=>{
    console.log('mongoose connected');
})
.catch((e)=>{
    console.log('failed');
})

const logInSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const collectionSchema = new mongoose.Schema({
    
    name:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    pincode:{
        type:String,
        required:true
    },
    completeaddress:{
        type: String,
        required:true

    },
    phone:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    timeslot:{
        type:String,
        required:true
    }

  });

  const homeChefSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    availability: {
        type: String, // Assuming availability is stored as an array of time slots
        required: true
    },
    email:{
        type: String, // Assuming availability is stored as an array of time slots
        required: true
    }
});

const gardenerschema = new mongoose.Schema({
    
    name:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    pincode:{
        type:String,
        required:true
    },
    completeaddress:{
        type: String,
        required:true

    },
    phone:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    timeslot:{
        type:String,
        required:true
    }

  });

  const gardenersinfo = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    availability: {
        type: String, // Assuming availability is stored as an array of time slots
        required: true
    },
    email:{
        type: String, // Assuming availability is stored as an array of time slots
        required: true
    }
});



const subscriberschema = new mongoose.Schema({
    
    name:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    pincode:{
        type:String,
        required:true
    },
    completeaddress:{
        type: String,
        required:true

    },
    phone:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    service:{
        type:String,
        required:true
    },
    duration:{
        type:String,
        required:true
    },
    frequency:{
        type:String,
        required:true
    }

  });



  const subscribtion = new mongoose.Schema({
    
    name:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    service:{
        type:String,
        required:true
    },
    duration:{
        type:String,
        required:true
    },
    frequency:{
        type:String,
        required:true
    }

  });


  const pestcustomer= new mongoose.Schema({
    
    name:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    pincode:{
        type:String,
        required:true
    },
    completeaddress:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    timeslot:{
        type:String,
        required:true
    }
  });


  const pestController= new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    availability: {
        type: String, // Assuming availability is stored as an array of time slots
        required: true
    },
    email:{
        type: String, // Assuming availability is stored as an array of time slots
        required: true
    }
});






const Collectionhomecook = mongoose.model('Collectionhomecook', collectionSchema)
const LogInCollection = mongoose.model('LogInCollection', logInSchema)
const  HomeChef= mongoose.model('HomeChef', homeChefSchema)
const  Gardening= mongoose.model('Gardening', gardenerschema)
const Gardenersinfo=mongoose.model('Gardenersinfo',gardenersinfo)
const Subscriberinfo=mongoose.model('Subscriberinfo',subscriberschema)
const Subscribersevicerproviderinfo=mongoose.model('Subscribersevicerproviderinfo',subscribtion)
const PestCustomer=mongoose.model('PesctCustomer',pestcustomer)
const PestController=mongoose.model('PestController',pestController)


module.exports = {
    LogInCollection, Collectionhomecook,HomeChef,Gardening,Gardenersinfo,Subscriberinfo,Subscribersevicerproviderinfo,PestCustomer,PestController
  };