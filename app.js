
//app.js  maneja el DOM de este lado CLIENTE (render). desde main.js no se puede ya que node sólo trabaja en back end.
const DateTime = luxon.DateTime
let listaSeries = []
let archivo = ""
let modoEdicion = false
let idEdit = 0
let arrayPos = 0
let equipo = 0

const equipos = document.getElementById("equipoSelect")
const historialText = document.getElementById("historialText")
const teclados = document.getElementById("teclados")
const validadores = document.getElementById("validadores")

const buscar = document.getElementById("buscar")
const buscarInput = document.getElementById("buscarInput")
const titulo = document.getElementById("titulo")
const navegacion = document.getElementById("navegacion")
const formulario = document.getElementById("formEntrada")
const botonGuarda = document.getElementById("guardar")
const botonConsultar = document.getElementById("consultar")
const serieInput = document.getElementById("serie")
const lineaInput = document.getElementById("lineaSelect") //probamos con el select
const cocheInput = document.getElementById("coche")
const problemaInput = document.getElementById("problema")
const casoInput = document.getElementById("caso")
const fechaInput = document.getElementById("fecha")
const laplata = document.getElementById("laplata")
const sonda = document.getElementById("sonda")
const eliminar = document.getElementById("eliminar")
//const notas = document.getElementById("notas")


const historial = document.getElementById("historial") 
const historialSerie = document.getElementById("historialSerie")
//var tabla = document.getElementById("historial");
var tbody = historial.getElementsByTagName("tbody")[0]; // Obtenemos el cuerpo de la tabla (filas)
const filaSeleccionada = document.getElementById('filaSeleccionada');
const ultimos = document.getElementById("ultimos")

async function leerSeries(archivo) {   
    //console.log(archivo)
    let lista = await window.electronAPI.leerDB(archivo)
    return lista
 }

window.addEventListener('load', async ()=> {        //al INICIAR leemos la base de datos
    selectValidador()
    window.electronAPI.escribeDB('escribeDB', listaSeries, "ValidadBackup.json");
    let ahora = DateTime.now()
    let fecha = ahora.toISODate()   //Ok para que funcione el value. en formato local no lo toma: .toLocaleString(DateTime.DATE_SHORT)
    fechaInput.value = fecha        // PONER MEJOR La función RESET
    equipos.focus()
    //equipos.setAttribute("placeholder", "Equipo")
    equipos.value = "Validador"
    //equipos.style.backgroundColor = "#ccf"
    //equipos.style.border = "3px solid cian"
    equipos.style.fontWeight = "bold"

})

equipos.addEventListener('change', async (e)=> {           //si ELEGIMOS el equipo
    e.preventDefault()
    equipo = equipos.value
    console.log("cambio a: " + equipo)

    if (equipo === "Validador") {
       selectValidador()
    }
    if (equipo === "Teclado") {
       selectTeclado()
    }
    if (equipo === "MountinKit") {
        selectMK()
     }
})

async function selectValidador() {
    archivo = "ValidadSeries.json"
    listaSeries = await leerSeries(archivo)
    historialText.innerText = "Historial del Validador:"
   // navegacion.classList.remove("bg-success")
   // navegacion.classList.add("bg-primary")
   // botonGuarda.classList.remove("bg-success")
   // botonGuarda.classList.add("bg-primary")
   // botonConsultar.classList.remove("bg-success")
   // botonConsultar.classList.add("bg-primary")
   // ultimos.classList.remove("bg-success")
   // ultimos.classList.add("bg-primary")
   // laplata.classList.remove("bg-success")
   // laplata.classList.add("bg-primary")
   // sonda.classList.remove("bg-success")
   // sonda.classList.add("bg-primary")
    validadores.classList.add("active")
    teclados.classList.remove("active")
    equipos.style.border = "3px solid #0d6efd"    //suave: #cfe2ff
    historialSerie.className= "mt-1 alert alert-primary p-1 fw-bold"
    //historialSerie.innerText= "SERIE: "

    //serieInput.classList.add("placeholderVal")
    serieInput.setAttribute("placeholder", "Serie Val")
    reset()       // resetemos form e historial
    serieInput.focus()
}


async function selectTeclado() {
    archivo = "TecladoSeries.json"
    listaSeries = await leerSeries(archivo)
    window.electronAPI.escribeDB('escribeDB', listaSeries, "TecladoBackup.json");
    historialText.innerText = "Historial del Teclado:"
   // navegacion.classList.remove("bg-primary")
   // navegacion.classList.add("bg-success")
   // botonGuarda.classList.remove("bg-primary")
   // botonGuarda.classList.add("bg-success")
   // botonConsultar.classList.remove("bg-primary")
   // botonConsultar.classList.add("bg-success")
   // ultimos.classList.remove("bg-primary")
   // ultimos.classList.add("bg-success")
   // laplata.classList.remove("bg-primary")
   // laplata.classList.add("bg-success")
   // sonda.classList.remove("bg-primary")
   // sonda.classList.add("bg-success")
    validadores.classList.remove("active")
    teclados.classList.add("active")

    equipos.style.border = "3px solid #198754"   //otro para teclado o texto teclado #20c997  suave: #d1e7dd
    historialSerie.className= "mt-1 alert alert-success p-1 fw-bold"
    historialSerie.innerText= "Serie: "

    serieInput.setAttribute("placeholder", "Serie Tec")
    reset()     // resetemos form e historial
    serieInput.focus()
}

// Monting kit color: #ffc107
async function selectMK() {
    equipos.style.border = "3px solid #ffc107" 
    historialSerie.className= "mt-1 alert alert-warning p-1 fw-bold"
    historialSerie.innerText= "Serie: "

    serieInput.setAttribute("placeholder", "Serie MK")
    reset()     // resetemos form e historial
    serieInput.focus()
}

//OTROS color #fd7e14

validadores.addEventListener('click', async () => {    //al elegir VALIDADORES -  FUNCIONA IGUAL Sin el GetElementbyId !!!!
 selectValidador();
});

teclados.addEventListener('click', async () => {         //al elegir TECLADOS
  selectTeclado();
});

//mk.addEventListener('click', async () => {   //al elegir MOUNTING KIT ******* CUIDADO SI LA AGREGO SE ROMPE TODOOOOOO  **********
//    selectMK();
//  });


buscar.addEventListener('click', async (e) => {        // al presionar BUSCAR...en Navegacion
    e.preventDefault()
    let pedido = buscarInput.value.toLowerCase()        // pasamos a minusculas
     if (pedido) {
        let datos = await buscarProblema(pedido)
        console.log(pedido)
        window.electronAPI.abrirBusqueda('abrirBusqueda', datos, pedido)
     }
     else {
        buscarInput.setAttribute("placeholder", "Ingrese algo a buscar..")
        buscarInput.focus()
     }
    })


ultimos.addEventListener('click', async ()=> {           // ULTIMOS
    let idMaximo = Math.max(...listaSeries.map((obj) => obj.id)) //obtenemos el id máximo, el más grande (no el último ojo).
    //console.log(idMaximo)
    let previo = idMaximo - 11        //los ultimos doce. deberían ser ultimos días ?
    let busqueda = []
    let encontrado = 0
        for (let i = previo; i <= idMaximo; i++) {    //lo hago así porque necesito desde/hasta sí o sí.
           encontrado = listaSeries.find((obj) => {   
             if(obj.id) {                //si existe la propiedad
                 return obj.id == i         //no usar estricto (===) ya que si son string no los encuentra. 
                }  
            })
           if (encontrado) {         //sólo si lo encuentra lo concatena. si no debuelve undefined y se traba la tabla
             busqueda = busqueda.concat(encontrado)
           }
           console.log(encontrado)
        }       
    console.log(busqueda) 
    let texto
    if (archivo == "ValidadSeries.json") { texto = "Ultimos VALIDADORES" }
    if (archivo == "TecladoSeries.json") { texto = "Ultimos TECLADOS" }
    window.electronAPI.abrirBusqueda('abrirBusqueda', busqueda, texto)
})

laplata.addEventListener('click', async ()=> {       // CASOS LA PLATA
    let busqueda = []
    let resultados = []
       // encontrado = listaSeries.find((obj) => {   
       //   if(obj.id) { 
       //       return obj.id == i }   //no usar estricto (===) si son string no los encuentra.
       // busqueda = busqueda.concat(encontrado)
    busqueda = listaSeries.filter((obj) => obj.caso)  //sólo si tiene valor en caso     
    resultados = busqueda.filter((obj) => {
        return obj.linea == "307" || obj.linea == "275"  // sólo los de esas líneas
      })           
    console.log(resultados) 
    let texto
    if (archivo == "ValidadSeries.json") { texto = "Casos VALIDADORES - La Plata" }
    if (archivo == "TecladoSeries.json") { texto = "Casos TECLADOS - La Plata" }
    window.electronAPI.abrirBusqueda('abrirBusqueda', resultados, texto)
})

sonda.addEventListener('click', async ()=> {       // CASOS SONDA
    let busqueda = []
    let resultados = []
    busqueda = listaSeries.filter((obj) => obj.caso)  //sólo si tiene valor en caso     
    resultados = busqueda.filter((obj) => {
        return obj.linea == "85" || obj.linea == "98"  // sólo los de esas líneas
      })           
    console.log(resultados) 
    let texto
    if (archivo == "ValidadSeries.json") { texto = "Casos VALIDADORES - Sonda" }
    if (archivo == "TecladoSeries.json") { texto = "Casos TECLADOS - Sonda" }
    window.electronAPI.abrirBusqueda('abrirBusqueda', resultados, texto)
})


async function escribeSeries(lista) {
   //console.log(lista)
   window.electronAPI.escribeDB('escribeDB', lista, archivo);
   //limpiamos formulario
}

serieInput.addEventListener('keypress', e => {       //al apretar enter CONSULTAR 
    if(e.key == "Enter") {         // nesesito agregarlos a todos los input ??   SI A LA MAYORIA
      botonConsultar.click()
      e.preventDefault()
    }
})

// Otra forma desde el HTML para todo el form: <form onkeydown="return event.key != 'Enter';" action="." method="get">

// GUARDAMOS datos nuevos:
formulario.addEventListener("submit", async (e)=>{      // al GUARDAR 
     e.preventDefault()            //evitamos que limpie el form. primero validamos en JS y luego lo reseteamos
    //console.log("Guardando..")   este no debería estar aquí porque cada vez que pulso enter se entra al submit

    console.log("modo " + modoEdicion)
    
    if (modoEdicion === false) {
        if (serieInput.value.trim() == '' || problemaInput.value.trim() == '' || equipos.value.trim() == '') {
            equipos.focus()  //falta el dato. simplemente continuamos..
        } else {                        
            let idMaximo = Math.max(...listaSeries.map((obj) => obj.id))
            let idProximo = idMaximo + 1
            
            let valor = Number(serieInput.value)  // pasamos a número para sacar los ceros
            let serie = valor.toString()          //volvemos a pasar a string.en la dB se guarda en string.
            
            let nuevo = {              //creamos la nueva entrada para guardar en la Base
                id: idProximo,
                serie: serie, 
                fecha: fechaInput.value,   //me toma año-mes-dia. es probable que sea mejor manejarlo así (ISO8601)
                linea: lineaInput.value,
                coche: cocheInput.value,
                problema: problemaInput.value,
                caso: casoInput.value,
            }
            console.log(nuevo)
            //console.log =`id: ${nuevo.id} serie: ${nuevo.serie} fecha: ${nuevo.fecha} linea: ${nuevo.linea} coche: ${nuevo.coche} problema: ${nuevo.problema}`      
            // agregamos la nueva entrada     
            listaSeries.push(nuevo)
            await escribeSeries(listaSeries)   //guardamos (y esperando que termine)
            botonConsultar.click()      // volvemos a consultar luego de esperar el guardado anterior 
            formulario.reset()          //limpiamos el form y reestablecemos la fecha
            let ahora = DateTime.now()
            let fecha = ahora.toISODate()
            fechaInput.value = fecha
          }
    }
    // en modo EDICION:
    if (serieInput.value.trim() == '' || problemaInput.value.trim() == '' || equipos.value.trim() == '') {
            equipos.focus()
        } else {
            let valor = Number(serieInput.value)  // pasamos a número para sacar los ceros
            let numserie = valor.toString()        //volvemos a pasar a string. en la dB se guarda en string.
            let nuevo = {           
                id: idEdit,                //el id a editar
                serie: numserie, 
                fecha: fechaInput.value,  
                linea: lineaInput.value,
                coche: cocheInput.value,
                problema: problemaInput.value,
                caso: casoInput.value,
            }
            console.log(nuevo)

            listaSeries[arrayPos] = nuevo       //guardamos los nuevos datos en el array
            //console.log(listaSeries[arrayPos])
            let serie = serieInput.value          //guardo serie antes de limpiar
            reset()                // reseteamos formulario e historial
            serieInput.value = serie     // recupero serie para poder consultar
            botonConsultar.click()      // volvemos a consultar para ver la entrada editada
            await escribeSeries(listaSeries)
            
            serieInput.classList.remove("text-danger","fw-bold")  // salimos de la Edición
            fechaInput.classList.remove("text-danger","fw-bold")
            cocheInput.classList.remove("text-danger","fw-bold")
            lineaInput.classList.remove("text-danger","fw-bold")
            problemaInput.classList.remove("text-danger","fw-bold") 
            casoInput.classList.remove("text-danger","fw-bold")  
            eliminar.hidden = true  //oculta botón
           modoEdicion = false  //lo reseteamos
        } 

    
})


botonConsultar.addEventListener("click", async (e)=>{       //al CONSULTAR 
    e.preventDefault()
    console.log("Consultando.." + serieInput.value)
    if (serieInput.value.trim() == '') {
        //let serie = ""
        serieInput.focus()
        // cartel: falta completar este dato. no hace falta porque simplemente sale del if y continúa.
    } else { 
        let serie = serieInput.value        // usamos filter para obtener TODAS las entradas
        let buscados = listaSeries.filter((obj) => {
            let num = Number(obj.serie)       // pasamos a números para sacar los ceros de la izquierda
            return num == serie    // chequeamos que sea el buscado. no usar estricto ===.
        })  
        if (buscados.length != 0) {
          historialSerie.innerText =`Serie: ${serie}` 
          historialSerie.classList.remove("alert-danger")
          console.log(buscados)
          muestraHistorial(buscados)            // llenamos el HISTORIAL
        } else if (buscados.length === 0) { 
            historialSerie.classList.add("alert-danger")
            historialSerie.innerText="No encontrado"
            console.log("No encontrado!")
            while (tbody.firstChild) {       //borramos las filas de la tabla
                tbody.removeChild(tbody.firstChild);
              }
        }
    }
    
})

function reset() {                     //RESET formulario e historial
    while (tbody.firstChild) {               //borramos las filas del historial
        tbody.removeChild(tbody.firstChild);
    }
    formulario.reset()                // limpiamos formulario
    let ahora = DateTime.now()
    let fecha = ahora.toISODate()   // cargamos fecha de hoy
    fechaInput.value = fecha
    
    equipos.focus()
}


//creamos las tablas del HISTORIAL
function muestraHistorial(listaHistorial) {  
  while (tbody.firstChild) {               //borramos las filas antes de llenar
     tbody.removeChild(tbody.firstChild);
   }
 const botones = []     //aquí vamos a almacenar todos los botones "Editar"

  // Recorremos el array de objetos y creamos las filas para cada uno
  for (var i = 0; i < listaHistorial.length; i++) {
    var fila = tbody.insertRow()
    var celda1 = fila.insertCell(0)          //las Celdas son columnas
    var celda2 = fila.insertCell(1)
    var celda3 = fila.insertCell(2)
    var celda4 = fila.insertCell(3)
     celda4.classList.add("lh-1")
    var celda5 = fila.insertCell(4)

    const celda6 = fila.insertCell(5); //Editar
    celda6.classList.add("col-1")
    //celda6.value = "Edit"
    const button = document.createElement('input')
    button.type = 'button'
    button.id = listaHistorial[i].id //'filaSeleccionada'
    button.value = "🗁" //button.id
    button.style.backgroundColor = "transparent"
    button.style.borderColor = "transparent"
    button.style.textAlign = "center"
    button.classList.add("hover-overlay")
    button.classList.add("hover-zoom")
    button.classList.add("hover-shadow")
    botones.push(button)           // guardamos cada nuevo botón en un array

    celda6.appendChild(button);

    let vacio = ""
    let fechaAntes = listaHistorial[i].fecha ? listaHistorial[i].fecha : vacio
    let fechaLuxon = DateTime.fromISO(fechaAntes)      //pasamos fecha a luxon
    let fechaLocal = fechaLuxon.toFormat('dd/MM/yyyy')  //formateamos para invertir el año
    celda1.innerHTML = fechaLocal              // listaHistorial[i].fecha
    celda2.innerHTML = listaHistorial[i].linea ? listaHistorial[i].linea : vacio
    celda3.innerHTML = listaHistorial[i].coche ? listaHistorial[i].coche : vacio
    celda4.innerHTML = listaHistorial[i].problema ? listaHistorial[i].problema : vacio
    celda5.innerHTML = listaHistorial[i].caso ? listaHistorial[i].caso : vacio
  }
  
  for (const boton of botones) {
      boton.addEventListener('click', (e) => {       // al EDITAR
        e.preventDefault()
        //Editamos aquí el id seleccionado
        modoEdicion = "true"
        console.log("Editando id: " + boton.id)
        eliminar.hidden = false   //mostramos boton eliminar
        
        let cual = listaSeries.find((obj) => {   //obtenemos el objeto
            if(obj.id) { 
                return obj.id == boton.id }
            })
            arrayPos = listaSeries.findIndex(objeto => objeto.id === cual.id);   //obtenemos la posición dentro del array
            
            serieInput.focus()
            
            serieInput.classList.add("text-danger","fw-bold")
            fechaInput.classList.add("text-danger","fw-bold")
            cocheInput.classList.add("text-danger","fw-bold")
            lineaInput.classList.add("text-danger","fw-bold")
            problemaInput.classList.add("text-danger","fw-bold")
            casoInput.classList.add("text-danger","fw-bold")
            
            serieInput.value = cual.serie
            fechaInput.value = cual.fecha
            cocheInput.value = cual.coche
            lineaInput.value = cual.linea
            problemaInput.value = cual.problema
            casoInput.value = cual.caso
            
            idEdit= boton.id
        }); 
    }
            
    eliminar.addEventListener("click", async (e)=>{      // al ELIMINAR
        e.preventDefault()
        e.stopImmediatePropagation() // ESTO EVITA EL PROBLEMA de que se ejecuta VARIAS VECES
        // (la cantidad de veces que cliqueamos previamente en el historial)

        console.log("eliminando id: " + idEdit)
                
        let consulta = await window.electronAPI.prompt(idEdit, "Eliminar?")

        if (consulta) {
          let borrados = listaSeries.splice(arrayPos, 1)
          console.log("indice: " + arrayPos)
          console.log(borrados)
           window.electronAPI.escribeBorrados(arrayPos, borrados)  //archivo backup de lo eliminado
           await escribeSeries(listaSeries)    //guardo  
          }
        let serie = serieInput.value  //guardo serie
        reset()
        serieInput.value = serie     // recupero serie para poder consultar
        botonConsultar.click()      // volvemos a consultar para ver la entrada editada
                
        serieInput.classList.remove("text-danger","fw-bold")  // salimos de la Edición
        fechaInput.classList.remove("text-danger","fw-bold")
        cocheInput.classList.remove("text-danger","fw-bold")
        lineaInput.classList.remove("text-danger","fw-bold")
        problemaInput.classList.remove("text-danger","fw-bold") 
        casoInput.classList.remove("text-danger","fw-bold")  
        eliminar.hidden = true  //oculta botón
        modoEdicion = false 
             
        idEdit = 99999   // Sólo evitamos eliminar los siguientes id cuando no ponemos el stopImmediatePropagation
        arrayPos = 88889   // se pueden sacar luego de las investigaciones.
    })
                   
}

//async function buscarProblema(buscada) { 
//    let problemas = listaSeries.filter((obj)=> {       
//       if (obj.problema) {                     //chequeamos que exista esa propiedad primero (no todos la tienen)
//         return obj.problema.toLowerCase().includes(buscada)  //pasamos a minúsculas y comparamos
//       }
//    })
//    let casos = listaSeries.filter((obj)=> {       
//        if (obj.caso) {                            
//          return obj.caso.includes(buscada) 
//        }
//     })
   // let fechas = listaSeries.filter((obj)=>{   //fechas las voy a manejar de otro modo. por un boton o algo así
   //     if (obj.fecha) {
   //       return obj.fecha.includes(buscada)
   //     }
   // })
//    let encontrados = problemas.concat(casos)  //.concat(fechas))    // unimos los arrays

//    if (encontrados.length > 0) {
       // console.log("Se encontró en:");
 //       return encontrados
 //   } else {
       // console.log("no se encontró");
//        return []
//    }
//}


async function buscarProblema(buscada) {
    let encontrados = [];

    for (let obj of listaSeries) {
        if (obj.problema && obj.problema.toLowerCase().includes(buscada)) {
            encontrados.push(obj);
        } else if (obj.caso && obj.caso.includes(buscada)) {
            encontrados.push(obj);
        }
    }

    // Ordenar por la propiedad 'fecha' de menor a mayor
    encontrados.sort((a, b) => {
        if (a.fecha && b.fecha) {
            return new Date(a.fecha) - new Date(b.fecha);
        } else if (a.fecha) {
            return -1; // Coloca 'a' antes de 'b' si 'a' tiene fecha definida y 'b' no
        } else if (b.fecha) {
            return 1; // Coloca 'b' antes de 'a' si 'b' tiene fecha definida y 'a' no
        } else {
            return 0; // No cambia el orden si ambas fechas son undefined
        }
    });

    if (encontrados.length > 0) {
        return encontrados;
    } else {
        return [];   //se podría retornar null para despues colocar el mensaje "nada encontrado"
    }
}

//guardamos el check de entregado, true o false en la dB
//Esta función es un llamado de Main y sólo se ejecuta cuando main la llame
window.electronAPI.entregadoGuardar( async (event, id, estado) => {
  //console.log("RECIBIENDO DE MAIN " + id + estado)
   let encuentra = listaSeries.find(obj => {        //buscamos el objeto con ese id
       if(obj.id) {  //chequeo, por que no todos tienen la propiedad id
           return obj.id == id }   //retornamos una copia
        })
        if (encuentra) {       // si encontró algo..
            encuentra.estado = estado;  // Modifico la propiedad estado. si no existe la crea.
           // console.log(encuentra)
            const index = listaSeries.findIndex(objeto => objeto.id === encuentra.id);  //buscamos la posición dentro del array donde se encuentra (porque no nos sirve el id)
            listaSeries[index] = encuentra;  // Actualizo el objeto dentro de listaSeries
            console.log(listaSeries[index]); 
            await escribeSeries(listaSeries)  // Guardamos el archivo          
        } else {
            console.log('No se encontró el objeto con el ID especificado.');
         }
   
})
   

let existe 
const nota = document.getElementById('nota')
const notasBtn = document.getElementById('notasBtn')

notasBtn.addEventListener('click', ()=> {
    if (!existe) {
        nota.style.display = 'block'
        //nota.type = 'textarea'
        nota.style.height= "200px"
        nota.style.width = "400px"
        nota.innerText = "Notas / Recordatorios: \n coches con conversor: 5-32-62-89-97-98-101" 
        // nota.style.backgroundColor = "transparent"
        nota.style.textAlign = "center"
        nota.style.borderRadius = "10px"
        nota.style.borderColor = "orange"
        nota.style.boxShadow = "10px"
        nota.classList.add("card", "m-4")
        //menus.appendChild(nota)
        existe = true
    }
    else { 
        nota.style.display = 'none'
        existe = false
    }
})