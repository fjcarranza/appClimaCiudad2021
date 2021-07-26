const fs = require('fs');
require('dotenv').config();
const axios = require('axios');
class Busquedas{
    
    rutaArch='./db/histo.json'
    historial=[];
    
    constructor(){
        // leer DB si Existe
        this.leerDB();
    }
    
    get paramsMapBox(){
        return {
            access_token: process.env.MAPBOX_KEY,
            limit: 5,
            language: 'es'
        }
    }
    
    get paramsOpenWM(){
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es',
        }
    }

    async ciudad(lugar=''){
        try {
            const instance=axios.create({
                baseURL:`https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json?`,
                params: this.paramsMapBox
            });
            const resp=await instance.get();
          
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name_es,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }));

            
        } catch (error) {
            return [];
        }
    }
    
    
        
    async climaActual(lat, lon){
        try {
            const instance=axios.create({
                baseURL:`https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsOpenWM, lat, lon}
               /* 
                params:{
                    appid: process.env.OPENWEATHER_KEY,
                    units: 'metric',
                    lang: 'es',
                    lat,
                    lon
                }
                */
            })
            const resp=await instance.get();
            const {weather, main}=resp.data;
            
            return {
                    desc: weather[0].description,
                    temp:main.temp,
                    min: main.temp_min,
                    max: main.temp_max,
            }

        } catch (error) {
            console.log("No se encontro la ciudad... ".red);
            return null;
        }
    }
    agregarHistorial(ciudad){
        if(this.historial.includes(ciudad.toLocaleLowerCase())){
            return;
        }
        this.historial.unshift(ciudad.toLocaleLowerCase());
        this.historial=this.historial.splice(0, 5);
        this.guardarDB();
    }

    guardarDB(){
        const payload={
            historial: this.historial
        };
        
        fs.writeFileSync(this.rutaArch, JSON.stringify(payload));
    }
    
    leerDB(){
        if (!fs.existsSync(this.rutaArch)){
            return;
        }
        
        const info = fs.readFileSync( this.rutaArch, {encoding:'utf-8'});
        const data=JSON.parse(info);
        this.historial=data.historial;
    }

    listaHistorial(){
        this.historial.forEach(ciudad => {
            console.log(ciudad);
            
        });
    }
    listaHistorialCap(){
        
        this.historial.forEach((ciudad, i) =>{
            //console.log(ciudad.replace(/\b\w/g, l => l.toUpperCase()));
            const id=i+1;
            console.log(`${id} - `.green + ciudad.toLowerCase()
            .trim()
            .split(' ')
            .map( v => v[0].toUpperCase() + v.substr(1) )
            .join(' '));
        })
    }
}



module.exports=Busquedas;