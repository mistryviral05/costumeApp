const Catagory = require("../models/Catagory");



exports.addCatagory = async(req,res)=>{
       const data = req.body;
       console.log(data)
 try{
    
    const catagory = data.catagory;
    if(!catagory){
      return res.json({success:false,message:"catagory value required"});

    }

    const newCatagory = new Catagory({catagory:catagory});

     await newCatagory.save();

     res.json({success:true,message:"Catagory Added "})



 }catch{
    res.json({success:false,message:"Error comes in catagory controller"});
 }



}



exports.getCatagories = async(req,res)=>{

      try{
         const catagories = await Catagory.find();
         if(catagories){
           return res.json({success:true,data:catagories});
         }

      }catch(err){
         res.json({success:false,message:"Error comes in getCatagory controllere"})
      }
}