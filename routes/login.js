const express = require("express");
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var app = express();

var Usuario = require("../models/usuario");


app.post('/', (req, res) => {
   

    var body = req.body;

    Usuario.findOne({ email: body.email}, (err, usuarioDB) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                erros: err
            });
        }

        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incrrectas - email',
                erros: err
            });
        }

        if(!bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incrrectas - password',
                erros: err
            });
        }

        // crear un token!!
        usuarioDB.password = ' :D ';
        var token = jwt.sign({usuario: usuarioDB}, SEED, {expiresIn: 14400 });

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
           id: usuarioDB.id
        });
    });


})







module.exports = app;