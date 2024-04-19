// APP - CONTROL DE EQUIPOS, series, problemas, y transmisiones.
// Usaremos main.js como Servidor y app.js como Cliente (render).

const fs = require('fs')
const {BrowserWindow, dialog, ipcMain} = require('electron')
const {app, Menu} = require('electron') 
const path = require('path')
const prompt = require('electron-prompt')
//const {showConsole, hideConsole} = require ("node-hide-console-window")

let buscados = []

let mainWindow     //mucho mejor que sea global, para poder acceder desde cualquier lado.

function createWindow() {
     mainWindow = new BrowserWindow({     // creamos el objeto win de clase browserwindow
     width: 1050,
     height: 700,
     resizable: false,
     autoHideMenuBar: true,        //oculta el Menú
      webPreferences: {           
         nodeIntegration: true,  //por defecto Electron lo tiene DESACTIVADO.
         sandbox: false, 
         contextIsolation: true,  // si esto no está falla en Unable to load preload script
         preload: path.join(__dirname, 'preload.js')   //es necesario cargar el preload.js antes del createWindow
     }
   }) 
   mainWindow.loadFile('index.html')     // cargamos en win el html a mostrar
   // si en vez de loadfile usamos loadUrl podemos cargar una página web desde electron! parecido a lo que hace Nativefier. muy loco.

   // Cargamos el MENÚ:
   const setMainMenu = ()=> {
    const template = [
       {
           label: 'Menu',
           submenu: [
               { label: 'Salir', click: ()=> { app.quit()} },
               { label: 'inspecc', click: ()=> { mainWindow.webContents.openDevTools() }},
               { label: 'Acerca de..', click: ()=> {
                   prompt({title: `Acerca de..`,
                   label: `Control de Equipos \n Pablo Carril Dto.SUBE \n Saes Línea 85`,
                   buttonLabels: {ok: "Aceptar", cancel: "Salir"},
                   alwaysOnTop: true,
                   width: 300,
                   height: 240,
                   inputAttrs: {type:"hidden", required: false},}
                   )}
               },
           ],
       }
     ]
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

   } 
   setMainMenu(mainWindow) 
   //mainWindow.webContents.openDevTools()  // abro inspector por default. luego sacarla
  // mainWindow.setAutoHideMenuBar(true)     // funciona, pero al iniciar no oculta el menú. lo puse el crear new browserWindow.
  // if (mainWindow.isMenuBarVisible()) { 
  //    setMenuBarVisibility(false)
  // }

}

app.whenReady().then( () => {
   //ipcMain.handle('dialog:openFile', handleFileOpen)
  createWindow()
  //app.on('activate', function () {
  //  if (BrowserWindow.getAllWindows().length === 0) createWindow()
  //})

})
//ipcMain.on('cambiarPagina', (event, archivo) => {  NO HACE FALTA NI CONVIENE CAMBIAR TODO EL HTML
//   console.log(archivo)
   //const win = BrowserWindow.getFocusedWindow();
   //mainWindow.loadFile(archivo);
//});
//mainWindow.webContents  esto no funciona


const additionalData = { myKey: 'myValue' }
const gotTheLock = app.requestSingleInstanceLock(additionalData) //CONTROLAMOS que no haya otra instancia abierta
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory, additionalData) => {
    // Imprime los datos recibidos de la segunda instancia.
    console.log("La Aplicacion ya se encuentra abierta... ") //, additionalData)
    // Alguien trato de ejecutar una segunda instancia, deberíamos enfocar nuestra ventana.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore() // Si encuentra otra Instancia le restaura el foco
      mainWindow.focus()
    }
  })
}


//FUNCIONES QUE LLAMAREMOS DESDE EL CLIENTE:

ipcMain.on('funcHola', () => {    //Funciona incluso sin parámetros. (evento, parametro) para pasar un parametro.
  // console.log("Hola")
})

ipcMain.handle('leerDB', async (event, archivo) => {     //.handle permite retornar un dato al cliente
  // console.log(archivolep)
   let dat = leerJson(archivo)  
   let datos = darFormato(dat)   // pasamos de string a objetos
   return datos      
})

ipcMain.on('escribeDB', (event, message, lista, archivo) => {        //on sólo puede recibir datos
   escribeJson(lista, archivo)
 });


ipcMain.on('escribeBorrados', async (message, arrayPos, borrados) => {    //BORRADOS
   let papelera = './borrados.json'
   let array = []
   //leer borrados
   try {
      let datos = fs.readFileSync(papelera, 'utf8')
      array = darFormato(datos)
    }
    catch (err) {
       console.error(`Error leyendo archivo ${archivo}. ${err}`)
       process.exit()    // si no existe salimos de la aplicación.
    }

   //agregar entrada
   objeto = {
      index: arrayPos,
      objeto: borrados,
   }
   array.push(objeto)

   //guardar borrados
   try {
      const jsonString = JSON.stringify(array)
      fs.writeFileSync(papelera, jsonString, 'utf-8')
      console.log("Archivo Guardado.")  
     }
     catch (err) { 
        console.error(`Error guardando: ${archivo}, ${err} `)   //estas comillas son template strings y permiten agregar variables
        }
})

//Manejo de archivos:

//var files = fs.readdirSync(pathoToDir);    //leemos el directorio 
//console.log("CARPETA: ")
//console.log(files);                     //listamos los archivos. en este caso nos devuelve un array
function leerJson(archivo) {      
   try {
     let dat = fs.readFileSync(archivo, 'utf8')  //Leemos el archivo. si ocurre un error va al catch y no ejecuta el consol.log
     console.log ("lectura correcta.") 
     return dat
   }
   catch (err) {
      console.error(`Error leyendo archivo ${archivo}. ${err}`)
      process.exit()    // si no existe salimos de la aplicación.

   }
}

function escribeJson(jsonObjet, archivo) {
   try {
    const jsonString = JSON.stringify(jsonObjet)
    fs.writeFileSync(archivo, jsonString, 'utf-8')
    console.log("Archivo Guardado.")  
   }
   catch (err) { 
      console.error(`Error guardando: ${archivo}, ${err} `)   //estas comillas son template strings y permiten agregar variables
      process.exit()    // si falla salimos de la aplicación.
      }
}

let darFormato = (datos) => {
   try {
     let dat = JSON.parse(datos)
    // console.log("formato correcto.")
     return dat
   }
   catch (error) {
     console.log("Error en formato: " + error) /* funciona BIEN! */    
      }
}
/*fs.readdir(pathoToDir, (error, files) => {    // Usando la función asíncrona readdir que espera que termine el callback.
   if (error) { throw error; }
   console.log("CARPETA: " + files);
});*/

/*const leerJson = async () => {
   await fs.readFile(pathoToFile, 'utf8', (error, datos) => {   //Leemos el archivo y lo imprimimos en consola.
    if (error) { throw error; }
   });
   return JSON.parse(datos)
}*/
// como el .readFile tarda un tiempo éste devuelve una promesa, y ésta la esperamos con await para luego poder imprimir en consola

let titulo = ""
ipcMain.on('abrirBusqueda', (message, pedidos, dato) => {
   let ventanaBusqueda = new BrowserWindow({
      parent: mainWindow,       //ventana padre
      modal: true,              //encima de ella
      show: false,              //inicialmente está oculta. no se muestra
      width: 780,
      height: 620,
      webPreferences: {           
        // nodeIntegration: true,  
         //sandbox: false, 
        // contextIsolation: true,  // si esto no está falla en Unable to load preload script
        preload: path.join(__dirname, 'preload.js')   //es necesario cargar el preload.js antes del createWindow
      }
   })
   ventanaBusqueda.loadFile("./busqueda/busqueda.html")     //cargamos su html (el cual carga su js)
   ventanaBusqueda.setMenu(null)                          //sin menú
      const template = [
         {
             label: 'Menu',
             submenu: [
                 { label: 'Salir', click: ()=> { ventanaBusqueda.close()} },
                 { label: 'inspecc', click: ()=> { ventanaBusqueda.webContents.openDevTools() }},
                 
             ],
         }
       ]
      const menu = Menu.buildFromTemplate(template)
     // ventanaBusqueda.setMenu(menu)
      ventanaBusqueda.once('ready-to-show', ()=> {           //cuando esté lista...
         ventanaBusqueda.show()
        //ventanaBusqueda.webContents.openDevTools()  //muestra inspector. luego sacarlo.
      })
   //buscados = []
   titulo = dato
   buscados = pedidos
})


ipcMain.handle('leerBusqueda', async () => {     //esta sólo la ejecuta busqueda.js
   console.log("buscando: " + titulo)
   return [buscados, titulo]
})

ipcMain.handle('prompt', async (event, datos, texto) => {       // PROMPT de busqueda por id
   console.log("Prompt:")
   let respuesta
   await prompt({            //si no ponemos el await no espera y retorna undefined
      title: `pregunta..`,
      label: texto,
      buttonLabels: {ok: "Si", cancel: "No"},
      alwaysOnTop: true,
      width: 200,
      height: 140,
      //value: 'http://example.org',
      inputAttrs: {type:"hidden", required: false},
      //type: 'input', 
  })
  .then((r) => {
      if(r === null) {
          //console.log('cancelado.');
          respuesta = false
      } else {
          //console.log('Ok.');   
          //console.log("desmarcando: " + datos)
          respuesta = true
      }
  })
  .catch(console.error);
  //console.log(respuesta)
  return respuesta
})

//envio a app los equipos entregados. lo hago a travéz de main porque con exports e imports no anda en electron.
ipcMain.on('entregado', (msg, id, estado) => {
  //console.log("entregado id: " + id + " estado: " + estado)
  //esta es la forma que DESDE MAIN llamar y ejecutar una función en el render:
  mainWindow.webContents.send('entregadoGuarda', id, estado)
})
