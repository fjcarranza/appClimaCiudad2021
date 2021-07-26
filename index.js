
require('dotenv').config()
//const { clear } = require('console');
const {inquirerMenu, leerInput, pausa, listadorCiudades, confirmar}=require('./helpers/inquirer');
const Busquedas = require('./model/busquedas');


const main = async()=>{
    const busquedas= new Busquedas();
    let opt=0;
    
    do {
        opt=await inquirerMenu();
        switch (opt) {
            case 1:
                const busqueda=await leerInput("Ciudad: ");
                const ciudades=await busquedas.ciudad(busqueda);
                const id=await listadorCiudades(ciudades);
                if(id==='0'){
                    continue
                }
                const lugSelec= ciudades.find(l=>l.id===id);
                const climaCiudad= await busquedas.climaActual(lugSelec.lat, lugSelec.lng);
                busquedas.agregarHistorial(lugSelec.nombre);
                busquedas.guardarDB();
                console.clear();
                console.log('________________________________________________________\n'.green);
                console.log(`            Informacion de ${busqueda}  `.white);
                console.log('________________________________________________________\n'.green);
                console.log(`   ${"Ciudad:".green}____________ ${lugSelec.nombre}`);
                console.log(`   ${"Lat:".green}_______________ ${lugSelec.lat}`);
                console.log(`   ${"Lng:".green}_______________ ${lugSelec.lng}`);
                console.log(`   ${"Descrición:".green}________ ${climaCiudad.desc}`);
                console.log(`   ${"Temperatura:".green}_______ ${climaCiudad.temp}`);
                console.log(`   ${"Minima:".green}____________ ${climaCiudad.min}`);
                console.log(`   ${"Maxima:".green}____________ ${climaCiudad.max}`);
                
                break;
            case 2:
                busquedas.listaHistorialCap();
                break;
            case 3:
                console.clear();
                const conf=await confirmar("Quiere cerrar la Aplicación?");
                if (conf != true) opt=5;
                break;        
        }
        
        if(opt !== 3 & opt !== 5) await pausa();
    } while (opt !== 3);
    
    

    
}


main();