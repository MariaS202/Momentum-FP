import { View, Text, StyleSheet, SafeAreaView, Button, TouchableOpacity} from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TasksContext } from "./Context";
import { useContext, useState, useEffect } from "react";
import { useTimer } from 'react-timer-hook';
import { TimerPickerModal } from "react-native-timer-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Audio } from "expo-av";
import Modal from "react-native-modal";


export default function Pomodoro({navigation}) {
    const {name} = useContext(TasksContext)
    const [pomodoroDisplay, setPomodoroDisplay] = useState(false)
    const [shortBreakDisplay, setShortBreakDisplay] = useState(false)
    const [longBreakDisplay, setLongBreakDisplay] = useState(false)
    const [pomodoroTimer, setPomodoroTimer] = useState(new Date())
    const [shortBreakTimer, setShortBreakTimer] = useState(new Date())
    const [longBreakTimer, setLongBreakTimer] = useState(new Date())
    const [showPicker, setShowPicker] = useState(false);  
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };   
    const [sound, setSound] = useState()

    async function playSound1() {
        // This sound from https://pixabay.com/sound-effects/gentle-ocean-waves-birdsong-and-gull-7109/
        console.log('sound loading');
        const {sound} = await Audio.Sound.createAsync(require('./assets/gentle-ocean-waves-birdsong-and-gull-7109.mp3'))        
        sound.setIsLoopingAsync(true)
        setSound(sound)
        await sound.playAsync();
    }

    async function playSound2() {
        // This sound is from https://pixabay.com/sound-effects/relaxing-smoothed-brown-noise-294838/
        console.log('sound loading');
        const {sound} = await Audio.Sound.createAsync(require('./assets/relaxing-smoothed-brown-noise-294838.mp3'))   
        sound.setIsLoopingAsync(true)
        setSound(sound)

        await sound.playAsync();
    }
    
    async function playSound3() {
        // This sound is from https://pixabay.com/sound-effects/rainy-day-in-town-with-birds-singing-194011/
        console.log('sound loading');
        const {sound} = await Audio.Sound.createAsync(require('./assets/rainy-day-in-town-with-birds-singing-194011.mp3'))  
        sound.setIsLoopingAsync(true)
        setSound(sound)

        await sound.playAsync();
    }

    async function playSound4() {
        // This sound is from https://pixabay.com/sound-effects/crackling-fire-sound-307026/
        console.log('sound loading');
        const {sound} = await Audio.Sound.createAsync(require('./assets/crackling-fire-sound-307026.mp3'))    
        sound.setIsLoopingAsync(true)
        setSound(sound)

        await sound.playAsync();
    }

    async function playSound5() {
        // This sound is from https://pixabay.com/sound-effects/rain-sounds-relaxing-noise-and-sound-of-summer-rain-143334/
        console.log('sound loading');
        const {sound} = await Audio.Sound.createAsync(require('./assets/rain-sounds-relaxing-noise-and-sound-of-summer-rain-143334.mp3'))      
        sound.setIsLoopingAsync(true)  
        setSound(sound)

        await sound.playAsync();
    }

    async function stopSound() {
        console.log('stopping sound');
        await sound.pauseAsync();
    }

    useEffect(() => {
        return sound
        ? () => {
            console.log('unloading sound');
            sound.unloadAsync()
            
        } : undefined
    }, [sound])
    
    // to set pomodoro display to default
    if (!pomodoroDisplay && !shortBreakDisplay && !longBreakDisplay) {
        setPomodoroDisplay(true)
        setLongBreakDisplay(false)
        setShortBreakDisplay(false)
    }

    // Setting timer for Pomodoro session
    function PomodoroTimer ({expiryTimestamp}) {
        const {
            seconds,
            minutes,
            hours,
            isRunning,
            pause,
            resume,
            restart,
        } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called'), autoStart: false });

    
        const formatTime = (pickedDuration) => {
            const time = new Date()
            time.setHours(time.getHours() + pickedDuration.hours)
            time.setMinutes(time.getMinutes() + pickedDuration.minutes)
            time.setSeconds(time.getSeconds() + pickedDuration.seconds)
            return time
        }
    
        return (
            <View>
                <TouchableOpacity activeOpacity={0.7} onPress={()=> setShowPicker(true)}>

                    <View style={{flexDirection: 'row', alignSelf:'center'}}>
                        <Text style={{fontSize: 25, fontWeight: '500'}}>{hours < 10 ? '0' : ''}{hours}:</Text>
                        <Text style={{fontSize: 25, fontWeight: '500'}}>{minutes < 10 ? '0' : ''}{minutes}:</Text>
                        <Text style={{fontSize: 25, fontWeight: '500'}}>{seconds < 10 ? '0' : ''}{seconds}</Text>
                    </View>

                    <TouchableOpacity activeOpacity={0.7} onPress={()=> setShowPicker(true)}>
                        <Text style={[styles.set_timer_button, {alignSelf: 'center'}]}> Set Pomodoro </Text>
                    </TouchableOpacity>
                </TouchableOpacity>

                <TimerPickerModal 
                    visible={showPicker}
                    setIsVisible={setShowPicker}
                    onCancel={() => setShowPicker(false)}
                    onConfirm={(pickedDuration)=>{
                        setPomodoroTimer(formatTime(pickedDuration))
                        setShowPicker(false)
                    }}
                    closeOnOverlayPress
                    modalTitle="Set Pomodoro Timer"
                    LinearGradient={LinearGradient}
                    styles={{theme:'light'}}
                />

                <Text style={{alignSelf:'center'}}>{isRunning ? 'Running' : 'Not running'}</Text>

                <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                    <Button title="Start" onPress={resume}/>
                    <Button title="Pause" onPress={pause}/>
                    <Button title="Start 25 mins" onPress={() => {
                        const time = new Date()
                        time.setMinutes(time.getMinutes() + 25)
                        restart(time)
                    }}/>
                    <Button title="Reset" onPress={() => {
                        const time = new Date()
                        time.setMinutes(time.getMinutes() + 0)
                        restart(time)
                    }}/>
                    
                </View>
            </View>
        );

    }

    // Setting Timer for Short break
    function ShortBreak ({expiryTimestamp}) {
        const {
            seconds,
            minutes,
            hours,
            isRunning,
            pause,
            resume,
            restart,
        } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called'), autoStart: false });

    
        const formatTime = (pickedDuration) => {
            const time = new Date()
            time.setHours(time.getHours() + pickedDuration.hours)
            time.setMinutes(time.getMinutes() + pickedDuration.minutes)
            time.setSeconds(time.getSeconds() + pickedDuration.seconds)
            return time
        }
    
        return (
            <View>
                <TouchableOpacity activeOpacity={0.7} onPress={()=> setShowPicker(true)}>
                    <View style={{flexDirection: 'row', alignSelf:'center'}}>
                        <Text style={{fontSize: 25, fontWeight: '500'}}>{hours < 10 ? '0' : ''}{hours}:</Text>
                        <Text style={{fontSize: 25, fontWeight: '500'}}>{minutes < 10 ? '0' : ''}{minutes}:</Text>
                        <Text style={{fontSize: 25, fontWeight: '500'}}>{seconds < 10 ? '0' : ''}{seconds}</Text>
                    </View>

                    <TouchableOpacity activeOpacity={0.7} onPress={()=> setShowPicker(true)}>
                        <Text style={[styles.set_timer_button, {alignSelf: 'center'}]}> Set Short Break </Text>
                    </TouchableOpacity>
                </TouchableOpacity>

            
                <TimerPickerModal 
                    visible={showPicker}
                    setIsVisible={setShowPicker}
                    onCancel={() => setShowPicker(false)}
                    onConfirm={(pickedDuration)=>{
                        setShortBreakTimer(formatTime(pickedDuration))
                        setShowPicker(false)
                    }}
                    closeOnOverlayPress
                    modalTitle="Set Short Break Timer"
                    LinearGradient={LinearGradient}
                    styles={{theme:'light'}}
                />

                <Text style={{alignSelf:'center'}}>{isRunning ? 'Running' : 'Not running'}</Text>

                <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                    <Button title="Start" onPress={resume}/>
                    <Button title="Pause" onPress={pause}/>
                    <Button title="Restart" onPress={() => {
                        const time = new Date();
                        time.setSeconds(time.getSeconds() + 0);
                        restart(time)
                    }}/>
                </View>
            </View>
        );
    }

    // Setting timer for Long break
    function LongBreak ({expiryTimestamp}) {
        const {
            seconds,
            minutes,
            hours,
            isRunning,
            pause,
            resume,
            restart,
        } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called'), autoStart: false });

    
        const formatTime = (pickedDuration) => {
            const time = new Date()
            time.setHours(time.getHours() + pickedDuration.hours)
            time.setMinutes(time.getMinutes() + pickedDuration.minutes)
            time.setSeconds(time.getSeconds() + pickedDuration.seconds)
            return time
        }
    
        return (
            <View>
                <TouchableOpacity activeOpacity={0.7} onPress={()=> setShowPicker(true)}>

                    <View style={{flexDirection: 'row', alignSelf:'center'}}>
                        <Text style={{fontSize: 25, fontWeight: '500'}}>{hours < 10 ? '0' : ''}{hours}:</Text>
                        <Text style={{fontSize: 25, fontWeight: '500'}}>{minutes < 10 ? '0' : ''}{minutes}:</Text>
                        <Text style={{fontSize: 25, fontWeight: '500'}}>{seconds < 10 ? '0' : ''}{seconds}</Text>
                    </View>

                    <TouchableOpacity activeOpacity={0.7} onPress={()=> setShowPicker(true)}>
                        <Text style={[styles.set_timer_button, {alignSelf: 'center'}]}> Set Long Break </Text>
                    </TouchableOpacity>
                </TouchableOpacity>

                <TimerPickerModal 
                    visible={showPicker}
                    setIsVisible={setShowPicker}
                    onCancel={() => setShowPicker(false)}
                    onConfirm={(pickedDuration)=>{
                        setLongBreakTimer(formatTime(pickedDuration))
                        setShowPicker(false)
                    }}
                    closeOnOverlayPress
                    modalTitle="Set Long Break Timer"
                    LinearGradient={LinearGradient}
                    styles={{theme:'light'}}
                />

                <Text style={{alignSelf:'center'}}>{isRunning ? 'Running' : 'Not running'}</Text>

                <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                    <Button title="Start" onPress={resume}/>
                    <Button title="Pause" onPress={pause}/>
                    <Button title="Restart" onPress={() => {
                        const time = new Date();
                        time.setSeconds(time.getSeconds() + 0);
                        restart(time)
                    }}/>
                </View>
            </View>
        );
    }

    // ========================================================================================================

    return (
        <SafeAreaView style={styles.container}>
            <MaterialCommunityIcons name="arrow-left-bold-circle-outline" size={40} onPress={()=> navigation.goBack()} style={{marginLeft: 20, }} color={'orange'}/>

            <Text style={{fontSize: 35,  fontWeight: 'bold', alignSelf: 'center'}}>Pomodoro</Text>
            
            <View style={{flexDirection: 'row', marginTop: 20, justifyContent: 'space-evenly', margin: 5,}}>
                {/* Pomodoro */}
                <TouchableOpacity style={styles.buttons_psl} 
                    onPress={() => {
                        setPomodoroDisplay(true)
                        setShortBreakDisplay(false)
                        setLongBreakDisplay(false)
                    }}>
                    <Text style={{fontSize: 17}}>Pomodoro</Text>
                </TouchableOpacity>

                {/* Short Break */}
                <TouchableOpacity style={styles.buttons_psl}
                    onPress={() => {
                        setShortBreakDisplay(true)
                        setPomodoroDisplay(false)
                        setLongBreakDisplay(false)
                    }}>
                    <Text style={{fontSize: 17}}>Short Break</Text>
                </TouchableOpacity>

                {/* Long Break */}
                <TouchableOpacity style={styles.buttons_psl}
                    onPress={() => {
                        setLongBreakDisplay(true)
                        setShortBreakDisplay(false)
                        setPomodoroDisplay(false)
                    }}>
                    <Text style={{fontSize: 17}}>Long Break</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.timer_view}>

                <Text style={styles.task_name}>{name}</Text>
                {pomodoroDisplay && <PomodoroTimer expiryTimestamp={pomodoroTimer}/>}
                {shortBreakDisplay && <ShortBreak expiryTimestamp={shortBreakTimer}/>}
                {longBreakDisplay && <LongBreak expiryTimestamp={longBreakTimer}/>}

            </View>

            <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
                <TouchableOpacity onPress={toggleModal}>
                    <Text style={styles.bs_title}>Background Sounds</Text>

                    {/* Modal containing 5 background sounds (looped) */}
                    <Modal isVisible={isModalVisible} onSwipeComplete={()=>setModalVisible(false)}  backdropOpacity={0.4}>
                        <View style={styles.modal}> 
                            <Text style={{fontSize: 17, flexWrap: 'wrap', alignSelf: 'center', marginTop: 15, margin: 10, textAlign: 'center'}}>Background Sounds for your focus sessions</Text>

                            <View style={styles.sound}>
                                <Text style={{alignSelf: 'center', fontSize: 17}}>Ocean waves</Text>
                                <MaterialCommunityIcons name="volume-high" size={25} onPress={playSound1} style={{alignSelf: 'flex-end', borderWidth: 1, borderRadius: 30, padding: 3}}/>
                            </View>

                            <View style={styles.sound}>
                                <Text style={{alignSelf: 'center', fontSize: 17}}>Brown noise</Text>
                                <MaterialCommunityIcons name="volume-high" size={25} onPress={playSound2} style={{alignSelf: 'flex-end', borderWidth: 1, borderRadius: 30, padding: 3}}/>
                            </View>

                            <View style={styles.sound}>
                                <Text style={{alignSelf: 'center', fontSize: 17}}>Nature Sounds</Text>
                                <MaterialCommunityIcons name="volume-high" size={25} onPress={playSound3} style={{alignSelf: 'flex-end', borderWidth: 1, borderRadius: 30, padding: 3}}/>
                            </View>

                            <View style={styles.sound}>
                                <Text style={{alignSelf: 'center', fontSize: 17}}>Fire crackling sound</Text>
                                <MaterialCommunityIcons name="volume-high" size={25} onPress={playSound4} style={{alignSelf: 'flex-end', borderWidth: 1, borderRadius: 30, padding: 3}}/>
                            </View>

                            <View style={styles.sound}>
                                <Text style={{alignSelf: 'center', fontSize: 17}}>Rain Sounds</Text>
                                <MaterialCommunityIcons name="volume-high" size={25} onPress={playSound5} style={{alignSelf: 'flex-end', borderWidth: 1, borderRadius: 30, padding: 3}}/>
                            </View>

                            <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}>
                                <TouchableOpacity style={styles.stop_sound} onPress={stopSound}>
                                    <Text style={{alignSelf: 'center', fontSize: 17, fontWeight: 'bold'}}>Stop Sound</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity onPress={toggleModal} style={{alignSelf: 'center'}}> 
                                    <Text style={{alignSelf: 'center', fontSize: 17, fontWeight: '500', color: 'blue'}}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </Modal>
                </TouchableOpacity>

                <MaterialCommunityIcons name="stop-circle-outline" size={60} onPress={stopSound} style={{alignSelf: 'center'}}/>
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    timer_view: {
        borderWidth: 1,
        borderRadius: 20,
        margin: 20,
        height: 400,
        paddingTop: 15
    },
    set_timer_button: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderWidth: 1,
        borderRadius: 10,
        fontSize: 16,
        overflow: "hidden",
        borderColor: "#8C8C8C",
        color: "#8C8C8C"
    },
    task_name: {
        fontSize: 25,
        alignSelf: 'center',
        fontWeight: '500',
        color: 'darkslateblue',
        fontStyle: 'italic'
    },
    buttons_psl: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 10
    },
    modal: {
        width: 350, 
		height: 550, 
		backgroundColor: 'white', 
		borderRadius: 20, 
        alignSelf: 'center'
    },
    bs_title: {
        borderWidth: 1, 
        padding: 10, 
        margin: 10, 
        borderRadius: 15, 
        alignSelf: 'center', 
        fontSize: 18,
        fontWeight: 'bold'
    },
    sound: {
        borderWidth: 1,
        margin: 10,
        marginLeft: 20,
        marginRight: 20,
        padding: 10,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    stop_sound: {
        margin: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderWidth: 2,
        alignSelf: 'center',
        padding: 10,
        borderRadius: 20
    }
});
