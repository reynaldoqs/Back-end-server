// Requieres 
var express = require('express');
const mongoose = require('mongoose');

// inicializar variables

var app = express();

// conexcion a la base de datos
mongoose.connect('mongodb://localhost:27017/hospitalDB', (err, res ) => {
    if(err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m','online');
})





// rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });
})

// escuchar peticiones
app.listen(3000, () => {
    console.log('Express server is running at 3000:\x1b[32m%s\x1b[0m',' online');
})