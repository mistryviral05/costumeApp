const Catagory = require("../models/Catagory");
exports.addCatagory = async (req, res) => {
   const data = req.body;
   try {

      const catagory = data.catagory;
      if (!catagory) {
         return res.json({ success: false, message: "catagory value required" });

      }

      const newCatagory = new Catagory({ catagory: catagory });

      await newCatagory.save();

      res.json({ success: true, message: "Catagory Added " })



   } catch {
      res.json({ success: false, message: "Error comes in catagory controller" });
   }



}
exports.getCatagories = async (req, res) => {

   try {
      const catagories = await Catagory.find();
      if (catagories) {
         return res.json({ success: true, data: catagories });
      }

   } catch (err) {
      res.json({ success: false, message: "Error comes in getCatagory controllere" })
   }
}
exports.deleteCatagoryById = async (req, res) => {

   try {
      const { id } = await req.params;
      if (!id) {
         return res.json({ success: false, message: "costume not deleted" })
      }
      await Catagory.findOneAndDelete({ _id: id });
      res.json({ success: true, message: "Catagory has been deleted" });


   } catch (err) {
      console.log(err);
      res.json({ success: false, message: err })
   }




}
exports.updateCatagory = async (req, res) => {

   try {
         const {catagory,_id} = await req.body;
          const data = await Catagory.findOneAndUpdate(
            {_id:_id},
            {$set:{catagory:catagory}},
           {new:true}
          )
          if(data){
            res.json({succes:true,message:'updated catagory'})
          }else{
            res.json({succes:false,message:' catagory not found'})
          }

           
   } catch (err) {
      console.log(err);
      res.json({ succes: false, message: err });
   }



}