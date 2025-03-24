import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity} from "react-native";
import Labels from "./Labels";
import { TasksContext } from "./Context";
import { useContext, useEffect, useState } from "react";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function FilteredTasks({route, navigation}) {
    const {labels} = useContext(TasksContext)
    const {tasks, setTasks} = useContext(TasksContext)
    const {email} = useContext(TasksContext)
    const {label} = route.params
    const [fTasks, setFTasks] = useState([])
    const [empty, setEmpty] = useState(false)

    const storeFTasks = async(val) => {
        try {
            const jsonValue = JSON.stringify(val)
            await AsyncStorage.setItem(`${email}_ftasks_key`, jsonValue)
        } catch (e) {
            console.log(e);
            
        }
    }

    const onTaskComplete = async(index) => {
        const taskFComp = [...fTasks]
        taskFComp.splice(index, 1)
        setFTasks(taskFComp)
        const taskComp = [...tasks]
        taskComp.splice(index, 1)
        setTasks(taskComp)

        try {
            await AsyncStorage.removeItem(`${email}_ftasks_key`)
            console.log('removed filter');
            
        } catch (e) {
            console.log('Error:', e);
               
        }

    }

    const getTasks = async() => {
        try {
            const jsonValue = await AsyncStorage.getItem(`${email}_ftasks_key`);
            console.log('retrieving', tasks);
            if(jsonValue != null){
                setFTasks(JSON.parse(jsonValue))
                setTasks(JSON.parse(jsonValue))
            }
            else {
                setFTasks([])
                setTasks([])
            }

        } catch (e) {
            console.log('error', e);
        }
    }

    useEffect(()=> {
        getTasks()
    }, [])

    useEffect(()=> {
        if(fTasks.length !== 0) setEmpty(false)
        else setEmpty(true)
    }, [fTasks])

    const filterTasks = (name) => {
        const filteredTasks = tasks.filter(tasks => tasks.label === name)
        storeFTasks(filteredTasks)

        if(fTasks.length > 0){
            return(
                <View>
                    <FlatList 
                        data={fTasks}
                        keyExtractor={(item, index) => index.toString()} 
                        renderItem={({item, index}) => (
                            <TouchableOpacity style={styles.task_cell}>
                                <View>
                                    <Text style={{fontSize: 19, fontWeight: '600', color:'midnightblue'}}>{item.name}</Text>
                                    <Text style={{color: 'grey'}}>{item.notes}</Text>
                                </View>
                                <MaterialCommunityIcons name='check-circle' size={35} color={'seagreen'}  
                                onPress={() => onTaskComplete(index)}
                                />
                            </TouchableOpacity>
                        )}
                    />
                </View>
            );
        }
        else console.log('no tasks available');
    }
    console.log(labels);
    

    

    return (
        <SafeAreaView style={styles.container}>
            <View style={{flexDirection: 'row', marginBottom: 15}}>
                <MaterialCommunityIcons name="arrow-left-bold-circle-outline" size={40} 
                onPress={()=> navigation.goBack()} 
                style={{marginLeft: 10, marginTop: 20, alignSelf: 'center'}} 
                color={'orange'}/>
                <Text style={{fontSize: 30, marginTop: 20, fontWeight: 'bold', marginLeft: 10, fontFamily: 'Sriracha', alignSelf: 'center', color: 'midnightblue',}}> Tasks in {label.lname}: </Text>
            </View>

            {filterTasks(label.lname)}

            {empty && 
                <View style={{backgroundColor: 'white', borderRadius: 40, justifyContent: 'center', padding: 30}}>
                    <Text style={{fontFamily: 'Sriracha', fontSize: 25, textAlign:'center', alignSelf: 'center', color: 'lightsalmon',}}>No tasks are available under this label</Text>
                </View>
            }
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'lightyellow',
        alignContent: 'center'
    },
    task_cell: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        margin: 7,
        padding: 15,
        borderWidth: 2,
        borderRadius: 20,
        borderColor: 'sandybrown',
        borderBottomWidth: 5,
        marginLeft: 20,
        marginRight: 20,
        
    },

});
