import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button} from "react-native";
import { Agenda } from "react-native-calendars";
import Modal from "react-native-modal";
import DateTimePicker from '@react-native-community/datetimepicker';
import { TasksContext } from "./Context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Calendar from 'expo-calendar';

export default function Cal() {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const [events, setEvents] = useState({});
    const [marksDate, setMarksDate] = useState({});
    const [date, setDate] = useState(new Date())
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [startD, setStartD] = useState(new Date())
    const [endD, setEndD] = useState(new Date())
    const [id, setId] = useState(0)
    const [eventId, setEventId] = useState('')
    const [isModalVisible, setModalVisible] = useState(false);
    const {email} = useContext(TasksContext)    
    const toggleModal = () => {
      setModalVisible(!isModalVisible);
    };
    const event_details = {
        id: id,
        date: date.toISOString().split('T')[0],
        title: title,
        description: desc,
        startDate: new Date(),
        endDate: new Date()
    }
    const changeDate = (event, date) => {
        const {
            set,
            nativeEvent: {timestamp, utcOffset},
        } = event;
        setDate(date)
    }
    const changeStartTime = (event, selectedDate) => {
        const {
            set,
            nativeEvent: {timestamp, utcOffset},
        } = event;
        setStartD(selectedDate)
    
    }
    const changeEndTime = (event, selectedDate) => {
        const {
            set,
            nativeEvent: {timestamp, utcOffset},
        } = event;
        setEndD(selectedDate)
        
    }

    // asking user permissions to use their local calendar
    useEffect(() => {
        (async () => {
          const { status } = await Calendar.requestCalendarPermissionsAsync();
          if (status === 'granted') {
            const calendars = await Calendar.getCalendarsAsync();
            console.log('Here are all your calendars:');
            // console.log({ calendars });
          }
        })();
    }, []);

    // creating events to the local calendar
    const createEvent = async(eventDetails) => {
        try {
            const defaultCalendar = await Calendar.getDefaultCalendarAsync()
    
            const eventID = await Calendar.createEventAsync(defaultCalendar.id, {
                title: eventDetails.title,
                startDate: eventDetails.startDate,
                endDate: eventDetails.endDate
            })

            console.log('EVENT CREATED');
            setEventId(eventID)

        } catch (error) {
            console.log(error);
        }
    }

    // deleting events from local calendar 
    const deleteEvent = async() => {
        try {
            await Calendar.deleteEventAsync(eventId)
            console.log('EVENT DELETED');

        } catch (error) {
            console.log(error);
        }
    }

    // ========
    const storeEvents = async(val) => {
        try {
            const jsonValue = JSON.stringify(val)
            await AsyncStorage.setItem(`${email}_events_key`, jsonValue)
        } catch (error) {
            console.log(error);
            
        }
    }

    const storeMarks = async(val) => {
        try {
            const jsonValue = JSON.stringify(val)
            await AsyncStorage.setItem(`${email}_marks_key`, jsonValue)
        } catch (error) {
            console.log(error);
            
        }
    }
    
    // onItemSubmit function code is from this link -> https://stackoverflow.com/questions/71211383/how-to-add-functionality-to-the-agenda-component-in-react-native-calendars
    const onItemSubmit = () => {
        const items = events
        const mark = {...marksDate}

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
        setId(e => e + 1);

        storeEvents(items)
        storeMarks(mark)

        setTitle("")
        setDesc("")

    }

    const getEvents = async() => {
        try {
            const jsonValue = await AsyncStorage.getItem(`${email}_events_key`)
            return jsonValue != null ? setEvents(JSON.parse(jsonValue)) : setEvents({})
        } catch (error) {
            console.log(error);
        }
    }

    const getMarks = async() => {
        try {
            const jsonValue = await AsyncStorage.getItem(`${email}_marks_key`)
            return jsonValue != null ? setMarksDate(JSON.parse(jsonValue)) : setMarksDate({})
        } catch (error) {
            console.log(error);
        }
    }
    
    useEffect(() => {
        getEvents()
        getMarks()
    }, [])

    const removeEvent = async() => {
        try {
            await AsyncStorage.removeItem(`${email}_events_key`)
            console.log('event removed');
            
        } catch (error) {
            console.log(error);
                   
        }
    }

    const removeMark = async() => {
        try {
            await AsyncStorage.removeItem(`${email}_marks_key`)
            console.log('');
            
        } catch (error) {
            console.log(error);
                   
        }
    }
    
    const onEventsDelete = (index, emDate) => {
        // Issues with rendering of items with Agenda component: https://github.com/wix/react-native-calendars/issues/1589#issuecomment-995414073 
        const eventsDel = {...events}
        const marksDel = {...marksDate}
        emDate = date.toISOString().split('T')[0]

        console.log('before filter----', eventsDel);
        eventsDel[emDate] = eventsDel[emDate].filter(e => e.id !== index)
        console.log('after filter---', eventsDel);

        if(eventsDel[emDate].length === 0) {
            delete eventsDel[emDate]
            delete marksDel[emDate]
        }

        setEvents(eventsDel)  
        setMarksDate(marksDel)
        removeEvent()
        removeMark()
        deleteEvent()
    }

    const d = new Date();
    return (
        <View style={styles.container}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 20}}>
                <Text style={{fontSize: 30, marginTop: 35, fontWeight: 'bold'}}>Calendar</Text>
                <Text style={{fontSize: 23, marginTop: 35, alignSelf:'center', fontStyle: 'italic'}}>{dayNames[d.getDay()]}</Text>
            </View>
            
            <Agenda 
                items={events}
                style={{
                    borderRadius: 30,
                }}
                renderItem={(item)=> {
                    return (
                        <View style={{backgroundColor: 'white', marginTop: 15, marginRight: 10, padding: 10, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View>
                                <Text>{item.title}</Text>
                                <Text>{item.description}</Text>
                                <Text>Start: {startD.toLocaleDateString([], {hour12: true, hour: '2-digit', minute: '2-digit'})}</Text>
                                <Text>End: {endD.toLocaleDateString([], {hour12: true, hour: '2-digit', minute: '2-digit'})}</Text>
                            </View>
                            <MaterialCommunityIcons name='delete-circle-outline' size={35} color={'red'} 
                            style={{marginLeft: 20, marginRight: 5}} 
                            onPress={() => {
                                    onEventsDelete(item.id, date)
                                }}/>
                        </View>
                    );
                }}
                renderEmptyData={() => {
                    return (
                        <View style={{}}>
                            <Text style={{textAlign:'center', marginTop: 50, fontSize: 17}}> No events added for this day</Text>
                        </View>
                    );
                }}
                markingType={'custom'}
                markedDates={marksDate}
                theme={{
                    agendaDayNumColor: 'black',
                    agendaTodayColor: 'red',
                    agendaKnobColor: 'orange',
                    textDayFontSize: 19,
                    textDayHeaderFontWeight: 'bold',
                    textDayHeaderFontSize: 14, // sun,mon,tues ...
                    textSectionTitleColor: 'orange',
                    textMonthFontSize: 20,
                    todayBackgroundColor: 'aliceblue',
                    textDayFontWeight: 'bold',
                    reservationsBackgroundColor : 'aliceblue'
                }}
                showClosingKnob
                
                
            />
            
            {/* Add new event */}
            <TouchableOpacity style={styles.add_event} onPress={toggleModal}>
                <Text style={styles.add_event_text}>Add New Event</Text>
                <Modal isVisible={isModalVisible}
                    onSwipeComplete={()=>setModalVisible(false)} 
                    backdropOpacity={0.4}>
                    <View style={styles.new_event_modal}>
                        <Text style={styles.modal_title}>Add new event to the Calendar</Text>
                        {/* date picker */}
                        <View style={styles.event_date}>
                            <Text style={{fontSize: 16, fontWeight: '500'}}>Select Date:</Text>
                            <DateTimePicker 
                                mode="date"
                                value={date}
                                onChange={changeDate}
                            />
                        </View>
                        {/* Text Inputs for name and description */}
                        <TextInput 
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Event Name"
                            placeholderTextColor={'grey'}
                            style={styles.event_name}
                        />
                        {/* View containing time pickers for start time and end time */}
                        <View style={styles.times}>
                            <View style={{alignItems: 'center'}}>
                                <Text style={{fontSize: 17, marginBottom: 7}}>Start Time</Text>
                                <DateTimePicker 
                                    value={startD}
                                    mode="time"
                                    onChange={changeStartTime}
                                />
                            </View>

                            <View style={{alignItems: 'center'}}>
                                <Text style={{fontSize: 17, marginBottom: 7}}>End Time</Text>
                                <DateTimePicker 
                                    value={endD}
                                    mode="time"
                                    onChange={changeEndTime}
                                />
                            </View>
                        </View>

                        <TextInput 
                            multiline
                            maxLength={200}
                            value={desc}
                            onChangeText={setDesc}
                            placeholder="Event description"
                            placeholderTextColor={'grey'}
                            style={styles.event_desc}
                        />

                        <View style={{flexDirection: 'row', justifyContent: 'space-around', margin: 10}}>
                            <Button title="discard" onPress={toggleModal} />
                            <Button title="save" onPress={()=>{
                                if(title == "" && desc == "" ) toggleModal()
                                else {
                                    onItemSubmit()
                                    createEvent(event_details)
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
        backgroundColor: 'aliceblue',
        padding: 20,
    },
    add_event: {
        borderWidth: 1,
        borderRadius: 20,
        borderColor: 'white',
        marginTop: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'lemonchiffon',
        shadowColor: 'white',
    },
    add_event_text: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    new_event_modal: {
        width: 350, 
		height: 450, 
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
    event_date: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginTop: 20, 
        marginRight: 25, 
        marginLeft: 25
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
        height: 100
    },
    times: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },

});
