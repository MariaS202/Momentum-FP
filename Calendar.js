import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button} from "react-native";
import { Agenda } from "react-native-calendars";
import Modal from "react-native-modal";
import DateTimePicker from '@react-native-community/datetimepicker';
import { TasksContext } from "./Context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Calendar from 'expo-calendar';
import * as Notifications from 'expo-notifications';

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
    const toggleModal = () => {
      setModalVisible(!isModalVisible);
    };
    const [select1, setSelect1] = useState(true)
    const [select2, setSelect2] = useState(true)
    const [select3, setSelect3] = useState(true)
    const [reminder, setReminder] = useState('')
    const toggleSelect1 = () => {
        setSelect1(!select1)
    } 
    const toggleSelect2 = () => {
        setSelect2(!select2)
    }
    const toggleSelect3 = () => {
        setSelect3(!select3)
    }

    const {email} = useContext(TasksContext) 
   
    // Notifications for event reminder
    const handleReminders = (name, d) => {
        if(select1 === false && select2 === false && select3 === false) {
            Notifications.cancelAllScheduledNotificationsAsync()
            return
        }
        else if(reminder == '1 day before') {
            const oneDayBefore = new Date(date.getTime())
            oneDayBefore.setDate(date.getDate() - 1)
            oneDayBefore.setTime(startD.getTime())
            
            Notifications.cancelAllScheduledNotificationsAsync()
            Notifications.scheduleNotificationAsync({
                content: {
                    title: `Reminder for Event ${name} on ${d}`,
                    body: 'This is your scheduled reminder',
                },
                trigger: {
                    type: 'date',
                    date: oneDayBefore,
                }
            });
            
                        
        }
        else if(reminder == '3 days before') {
            const threeDaysBefore = new Date(date.getTime())
            threeDaysBefore.setDate(date.getDate() - 3)
            threeDaysBefore.setTime(startD.getTime())

            Notifications.cancelAllScheduledNotificationsAsync()
            Notifications.scheduleNotificationAsync({
                content: {
                    title: `Reminder for Event ${name} on ${d}`,
                    body: 'This is your scheduled reminder',
                },
                trigger: {
                    type: 'date',
                    date: threeDaysBefore,
                }
            });
        }
        else if(reminder == '1 week before') {
            const oneWeekBefore = new Date(date.getTime())
            oneWeekBefore.setDate(date.getDate() - 7)
            console.log(oneWeekBefore.toLocaleDateString([]).split(', ')[0]);
            oneWeekBefore.setTime(startD.getTime())

            Notifications.cancelAllScheduledNotificationsAsync()
            Notifications.scheduleNotificationAsync({
                content: {
                    title: `Reminder for Event ${name} on ${d}`,
                    body: 'This is your scheduled reminder',
                },
                trigger: {
                    type: 'date',
                    date: oneWeekBefore,
                }
            });
        }
    }

    //  to check that all the notifications are scheduled correctly
    const checkNotifications = async() => {
        const allNotifications = await Notifications.getAllScheduledNotificationsAsync()
        console.log(allNotifications);
    }

    // asking user permissions to use their local calendar
    useEffect(() => {
        (async () => {
            const { status } = await Calendar.requestCalendarPermissionsAsync();
            if (status === 'granted') {
                const calendars = await Calendar.getCalendarsAsync();
                
                console.log('Here are all your calendars:');
                console.log({ calendars });

            }
        })();
    }, []);
    
    const formattedDate = () => {
        const d = date.toLocaleDateString()
        const day = d.slice(0, 2)
        const month = d.slice(3, 5)
        const year = d.slice(6, 10)        
        return year + '-' + month + '-' + day
        
    }
    const event_details = {
        id: id,
        date: formattedDate(),
        title: title,
        description: desc,
        startDate: startD.toTimeString(),
        endDate: endD.toTimeString()
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

    // creating events to the local calendar
    const createEvent = async(eventDetails) => {
        // combining the date and start and end times to make it easy for users to save the event and sync it with Agenda date
        const combinedStartDate = date.toDateString() + ' ' + startD.toTimeString()
        const combinedEndDate = date.toDateString() + ' ' + endD.toTimeString()
        try {
            const defaultCalendar = await Calendar.getDefaultCalendarAsync()        
            const eventID = await Calendar.createEventAsync(defaultCalendar.id, {
                title: eventDetails.title,
                startDate: new Date(combinedStartDate),
                endDate: new Date(combinedEndDate),
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

    // storing events and marks to AsyncStorage
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
        handleReminders(event_details.title, event_details.date)
        checkNotifications()
    }

    // getting events and marks from asyncstorage
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
        getMarks()
        getEvents()
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
        emDate = formattedDate()

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
                <Text style={{fontSize: 28, marginTop: 35, fontWeight: 'bold', fontFamily: 'Tomorrow', color: 'midnightblue'}}>CALENDAR</Text>
                <Text style={{fontSize: 25, marginTop: 35, fontFamily: 'Sriracha', color: 'orange'}}>{dayNames[d.getDay()]}</Text>
            </View>
            {/* MAIN CALENDAR AGENDA */}
            <Agenda 
                items={events}
                style={{
                    borderRadius: 30,
                }}
                renderItem={(item)=> {
                    return (
                        <View style={{backgroundColor: 'white', marginTop: 15, marginRight: 10, padding: 15, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View>
                                <Text style={{fontSize: 18, color: 'midnightblue', fontWeight: '600'}}>{item.title}</Text>
                                <Text>{item.description}</Text>
                            </View>
                            <MaterialCommunityIcons name='delete-circle-outline' size={35} color={'red'} 
                            style={{marginLeft: 20, alignSelf: 'center'}} 
                            onPress={() => {
                                    onEventsDelete(item.id, date)
                                }}/>
                        </View>
                    );
                }}
                renderEmptyData={() => {
                    return (
                        <View>
                            <Text style={{textAlign:'center', marginTop: 50, fontSize: 23, fontFamily: 'Sriracha', color: 'lightsalmon'}}> No events added for this day.</Text>
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
                    textDayHeaderFontSize: 14, 
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
                <Text style={styles.add_event_text}>ADD NEW EVENT</Text>
                <Modal isVisible={isModalVisible}
                    onSwipeComplete={()=>setModalVisible(false)} 
                    backdropOpacity={0.4}>
                    <View style={styles.new_event_modal}>
                        <Text style={styles.modal_title}>ADD NEW EVENT</Text>
                        {/* Text Inputs for name and description */}
                        <TextInput 
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Event Name"
                            placeholderTextColor={'grey'}
                            style={styles.event_name}
                            
                        />
                        <TextInput 
                            multiline
                            maxLength={200}
                            value={desc}
                            onChangeText={setDesc}
                            placeholder="Event description (optional)"
                            placeholderTextColor={'grey'}
                            style={styles.event_desc}
                        />

                        {/* date picker */}
                        <View style={styles.event_date}>
                            <Text style={{fontSize: 18, color: 'goldenrod', fontFamily: 'Tomorrow'}}>Select Date:</Text>
                            <DateTimePicker 
                                mode="date"
                                value={date}
                                onChange={changeDate}
                            />
                        </View>
                        
                        {/* View containing time pickers for start time and end time */}
                        <View style={styles.times}>
                            <View style={{backgroundColor: 'lightyellow', padding: 13, borderRadius: 20}}>
                                <Text style={{fontSize: 18, color: 'goldenrod', fontFamily: 'Tomorrow', alignSelf: 'center', marginBottom: 7}}>Start Time:</Text>
                                <DateTimePicker 
                                    value={startD}
                                    mode="time"
                                    onChange={changeStartTime}
                                />
                            </View>

                            <View style={{backgroundColor: 'lightyellow', padding: 13, borderRadius: 20,}}>
                                <Text style={{fontSize: 18, color: 'goldenrod', fontFamily: 'Tomorrow', alignSelf: 'center', marginBottom: 7}}>End Time:</Text>
                                <DateTimePicker 
                                    value={endD}
                                    mode="time"
                                    onChange={changeEndTime} 
                                />
                            </View>
                        </View>

                        {/* Setting reminders [a day before, 3 days before and a week before the scheduled event] */}
                        <View style={{backgroundColor: 'lightyellow', padding: 13, borderRadius: 20, marginLeft: 20, marginRight: 20, marginTop: 10}}>
                            <Text style={{fontSize: 18, color: 'goldenrod', fontFamily: 'Tomorrow', alignSelf: 'center', marginBottom: 7}} >Set Reminder</Text>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 5}}>
                                <TouchableOpacity style={ select1 ? styles.onSelection : styles.noSelection} 
                                onPress={()=> {
                                    toggleSelect1()
                                    setSelect2(false)
                                    setSelect3(false)
                                    setReminder('1 day before')
                                }}>
                                    <Text style={{alignSelf: 'center'}}>1 day before</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={select2 ? styles.onSelection : styles.noSelection}
                                    onPress={() => {
                                    toggleSelect2()
                                    setSelect1(false)
                                    setSelect3(false)
                                    setReminder('3 days before')
                                    }}>
                                    <Text>3 days before</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity style={select3 ? styles.onSelection : styles.noSelection} 
                                onPress={() => {
                                    toggleSelect3()
                                    setSelect1(false)
                                    setSelect2(false)
                                    setReminder('1 week before')
                                }}>
                                    <Text>1 week before</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{flexDirection: 'row', justifyContent: 'space-around', margin: 10}}>
                            <TouchableOpacity
                                onPress={toggleModal}>
                                <Text style={{fontSize: 18, fontFamily: 'Tomorrow', color: 'grey', marginTop: 10, marginRight: 10}}>DISCARD</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                onPress={()=> {
                                    if(title == "") {
                                        alert('Name input is empty')
                                        toggleModal()
                                    }
                                    else {
                                        onItemSubmit()
                                        createEvent(event_details)
                                        toggleModal()
                                    }
                                }}>
                                <Text style={{fontSize: 18, fontFamily: 'Tomorrow', color: 'navy', marginTop: 10, marginRight: 10}}>SAVE</Text>
                            </TouchableOpacity>
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
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 20,
        backgroundColor: 'lemonchiffon',
        borderColor: 'gold',
        borderBottomWidth: 5,
        borderLeftWidth: 5
    },
    add_event_text: {
        margin: 10, 
        fontSize: 20, 
        fontFamily: 'Tomorrow', 
        color: 'goldenrod'
    },
    new_event_modal: {
        width: 370, 
		height: 550, 
		backgroundColor: 'aliceblue', 
		borderRadius: 25,
        alignSelf: 'center'
    },
    modal_title: {
        fontSize: 25,
        marginTop: 25,
        fontFamily: 'Tomorrow',
        color: 'navy',
        alignSelf: 'center'
    },
    event_date: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginTop: 10, 
        marginRight: 25, 
        marginLeft: 25,
        backgroundColor: 'lightyellow',
        padding: 13,
        borderRadius: 20
    },
    event_name: {
        marginLeft: 25,
        marginTop: 20,
        marginRight: 25,
        backgroundColor: 'lightyellow',
        padding: 15,
        fontSize: 16,
        borderRadius: 20,
    },
    event_desc: {
        marginLeft: 25,
        marginTop: 10,
        marginRight: 25,
        backgroundColor: 'lightyellow',
        padding: 15,
        fontSize: 16,
        borderRadius: 20,
        height: 70
    },
    times: {
        marginTop: 10,
        marginRight: 25, 
        marginLeft: 25,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    onSelection: {
        borderWidth: 1, 
        padding: 7, 
        borderRadius: 15, 
        borderColor: 'sandybrown',
        borderLeftWidth: 3,
        borderBottomWidth: 3,
    },
    noSelection: {
        borderWidth: 1, 
        padding: 7, 
        borderRadius: 15,
        borderColor: 'gold'
    },

});
