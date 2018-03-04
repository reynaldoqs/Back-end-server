const express = require("express");
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAuth = require('../middlewares/autenticacion');

var app = express();


var Usuario = require("../models/usuario");


// obtener todos los usuraiors
app.get("/", (req, res, next) => {

  var desde = req.query.desde || 0;
  desde = Number(desde);

  Usuario.find({}, "nombre email img role")
  .skip(desde)
  .limit(5)
  .exec((err, usuarios) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error cargando usuarios",
        error: err
      });
    }

    Usuario.count({}, (err, conteo) =>{

      res.status(200).json({
        ok: true,
        usuarios: usuarios,
        total: conteo
      });
  
    })

  });
});



// actualizar usuario

app.put('/:id', mdAuth.verificaToken,(req, res) => {

  var id = req.params.id;
  var body = req.body;

  Usuario.findById( id, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar usuario",
        erros: err
      });
    }

    if(!usuario)  {
      return res.status(400).json({
        ok: false,
        mensaje: `El usuario con el id: ${id} no existe` ,
        erros: {message: 'No existe usuario con el ID'}
      });   
    }

    usuario.nombre = body.nombre;
    usuario.email = body.email;
    usuario.rol = body.rol;

    usuario.save( (err, usuarioGuardado) => {

      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al actualizar usuario",
          erros: err
        });
      }

      usuarioGuardado.password = '.!.';

      res.status(200).json({
        ok: true,
        usuario: usuarioGuardado
      });

    })

  })


})

// crear un nuevo usuario
app.post('/', mdAuth.verificaToken ,(req, res) => {

    var body = req.body;
    var usuario = new Usuario({
      nombre: body.nombre,
      email: body.email,
      password: bcrypt.hashSync(body.password, 10),
      img: body.img,
      role: body.role
    });

    usuario.save((err, usuarioGuardado ) => {

      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al crear usuario",
          erros: err
        });
      }

      res.status(201).json({
        ok: true,
        usuario: usuarioGuardado,
        usuarioToken: req.usuario
      });      

    });
})
// eliminar usuario 

app.delete('/:id', mdAuth.verificaToken, (req, res) => {

  var id = req.params.id;

  Usuario.findByIdAndRemove( id, (err, usuarioBorrado) => {
    if (err){
      return res.status(500).json({
        ok: false,
        mensaje: 'Error borrar usuario'
      });
    }
    if (!usuarioBorrado){
      return res.status(400).json({
        ok: false,
        mensaje: 'No existe usuario con ese id',
        errors: { message: 'No existe usuario con ese id'}
      });
    }
    res.status(200).json({
      ok: true,
      usuario: usuarioBorrado
    })
  });

})

module.exports = app;
