const express = require('express');

var app = express();

var Hospital = require('../models/hopital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');
    switch (tabla) {
        case 'medicos':
            buscarMedicos(busqueda, regex).then(
                medicos => {
                    res.status(200).json({
                        ok: true,
                        medicos: medicos
                    })
                }
            ).catch(err => {
                res.status(500).json({
                    ok: false,
                    error: err
                })
            });

            break;

        case 'hospitales':
        buscarHospitales(busqueda, regex).then(
            hospitales => {
                res.status(200).json({
                    ok: true,
                    hospitales: hospitales
                })
            }
        ).catch(err => {
            res.status(500).json({
                ok: false,
                error: err
            })
        });

            break;

        case 'usuarios':
        buscarUsuarios(busqueda, regex).then(
            usuarios => {
                res.status(200).json({
                    ok: true,
                    usuarios: usuarios
                })
            }
        ).catch(err => {
            res.status(500).json({
                ok: false,
                error: err
            })
        });
            break;

        default:
        res.status(500).json({
            ok:false,
            error: `No existe la tabla ${tabla} en nuestra DB `
        })
            break;
    }

});

app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
        buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda, regex),
        buscarUsuarios(busqueda, regex)
    ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });

        });


});

function buscarHospitales(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {

                if (err) {
                    reject('Error al cargar hospitales', err);
                }
                else {
                    resolve(hospitales);
                }
            });

    });
}

function buscarMedicos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {

                if (err) {
                    reject('Error al cargar medicos', err);
                }
                else {
                    resolve(medicos);
                }
            });

    });
}


function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Error al cargar usuarios', err);
                }
                else {
                    resolve(usuarios);
                }

            })

    });
}

module.exports = app;