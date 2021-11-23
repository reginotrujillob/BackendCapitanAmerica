const mongoose=require('mongoose');
const Estudianteschema=mongoose.Schema({
    nombre:String,
    apellidos:String,
    tipo:String,
    date:{type:Date, default:Date.now},
    image:String
});
module.exports=mongoose.model('Estudiante',Estudianteschema);
