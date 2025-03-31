import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList} from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TasksContext } from "./Context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UpcomingTasks({navigation}) {
    const {upTasks, setUpTasks} = useContext(TasksContext)
    const {email} = useContext(TasksContext)
    const {tasks, setTasks} = useContext(TasksContext)
    const [empty, setEmpty] = useState(false)

    const storeUpcomingTasks = async(val) => {
        try {
            const jsonValue = JSON.stringify(val)
            await AsyncStorage.setItem(`${email}_upTasks_key`, jsonValue)
        } catch (e) {
            console.log(e);
            
        }
    }

    const getUpcomingTasks = async() => {
        try {
            const jsonValue = await AsyncStorage.getItem(`${email}_upTasks_key`);
            return jsonValue != null ? setUpTasks(JSON.parse(jsonValue)) : setUpTasks([])

        } catch (e) {
            console.log('error', e);
        }
    }

    const isEmpty = () =>{
        if (upTasks.length > 0) setEmpty(false)
        else setEmpty(true)
    }

    useEffect(() => {
        isEmpty()
    }, [upTasks])
    useEffect(()=> {
        getUpcomingTasks()
    }, [])

    const removeUpcomingTasks = async(index) =>{
        try {
            const removeTask = [...upTasks]
            removeTask.splice(index, 1)
            setUpTasks(removeTask)
            await AsyncStorage.removeItem(`${email}_upTasks_key`)
            console.log('task removed');
            
        } catch (e) {
            console.log(e);
            
        }
    }

    // code has issues
    // const handleTasks = (index) => {
    //     if(upTasks[index].date === new Date().toLocaleDateString()) {
    //         console.log('dates equal');
    //         const removeTask = [...upTasks]
    //         removeTask.splice(index, 1)
    //         setUpTasks(removeTask)
    //         setTasks([...tasks, upTasks[index]])
    //     }
    // }

    const upcomingTasks = () => {
        
        if(upTasks.length > 0) {
            storeUpcomingTasks(upTasks)
            console.log(upTasks);
            
            return (                
            <FlatList 
            data={upTasks}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
                    <View style={styles.task_cell}>
                        <View style={{flex: 1}}>
                            <Text style={styles.up_task_name}>{item.name}</Text>
                            <Text style={styles.up_task_date}>Task Scheduled On: {item.date}</Text>
                        </View>
                        {/* {handleTasks(index)} */}
                        <MaterialCommunityIcons name="delete-circle" size={40} onPress={()=> removeUpcomingTasks(index)} style={{ alignSelf:'center'}} color={'red'}/>
                            
                    </View>
                )}
                />
            )
        } 
        else if(upTasks.length === 0){
            return (
                <View style ={{backgroundColor: 'white', borderRadius: 40, padding: 30, }}> 
                    <Text style={{alignSelf: 'center', fontSize: 25, fontFamily: 'Sriracha', color: 'lightsalmon',  textAlign: 'center'}}>There are no Upcoming Tasks</Text>
                </View>
            )
        }
        
    }

    return (
        <View style={styles.container}>
            <View style={{flexDirection: 'row', marginTop: 35, marginBottom: 10}}>
                <MaterialCommunityIcons name="arrow-left-bold-circle-outline" size={40} onPress={()=> navigation.goBack()} style={{marginRight: 20,}} color={'darkorange'}/>
                <Text style={{fontSize: 25,  alignSelf: 'center', fontFamily: 'Tomorrow', color: 'midnightblue'}}>UPCOMING TASKS</Text>

            </View>
            {upcomingTasks()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'lightyellow',
        padding: 20,
    },
    task_cell: {
        flexDirection: 'row', 
        padding: 10,
        borderWidth: 1,
        borderRadius: 20,
        borderBottomWidth: 5,
        borderColor: 'sandybrown',
        marginTop: 15
    },
    up_task_name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 5,
        flexShrink: 1,
        color: 'navy'
    },
    up_task_date: {
        fontSize: 16,
        marginTop: 5,
        marginLeft: 5,
        color: 'navy'
    }

});