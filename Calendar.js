import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button} from "react-native";
import { Agenda } from "react-native-calendars";
import Modal from "react-native-modal";
import DateTimePicker from '@react-native-community/datetimepicker';
import { TasksContext } from "./Context";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Cal() {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const [events, setEvents] = useState({});
    const [marksDate, setMarksDate] = useState({});
    const [date, setDate] = useState(new Date())
    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')
    const [isModalVisible, setModalVisible] = useState(false);
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    
    const toggleModal = () => {
      setModalVisible(!isModalVisible);
    };
    const toggleDeleteModal = () => {
        setDeleteModalVisible(!isDeleteModalVisible);
    };
      
    const changeDate = (event, date) => {
        const {
            set,
            nativeEvent: {timestamp, utcOffset},
          } = event;
        setDate(date)
    }

    let d = new Date()
    function currentDate() {
        let day = d.getDate()
        let mon = d.getMonth() + 1
        let year = d.getFullYear()
        return day + '/' + mon + '/' + year
    }

    // https://stackoverflow.com/questions/71211383/how-to-add-functionality-to-the-agenda-component-in-react-native-calendars
    const onItemSubmit = () =>{
        let items = events
        let mark = {...marksDate}
        let event_details = {
            date: date.toISOString().split('T')[0],
            name: name,
            description: desc
        }

        if (!items[event_details.date]) {
            items[event_details.date] = [];
        }
        items[event_details.date].push(event_details);
        mark[event_details.date] = {
            customStyles: {
                container: {
                backgroundColor: 'orange',
                },
                text: {
                    color: 'white',
                    fontWeight: 'bold',
                }, 
            },
        };
    
        setEvents(items);
        setMarksDate(mark);
        setName("")
        setDesc("")
    }

    return (
        <View style={styles.container}>
            <Text style={{fontSize: 27, marginTop: 35, fontWeight: 'bold'}}>Calendar</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                <Text style={{fontSize: 23}}>{dayNames[d.getDay()]}</Text>
                <Text style={{fontSize: 20}}>{currentDate()}</Text>
            </View>

            <Agenda 
                items={events}
                renderItem={(item)=> {
                    return (
                        <View style={{backgroundColor: 'rgb(255, 200, 137)', marginTop: 15,     marginRight: 10, padding: 10, borderRadius: 10}}>
                            <Text>{item.name}</Text>
                            <Text>{item.description}</Text>
                        </View>
                    );
                }}
                renderEmptyData={() => {
                    return (
                        <Text style={{textAlign:'center', marginTop: 50, fontSize: 17}}> No Events today!</Text>
                    );
                }}
                markingType={'custom'}
                markedDates={marksDate}
                theme={{
                    agendaDayNumColor: 'black',
                    agendaTodayColor: 'red',
                    agendaKnobColor: 'orange'
                }}
            />

            {/* Add new event */}

            <TouchableOpacity style={styles.add_event} onPress={toggleModal}>
                <Text style={styles.add_event_text}>Add New Event</Text>
                <Modal isVisible={isModalVisible} avoidKeyboard={true}
                    onSwipeComplete={()=>setModalVisible(false)} 
                    backdropOpacity={0.4}>
                    <View style={styles.new_event_modal}>
                        <Text style={styles.modal_title}>Add new event to the Calendar</Text>
                        {/* date picker */}
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 23, margin: 10, marginRight: 25, marginLeft: 25}}>
                            <Text style={{fontSize: 16, fontWeight: '500'}}>Select Date:</Text>
                            <DateTimePicker 
                                mode="date"
                                value={date}
                                onChange={changeDate}
                            />
                        </View>
                        {/* Text Inputs for name and description */}
                        <TextInput 
                            value={name}
                            onChangeText={setName}
                            placeholder="Event Name"
                            placeholderTextColor={'grey'}
                            style={styles.event_name}
                        />
                        <TextInput 
                            multiline
                            maxLength={300}
                            value={desc}
                            onChangeText={setDesc}
                            placeholder="Event description"
                            placeholderTextColor={'grey'}
                            style={styles.event_desc}
                        />
                        <View style={{flexDirection: 'row', justifyContent: 'space-around', margin: 10}}>
                            <Button title="discard" onPress={toggleModal} />
                            <Button title="save" onPress={()=>{
                                if(name == "" && desc == "" ) toggleModal()
                                else {
                                    onItemSubmit()
                                    toggleModal()
                                }
                            }} />
                        </View>
                    </View>
                </Modal>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    add_event: {
        borderWidth: 1,
        borderRadius: 20,
        marginLeft: 200,
        marginTop: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    add_event_text: {
        fontSize: 17,
        fontWeight: 'bold'
    },
    new_event_modal: {
        width: 350, 
		height: 410, 
		backgroundColor: 'white', 
		borderRadius: 25,
        alignSelf: 'center'
    },
    modal_title: {
        alignSelf: 'center',
        marginTop: 20,
        fontSize: 20,
        fontWeight: '500'
    },
    event_name: {
        marginLeft: 25,
        marginTop: 20,
        marginRight: 25,
        backgroundColor: 'rgb(227, 227, 227)',
        padding: 15,
        fontSize: 16,
        borderRadius: 20,
    },
    event_desc: {
        marginLeft: 25,
        marginTop: 20,
        marginRight: 25,
        backgroundColor: 'rgb(227, 227, 227)',
        padding: 15,
        fontSize: 16,
        borderRadius: 20,
        height: 150
    }

});
