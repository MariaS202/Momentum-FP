import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, TextInput, Button} from "react-native";
import { TasksContext } from "./Context";
import { useContext, useEffect, useState } from "react";
import Modal from "react-native-modal";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Pomodoro from "./Pomodoro";
import TimeTrack from "./TimeTrack";


export default function Focus({navigation}) {
    const {tasks, setTasks} = useContext(TasksContext)
    const {focusTasks, setFocusTasks} = useContext(TasksContext)
    const {name, setName} = useContext(TasksContext)
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    // const [taskName, setTaskName] = useState('')
    // const [taskNotes, setTaskNotes] = useState('')
    const [focusTaskName, setFocusTaskName] = useState('')
    const [focusTaskNotes, setFocusTaskNotes] = useState('')
    const [empty, setEmpty] = useState(false)

    const onTaskSubmit = () => {
        console.log("task submitted");

        const newTask = {
            name: focusTaskName,
            notes: focusTaskNotes,
        }
        if (newTask.notes === "") {
            newTask.notes = 'no notes provided'
            setFocusTasks([...focusTasks, newTask.notes])
        }
        
        setFocusTasks([...focusTasks, newTask])
        setFocusTaskName("")
        setFocusTaskNotes("")
        
    }

    const onTaskComplete = (index) => {
        const taskComp = [...focusTasks]
        taskComp.splice(index, 1)
        setFocusTasks(taskComp)
        setName('')
    }

    const isFocusTaskEmpty = () => {
        if(focusTasks.length === 0) setEmpty(true)
        else setEmpty(false)
    } 
    useEffect(()=> {
        isFocusTaskEmpty()
    }, [focusTasks])

    return (
        <View style={styles.container}>
            <View style={styles.focus_view}>
                <Text style={{fontSize: 35,  fontWeight: 'bold', alignSelf: 'center'}}>Focus Mode</Text>
                <Text style={{fontSize: 20, fontWeight: '400', alignSelf: 'center',}}>What will you focus on today?</Text>
            </View>

            <View style={styles.focus_tasks}> 
                <Text style={{alignSelf: 'center', fontSize: '17', marginTop: 10}}>Create a task for your focus session!</Text>
                {empty && <Text style={styles.empty_task}>Add your tasks for them to appear here!</Text>}

                <ScrollView>
                    <FlatList
                        data={focusTasks}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item, index}) => (
                            <TouchableOpacity style={styles.task_cell} 
                                onPress={()=> {
                                    setName(item.name)
                                    console.log(name)                                    
                                }}>
                                <View>
                                    <Text style={{fontSize: 17, fontWeight: '500'}}>{item.name}</Text>
                                    <Text style={{color: 'grey'}}>{item.notes}</Text>
                                    <Text>{item.label}</Text>
                                    
                                    
                                </View>
                                <MaterialCommunityIcons name='check-circle-outline' size={35} color={'green'} 
                                style={{marginLeft: 20, marginRight: 5, alignSelf :'center'}} 
                                onPress={() => onTaskComplete(index)}
                                />
                            </TouchableOpacity>
                        )}
                    />
                </ScrollView>

                <TouchableOpacity onPress={toggleModal} style={styles.add_tasks_button}>
                    <Text style={{margin: 10, fontSize: 18.5, fontStyle: 'italic', fontWeight: 'bold'}}>Add Task</Text>
                    
                    <Modal isVisible={isModalVisible} onSwipeComplete={()=>setModalVisible(false)}  backdropOpacity={0.4}>
                        <View style={styles.modal}>
                            <Text style={styles.add_task_text}>Add Task</Text>
                            <TextInput value={focusTaskName} onChangeText={setFocusTaskName} 
                                placeholder="What would you like to accomplish?"
                                placeholderTextColor={'grey'}
                                style={styles.task_text}
                            />
                            <TextInput value={focusTaskNotes} onChangeText={setFocusTaskNotes}
                                multiline
                                maxLength={1000}
                                placeholder="Task Description/Notes"
                                placeholderTextColor={'grey'}
                                style={styles.task_notes}
                            />

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

            </View>

        
            <View style={{flexDirection: 'row', alignSelf: 'center' , marginTop: 15}}>
                {/* Pomodoro feature  */}
                <TouchableOpacity style={styles.pom_button} 
                    onPress={()=>{
                        if(name !== "") navigation.navigate(Pomodoro)
                        else alert('Task has not been selected/created.')
                    }}>
                    <Text style={{fontSize: 18, fontWeight: '600'}}>Pomodoro Mode</Text>
                </TouchableOpacity>

                {/* Time tracking feature */}
                <TouchableOpacity style={styles.tt_button} 
                    onPress={()=>{
                        if(name !== "") navigation.navigate(TimeTrack)
                        else alert('Task has not been selected/created.')
                    }}>
                    <Text style={{fontSize: 18, fontWeight: '600'}}>Time Tracking Mode</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    focus_view: {
        marginTop: 35, 
        margin: 5,
    },
    focus_tasks: {
        borderWidth: 1,
        marginTop: 20,
        height: 450,
        borderRadius: 20,
    },
    add_tasks_button: {
        borderWidth: 1,
        alignSelf: 'flex-end',
        padding: 5,
        borderRadius: 20,
        margin: 10,
        
    },
    modal: {
        width: 350, 
		height: 450, 
		backgroundColor: 'white', 
		borderRadius: 20, 
        alignSelf: 'center'
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
        borderRadius: 20,
        marginTop: 15
    },
    pom_button: {
        borderWidth: 1,
        padding: 10,
        margin: 5,
        borderRadius: 15
    },
    tt_button: {
        borderWidth: 1,
        padding: 10,
        margin: 5,
        borderRadius: 15
    },
    empty_task : {
        fontSize: 22,
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 35,
        color: 'grey'
    }



});