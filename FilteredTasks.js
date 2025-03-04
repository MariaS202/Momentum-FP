import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity} from "react-native";
import Labels from "./Labels";
import { TasksContext } from "./Context";
import { useContext, useEffect } from "react";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function FilteredTasks({route, navigation}) {
    const {labels} = useContext(TasksContext)
    const {tasks, setTasks} = useContext(TasksContext)
    const {email} = useContext(TasksContext)

    const {label} = route.params

    const storeFTasks = async(val) => {
        try {
            const jsonValue = JSON.stringify(val)
            await AsyncStorage.setItem(`${email}_ftasks_key`, jsonValue)
        } catch (e) {
            console.log(e);
            
        }
    }


    const onTaskComplete = async(index) => {
        const taskComp = [...tasks]
        taskComp.splice(index, 1)
        setTasks(taskComp)

        try {
            await AsyncStorage.setItem(`${email}_ftasks_key`, JSON.stringify(taskComp))
            console.log('removed');
            
        } catch (e) {
            console.log('Error:', e);
               
        }

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
    


    const filterTasks = (name) => {
        const filteredTasks = tasks.filter(tasks => tasks.label === name)
        storeFTasks(filterTasks)

        if(filteredTasks.length > 0){
            return(
                <View>
                    <FlatList 
                        data={filteredTasks}
                        keyExtractor={(item, index) => index.toString()} 
                        renderItem={({item, index}) => (
                            <TouchableOpacity style={styles.task_cell}>
                                <View>
                                    <Text style={{fontSize: 17, fontWeight: '500'}}>{item.name}</Text>
                                    <Text style={{color: 'grey'}}>{item.notes}</Text>
                                </View>
                                <MaterialCommunityIcons name='check-circle-outline' size={35} color={'green'} 
                                style={{marginLeft: 20, marginRight: 5}} 
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

            <MaterialCommunityIcons name="arrow-left-bold-circle-outline" size={40} onPress={()=> navigation.goBack()} style={{marginLeft: 10, marginTop: 20}} color={'orange'}/>
            <Text>what dahek</Text>
            <Text style={{fontSize: 27, marginTop: 20, fontWeight: 'bold', marginLeft: 10}}> Tasks in {label.lname}: </Text>

            {filterTasks(label.lname)}
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    task_cell: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        margin: 10,
        padding: 10,
        borderWidth: 1,
        borderRadius: 20
    },

});
