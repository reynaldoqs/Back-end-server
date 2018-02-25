const express = require('express');
var mdAuth = require('../middlewares/autenticacion');
var app = express();

var Hospital = require('../models/hopital');

//obtener todos los hospitales
app.get('/', (req, res) =>{
   Hospital.find({},(err, hospitales) =>{

    if(err){
        return res.status(500).json({
            ok:false,
            mensaje:'Error al cargar Hospitales',
            error: err
        })
    }

    res.status(200).json({
        ok: true,
        hospitales: hospitales
    });

   }); 
});

// actualizar un hospital
app.post('/:id', mdAuth.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if(err){
            res.status(500).json({
                ok:false,
                mensaje: 'Error al buscar hospital',
                error: err
            })
        }

        if(!hospital)  {
            return res.status(400).json({
              ok: false,
              mensaje: `El hospital con el id: ${id} no existe` ,
              erros: {message: 'No existe hospital con el ID'}
            });   
        }

        hospital.nombre = body.nombre;
        //hospital.img = body.img;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado) => {

            if(err){
                res.status(500).json({
                    ok: false,
                    mensaje: 'Error al guardar hospital',
                    error: err
                })
            }

            res.status(200).json({
                ok: true,
                mensaje: 'Hospital actualizado',
                hospital: hospitalGuardado
            });
        });
    });
});

//crear un nuevo hospital
app.put('/', mdAuth.verificaToken , (req, res) => {

    var body = req.body;

    hospital = new Hospital({
        nombre: body.nombre,
        //img: body.img,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) =>{

        if(err){
            res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                error: err
            })
        };

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        })

    });
})

// Eliminar un hospital

app.delete('/:id', mdAuth.verificaToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

        if(err){
            res.status(500).json({
                ok:false,
                mensaje: 'Error al borrar hospital'
            })
        }

        if(!hospitalBorrado){
            res.status(400).json({
                ok: false,
                mensaje: 'No existe hospital con ese ID',
                errors: { message: 'No existe hospital con ese ID'}
            })
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        })

    });


})

module.exports = app;