const Mision=require('../models/MisionModel');
const fs=require('fs');
const path=require('path');
const { ok } = require('assert');
const  controller2={
    save:(req,res)=>{
        /*
        1. Recoger los datos
        2. Validar los datos
        3. Crea el objeto
        4. Lo guarda
        5. Se devuelve una respuesta
        */
       const {nombreM,tipo,codigo}=req.body;
       console.log(req.body);
       try {
           if(nombreM.length>0 && codigo.length>0){
                const mision= new Mision();
                mision.nombreM=nombreM;
                mision.tipo=tipo;
                mision.codigo=codigo;
                mision.save((err, mision) => {
                        if (err || !mision) {
                            return res.status(400).send({
                                status: 'Fail',
                                message: 'no se puedexd'
                            });
                        }
                        else {
                            return res.status(200).send({
                                status: 'exito',
                                mision
                            });
                        }
                    })
           }
           else{
               return res.status(401).send({
                   status:false,
                   message:'Faltan datos de la mision'
               })
           }
       } catch (error) {
           console.log("Error aqui");
           return res.status(401).send({
            status:false,
            message:'Contacte a zapata'
        })
       }
       
    },
    getMisiones:(req,res)=>{
        Mision.find({}).sort('tipo').exec((err,misiones)=>{
            if(err){
                return res.status(400).send({
                    status:'error',
                    message:'No se encontaron datos'
                })
            }
            return res.status(400).send({
                status:'ok',
                misiones
            })
        })
    },
    getMision:(req,res)=>{
        //Recoger el id de la url
        const {id}=req.params;
        console.log(id);
        if(!id || id==null){
            return res.status(500).send({
                status:'malo',
                message:'Error al devolver los datos'
            })
        }
        Mision.findById(id,(err,mision)=>{
            if(err){
                return res.status(400).send({
                    status:'malo',
                    message:'No se pudo procesar'
                })
            }
            if(!mision){
                return res.status(201).send({
                    status:'ok',
                    message:'Ingrese id correcto'
                })
            }
            return res.status(200).send({
                status:'ok',
                mision
            })
        })
    },
    //Borrar
    deleteMision:(req,res)=>{
        //Coger el id que nos llega desde la url
        const {id}=req.params;
        console.log(id);
        if(!id || id==null){
            return res.status(500).send({
                status:'fail',
                message:'Error no se paso el parametro id'
            })
        }
        Mision.deleteOne({_id:id},(err,mision)=>{
            if(err || mision){
                return res.status(500).send({
                    status:'error',
                    message:'No existe el id'
                })
            }
            return res.status(202).send({
                status:'ok',
                mision
            })
        })
    },
    search:(req,res)=>{
        const {texto}=req.params;
        Mision.find({"$or":[
            {"nombreM":new RegExp(texto,'i')},
            {"tipo":new RegExp(texto,'i')},
            {"codigo":new RegExp(texto,'i')},
            {"fecha":new RegExp(texto,'i')}

        ]}).exec((err,misiones)=>{
            if(err){
                return res.status(500).send({
                    status:'error',
                    message:'Contacte al zapata'
                })
            }
            return res.status(200).send({
                status:'exito',
                misiones
            })
        })
    },
    updateMision:(req,res)=>{
        /*
        1. Recoger los datos
        2. Validamos
        3. Buscar y actualizar
        */
       const {nombreM,tipo}=req.body;
       const {id}=req.params;
       try{
            if(nombreM.length>0 || tipo.length>0){
                Mision.updateOne({_id:id},req.body,{new:true},
                    (err,mision)=>{
                        if(err){
                            return res.status(401).send({
                                status:'fail',
                                message:'Contacte al admin'
                            })
                        }
                        return res.status(200).send({
                            status:'exito',
                            mision
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
            Mision.findOneAndUpdate({_id:id},{image:file_name},
                {new:true},(err,misionUpdate)=>{
                    if(err || !misionUpdate){
                        return res.status(400).send({
                            status:'error',
                            message:'error'
                        })
                    }
                    return res.status(200).send({
                        status:'ok',
                        misionUpdate
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
module.exports= controller2;