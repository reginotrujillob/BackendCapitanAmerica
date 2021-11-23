const Estudiante=require('../models/EstudianteModel');
const fs=require('fs');
const path=require('path');
const { ok } = require('assert');
const controller={
    save:(req,res)=>{
        /*
        1. Recoger los datos
        2. Validar los datos
        3. Crea el objeto
        4. Lo guarda
        5. Se devuelve una respuesta
        */
       const {nombre,apellido,tipo}=req.body;
       console.log(req.body);
       try {
           if(nombre.length>0 && apellido.length>0){
                const estudiante= new Estudiante();
                estudiante.nombre=nombre;
                estudiante.apellidos=apellido;
                estudiante.tipo=tipo;
                estudiante.save((err,estudiante)=>{
                    if(err || !estudiante){
                        return  res.status(400).send({
                            status:'Fail',
                            message:'no hubo forma mono'
                        })
                    }
                    else{
                        return res.status(200).send({
                            status:'exito',
                            estudiante
                        })
                    }
                })
           }
           else{
               return res.status(401).send({
                   status:false,
                   message:'Faltan datos'
               })
           }
       } catch (error) {
           console.log("Error mono");
           return res.status(401).send({
            status:false,
            message:'Contacte al admin'
        })
       }
       
    },
    getEstudiantes:(req,res)=>{
        Estudiante.find({}).sort('apellidos').exec((err,estudiantes)=>{
            if(err){
                return res.status(400).send({
                    status:'error',
                    message:'No se encontaron datos'
                })
            }
            return res.status(400).send({
                status:'ok',
                estudiantes
            })
        })
    },
    getEstudiante:(req,res)=>{
        //Recoger el id de la url
        const {id}=req.params;
        console.log(id);
        if(!id || id==null){
            return res.status(500).send({
                status:'malo',
                message:'Error al devolver los datos'
            })
        }
        Estudiante.findById(id,(err,estudiante)=>{
            if(err){
                return res.status(400).send({
                    status:'malo',
                    message:'No se pudo procesar'
                })
            }
            if(!estudiante){
                return res.status(201).send({
                    status:'ok',
                    message:'Ingrese id correcto'
                })
            }
            return res.status(200).send({
                status:'ok',
                estudiante
            })
        })
    },
    //Borrar
    deleteEstudiante:(req,res)=>{
        //Coger el id que nos llega desde la url
        const {id}=req.params;
        console.log(id);
        if(!id || id==null){
            return res.status(500).send({
                status:'fail',
                message:'Error no se paso el parametro id'
            })
        }
        Estudiante.deleteOne({_id:id},(err,estudiante)=>{
            if(err || estudiante){
                return res.status(500).send({
                    status:'error',
                    message:'No existe el id'
                })
            }
            return res.status(202).send({
                status:'ok',
                estudiante
            })
        })
    },
    search:(req,res)=>{
        const {texto}=req.params;
        Estudiante.find({"$or":[
            {"nombre":new RegExp(texto,'i')},
            {"apellidos":new RegExp(texto,'i')}
        ]}).exec((err,estudiantes)=>{
            if(err){
                return res.status(500).send({
                    status:'error',
                    message:'Contacte al admon'
                })
            }
            return res.status(200).send({
                status:'exito',
                estudiantes
            })
        })
    },
    updateEstudiante:(req,res)=>{
        /*
        1. Recoger los datos
        2. Validamos
        3. Buscar y actualizar
        */
       const {nombre,apellidos,tipo}=req.body;
       const {id}=req.params;
       try{
            if(nombre.length>0 || apellidos.length>0){
                Estudiante.updateOne({_id:id},req.body,{new:true},
                    (err,estudiante)=>{
                        if(err){
                            return res.status(401).send({
                                status:'fail',
                                message:'Contacte al admin'
                            })
                        }
                        return res.status(200).send({
                            status:'exito',
                            estudiante
                        })
                    })
            }
       }
       catch(error){
           console.log('Contacte el administrador')
       }
    },
    upload:(req,res)=>{
        let file_name='imagen no subida';
        if(!req.files){
            return res.status(404).send({
                status:'error',
                message:file_name
            })
        }
        let file_path=req.files.file0.path;
        console.log(file_path);
        const file_split=file_path.split('/');// "\\" en windows
        file_name=file_split[2];
        const file_extension=file_name.split('.')[1];
        if (file_extension != 'png' && file_extension !='jpg'
        && file_extension !='jpeg' && file_extension !='gif'){
            fs.unlink(file_path,(err)=>{
                return res.status(200).send({
                    status:'error',
                    message:'Exetension validad'
                })
            })
        }
        else{
            const id=req.params.id;
            Estudiante.findOneAndUpdate({_id:id},{image:file_name},
                {new:true},(err,estudianteUpdate)=>{
                    if(err || !estudianteUpdate){
                        return res.status(400).send({
                            status:'error',
                            message:'error'
                        })
                    }
                    return res.status(200).send({
                        status:'ok',
                        estudianteUpdate
                    })
                })
        }
    },
    getImage:(req,res)=>{
        const file=req.params.nombreImagen;
        const path_file='./upload/images/'+file;
        fs.stat(path_file,(error,exist)=>{
            if(error){
                return res.status(404).send({
                    status:'error',
                    message:'no se encuentra la imagen'
                })
            }
            return res.sendFile(path.resolve(path_file));
        })
    }
    
}
module.exports=controller;