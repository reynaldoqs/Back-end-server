const express = require('express');
var mdAuth = require('../middlewares/autenticacion');
var app = express();

var Medico = require('../models/medico');

//obtener todos los medicos
app.get('/', (req, res) =>{
   Medico.find({},(err, medicos) =>{

    if(err){
        return res.status(500).json({
            ok:false,
            mensaje:'Error al cargar Medicos',
            error: err
        })
    }

    res.status(200).json({
        ok: true,
        medicos: medicos
    });

   }); 
});

// actualizar un Medico
app.post('/:id', mdAuth.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {

        if(err){
            res.status(500).json({
                ok:false,
                mensaje: 'Error al buscar Medico',
                error: err
            })
        }

        if(!medico)  {
            return res.status(400).json({
              ok: false,
              mensaje: `El medico con el id: ${id} no existe` ,
              erros: {message: 'No existe medico con el ID'}
            });   
        }

        medico.nombre = body.nombre;
        medico.img = body.img;
        medico.usuario = body.usuario;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {

            if(err){
                res.status(500).json({
                    ok: false,
                    mensaje: 'Error al guardar medico',
                    error: err
                })
            }

            res.status(200).json({
                ok: true,
                mensaje: 'medico actualizado',
                medico: medicoGuardado
            });
        });
    });
});

//crear un nuevo medico
app.put('/', mdAuth.verificaToken , (req, res) => {

    var body = req.body;

    medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: body.usuario,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) =>{

        if(err){
            res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                error: err
            })
        };

        res.status(201).json({
            ok: true,
            medico: medicoGuardado,
            usuarioToken: req.usuario
        })

    });
})

// Eliminar un medico

app.delete('/:id', mdAuth.verificaToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {

        if(err){
            res.status(500).json({
                ok:false,
                mensaje: 'Error al borrar medico'
            })
        }

        if(!medicoBorrado){
            res.status(400).json({
                ok: false,
                mensaje: 'No existe medico con ese ID',
                errors: { message: 'No existe medico con ese ID'}
            })
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        })

    });


})

module.exports = app;