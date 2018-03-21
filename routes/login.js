const express = require("express");
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;
const GOOGLE_CLIENT_ID = require('../config/config').GOOGLE_CLIENT_ID;

var app = express();

var Usuario = require("../models/usuario");

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(GOOGLE_CLIENT_ID);


// auth google

app.post('/google', (req, res) => {

    var token = req.body.token || 'xxx';

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        // If request specified a G Suite domain:
        //const domain = payload['hd'];


        Usuario.findOne({email: payload.email}, (err, usuario) =>{

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usuario',
                    error: err
                })    
            }

            if(usuario){

                if(!usuario.google){

                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Debe de usar su autenticacion normal'
                    }) 

                }else{

                    usuario.password = ' :D ';
                    var token = jwt.sign({ usuario: usuario }, SEED, { expiresIn: 144000 });
            
                    res.status(200).json({
                        ok: true,
                        usuario: usuario,
                        token: token,
                        id: usuario.id
                    });

                }
                // si el usuario no existe por correo
            } else{

               var usuario = new Usuario();
               usuario.nombre = payload.name;
               usuario.email = payload.email;
               usuario.password = " :)";
               usuario.img = payload.picture;
               usuario.google = true;
               usuario.save((err, usuarioDB) => {
               
                    if(err){

                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al crear usuario - google',
                            error: err
                        })

                    }

                    var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 144000 });
            
                    res.status(200).json({
                        ok: true,
                        usuario: usuarioDB,
                        token: token,
                        id: usuarioDB.id
                    });


               })


            }

        })

    }

    verify().catch(reason => {

            return res.status(500).json({
                ok: false,
                mensaje: 'Token no valido',
                error: reason
            })       

    });

})

// auth normal
app.post('/', (req, res) => {


    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                erros: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incrrectas - email',
                erros: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incrrectas - password',
                erros: err
            });
        }

        // crear un token!!
        usuarioDB.password = ' :D ';
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 144000 });

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB.id
        });
    });


})







module.exports = app;