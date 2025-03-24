import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Image, TouchableOpacity, Button, TextInput, FlatList, Touchable,} from "react-native";
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
    const [editing, setEditing] = useState(false)
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
    // filtering tasks for today
    const tasksForToday = tasks.filter(tasks=> tasks.date === new Date().toLocaleDateString())

    // Notifications and Reminders
    useEffect(() => {
        const getNotificationPermisson = async() => {
            const settings = await Notifications.getPermissionsAsync();
            // console.log(settings)
        }
        const requestNotificationPermission = async() => {
            const {status} = await Notifications.requestPermissionsAsync()
            if(status === 'granted'){
                // console.log(status);
            } 
            else {
                // console.log('not granted');
            }
        }
        getNotificationPermisson();
        requestNotificationPermission()
    }, [])

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
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
            const {status} = await Location.requestForegroundPermissionsAsync();
            if(status !== 'granted') {
                setErrorMsg('Permission not granted')
                return
            }
            
            const loc = await Location.getCurrentPositionAsync({});
    
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&appid=caa3d06c2d8e6913acc8986891ce008b&units=metric`, {
            method: 'GET',
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
            date: taskDate.toLocaleDateString(), // selected date of the task
        }
        
        if (newTask.notes === "") {
            newTask.notes = 'no notes provided'
            setTasks([...tasks, newTask.notes])
        }

        if(newTask.name === "" && newTask.notes === 'no notes provided' && newTask.label === ""){
            return null
        }
        if(newTask.label !== "" && newTask.name === "" && newTask.notes === 'no notes provided') return 
        
        if(newTask.date > new Date().toLocaleDateString()) {
            setUpTasks([...upTasks, newTask])            
        }
        setTasks([...tasks, newTask])
        storeTasks([...tasks, newTask]) 
        setTaskName("")
        setTaskNotes("")
        setLabelName("")
        setTaskDate(new Date())
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
        const removeTask = [...upTasks]
        removeTask.splice(index, 1)
        setTasks(removeTask)
        try {
            await AsyncStorage.removeItem(`${email}_tasks_key`)
            console.log('removed');
            
        } catch (e) {
            console.log('Error:', e);
               
        }
    }

    // const handleTasks = (index) => {
    //     if(tasks[index].date === new Date().toLocaleDateString()) {
    //         setTasks([...tasks, upTasks[index]])
    //         console.log('dates equal');
    //         const removeTask = [...tasks]
    //         removeTask.splice(index, 1)
    //         setTasks(removeTask)
    //         setUpTasks()
    //     }
    // }

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
        if(empTasks === true) {
            return (
                <Text style={styles.emptyTaskText}>Add your tasks for today!</Text>
            )
        }
        else if(tasksForToday.length === 0){
            return (
                <Text style={styles.emptyTaskText}>No tasks for today</Text>
            )
        }
    }

    // implementing feature that allows task editing
    const edit = (index) => {
        // this link has been very helpful in implementing edit task feature https://stackoverflow.com/questions/70682809/editing-and-updating-an-object-text-value-from-textinput 
        return (
            <View>
                <Modal isVisible={isModalVisible} onSwipeComplete={()=>setModalVisible(false)}  backdropOpacity={0.4}>
                    <View style={styles.modal}>
                        {/* Add tasks heading */}
                        <Text style={styles.add_task_text}>Edit Task</Text>
                        {/* task name */}
                        <TextInput value={tasks[index].name} 
                        onChangeText={(e)=> {
                            const editedTaskName = [...tasks]
                            editedTaskName[index] = {...editedTaskName[index], name : e}
                            setTasks(editedTaskName)
                            storeTasks(editedTaskName)
                        }}
                            placeholder="What would you like to accomplish?"
                            placeholderTextColor={'grey'}
                            style={styles.task_text}
                        />
                        {/* additional notes for the task */}
                        <TextInput value={tasks[index].notes} 
                        onChangeText={(e)=>{
                            const editedTaskNote = [...tasks]
                            editedTaskNote[index] = {...editedTaskNote[index], notes: e}
                            setTasks(editedTaskNote)
                            storeTasks(editedTaskNote)
                        }}
                            multiline
                            maxLength={1000}
                            placeholder="Task Description/Notes"
                            placeholderTextColor={'grey'}
                            style={styles.task_notes}
                        />
                        {/* Assigning an existing Label to a task */}
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', margin: 20, borderRadius: 30, backgroundColor: 'lightyellow'}}>
                            <Text style={{marginLeft: 20, alignSelf: 'center', fontSize: 19, fontFamily: 'Tomorrow', color: 'goldenrod'}}>Labels:</Text>
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
                                        placeholder="Not available"
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
                                        const editedlabel = [...tasks]
                                        editedlabel[index] = {...editedlabel[index], label : e.lname}
                                        setValue(e.value);
                                        setLabelName(e.lname);
                                        setTasks(editedlabel)
                                        storeTasks(editedlabel) 
                                        setLabelName('')
                                    }} 
                                    placeholder={tasks[index].label}
                                />
                            )}
                                
                        </View>

                        {/* Scheduling tasks */}
                        <View style={{marginLeft: 25, marginRight: 25, padding: 10, borderRadius: 30, backgroundColor: 'lightyellow'}}>
                            <Text style={{alignSelf: 'center', fontSize: 19, fontFamily: 'Tomorrow', color: 'goldenrod', marginBottom: 5}}>Schedule Task On:</Text> 
                            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
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
                        <View style={{marginTop: 10, marginLeft: 25, marginRight: 25, backgroundColor: 'lightyellow', borderRadius: 30, paddingBottom: 15}}>
                            <Text style={{marginLeft: 25, fontSize: 19, alignSelf: 'center', fontFamily: 'Tomorrow', color: 'goldenrod', marginTop: 10}}>Set Reminder: </Text>
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
                        <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 20}}>
                            <TouchableOpacity onPress={toggleModal}>
                                <Text style={{fontSize: 18, fontFamily: 'Tomorrow', color: 'grey', marginTop: 10, marginRight: 10}}>DISCARD</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                onPress={()=> {
                                    setEditing(false)
                                    onTaskSubmit()
                                    toggleModal()
                                    console.log('TASKS ', tasks);
                                    setLabelName('')
                                }}>
                                <Text style={{fontSize: 18, fontFamily: 'Tomorrow', color: 'navy', marginTop: 10, marginRight: 10}}>SAVE</Text>
                            </TouchableOpacity>
                        
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
                    <Text style={styles.welcome_text}>HOME</Text>
                    <MaterialCommunityIcons name='clipboard-text-clock' color='navy' size={35} style={{marginTop: 13}}
                    onPress={()=> {
                        navigation.navigate('UpcomingTasks')
                    }}/>
                </View>
                {/* current weather box */}
                <View style={styles.weather}>
                    {location &&
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View>
                                <Text style={{fontFamily: 'Noto-arabic', fontWeight: 'bold', fontSize: 17, color: 'navy'}}> {location.name} </Text>
                                <Text style={{fontSize: 23, fontFamily: 'Tomorrow', alignSelf: 'center',color: 'sandybrown'}}>{Math.round(location.main.temp)}°C</Text>
                                <Text style={{fontFamily: 'Noto-arabic', fontWeight: 'bold', fontSize: 17, color: 'steelblue', alignSelf: 'center'}}> {location.weather[0].description} </Text>
                            </View>
                            
                            <Image style={styles.weather_icon} 
                                source={{uri: 'https://openweathermap.org/img/wn/' + location.weather[0].icon + '@2x.png'}} 
                            />    
                        </View>
                    }
                    {!location && 
                        <View>
                            <Text style={{alignSelf:'center', marginTop: 30}}>No weather data</Text>
                        </View>
                    }
                </View>

                {/* current tasks section */}
                <View style={styles.current_tasks}>
                    <Text style={{fontSize: 23, fontFamily: 'Tomorrow', alignSelf: 'center', marginTop: 10, color: 'navy'}}>TODAY</Text>
                    <ScrollView>   
                        {emptyTask()}             
                            <FlatList
                                data={tasksForToday}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({item, index}) => (
                                    <View style={styles.task_cell}>
                                        <MaterialCommunityIcons name="circle-edit-outline" color={'darkorange'} size={30} style={{alignSelf: 'center', marginRight: 10}}
                                        onPress={()=> {
                                            setEditTaskView(true)
                                            setAddTaskView(false)
                                            setEditing(true)
                                            toggleModal()
                                        }}/>
                                        {editTaskView && edit(index)}

                                        <View style={{flex: 1}}>
                                            <Text style={{fontSize: 19, fontWeight: '500', flexWrap: 'wrap', color: 'navy', marginRight: 5 }}>{item.name}</Text>
                                            <Text style={{color: 'grey', flexWrap: 'wrap' }}>{item.notes}</Text>
                                            <Text style={styles.item_label}>{item.label}</Text>
                                        </View>
                                        
                                        <MaterialCommunityIcons name='check-circle' size={35} color={'green'} 
                                        style={{alignSelf :'center'}} 
                                        onPress={() => {
                                            onTaskComplete(index)
                                        }}/>
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
                        toggleModal()
                        setAddTaskView(true)
                        // setEditTaskView(false)
                        setSelect1(false)
                        setSelect2(false)
                        setSelect3(false)
                    }}>
                    <Text style={{margin: 10, fontSize: 20, fontFamily: 'Tomorrow', color: 'goldenrod'}}>ADD TASK</Text>                   
            
                    {addTaskView && 
                    <View>
                        <Modal isVisible={isModalVisible} onSwipeComplete={()=>setModalVisible(false)}  backdropOpacity={0.4}>
                            <View style={styles.modal}>
                                {/* Add tasks heading */}
                                <Text style={styles.add_task_text}>ADD TASK</Text>
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
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', margin: 20, borderRadius: 30, backgroundColor: 'lightyellow'}}>
                                    <Text style={{marginLeft: 20, alignSelf: 'center', fontSize: 19, fontFamily: 'Tomorrow', color: 'goldenrod'}}>Labels:</Text>
                                    {labels.length === 0 ? (
                                        <View>
                                            <SelectCountry
                                                style={styles.dropdown}
                                                selectedTextStyle={styles.selectedTextStyle}
                                                maxHeight={200}
                                                value={value}
                                                data={labels}
                                                valueField="value"
                                                onChange={e => {
                                                    setValue(e.value);
                                                    setLabelName(e.lname);
                                                }}
                                                placeholder="Not available"
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
                                            placeholderStyle={{marginLeft: 5, textAlign: 'center'}}
                                            containerStyle={{backgroundColor: 'lightyellow', borderRadius: 25}}
                                        />
                                    )}
                                </View>

                                {/* Scheduling tasks */}
                                <View style={{ marginLeft: 25, marginRight: 25, padding: 10, borderRadius: 30, backgroundColor: 'lightyellow', }}>
                                    <Text style={{alignSelf: 'center', fontSize: 19, fontFamily: 'Tomorrow', color: 'goldenrod', marginBottom: 5}}>Schedule Task On:</Text> 
                                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                        <DateTimePicker 
                                            mode="date"
                                            value={taskDate}
                                            onChange={changeDate}
                                            
                                        />
                                        <DateTimePicker 
                                            mode="time"
                                            value={time}
                                            onChange={changeTime}
                                        />
                                    </View>
                                </View>

                                {/* Set Reminder */}
                                <View style={{marginTop: 10, marginLeft: 25, marginRight: 25, backgroundColor: 'lightyellow', borderRadius: 30, paddingBottom: 15}}>
                                    <Text style={{marginLeft: 25, fontSize: 19, alignSelf: 'center', fontFamily: 'Tomorrow', color: 'goldenrod', marginTop: 10}}>Set Reminder: </Text>
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
                                <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 20}}>

                                    <TouchableOpacity onPress={toggleModal}>
                                        <Text style={{fontSize: 18, fontFamily: 'Tomorrow', color: 'grey', marginTop: 10, marginRight: 10}}>DISCARD</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity 
                                        onPress={()=> {
                                            onTaskSubmit()
                                            toggleModal()                                            
                                            setLabelName('')
                                        }}>
                                        <Text style={{fontSize: 18, fontFamily: 'Tomorrow', color: 'navy', marginTop: 10, marginRight: 10}}>SAVE</Text>
                                    </TouchableOpacity>
                                    
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
        fontSize: 28,
        marginTop: 10,
        marginBottom: 20,
        fontFamily: 'Tomorrow', 
        color: 'midnightblue'
    },
    weather: {
        borderWidth: 1,
        borderRadius: 30,
        borderBottomWidth: 5,
        borderLeftWidth: 5, 
        borderColor: 'navy',
        padding: 15,
        backgroundColor: 'white'
    },
    weather_icon: {
        width: 60, 
        height: 60,
        backgroundColor:'white', 
        borderRadius: 25, 
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'navy',
        borderBottomWidth: 3,
        borderLeftWidth: 3, 
    },
    current_tasks: {
        borderWidth: 1,
        borderRadius: 20,
        marginTop: 15,
        marginBottom: 10,
        height: 430,
        borderBottomWidth: 5,
        borderLeftWidth: 5, 
        borderColor: 'navy',
        backgroundColor: 'white'
    },
    completed_tasks:{
        borderWidth: 1,
        borderRadius: 20,
    },
    add_tasks: {
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 20,
        backgroundColor: 'lemonchiffon',
        borderColor: 'gold',
        borderBottomWidth: 5,
        borderLeftWidth: 5
    },
    add_task_text: {
        fontSize: 25,
        marginTop: 25,
        fontFamily: 'Tomorrow',
        color: 'navy',
        alignSelf: 'center'
    },
    task_text: {
        marginLeft: 25,
        marginTop: 20,
        marginRight: 25,
        backgroundColor: 'lightyellow',
        padding: 15,
        fontSize: 16,
        borderRadius: 20,
    },
    task_notes: {
        marginLeft: 25,
        marginTop: 15,
        marginRight: 25,
        backgroundColor: 'lightyellow',
        padding: 15,
        fontSize: 16,
        borderRadius: 20,
        height: 100
    },
    task_cell: {
        flexDirection: 'row', 
        marginLeft: 15,
        marginRight: 15,
        padding: 10,
        borderWidth: 1,
        borderRadius: 20,
        borderBottomWidth: 5,
        borderColor: 'sandybrown',
        marginTop: 15
    },
    modal: {
        width: 380, 
		height: 650, 
		backgroundColor: 'aliceblue', 
		borderRadius: 40, 
        alignSelf: 'center'
    },
    emptyTaskText: {
        textAlign: 'center',
        marginTop: 10,
        fontFamily: 'Sriracha', 
        fontSize: 25, 
        alignSelf: 'center', 
        color: 'lightsalmon',
    },
    dropdown: {
        margin: 16,
        height: 50,
        width: 170,
        backgroundColor: 'lightyellow',
        borderRadius: 22,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderBottomWidth: 3,
        borderColor: 'goldenrod'        
    },
    selectedTextStyle: {
        fontSize: 16,
        marginLeft: 8,
    },
    onSelection: {
        borderWidth: 1, 
        padding: 7, 
        borderRadius: 15, 
        borderColor: 'sandybrown',
        borderLeftWidth: 3,
        borderBottomWidth: 3,
        // borderTopWidth: 3
    },
    noSelection: {
        borderWidth: 1, 
        padding: 7, 
        borderRadius: 15,
        borderColor: 'gold'
    },
    item_label: {
        alignSelf: 'flex-start', 
        fontFamily: 'Noto-arabic', 
        color: 'navy', 
    }

});