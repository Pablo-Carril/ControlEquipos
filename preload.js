//el preload conectará con un puente el main con el render (cliente)
const { contextBridge, ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    console.log("PreLoad Cargado OK");
})

contextBridge.exposeInMainWorld('electronAPI',{       //exponemos la variable global electronAPI para usar en el cliente
    //izquierda: lado app (cliente) --- derecha: lado Main (server)

    hola: () => ipcRenderer.send('funcHola'),              //exportamos las funciones para usar desde el cliente.
    //metodo: (callback)=> ipcRenderer.on('canal', callback), 
    //openFile: () => ipcRenderer.invoke('dialog:openFile')  para abrir archivos        
    //setTitle: (title) => ipcRenderer.send('set-title', title),  //funciona! 
    leerDB: async (archivoLee) => await ipcRenderer.invoke('leerDB', archivoLee),  //método bidireccional con invoke, pero no sé como devolver un dato.
    //escribeDB: (lista) => ipcRenderer.invoke('escribeDB', lista),
    escribeDB: (message, ...args ) => ipcRenderer.send('escribeDB', message, ...args),
    abrirBusqueda: (message, ...args) => ipcRenderer.send('abrirBusqueda', ...args),
    leerBusqueda: async () => await ipcRenderer.invoke('leerBusqueda'),
    prompt: async (pedido, texto) => await ipcRenderer.invoke('prompt', pedido, texto),
    entregado: (message, id, estado) => ipcRenderer.send('entregado', message, id, estado),
    entregadoGuardar: (callback, id, estado) => ipcRenderer.on('entregadoGuarda', callback, id, estado),
    escribeBorrados: (message, arrayPos, borrados) => ipcRenderer.send('escribeBorrados', message, arrayPos, borrados),

})
