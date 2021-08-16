const express = require('express');
const mongoose = require('mongoose');

const app = express();

const port = process.env.PORT || 3000;
const password = process.env.MONGODB_PASSWORD;

MONGO_URL = `mongodb+srv://dheeraj:${password}@cluster0.fbx4t.mongodb.net/testingDBs?retryWrites=true&w=majority`

mongoose.connect(MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:true
})

mongoose.connection.on('connect',()=>{
    console.log('connect to database yeah!!!');
})

const Schema = mongoose.Schema;

// Schema
const  myFrinds = new Schema({
    name:String,
    branch:String,
    age:Number,
    adress:String, 
    date:{
        type:String,
        default:Date.now()
    }
})

// Model
const frndModels = mongoose.model('frndModels', myFrinds)
const data={
    name:"pandit",
    branch:"ME",
    age:29,
    adress:"Jaunpur"
}

const frndList = new frndModels(data);

frndList.save((error)=>{
    if(error){
    console.log("oops something went wrong")
}else
{
    console.log("data saved successfully")
}
})

app.get('/', (req, res) => {
    res.send({
        "name":"Dheeraj",
        "age":27
    })
})

app.listen(port,()=>{
    console.log(`Listening on ${port}`)
})