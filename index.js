
//index.js es el comienzo de npm start y llamará a main.js (servidor) y este a app.js (cliente)

const {createWindow} = require("./main")    //importamos la función createWindow desde el main.js
const {app, Menu} = require('electron')          // app será el hilo principal y lo ejecutaremos aquí

//aqui cargaremos todos los require necesarios
//require('electron-reload')(__dirname)    // usamos electron-reload para que recargue automáticamente al guardar el proyecto.

// PARECE QUE NO HACE FALTA INDEX.JS YA FUE DESAFECTADO

app.whenReady().then(createWindow)


