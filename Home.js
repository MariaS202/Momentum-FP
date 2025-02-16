import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Image, TouchableOpacity, Button, TextInput, FlatList,} from "react-native";
// import { Cell, Section, TableView } from 'react-native-tableview-simple';
import Modal from "react-native-modal";
import * as Location from 'expo-location'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Home() {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);	
    const [isModalVisible, setModalVisible] = useState(false);
	const toggleModal = () => {
	  setModalVisible(!isModalVisible);
	};
    const [taskName, setTaskName] = useState('')
    const [taskNotes, setTaskNotes] = useState('')
    const [tasks, setTasks] = useState([])
    const [empTasks, setEmpTasks] = useState(true)
    

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
                // console.log(json);
                setLocation(json)
            })
            .catch((error)=> console.log(error))
            
        })();
    }, [])

    const onTaskSubmit = () => {
        console.log("task submitted");

        const newTask = {
            name: taskName,
            notes: taskNotes
        }
        if (newTask.notes == "") {
            newTask.notes = 'no notes provided'
            setTasks([...tasks, newTask.notes])
        }
        
        setTasks([...tasks, newTask])
        setTaskName("")
        setTaskNotes("")

    }
    
    const onTaskComplete = (index) => {
        const taskDelete = [...tasks]
        taskDelete.splice(index, 1)
        setTasks(taskDelete)
    }

    const isTodaysTaskEmpty = () => {
        if (tasks.length === 0) {
            setEmpTasks(true)
        } 
        else {
            setEmpTasks(false)
        }
    }
    // to check if the task list is empty with tasks as its dependency
    useEffect(() => {
        isTodaysTaskEmpty();
    }, [tasks])
    
    const emptyTask = () => {
        if(empTasks === true) return (<Text style={styles.emptyTaskText}>Add Tasks to get started!</Text>)
    }

    return (
        <View style={[styles.container]}>
            <SafeAreaView>
                
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={styles.welcome_text}>Welcome Maria!</Text>
                    <MaterialCommunityIcons name='bell' color='black' size={30} style={{marginTop: 13}}/>
                </View>
                {/* current weather box */}
                <View style={styles.weather}>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{alignSelf: 'center', fontSize: 18, marginTop: 10, marginBottom: 10, fontWeight: '600', textDecorationLine: 'underline'}}>Current weather</Text>
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                        <View>
                            <Text style={{marginLeft: 15, fontSize: 17, marginBottom: 5}}> {location.name} </Text>
                            <Text style={{marginLeft: 15, fontSize: 17, fontWeight: 'bold', alignSelf: 'center', marginBottom: 5}}>{Math.round(location.main.temp)}°C</Text>
                            <Text style={{marginLeft: 15, marginBottom: 15, alignSelf: 'center', fontSize: 17, fontStyle: 'italic'}}> {location.weather[0].description} </Text>
                        </View>
                        
                        <Image style={{width: 60, height: 60,}} 
                            source={{uri: 'https://openweathermap.org/img/wn/' + location.weather[0].icon + '@2x.png'}} 
                        />    
                    </View>
                </View>

                {/* current tasks section */}
                <View style={[styles.current_tasks]}>
                    <Text style={{alignSelf: 'center', fontSize: 18, marginTop: 10, marginBottom: 10, fontWeight: '600', textDecorationLine: 'underline'}}>Tasks for today</Text>
                    <ScrollView>   
                        {emptyTask()}
                        <TouchableOpacity>
                            <FlatList 
                                data={tasks}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({item, index}) => (
                                    <View style={styles.task_cell}>
                                        <View>
                                            <Text style={{fontSize: 17, fontWeight: '500'}}>{item.name}</Text>
                                            <Text style={{color: 'grey'}}>{item.notes}</Text>
                                        </View>
                                        <MaterialCommunityIcons name='check-bold' size={25} color={'green'} 
                                        style={{marginLeft: 20, marginRight: 5}} 
                                        onPress={() => onTaskComplete(index)}
                                        />
                                    </View>
                                )}
                            />
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                {/* completed tasks section */}
                {/* <View style={styles.completed_tasks}>
                    <Text style={{alignSelf: 'center', fontSize: 18, marginTop: 10, marginBottom: 10, fontWeight: '600', textDecorationLine: 'underline'}}>Completed tasks</Text>
                </View> */}

                {/* Add Tasks */}
                <TouchableOpacity onPress={toggleModal} style={styles.add_tasks}>
                    <Text style={{margin: 10, fontSize: 18.5, fontStyle: 'italic', fontWeight: 'bold'}}>Add Task</Text>
                    
                    <Modal isVisible={isModalVisible} onSwipeComplete={()=>setModalVisible(false)}  backdropOpacity={0.4}>
                        <View style={styles.modal}>
                            <Text style={styles.add_task_text}>Add Task</Text>
                            <TextInput value={taskName} onChangeText={setTaskName} 
                                placeholder="What would you like to accomplish?"
                                placeholderTextColor={'grey'}
                                style={styles.task_text}
                            />
                            <TextInput value={taskNotes} onChangeText={setTaskNotes}
                                multiline
                                maxLength={1000}
                                placeholder="Task Description/Notes"
                                placeholderTextColor={'grey'}
                                style={styles.task_notes}
                            />
                            {/* <Text style={{marginLeft: 25, marginTop: 25, fontSize:16}}>Reminder</Text>
                            <Text style={{marginLeft: 25, marginTop: 25, fontSize:16}}>Due</Text>
                            <Text style={{marginLeft: 25, marginTop: 25, fontSize:16}}>Labels</Text>
                            <Text style={{marginLeft: 25, marginTop: 25, fontSize:16}}>Repeat</Text> */}

                            <View style={{flexDirection: 'row', alignSelf: 'center', marginTop: 20}}>
                                <Button title="Discard Task" color={'black'} onPress={toggleModal}/>
                                <Button title="Save Task" color={'black'} 
                                    onPress={()=> {
                                        onTaskSubmit()
                                        toggleModal()
                                    }}/>
                            </View>
                            
                        </View>
                    </Modal>
                
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 15,
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
        marginTop: 15,
        marginBottom: 10,
        height: 370
    },
    completed_tasks:{
        borderWidth: 1,
        borderRadius: 20,
    },
    add_tasks: {
        margin: 10, 
        width: 130,
        alignItems:'center',
        borderWidth: 1,
        borderRadius: 20,
        alignSelf: 'flex-end'
    },
    add_task_text: {
        fontWeight: 'bold',
        fontSize: 25,
        marginTop: 25,
        marginLeft: 25,
    },
    task_text: {
        marginLeft: 25,
        marginTop: 20,
        marginRight: 25,
        backgroundColor: 'lightgrey',
        padding: 15,
        fontSize: 16,
        borderRadius: 20,
    },
    task_notes: {
        marginLeft: 25,
        marginTop: 20,
        marginRight: 25,
        backgroundColor: 'lightgrey',
        padding: 15,
        fontSize: 16,
        borderRadius: 20,
        height: 150
    },
    task_cell: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        margin: 10,
        padding: 10,
        borderWidth: 1,
        borderRadius: 20
    },
    modal: {
        width: 350, 
		height: 400, 
		backgroundColor: 'white', 
		borderRadius: 20, 
        alignSelf: 'center'
    },
    emptyTaskText: {
        fontSize: 22,
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 35,
        color: 'grey'
    }

});
