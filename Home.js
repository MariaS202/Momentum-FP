import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Image, TouchableOpacity, Button, TextInput,} from "react-native";
import Modal from "react-native-modal";
import * as Location from 'expo-location'
export default function Home() {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);	
	// const [cImperial, setCurrentImperial] = useState(['temp_c', 'feelslike_c', 'mintemp_c', 'maxtemp_c'])
    const [isModalVisible, setModalVisible] = useState(false);
	const toggleModal = () => {
	  setModalVisible(!isModalVisible);
	};

    // OpenWeather API for current weather
    useEffect(()=>{
        (async() => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if(status !== 'granted') {
                setErrorMsg('Permission not granted')
                return
            }
            
            let loc = await Location.getCurrentPositionAsync({});
    
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&appid=caa3d06c2d8e6913acc8986891ce008b&units=metric`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
            })
            .then((response)=>response.json())
            .then((json)=> {
                console.log(json);
                setLocation(json)
            })
            .catch((error)=> console.log(error))
            
        })();
    }, [])

    if(errorMsg !== null) {
		return (
			<View style={[styles.container, {justifyContent: 'center',}]}>
			<Text style={{fontSize: 20, marginTop: 150}}>There has been an error: {errorMsg}</Text>
		  </View>
		);
	}
    
    return (
        <ScrollView style={styles.container}>
            <SafeAreaView>
                <Text style={styles.welcome_text}>Welcome Maria!</Text>
                {/* current weather box */}
                <View style={styles.weather}>
                    <Text style={{margin: 10}}>Current weather!</Text>
                    {/* <Text> {location.name} </Text>
                    <Text>{Math.round(location.main.temp)}°C</Text>
                    <Text> {location.weather[0].description} </Text>
                    <Image style={{width: 50, height: 50}} 
						source={{uri: 'https://openweathermap.org/img/wn/' + location.weather[0].icon + '@2x.png'}} 
					/>     */}
                </View>

                {/* current tasks section */}
                <View style={styles.current_tasks}>
                    <Text style={{margin: 10}}>Tasks for today!</Text>
                </View>

                {/* completed tasks section */}
                <View style={styles.completed_tasks}>
                    <Text style={{margin: 10}}>Completed tasks</Text>
                </View>

                <TouchableOpacity onPress={toggleModal} style={styles.add_tasks}>
                    <Modal isVisible={isModalVisible} onSwipeComplete={()=>setModalVisible(false)} avoidKeyboard={true} backdropOpacity={0.5}>
                        <View style={styles.mod}>
                            <Text>Modal open</Text>
                            <Button title="hide" onPress={toggleModal}/>
                        </View>
                    </Modal>
                </TouchableOpacity>
            </SafeAreaView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20
    },
    welcome_text: {
        fontWeight: 'bold',
        fontSize: 30,
        marginTop: 10,
        marginBottom: 20
    },
    weather: {
        borderWidth: 1,
        borderRadius: 20,
    },
    current_tasks: {
        borderWidth: 1,
        borderRadius: 20,
        marginTop:10,
        marginBottom:10,
        alignItems: 'center'
    },
    completed_tasks:{
        borderWidth: 1,
        borderRadius: 20,
        alignItems: 'center'
    },
    add_tasks: {
        borderWidth:1,
        margin:20,
        padding:40
    },
    mod: {
        width: 350, 
		height: 550, 
		backgroundColor: 'white', 
		borderRadius: 30, 
		alignItems: 'center'
    }

});