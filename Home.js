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
import UpcomingTasks from "./UpcomingTasks";

export default function Home({navigation}) {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);	
    const [isModalVisible, setModalVisible] = useState(false);
	const toggleModal = () => {
	  setModalVisible(!isModalVisible);
	};
    const [taskName, setTaskName] = useState('')
    const [taskNotes, setTaskNotes] = useState('')
    const [empTasks, setEmpTasks] = useState(true)
    const [editTaskView, setEditTaskView] = useState(false)
    const [addTaskView, setAddTaskView] = useState(false)
    const [select1, setSelect1] = useState(true)
    const [select2, setSelect2] = useState(true)
    const [select3, setSelect3] = useState(true)
    const [reminder, setReminder] = useState('')
    const toggleSelect1 = () => {
        setSelect1(!select1)
    } 
    const toggleSelect2 = () => {
        setSelect2(!select2)
    }
    const toggleSelect3 = () => {
        setSelect3(!select3)
    }
    const {time, setTime} = useContext(TasksContext)
    const {taskDate, setTaskDate} = useContext(TasksContext)
    const {tasks, setTasks} = useContext(TasksContext)
    const {labels} = useContext(TasksContext)
    const {value, setValue} = useContext(TasksContext)
    const {labelName, setLabelName} = useContext(TasksContext)
    const {email, setEmail} = useContext(TasksContext)
    const {upTasks, setUpTasks} = useContext(TasksContext)

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        }),
    });

    const handleReminders = (name, date) => {
        if(select1 === false && select2 === false && select3 === false) {
            Notifications.cancelAllScheduledNotificationsAsync()
            return
        }
        else if(reminder == '1 day before') {
            const oneDayBefore = new Date(taskDate.getTime())
            oneDayBefore.setDate(taskDate.getDate() - 1)
            oneDayBefore.setTime(time.getTime())
            
            Notifications.cancelAllScheduledNotificationsAsync()
            Notifications.scheduleNotificationAsync({
                content: {
                  title: `Reminder for Task ${name} on ${date}`,
                  body: 'This is your scheduled reminder',
                },
                trigger: {
                    type: 'date',
                    date: oneDayBefore,
                }
            });
            
                        
        }
        else if(reminder == '3 days before') {
            const threeDaysBefore = new Date(taskDate.getTime())
            threeDaysBefore.setDate(taskDate.getDate() - 3)
            threeDaysBefore.setTime(time.getTime())

            Notifications.cancelAllScheduledNotificationsAsync()
            Notifications.scheduleNotificationAsync({
                content: {
                  title: `Reminder for Task ${name} on ${date}`,
                  body: 'This is your scheduled reminder',
                },
                trigger: {
                    type: 'date',
                    date: threeDaysBefore,
                }
            });
        }
        else if(reminder == '1 week before') {
            const oneWeekBefore = new Date(taskDate.getTime())
            oneWeekBefore.setDate(taskDate.getDate() - 7)
            console.log(oneWeekBefore.toLocaleDateString([]).split(', ')[0]);
            oneWeekBefore.setTime(time.getTime())

            Notifications.cancelAllScheduledNotificationsAsync()
            Notifications.scheduleNotificationAsync({
                content: {
                  title: `Reminder for ${name} on ${date}`,
                  body: 'This is your scheduled reminder',
                },
                trigger: {
                    type: 'date',
                    date: oneWeekBefore,
                }
            });
        }
    }

    //  to check that all the notifications are scheduled correctly
    const checkNotifications = async() => {
        const allNotifications = await Notifications.getAllScheduledNotificationsAsync()
        console.log(allNotifications);
    }

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
        
        const newTask = {
            name: taskName,
            notes: taskNotes,
            label: labelName,
            date: taskDate.toLocaleDateString([]).split(', ')[0], // selected date of the task
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
        
        if(newTask.date === new Date().toLocaleDateString([]).split(', ')[0]) {
            setTasks([...tasks, newTask])
            storeTasks([...tasks, newTask])
        }
        else {
            console.log('dat eis ahead');
            setUpTasks([...upTasks, newTask])
        }
        // setTasks([...tasks, newTask])
        setTaskName("")
        setTaskNotes("")
        setLabelName("")
        setTaskDate(new Date())
        // scheduleNotif(newTask.date)
        handleReminders(newTask.name, newTask.date)
        checkNotifications()
    }
 
    const getTasks = async() => {
        try {
            const jsonValue = await AsyncStorage.getItem(`${email}_tasks_key`);
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
    
    
    // filtering tasks for today only and then using this in the flatlist to render todays tasks
    const tasksForToday = tasks.filter(tasks=> tasks.date === new Date().toLocaleDateString([]).split(', ')[0])
    
    const emptyTask = () => {
        if(empTasks === true) {
            return (
                <Text style={styles.emptyTaskText}>Add Tasks to get started!</Text>
            )
        }
        else if(tasksForToday.length === 0){
            return (
                <Text style={styles.emptyTaskText}>No tasks for today</Text>
            )
        }
    }
    return (
        <View style={styles.container}>
            <SafeAreaView>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={styles.welcome_text}>Welcome!</Text>
                    <MaterialCommunityIcons name='clipboard-text-clock' color='green' size={35} style={{marginTop: 13}}
                    onPress={()=> {
                        navigation.navigate('UpcomingTasks')
                    }}/>
                </View>
                {/* current weather box */}
                <View style={styles.weather}>
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{alignSelf: 'center', fontSize: 18, marginTop: 10, marginBottom: 10, fontWeight: '600', textDecorationLine: 'underline'}}>Current weather</Text>
                    </View>

                    {location &&
                        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                            <View>
                                <Text style={{marginLeft: 15, fontSize: 17, marginBottom: 5}}> {location.name} </Text>
                                <Text style={{marginLeft: 15, fontSize: 17, fontWeight: 'bold', alignSelf: 'center', marginBottom: 5}}>{Math.round(location.main.temp)}°C</Text>
                                <Text style={{marginLeft: 15, marginBottom: 15, alignSelf: 'center', fontSize: 17, fontStyle: 'italic'}}> {location.weather[0].description} </Text>
                            </View>
                            
                            <Image style={{width: 60, height: 60,}} 
                                source={{uri: 'https://openweathermap.org/img/wn/' + location.weather[0].icon + '@2x.png'}} 
                            />    
                        </View>}
                </View>

                {/* current tasks section */}
                <View style={styles.current_tasks}>
                    <Text style={{alignSelf: 'center', fontSize: 18, marginTop: 10, marginBottom: 10, fontWeight: '600', textDecorationLine: 'underline'}}>Tasks for today</Text>
                    <ScrollView>   
                        {emptyTask()}             
                            <FlatList
                                data={tasksForToday}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({item, index}) => (
                                    <TouchableOpacity style={styles.task_cell}>
                                        <MaterialCommunityIcons name='circle-edit-outline' size={30} color={'orange'} 
                                        style={{marginRight: 20, alignSelf :'center'}} 
                                        onPress={() => {
                                            setEditTaskView(true)
                                            setAddTaskView(false)
                                            toggleModal()                                    
                                        }}/>
                                        
                                        {/* {editTaskView && edit(index)} */}
                                        <View style={{flex: 1}}>
                                            <Text style={{fontSize: 17, fontWeight: '500', flexWrap: 'wrap' }}>{item.name}</Text>
                                            <Text style={{color: 'grey', flexWrap: 'wrap' }}>{item.notes}</Text>
                                            <Text>{item.label}</Text>
                                        </View>
                                        
                                        <MaterialCommunityIcons name='check-circle-outline' size={35} color={'green'} 
                                        style={{alignSelf :'center'}} 
                                        onPress={() => onTaskComplete(index)}
                                        />
                                    </TouchableOpacity>
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
                    <Text style={{margin: 10, fontSize: 20, fontWeight: 'bold'}}>Add Task</Text>                   
            
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
                                <View style={{borderWidth: 1, marginLeft: 25, marginRight: 25, padding: 10, borderRadius: 30, backgroundColor: 'white'}}>
                                    <Text style={{alignSelf: 'center', fontSize: 18}}>Schedule task on:</Text> 
                                    <View style={{flexDirection: 'row', marginTop: 10, justifyContent: 'center'}}>
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
                                        
                                    </View>
                                </View>

                                {/* Set Reminder */}
                                <View style={{marginTop: 10}}>
                                    <Text style={{marginLeft: 25, fontSize: 18, alignSelf: 'center'}}>Set Reminder: </Text>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 7}}>
                                        <TouchableOpacity style={ select1 ? styles.onSelection : styles.noSelection} 
                                        onPress={()=> {
                                            toggleSelect1()
                                            setSelect2(false)
                                            setSelect3(false)
                                            setReminder('1 day before')
                                        }}>
                                            <Text style={{alignSelf: 'center'}}>1 day before</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={select2 ? styles.onSelection : styles.noSelection}
                                         onPress={() => {
                                            toggleSelect2()
                                            setSelect1(false)
                                            setSelect3(false)
                                            setReminder('3 days before')
                                         }}>
                                            <Text>3 days before</Text>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity style={select3 ? styles.onSelection : styles.noSelection} 
                                        onPress={() => {
                                            toggleSelect3()
                                            setSelect1(false)
                                            setSelect2(false)
                                            setReminder('1 week before')
                                        }}>
                                            <Text>1 week before</Text>
                                        </TouchableOpacity>
                                    </View>
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
        backgroundColor: 'aliceblue',
        padding: 15,
    },
    welcome_text: {
        fontWeight: 'bold',
        fontSize: 33,
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
        alignItems:'center',
        borderWidth: 2,
        borderRadius: 20,
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
        // justifyContent: 'space-between',
        margin: 10,
        padding: 10,
        borderWidth: 1,
        borderRadius: 20,
    },
    modal: {
        width: 370, 
		height: 650, 
		backgroundColor: 'aliceblue', 
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
    onSelection: {
        borderWidth: 2, 
        padding: 7, 
        borderRadius: 15, 
        borderColor: 'orange',
    },
    noSelection: {
        borderWidth: 1, 
        padding: 7, 
        borderRadius: 15
    }

});