const mongoose=require('mongoose');
const Misionesschema=mongoose.Schema({
    nombreM:String,
    codigo:String,
    tipo:String,
    date:{type:Date, default:Date.now}
});
module.exports=mongoose.model('Mision',Misionesschema);
