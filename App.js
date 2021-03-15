import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Picker, Button, ImageBackground } from 'react-native';

const fondo = { uri: "https://image.freepik.com/foto-gratis/banderas-diferentes-paises-sobre-fondo-amarillo_23-2148293449.jpg" };

export default function App() {

  const [ciudad, setCiudad] = useState([]);
  const [paises, setPaises] = useState([]);
  const [paisActual, setPaiActual] = useState('');
  const [ciudadesPicker, setCiudadesPicker] = useState([]);
  const [ciudadActual, setCiudadActual] = useState('');
  const [Resultado, setResultado] = useState('');
  const [Zhoraria, setZhoraria] = useState('');
  const [Pais, setPais] = useState('');
  const [MonedaActual, setMonedaActual] = useState('');

  let CiudadesArray = [];
  useEffect(() => {
    var Data = require("./city.list.json");
    
    Data.forEach(element => {
      CiudadesArray.push(element.name);
    });
    setCiudad(CiudadesArray);
    //console.log(CiudadesArray)
  }, []);


   //promise para carga de paises
   let countriesArray = [];
   useEffect(()=> {
     fetch('https://countriesnow.space/api/v0.1/countries/positions')
     .then(response => response.json())
     .then(data => {
       let countryInfo =data.data;
       //console.log("JSON: " + countryInfo.length)
       countryInfo.forEach(element => {
         countriesArray.push(element.name);
       });
       setPaises(countriesArray);
       //console.log(countryInfo[1].name);
     });
     
   }, []); 

   let arrPickerItems  = [];
    paises.map((item, index)=>{
      if(item != undefined){
        arrPickerItems.push(<Picker.Item label={item} value={item} key={index}/>)
      }
    });


  return (
    <ImageBackground source={fondo} style={styles.image}>
      <View style={styles.container}>
      {/*Titulo*/}
      <Text style={styles.titulo}>Información de Ciudades  </Text>
      <View style={styles.pickers}>
          <Text style={styles.titulos}> Paises:</Text>
          <Picker 
              style={styles.paisesPicker}
              selectedValue={paisActual}
              onValueChange={(itemValue, itemIndex) => {
                setPaiActual(itemValue)
                let ciudad = {"country": itemValue}
                fetch('https://countriesnow.space/api/v0.1/countries/cities', 
                { 
                  method: "post", 
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(ciudad)
                })
                .then(response => response.json())
                .then(data => {
                  let arrPickerCiudades  = [];
                  let ciudadesInfo = data.data;
                  ciudadesInfo.map((item, index)=>{
                    if(item != undefined){
                      arrPickerCiudades.push(<Picker.Item label={item} value={item} key={index}/>)
                    }
                  });
                  setCiudadesPicker(arrPickerCiudades);
                });

              }}
            >
            {arrPickerItems}
            </Picker>
            
            {/* Picker de ciudades */}
            <Text style={styles.titulos}> Ciudades:</Text>
            <Picker 
              style={styles.ciudadesPicker}
              selectedValue={ciudadActual}
              onValueChange={(itemValue, itemIndex) => {
                setCiudadActual(itemValue)
              }}
              
            >
              {ciudadesPicker}
            </Picker>
        </View> 

        <View style={[{ width: '40%', height: 40 , backgroundColor: "blue", marginTop:100, marginBottom:100}]}>
          <Button 
                  color="blue"
                  title= 'Ver Info.'
                  onPress = {() => {
                    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${ciudadActual}&appid=0de0bf05a6cd8f607382843452286891`;
                  

                    let Resultado = ' ';
                    let Zhoraria = ' ';
                    let Pais = ' ';
                  
                    

                    fetch(URL)
                      .then(response => response.json())
                      .then(datos =>{
                        Resultado = datos;
                        Zhoraria = JSON.stringify(datos.timezone)
                        Resultado = JSON.stringify(datos.main.temp)
                        Pais = JSON.stringify(datos.sys.country)
                        setResultado(Resultado + '°C')
                        setZhoraria(Zhoraria)
                        Pais = Pais.slice(1,-1)
                        setPais(Pais)
                        console.log(Resultado)
                        console.log(Zhoraria)
                        console.log(Pais)
                      })

                    
                      
                  
                  }}
                />
        </View>
                

          {/*Resultado*/}
          <View style={styles.resultado}>
            <Text style={styles.letras}> Temperatura: {Resultado} </Text>
            <Text style={styles.letras}> Zona Horaria: {Zhoraria} </Text>
          </View>
        </View>
    </ImageBackground>
  );
    
}

const styles = StyleSheet.create({
  countriesPicker:{
    height: 50,
    width: '60%',
    backgroundColor: '#aaa',
    borderBottomColor: '#bbb',
    borderBottomWidth: 2
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column' 
  },

  image:{
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: "cover",
    flex:1
  },

  pickers:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width:'90%',
    marginTop: 40
  },

  paisesPicker:{
    height: 50,
    width: '25%',
    backgroundColor: 'black',
    marginRight: 80,
    color:'white',
    fontSize:15,
    fontWeight: 'bold',
    paddingLeft:20,
  

  },

  ciudadesPicker:{
    height: 50,
    width: '25%',
    backgroundColor: 'black',
    color:'white',
    fontSize:15,
    fontWeight: 'bold',
    paddingLeft:20,

  },

  resultado:{
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 3,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:3
    

  },

  letras:{
    fontSize: 15,
    fontFamily: 'Abadi',
    fontWeight: 'bold',
    borderRadius:10,
    color: '#000',
    backgroundColor: 'white',
    padding: 10

  },

  titulos:{
    backgroundColor: 'white',
    color:'black',
    borderRadius: 3,
    fontWeight: 'bold',
    fontSize:15,
    marginRight: 20,
    padding:10,
    paddingBottom:25
  },
  titulo:{
    fontSize: 15,
    fontFamily:'Goudy Stout',
    fontWeight: 'bold',
    marginBottom: 100,
    backgroundColor: 'white',
    borderWidth:20,
    borderLeftColor: 'white',
    borderRightColor:'white',
    bordercolor: 'white',
    borderTopColor: 'blue',
    borderBottomColor: 'blue',
    color: 'black',
    padding: 20
  },
});