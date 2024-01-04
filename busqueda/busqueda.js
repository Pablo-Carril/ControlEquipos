
const lista = document.getElementById('lista')
const titulo = document.getElementById('titulo')
var tabla = document.getElementById("tabla");
var tbody = tabla.getElementsByTagName("tbody")[0];
const DateTime = luxon.DateTime
let ahora = DateTime.now()

window.addEventListener('load', async ()=> { 
    let datos = await window.electronAPI.leerBusqueda()
     //console.log(datos[0])
    let resultados = datos[0]            //el primer dato del array son los objetos encontrados
    titulo.textContent = datos[1]    //el segundo es el texto buscado o pedido
    titulo.classList.add("ms-2")    //agrego un pequeño margin start de bootstrap

    while (tbody.firstChild) {               //borramos las filas antes de llenar 
        tbody.removeChild(tbody.firstChild);
      }
    for (var i = 0; i < resultados.length; i++) {   //todos los objetos pasados
        var fila = tbody.insertRow()  //  inserta una fila en cada pasada

        var celda1 = fila.insertCell(0)  //creamos las columnas
        var celda2 = fila.insertCell(1)
        var celda3 = fila.insertCell(2)
        var celda4 = fila.insertCell(3)
        var celda5 = fila.insertCell(4)
        var celda6 = fila.insertCell(5)
        var celda7 = fila.insertCell(6)

        let vacio = ""
        let fechaAntes = resultados[i].fecha ? resultados[i].fecha : vacio
        let fechaLuxon = DateTime.fromISO(fechaAntes)      //pasamos fecha a luxon
        let fechaLocal = fechaLuxon.toFormat('dd/MM/yyyy')  //formateamos para invertir el año
        
        celda1.innerHTML = resultados[i].serie ? resultados[i].serie : vacio    //llenamos las columnas de la primer fila
        celda2.innerHTML = fechaLocal              // listaHistorial[i].fecha
        celda3.innerHTML = resultados[i].linea ? resultados[i].linea : vacio
        celda4.innerHTML = resultados[i].coche ? resultados[i].coche : vacio
        celda5.innerHTML = resultados[i].problema ? resultados[i].problema : vacio
        celda6.innerHTML = resultados[i].caso ? resultados[i].caso : vacio
        //const Celda = fila.insertCell(5)
        const button = document.createElement('input')
        button.type = 'button'
        button.id = resultados[i].id  //fila seleccionada la manejamos por id
        if (resultados[i].caso) {       //si tiene número de caso...
          button.value = "⚪" // button.id
          button.style.backgroundColor = "transparent"
          button.style.borderColor = "transparent"
          button.style.textAlign = "center" 
          celda7.appendChild(button);
          
          if (resultados[i].estado == true) {
            button.textAlign = "center"
            const boton = document.getElementById(button.id) 
            boton.value = "✅"    //Marcamos como entregado  
            
          }
          //console.log(fila)
          button.addEventListener('click', async function() {
            const boton = document.getElementById(button.id) 
            if (boton.value === "✅"){
              let consulta = await window.electronAPI.prompt(button.id, "Desea desmarcarlo? ")
              console.log("resultado: " + consulta)
              if (consulta) {  //si es true..
                boton.value = "⚪"
                guardar(button.id, false)
              }    //si no no hace nada
            }
            else {    //si estaba desmarcado...
              boton.value = "✅"    //Marcamos como entregado   
              guardar(button.id, true)    //lo guardamos en la dB. NO en resultados, sino listaSeries de App                      
            }
          });
        } //si no tiene numero de caso no hacer nada..
    }
})

function guardar(id, estado) {
   window.electronAPI.entregado(id, estado) //tiene que ser una invokación a main y que main le diga a app que guarde la dB
   console.log("guarda entregado: " + id)
}