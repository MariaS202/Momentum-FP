import { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Button, TextInput, FlatList, Alert, Dimensions, SafeAreaView, } from "react-native";
import Modal from "react-native-modal";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from "./Home";
import { TasksContext } from "./Context";
import FilteredTasks from "./FilteredTasks";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Labels({navigation}) {
    const {labelName, setLabelName} = useContext(TasksContext)
    const {labels, setLabels} = useContext(TasksContext)
    const {value} = useContext(TasksContext)
    const {email} = useContext(TasksContext)
    const [empty, setEmpty] = useState(false)

    useEffect(()=> {
        if(labels.length > 0) setEmpty(false)
        else setEmpty(true)
    }, [labels])

    const storeLabels = async(val) => {
        try {
            const jsonValue = JSON.stringify(val)
            await AsyncStorage.setItem(`${email}_labels_key`, jsonValue)
        } catch (e) {
            console.log(e);
            
        }
    }

    const addNewLabel = async() => {
        const newLabel = {
            value: value,
            lname: labelName
        }

        if(newLabel.lname === '') {
            alert('Empty Label!')
            return
        }

        setLabels([...labels, newLabel])
        storeLabels([...labels, newLabel])
        setLabelName('')        
    }

    const getLabels = async() => {
        try {
            const jsonValue = await AsyncStorage.getItem(`${email}_labels_key`);
            console.log('retrieving LABELS', labels);
            return jsonValue != null ? setLabels(JSON.parse(jsonValue)) : setLabels([])

        } catch (e) {
            console.log('error', e);
        }
    }

    useEffect(()=> {
        getLabels()
    }, [])

    const removeLabel = async(del) => {
        try {
            await AsyncStorage.setItem(`${email}_labels_key`, JSON.stringify(del))
            console.log('removed labels');
            
        } catch (e) {
            console.log('Error:', e);
               
        }
    }


    const deleteLabel = async(index) => {
        Alert.alert('Delete Label?', `Are you sure that you want to delete ${labels[index].lname} label?`, [
            {
                text: 'No',
                style: 'cancel'
            },
            {
                text: 'Yes',
                onPress: () => {
                    const labelDel = [...labels]
                    labelDel.splice(index, 1)
                    removeLabel(labelDel)
                    setLabels(labelDel)
                    
                },
                style: 'destructive'
            }
        ])
    }

    return (
        <View style={styles.container}>
            <Text style={{fontSize: 28, marginTop: 45, fontWeight: 'bold', fontFamily: 'Tomorrow', color: 'midnightblue'}}>LABELS</Text>
                       
            <View style={{flexDirection: 'row', justifyContent :'space-around', marginTop: 15, marginBottom: 5}}>
                <TextInput 
                    value={labelName}
                    onChangeText={setLabelName}
                    placeholder="Enter New Label Name"
                    placeholderTextColor={'grey'}
                    style={styles.inputs}
                    // style={{fontSize: 20, borderWidth: 1, padding: 10, borderRadius: 20, width: 320}}
                    maxLength={25}
                />
                <MaterialCommunityIcons name="plus-box" size={40} color={'navy'} style={{alignSelf: 'center', marginLeft: 5}} onPress={addNewLabel}/>
            </View>

            {empty && 
                <View>
                    <Text style={{alignSelf: 'center', flexDirection: 'column', fontFamily: 'Sriracha', fontSize: 20, textAlign: 'center', color: 'lightsalmon', marginTop: 20}}>Create Labels by entering label name and organise your tasks with ease!</Text>
                </View>
            }

            <FlatList
                data={labels}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                    <TouchableOpacity style={styles.label} 
                        onPress={()=>navigation.navigate('FilteredTasks', {label: item})}>

                        <MaterialCommunityIcons name='delete-circle' size={35} color={'red'} 
                            style={{marginLeft: 0, marginRight: 10, alignSelf: 'center'}} 
                            onPress={() => deleteLabel(index)}
                        />
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1}}>
                            <Text style={styles.label_text}>{item.lname}</Text>
                            <MaterialCommunityIcons name='chevron-right-circle' size={35} color={'darkorange'} 
                                style={{marginLeft: 20, marginRight: 5}} 
                                onPress={()=>navigation.navigate('FilteredTasks', {label: item})}
                            />
                        </View>

                    </TouchableOpacity>
                )}
                
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'aliceblue',
        padding: 20,
    },
    new_label: {
        borderWidth: 1,
        borderRadius: 20,
        padding: 15,
        alignSelf: 'flex-end',
        position: 'absolute',
        bottom: 25,
        right: 25,
    },
    label_text: {
        fontSize: 20, 
        fontWeight: '400', 
        alignSelf: 'center',
        marginLeft: 5
    },
    label: {
        borderWidth: 1,
        borderRadius: 20,
        marginTop: 10,
        padding: 7,
        borderBottomWidth: 3,
        borderLeftWidth: 3,
        borderBottomColor: 'midnightblue',
        borderLeftColor: 'midnightblue',
        flexDirection: 'row',
        backgroundColor: 'white'   
    },
    inputs: {
        borderWidth: 2,
        borderColor: 'lightsteelblue',
        fontSize: 20, 
        padding: 15, 
        borderRadius: 20, 
        width: 320,
        backgroundColor: 'whitesmoke'
    },

});
