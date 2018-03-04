const express = require('express');
const fileUpload = require('express-fileupload');
var fs = require('fs');
var app = express();
app.use(fileUpload());


var Usuario = require('../models/usuario')
var Medico = require('../models/medico')
var Hospital = require('../models/hopital')

app.put('/:tipo/:id', (req, res, next) => {


    var tipo = req.params.tipo;
    var id = req.params.id;

    // tipos de coleccion

    var tiposValidos = ['hospitales', 'medicos', 'usuarios']
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no es valido',
            errors: {
                message: 'Tipo de coleccion no es valido'
            }
        })
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Error al cargar el archivo',
            errors: {
                message: 'Debe validar la Imagen'
            }
        })
    }

    // obtener el nomrbe del archivo

    var archivo = req.files.imagen
    var nombreCortado = archivo.name.split('.')


    var extensionArchivo = nombreCortado[nombreCortado.length - 1]

    // estas extencion aceptadas

    var extencionValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extencionValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: {
                message: 'Las extenciones validaas son ' + extencionValidas.join(', ')
            }
        });
    }

    // nombre de archivo perzonalisado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    // mover el archivo del temporal al path

    var path = `./uploads/${tipo}/${nombreArchivo}`

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover el archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res)

        /*return res.status(200).json({
            ok: true,
            mensaje: 'Archivo movido'
        });*/

    })




});



function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if(!usuario){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe'}
                })
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;
            // si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo)
            }


            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':D'

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                })

            })




        })

    }

    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico) => {

            if(!medico){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Medico no existe',
                    errors: { message: 'Medico no existe'}
                })
            }            

            var pathViejo = './uploads/medicos/' + medico.img;
            // si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo)
            }

            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizada',
                    medico: medicoActualizado
                })

            })

        })

    }

    if (tipo === 'hospitales') {

        Hospital.findById(id, (err, hospital) => {

            if(!hospital){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'hospital no existe',
                    errors: { message: 'hospital no existe'}
                })
            }


            var pathViejo = './uploads/hospitales/' + hospital.img;
            // si existe elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo)
            }

            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    hospital: hospitalActualizado
                })

            })

        })

    }
}

module.exports = app;