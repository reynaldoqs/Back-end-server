// Requieres 
var express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');

// inicializar variables

var app = express();

// body parser

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
// conexcion a la base de datos
mongoose.connect('mongodb://localhost:27017/hospitalDB', (err, res ) => {
    if(err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m','online');
})



//rutas
app.use('/login', loginRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/', appRoutes);

// escuchar peticiones
app.listen(3000, () => {
    console.log('Express server is running at 3000:\x1b[32m%s\x1b[0m',' online');
})