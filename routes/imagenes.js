const express = require('express');
var fs = require('fs');
var app = express();
var path = require('path');

app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    var url = `./uploads/${ tipo }/${ img }`;

   fs.access(url, (err) => {

        if(err && err.code === 'ENOENT'){
            url = './assets/no-img.jpg';
        }
        res.sendFile(path.resolve(url));
    })
/*
   fs.exists( url, existe => {

        if(!existe){
            url = './assets/no-img.jpg';
        }

        res.sendfile(url);
    })
*/
});

module.exports = app;