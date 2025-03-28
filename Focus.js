import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, TextInput, Button} from "react-native";
import { TasksContext } from "./Context";
import { useContext, useEffect, useState } from "react";
import Modal from "react-native-modal";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Pomodoro from "./Pomodoro";
import TimeTrack from "./TimeTrack";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Focus({navigation}) {
    const {focusTasks, setFocusTasks} = useContext(TasksContext)
    const {name, setName} = useContext(TasksContext)
    const {email} = useContext(TasksContext)
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    const [focusTaskName, setFocusTaskName] = useState('')
    const [focusTaskNotes, setFocusTaskNotes] = useState('')
    const [empty, setEmpty] = useState(false)

    const storeFocusTasks = async(val) => {
        try {
            const jsonValue = JSON.stringify(val)
            await AsyncStorage.setItem(`${email}_focus_key`, jsonValue)
        } catch (e) {
            console.log(e);
            
        }
    }

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
        storeFocusTasks([...focusTasks, newTask])
        setFocusTaskName("")
        setFocusTaskNotes("")
    }

    const getTasks = async() => {
        try {
            const jsonValue = await AsyncStorage.getItem(`${email}_focus_key`);
            console.log('retrieving focus', focusTasks);
            return jsonValue != null ? setFocusTasks(JSON.parse(jsonValue)) : setFocusTasks([])

        } catch (e) {
            console.log('error', e);
        }
    }

    useEffect(()=> {
        getTasks()
    }, [])
    
    const onTaskComplete = async(index) => {
        const taskComp = [...focusTasks]
        taskComp.splice(index, 1)
        setFocusTasks(taskComp)
        try {
            await AsyncStorage.setItem(`${email}_focus_key`, JSON.stringify(taskComp))
            console.log('removed focus task');
            
        } catch (e) {
            console.log('Error:', e);
               
        }
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
                <Text style={{fontSize: 35,  fontWeight: 'bold', alignSelf: 'center', fontFamily: 'Tomorrow', color: 'midnightblue', textDecorationLine: 'underline'}}>FOCUS MODE</Text>
                <Text style={{fontSize: 23, alignSelf: 'center', fontFamily: 'Sriracha', color: 'sandybrown'}}>What will you focus on today?</Text>
            </View>

            <TouchableOpacity onPress={toggleModal} style={styles.add_tasks_button}>
                <Text style={{ margin: 10, fontSize: 20, fontFamily: 'Tomorrow', color: 'sandybrown'}}>ADD TASK</Text>
                
                <Modal isVisible={isModalVisible} onSwipeComplete={()=>setModalVisible(false)}  backdropOpacity={0.4}>
                    <View style={styles.modal}>
                        <Text style={styles.add_task_text}>ADD TASK</Text>
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

                        <View style={{flexDirection: 'row', marginTop: 15, justifyContent: 'space-around'}}>
                            <TouchableOpacity
                                onPress={toggleModal}>
                                <Text style={{fontSize: 18, fontFamily: 'Tomorrow', color: 'grey', marginTop: 10, marginRight: 10}}>DISCARD</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={()=> {
                                    onTaskSubmit()
                                    toggleModal()
                                }}>
                                <Text style={{fontSize: 18, fontFamily: 'Tomorrow', color: 'navy', marginTop: 10, marginRight: 10}}>SAVE</Text>
                            </TouchableOpacity>
                        </View>
                        
                    </View>
                </Modal>
            
            </TouchableOpacity>

            <View style={styles.focus_tasks}> 
                {empty && 
                    <View> 
                        <Text style={styles.empty_task}>Create and select a task for your focus session!</Text>
                    </View>
                }

                <ScrollView>
                    <FlatList
                        data={focusTasks}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item, index}) => (
                            <View>
                                <TouchableOpacity style={styles.task_cell}
                                onPress={()=> {
                                        setName(item.name)
                                        console.log(name) 
                                    }}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={{fontSize: 19, fontWeight: '600', flexWrap: 'wrap', color: 'navy', alignSelf: 'center'}}>{item.name}</Text>
                                        {/* <Text style={{color: 'grey'}}>{item.notes}</Text> */}                                    
                                    </View>
                                    <MaterialCommunityIcons name='check-circle' size={35} color={'seagreen'} 
                                    style={{marginLeft: 20, marginRight: 5, alignSelf :'center'}} 
                                    onPress={() => onTaskComplete(index)}
                                    />
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </ScrollView>

            </View>
        
            <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 10}}>
                {/* Pomodoro feature  */}
                <TouchableOpacity style={styles.pom_button} 
                    onPress={()=>{
                        if(name !== "") navigation.navigate(Pomodoro)
                        else alert('Task has not been selected/created.')
                    }}>
                    <Text style={{fontSize: 18, fontWeight: '600', fontFamily:'Tomorrow', color: 'sandybrown'}}>POMODORO</Text>
                </TouchableOpacity>

                {/* Time tracking feature */}
                <TouchableOpacity style={styles.tt_button} 
                    onPress={()=>{
                        if(name !== "") navigation.navigate(TimeTrack)
                        else alert('Task has not been selected/created.')
                    }}>
                    <Text style={{fontSize: 18, fontWeight: '600', fontFamily:'Tomorrow', color: 'sandybrown'}}>TIME TRACK</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'aliceblue',
        padding: 20,
    },
    focus_view: {
        marginTop: 35, 
        margin: 5,
    },
    focus_tasks: {
        borderWidth: 1,
        height: 420,
        borderRadius: 30,
        borderBottomWidth:5,
        borderLeftWidth: 5,
        borderColor: 'navy',
        borderLeftColor: 'navy',
        borderBottomColor: 'navy',
        backgroundColor: 'white'
    },
    add_tasks_button: {
        alignItems: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: 'lightyellow',
        margin: 20,
        borderColor: 'gold',
        borderWidth: 2
    },
    modal: {
        width: 350, 
		height: 310, 
		backgroundColor: 'aliceblue', 
		borderRadius: 30, 
        alignSelf: 'center'
    },
    add_task_text: {
        fontWeight: 'bold',
        fontSize: 25,
        marginTop: 25,
        alignSelf: 'center',
        fontFamily: 'Tomorrow',
        color: 'navy',
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
        marginTop: 20,
        marginRight: 25,
        backgroundColor: 'lightyellow',
        padding: 15,
        fontSize: 16,
        borderRadius: 20,
        height: 80
    },
    task_cell: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        marginTop: 20,
        padding: 10,
        borderWidth: 1,
        borderRadius: 23,
        borderBottomWidth: 4,
        borderColor: 'sandybrown',
        marginLeft: 10,
        marginRight: 10
    },
    pom_button: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 20,
        backgroundColor: 'lightyellow',
        borderColor: 'gold',
        margin: 5,
        borderLeftWidth: 4,
        borderBottomWidth: 4
    },
    tt_button: {
        borderWidth: 1,
        padding: 10,
        margin: 5,
        borderRadius: 15,
        borderLeftWidth: 4,
        borderBottomWidth: 4,
        borderRadius: 20,
        backgroundColor: 'lightyellow',
        borderColor: 'gold',
    },
    empty_task : {
        alignSelf: 'center', 
        fontSize: 23, 
        textAlign: 'center', 
        fontFamily: 'Sriracha',
        margin: 20,
        color: 'lightsalmon'
    },

});