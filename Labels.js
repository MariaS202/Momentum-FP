import { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Button, TextInput, FlatList, Alert, Dimensions, SafeAreaView, } from "react-native";
import Modal from "react-native-modal";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from "./Home";
import { TasksContext } from "./Context";
import FilteredTasks from "./FilteredTasks";

export default function Labels({navigation}) {
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    const {labelName, setLabelName} = useContext(TasksContext)
    const {labels, setLabels} = useContext(TasksContext)
    const {value, setValue} = useContext(TasksContext)
    const {tasks} = useContext(TasksContext)

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

                        {/* Modal */}

                        {/* <Modal isVisible={isModalVisible} onSwipeComplete={()=>setModalVisible(false)}>
                            <SafeAreaView style={styles.modal}>
                                <MaterialCommunityIcons name="arrow-left-bold-circle-outline" size={40} on onPress={toggleModal} style={{marginLeft: 10, marginTop: 20}} color={'orange'}/>
                                <Text style={{fontSize: 27, marginTop: 20, fontWeight: 'bold', marginLeft: 10}}> Tasks in {labels[index].name}: </Text>
                                <Text>{filterTasks(labels[index].name)}</Text>
                            </SafeAreaView>
                        </Modal> */}


                    </TouchableOpacity>
                )}
                
            />

             

            {/* <TouchableOpacity style={styles.new_label} onPress={toggleModal}>
                <Text style={{fontWeight: 'bold', fontSize: 17}}>+ Create New Label</Text>
                <Modal isVisible={isModalVisible} onSwipeComplete={()=>setModalVisible(false)}  backdropOpacity={0.4}>  
                    <View style={styles.modal}>
                        <TextInput 
                            value={labelName}
                            onChangeText={setLabelName}
                            placeholder="Enter New Label Name"
                            placeholderTextColor={'grey'}
                        />
                        <Button title="discard modal" onPress={toggleModal}/>
                    </View>
                </Modal>
            </TouchableOpacity> */}
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
    modal: {
        width: Dimensions.get('window').width, 
		height: Dimensions.get('window').height, 
		backgroundColor: 'white', 
		borderRadius: 20, 
        alignSelf: 'center'
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
