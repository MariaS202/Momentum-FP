import { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Button, TextInput, FlatList, Alert, Dimensions, SafeAreaView, } from "react-native";
import Modal from "react-native-modal";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from "./Home";
import { TasksContext } from "./Context";
import FilteredTasks from "./FilteredTasks";

export default function Labels({navigation}) {
    const {labelName, setLabelName} = useContext(TasksContext)
    const {labels, setLabels} = useContext(TasksContext)
    const {value} = useContext(TasksContext)

    const addNewLabel = () => {
        const newLabel = {
            value: value,
            name: labelName
        }
        if(newLabel.name === "") {
            alert('Empty Label!')
        }

        setLabels([...labels, newLabel])
        setLabelName('')        
    }

    const deleteLabel = (index) => {
        Alert.alert('Delete Label?', `Are you sure that you want to delete ${labels[index].name} label?`, [
            {
                text: 'No',
                style: 'cancel'
            },
            {
                text: 'Yes',
                onPress: () => {
                    const labelDel = [...labels]
                    labelDel.splice(index, 1)
                    setLabels(labelDel)
                },
                style: 'destructive'
            }
        ])
    }

    return (
        <View style={styles.container}>
            <Text style={{fontSize: 27, marginTop: 35, fontWeight: 'bold'}}>Labels</Text>

           
            <View style={{flexDirection: 'row', justifyContent :'space-around', marginTop: 15, marginBottom: 5}}>
                <TextInput 
                    value={labelName}
                    onChangeText={setLabelName}
                    placeholder="Enter New Label Name"
                    placeholderTextColor={'grey'}
                    style={{fontSize: 20, borderWidth: 1, padding: 10, borderRadius: 20, width: 320}}
                    maxLength={25}
                />
                <MaterialCommunityIcons name="plus-box" size={40} color={'navy'} style={{alignSelf: 'center', marginLeft: 5}} onPress={addNewLabel}/>
            </View>

            <FlatList
                data={labels}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                    <TouchableOpacity style={styles.label} 
                        onPress={()=>navigation.navigate('FilteredTasks', {label: item})}>

                        <View style={{flexDirection: 'row', justifyContent: 'space-between', }}>
                            <Text style={styles.label_text}>{item.name}</Text>
                            <MaterialCommunityIcons name='delete-circle-outline' size={35} color={'red'} 
                                style={{marginLeft: 20, marginRight: 5}} 
                                onPress={() => deleteLabel(index)}
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
        backgroundColor: 'white',
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
        padding: 5,
    }

});
