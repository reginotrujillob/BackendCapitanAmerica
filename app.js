'use strict';
//cargar los modulos de js
const express=require('express');
const cors = require('cors');
//vamos a ejecutar el servidor
const app=express();
//Cargas los archivos y asignarles una ruta
const EstudianteUrl=require('./urls/EstudianteUrl');
const corsOptions = {
    origin: '*', // Aqui debemos reemplazar el * por el dominio de nuestro front
    optionsSuccessStatus: 200 // Es necesario para navegadores antiguos o algunos SmartTVs
}

//middleware lo que traduce la peticion a json
app.use(express.json());
app.use(express.urlencoded());

//Cors permite que otras aplicaciones se conecten
app.use(cors(corsOptions));
//Añadir los prefijos
app.use('/api',EstudianteUrl);
//Exportar los modulos
module.exports=app;

