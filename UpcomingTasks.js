import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList} from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TasksContext } from "./Context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UpcomingTasks({navigation}) {
    const {upTasks, setUpTasks} = useContext(TasksContext)
    const {email} = useContext(TasksContext)
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

    const upcomingTasks = () => {
        
        if(upTasks.length > 0) {
            storeUpcomingTasks(upTasks)
            
            console.log('UPCOMING TASKS: ', upTasks);
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
                            
                            <MaterialCommunityIcons name="delete-circle-outline" size={40} onPress={()=> removeUpcomingTasks(index)} style={{marginRight: 5, alignSelf:'center'}} color={'red'}/>
                                
                        </View>
                    )}
                    />
                )
            } else {
                return (
                    <View style ={{flex:1, backgroundColor: 'lemonchiffon', }}> 
                        <Text style={{alignSelf: 'center', fontSize: 25, marginTop: 100, fontFamily: 'arial'}}>There are no Upcoming Tasks </Text>
                    </View>
                )
            }
    }

    return (
        <View style={styles.container}>
            <View style={{flexDirection: 'row', marginTop: 30,}}>
                <MaterialCommunityIcons name="arrow-left-bold-circle-outline" size={40} onPress={()=> navigation.goBack()} style={{marginRight: 20,}} color={'orange'}/>
                <Text style={{fontSize: 27, fontWeight: 'bold', alignSelf: 'flex-end', marginBottom: 6}}>Upcoming Tasks</Text>

            </View>
            {upcomingTasks()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    task_cell: {
        flexDirection: 'row',
        justifyContent:'space-between',
        margin: 10,
        padding: 10,
        borderWidth: 1,
        borderRadius: 25
    },
    up_task_name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 5,
        flexShrink: 1
    },
    up_task_date: {
        fontSize: 16,
        marginTop: 10,
        marginLeft: 5
    }

});