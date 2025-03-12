import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Image, TouchableOpacity, Button, TextInput, FlatList,} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from "react-native-modal";
import * as Location from 'expo-location'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SelectCountry } from 'react-native-element-dropdown';
import Labels from "./Labels";
import { TasksContext } from "./Context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from 'expo-notifications';

export default function Home() {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);	
    const [isModalVisible, setModalVisible] = useState(false);
	const toggleModal = () => {
	  setModalVisible(!isModalVisible);
	};
    const [taskName, setTaskName] = useState('')
    const [taskNotes, setTaskNotes] = useState('')
    const [empTasks, setEmpTasks] = useState(true)
    const [time, setTime] = useState(new Date())
    const [taskDate, setTaskDate] = useState(new Date())
    const [editTaskView, setEditTaskView] = useState(false)
    const [addTaskView, setAddTaskView] = useState(false)
    const {tasks, setTasks} = useContext(TasksContext)
    const {labels} = useContext(TasksContext)
    const {value, setValue} = useContext(TasksContext)
    const {labelName, setLabelName} = useContext(TasksContext)
    const {email, setEmail} = useContext(TasksContext)

    // First, set the handler that will cause the notification
    // // to show the alert
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        }),
    });
    
    // Second, call scheduleNotificationAsync()
    // Notifications.scheduleNotificationAsync({
    //     content: {
    //       title: "Time's up!",
    //       body: 'Change sides!',
    //     },
    //     trigger: {
    //     //   type: SchedulableTriggerInputTypes.TIME_INTERVAL,
    //     //   seconds: 60,
    //     },
    //   });

    const changeDate = (event, date) => {
        const {
            set,
            nativeEvent: {timestamp, utcOffset},
          } = event;
          setTaskDate(date)
    }

    const changeTime = (event, time) => {
        const {
            set,
            nativeEvent: {timestamp, utcOffset},
          } = event;
        setTime(time)
    }

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

    const storeTasks = async(val) => {
        try {
            const jsonValue = JSON.stringify(val)
            await AsyncStorage.setItem(`${email}_tasks_key`, jsonValue)
        } catch (e) {
            console.log(e);
            
        }
    }

    const onTaskSubmit = async() => {
        console.log("task submitted");

        const newTask = {
            name: taskName,
            notes: taskNotes,
            label: labelName
        }
        if (newTask.notes === "") {
            newTask.notes = 'no notes provided'
            setTasks([...tasks, newTask.notes])
        }
        else if(newTask.name === '' && newTask.notes === 'no notes provided' && newTask.label === ''){
            alert('task fields are empty')
            setTasks([])
            return
        }

        setTasks([...tasks, newTask])
        storeTasks([...tasks, newTask])
        setTaskName("")
        setTaskNotes("")
        setLabelName("")
    }
 
    const getTasks = async() => {
        try {
            const jsonValue = await AsyncStorage.getItem(`${email}_tasks_key`);
            console.log('retrieving', tasks);
            return jsonValue != null ? setTasks(JSON.parse(jsonValue)) : setTasks([])

        } catch (e) {
            console.log('error', e);
        }
    }

    useEffect(()=> {
        getTasks()
    }, [])
    

    const onTaskComplete = async(index) => {
        const taskComp = [...tasks]
        taskComp.splice(index, 1)
        setTasks(taskComp)

        try {
            await AsyncStorage.removeItem(`${email}_tasks_key`)
            console.log('removed');
            
        } catch (e) {
            console.log('Error:', e);
               
        }
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
        if(empTasks === true) return <Text style={styles.emptyTaskText}>Add Tasks to get started!</Text>
    }

    const edit = (index) => {
        console.log('bruh');
        
        return (
            <View>
                <Modal isVisible={isModalVisible} onSwipeComplete={()=>setModalVisible(false)}  backdropOpacity={0.4}>
                    <View style={styles.modal}>
                        <Text style={styles.add_task_text}>Edit Task</Text>
                        {/* task name */}
                        <TextInput value={tasks[index].name} onChangeText={setTaskName} 
                            // placeholder={tasks[index].name}
                            style={styles.task_text}
                        />
                        {/* additional notes for the task */}
                        <TextInput value={taskNotes} onChangeText={setTaskNotes}
                            multiline
                            maxLength={1000}
                            placeholder="Task Description/Notes"
                            placeholderTextColor={'grey'}
                            style={styles.task_notes}
                        />
                        {/* Assigning an existing Label to a task */}
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={{marginLeft: 25, alignSelf: 'center', fontSize: 18}}>Labels:</Text>
                            <SelectCountry
                                style={styles.dropdown}
                                selectedTextStyle={styles.selectedTextStyle}
                                maxHeight={200}
                                value={value}
                                data={labels}
                                valueField="value"
                                labelField="lname"
                                onChange={e => {
                                    setValue(e.value);
                                    setLabelName(e.lname);
                                }}
                            />
                            
                        </View>

                        {/* Scheduling tasks */}
                        <View>
                            <Text style={{alignSelf: 'center', fontSize: 18}}>Schedule task on:</Text> 

                            <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10}}>
                                <DateTimePicker 
                                    mode="date"
                                    value={taskDate}
                                    onChange={changeDate}
                                    textColor="black"
                                />
                                <DateTimePicker 
                                    mode="time"
                                    value={time}
                                    onChange={changeTime}
                                />
                                {console.log(taskDate)}
                            </View>
                        </View>

                        {/* Set Reminder */}
                        <View>
                            <Text style={{marginLeft: 25, fontSize: 18}}>Set Reminder: </Text>
                        </View>


                        {/* Discard and saving tasks buttons */}
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

            </View>
        )
    }
    
    return (
        <View style={styles.container}>
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

                    {/* <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                        <View>
                            <Text style={{marginLeft: 15, fontSize: 17, marginBottom: 5}}> {location.name} </Text>
                            <Text style={{marginLeft: 15, fontSize: 17, fontWeight: 'bold', alignSelf: 'center', marginBottom: 5}}>{Math.round(location.main.temp)}°C</Text>
                            <Text style={{marginLeft: 15, marginBottom: 15, alignSelf: 'center', fontSize: 17, fontStyle: 'italic'}}> {location.weather[0].description} </Text>
                        </View>
                        
                        <Image style={{width: 60, height: 60,}} 
                            source={{uri: 'https://openweathermap.org/img/wn/' + location.weather[0].icon + '@2x.png'}} 
                        />    
                    </View> */}
                </View>

                {/* current tasks section */}
                <View style={styles.current_tasks}>
                    <Text style={{alignSelf: 'center', fontSize: 18, marginTop: 10, marginBottom: 10, fontWeight: '600', textDecorationLine: 'underline'}}>Tasks for today</Text>
                    <ScrollView>   
                        {emptyTask()}                
                            <FlatList
                                data={tasks}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({item, index}) => (
                                    <View style={styles.task_cell}>
                                        <MaterialCommunityIcons name='circle-edit-outline' size={30} color={'orange'} 
                                        style={{ marginRight: 20, alignSelf :'center'}} 
                                        onPress={() => {
                                            setEditTaskView(true)
                                            setAddTaskView(false)
                                            toggleModal()                                    
                                        }}/>
                                        {editTaskView && edit(index)}
                                        <View>
                                            <Text style={{fontSize: 17, fontWeight: '500'}}>{item.name}</Text>
                                            <Text style={{color: 'grey'}}>{item.notes}</Text>
                                            <Text>{item.label}</Text>
                                        </View>
                                        <MaterialCommunityIcons name='check-circle-outline' size={35} color={'green'} 
                                        style={{ marginRight: 5, alignSelf :'center', }} 
                                        onPress={() => onTaskComplete(index)}
                                        />
                                    </View>
                                )}
                            />
                    </ScrollView>
                </View>
                {/* completed tasks section */}
                {/* <View style={styles.completed_tasks}>
                    <Text style={{alignSelf: 'center', fontSize: 18, marginTop: 10, marginBottom: 10, fontWeight: '600', textDecorationLine: 'underline'}}>Completed tasks</Text>
                </View> */}

                {/* Add Tasks */}
                <TouchableOpacity style={styles.add_tasks}
                    onPress={() => {
                        setAddTaskView(true)
                        setEditTaskView(false)
                        toggleModal()
                    }}>
                    <Text style={{margin: 10, fontSize: 18.5, fontStyle: 'italic', fontWeight: 'bold'}}>Add Task</Text>                   
            
                    {addTaskView && 
                    <View>
                        <Modal isVisible={isModalVisible} onSwipeComplete={()=>setModalVisible(false)}  backdropOpacity={0.4}>
                            <View style={styles.modal}>
                                {/* Add tasks heading */}
                                <Text style={styles.add_task_text}>Add Task</Text>
                                {/* task name */}
                                <TextInput value={taskName} onChangeText={setTaskName} 
                                    placeholder="What would you like to accomplish?"
                                    placeholderTextColor={'grey'}
                                    style={styles.task_text}
                                />
                                {/* additional notes for the task */}
                                <TextInput value={taskNotes} onChangeText={setTaskNotes}
                                    multiline
                                    maxLength={1000}
                                    placeholder="Task Description/Notes"
                                    placeholderTextColor={'grey'}
                                    style={styles.task_notes}
                                />
                                {/* Assigning an existing Label to a task */}
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Text style={{marginLeft: 25, alignSelf: 'center', fontSize: 18}}>Labels:</Text>
                                    {labels.length === 0 ? (
                                        <View>
                                            <SelectCountry
                                                style={styles.dropdown}
                                                selectedTextStyle={styles.selectedTextStyle}
                                                maxHeight={200}
                                                value={value}
                                                data={labels}
                                                valueField="value"
                                                // labelField="lname"
                                                onChange={e => {
                                                    setValue(e.value);
                                                    setLabelName(e.lname);
                                                }}
                                                placeholder="Labels are not available"
                                                placeholderStyle={{marginLeft: 5, textAlign: 'center'}}
                                                disable
                                            />
                                        </View>
                                        ) : (
                                        <SelectCountry
                                            style={styles.dropdown}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            maxHeight={200}
                                            value={value}
                                            data={labels}
                                            // valueField="value"
                                            labelField="lname"
                                            onChange={e => {
                                                setValue(e.value);
                                                setLabelName(e.lname);
                                            }}
                                            placeholder="Select Label"
                                        />
                                    )}
                                  

                                </View>

                                {/* Scheduling tasks */}
                                <View>
                                    <Text style={{alignSelf: 'center', fontSize: 18}}>Schedule task on:</Text> 

                                    <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10}}>
                                        <DateTimePicker 
                                            mode="date"
                                            value={taskDate}
                                            onChange={changeDate}
                                            textColor="black"
                                        />
                                        <DateTimePicker 
                                            mode="time"
                                            value={time}
                                            onChange={changeTime}
                                        />
                                        {/* {console.log(taskDate)} */}
                                    </View>
                                </View>

                                {/* Set Reminder */}
                                <View>
                                    <Text style={{marginLeft: 25, fontSize: 18}}>Set Reminder: </Text>
                                </View>


                                {/* Discard and saving tasks buttons */}
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
                    </View>
                    }
                
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
        borderWidth: 0.5,
        borderRadius: 20,
        marginTop: 15,
        marginBottom: 10,
        height: 430
    },
    completed_tasks:{
        borderWidth: 1,
        borderRadius: 20,
    },
    add_tasks: {
        // margin: 5, 
        alignItems:'center',
        borderWidth: 2,
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
        margin: 10,
        padding: 10,
        borderWidth: 1,
        borderRadius: 20
    },
    modal: {
        width: 370, 
		height: 600, 
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
    },
    dropdown: {
        margin: 16,
        height: 50,
        width: 170,
        backgroundColor: '#EEEEEE',
        borderRadius: 22,
        paddingHorizontal: 8,
        
    },
    selectedTextStyle: {
        fontSize: 16,
        marginLeft: 8,
    },

});
