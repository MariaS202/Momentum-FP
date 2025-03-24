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
                <TouchableOpacity style={[styles.timer_controls, {alignItems: 'center', margin: 10}]}
                    onPress={() => {
                        const time = new Date()
                        time.setMinutes(time.getMinutes() + 25)
                        restart(time)
                    }}>
                        <Text style={{fontFamily: 'Tomorrow', fontSize: 19, color: 'goldenrod'}}>START 25 MINS</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.7} onPress={()=> setShowPicker(true)}>
                    
                    <View style={{flexDirection: 'row', alignSelf:'center'}}>
                        <Text style={{fontSize: 45, fontFamily: 'Tomorrow', color: 'navy'}}>{hours < 10 ? '0' : ''}{hours}:</Text>
                        <Text style={{fontSize: 45, fontFamily: 'Tomorrow', color: 'goldenrod'}}>{minutes < 10 ? '0' : ''}{minutes}:</Text>
                        <Text style={{fontSize: 45, fontFamily: 'Tomorrow'}}>{seconds < 10 ? '0' : ''}{seconds}</Text>
                    </View>
                </TouchableOpacity>


                <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20}}>

                    <TouchableOpacity style={styles.timer_controls}
                    onPress={resume}> 
                        <Text  style={{fontFamily: 'Tomorrow', fontSize: 19, color: 'goldenrod'}}>START</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={pause} style={styles.timer_controls}>
                        <Text style={{fontFamily: 'Tomorrow', fontSize: 19, color: 'goldenrod'}}>PAUSE</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.timer_controls}
                    onPress={() => {
                        const time = new Date()
                        time.setMinutes(time.getMinutes() + 0)
                        restart(time)
                    }}>
                        <Text style={{fontFamily: 'Tomorrow', fontSize: 19, color: 'goldenrod'}}>RESET</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity activeOpacity={0.7} onPress={()=> setShowPicker(true)}>
                    <Text style={[styles.set_timer_button, {alignSelf: 'center', marginTop: 45}]}>CUSTOM</Text>
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
                <TouchableOpacity style={[styles.timer_controls, {alignItems: 'center', margin: 10}]}
                    onPress={() => {
                        const time = new Date()
                        time.setMinutes(time.getMinutes() + 10)
                        restart(time)
                    }}>
                        <Text style={{fontFamily: 'Tomorrow', fontSize: 19, color: 'goldenrod'}}>START 10 MINS</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.7} onPress={()=> setShowPicker(true)}>
                
                    <View style={{flexDirection: 'row', alignSelf:'center'}}>
                        <Text style={{fontSize: 45, fontFamily: 'Tomorrow', color: 'navy'}}>{hours < 10 ? '0' : ''}{hours}:</Text>
                        <Text style={{fontSize: 45, fontFamily: 'Tomorrow', color: 'goldenrod'}}>{minutes < 10 ? '0' : ''}{minutes}:</Text>
                        <Text style={{fontSize: 45, fontFamily: 'Tomorrow',}}>{seconds < 10 ? '0' : ''}{seconds}</Text>
                    </View>

                </TouchableOpacity>

        
                <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20}}>
                    <TouchableOpacity style={styles.timer_controls}
                        onPress={resume}> 
                            <Text  style={{fontFamily: 'Tomorrow', fontSize: 19, color: 'goldenrod'}}>START</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={pause} style={styles.timer_controls}>
                            <Text style={{fontFamily: 'Tomorrow', fontSize: 19, color: 'goldenrod'}}>PAUSE</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.timer_controls}
                        onPress={() => {
                            const time = new Date()
                            time.setMinutes(time.getMinutes() + 0)
                            restart(time)
                        }}>
                            <Text style={{fontFamily: 'Tomorrow', fontSize: 19, color: 'goldenrod'}}>RESET</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity activeOpacity={0.7} onPress={()=> setShowPicker(true)}>
                    <Text style={[styles.set_timer_button, {alignSelf: 'center', marginTop: 45}]}>CUSTOM</Text>
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
                <TouchableOpacity style={[styles.timer_controls, {alignItems: 'center', margin: 10}]}
                    onPress={() => {
                        const time = new Date()
                        time.setMinutes(time.getMinutes() + 20)
                        restart(time)
                    }}>
                        <Text style={{fontFamily: 'Tomorrow', fontSize: 19, color: 'goldenrod'}}>START 20 MINS</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.7} onPress={()=> setShowPicker(true)}>
                
                    <View style={{flexDirection: 'row', alignSelf:'center'}}>
                        <Text style={{fontSize: 45, fontFamily: 'Tomorrow', color: 'navy'}}>{hours < 10 ? '0' : ''}{hours}:</Text>
                        <Text style={{fontSize: 45, fontFamily: 'Tomorrow', color: 'goldenrod'}}>{minutes < 10 ? '0' : ''}{minutes}:</Text>
                        <Text style={{fontSize: 45, fontFamily: 'Tomorrow',}}>{seconds < 10 ? '0' : ''}{seconds}</Text>
                    </View>

                </TouchableOpacity>

        
                <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20}}>
                    <TouchableOpacity style={styles.timer_controls}
                        onPress={resume}> 
                            <Text  style={{fontFamily: 'Tomorrow', fontSize: 19, color: 'goldenrod'}}>START</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={pause} style={styles.timer_controls}>
                            <Text style={{fontFamily: 'Tomorrow', fontSize: 19, color: 'goldenrod'}}>PAUSE</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.timer_controls}
                        onPress={() => {
                            const time = new Date()
                            time.setMinutes(time.getMinutes() + 0)
                            restart(time)
                        }}>
                            <Text style={{fontFamily: 'Tomorrow', fontSize: 19, color: 'goldenrod'}}>RESET</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity activeOpacity={0.7} onPress={()=> setShowPicker(true)}>
                    <Text style={[styles.set_timer_button, {alignSelf: 'center', marginTop: 45}]}>CUSTOM</Text>
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
            </View>
        );
    }

    // ========================================================================================================

    return (
        <SafeAreaView style={styles.container}>
            <View style={{flexDirection: 'row', marginTop: 20}}>
                <MaterialCommunityIcons name="arrow-left-bold-circle-outline" size={40} onPress={()=> navigation.goBack()} style={{marginLeft: 20, marginRight: 40}} color={'orange'}/>

                <Text style={{fontSize: 35,  alignSelf: 'center', fontFamily: 'Tomorrow', color: 'navy'}}>POMODORO</Text>
            </View>
            
            <View style={{flexDirection: 'row', marginTop: 20, justifyContent: 'space-evenly', margin: 5,}}>
                {/* Pomodoro */}
                <TouchableOpacity style={pomodoroDisplay ? styles.onselect : styles.buttons_psl} 
                    onPress={() => {
                        setPomodoroDisplay(true)
                        setShortBreakDisplay(false)
                        setLongBreakDisplay(false)
                    }}>
                    <Text style={{fontSize: 17, fontFamily: 'Tomorrow', color:'goldenrod'}}>Pomodoro</Text>
                </TouchableOpacity>

                {/* Short Break */}
                <TouchableOpacity style={shortBreakDisplay ?  styles.onselect : styles.buttons_psl}
                    onPress={() => {
                        setShortBreakDisplay(true)
                        setPomodoroDisplay(false)
                        setLongBreakDisplay(false)
                    }}>
                    <Text style={{fontSize: 17, fontFamily: 'Tomorrow', color:'goldenrod'}}>Short Break</Text>
                </TouchableOpacity>

                {/* Long Break */}
                <TouchableOpacity style={longBreakDisplay ?  styles.onselect : styles.buttons_psl}
                    onPress={() => {
                        setLongBreakDisplay(true)
                        setShortBreakDisplay(false)
                        setPomodoroDisplay(false)
                    }}>
                    <Text style={{fontSize: 17, fontFamily: 'Tomorrow', color:'goldenrod'}}>Long Break</Text>
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
                    <Text style={styles.bs_title}>BACKGROUND SOUNDS</Text>

                    {/* Modal containing 5 background sounds (looped) */}
                    <Modal isVisible={isModalVisible} onSwipeComplete={()=>setModalVisible(false)}  backdropOpacity={0.4}>
                        <View style={styles.modal}> 
                            <Text style={{fontSize: 19, flexWrap: 'wrap', alignSelf: 'center', marginTop: 15, margin: 10, textAlign: 'center', fontFamily: 'Tomorrow', color: 'navy'}}>Background Sounds for your focus sessions</Text>

                            <View style={styles.sound}>
                                <Text style={{alignSelf: 'center', fontSize: 17, fontFamily: 'Tomorrow', color: 'goldenrod'}}>OCEAN WAVES</Text>
                                <MaterialCommunityIcons name="volume-high" size={25} onPress={playSound1} style={{alignSelf: 'flex-end', borderWidth: 1, borderRadius: 30, padding: 3, borderColor: 'navy'}} color={'navy'}/>
                            </View>

                            <View style={styles.sound}>
                                <Text style={{alignSelf: 'center', fontSize: 17, fontFamily: 'Tomorrow', color: 'goldenrod'}}>BROWN NOISE</Text>
                                <MaterialCommunityIcons name="volume-high" size={25} onPress={playSound2} style={{alignSelf: 'flex-end', borderWidth: 1, borderRadius: 30, padding: 3, borderColor: 'navy'}} color={'navy'}/>
                            </View>

                            <View style={styles.sound}>
                                <Text style={{alignSelf: 'center', fontSize: 17, fontFamily: 'Tomorrow', color: 'goldenrod'}}>NATURE SOUNDS</Text>
                                <MaterialCommunityIcons name="volume-high" size={25} onPress={playSound3} style={{alignSelf: 'flex-end', borderWidth: 1, borderRadius: 30, padding: 3, borderColor: 'navy'}} color={'navy'}/>
                            </View>

                            <View style={styles.sound}>
                                <Text style={{alignSelf: 'center', fontSize: 17, fontFamily: 'Tomorrow', color: 'goldenrod'}}>FIRE CRACKLING SOUNDS</Text>
                                <MaterialCommunityIcons name="volume-high" size={25} onPress={playSound4} style={{alignSelf: 'flex-end', borderWidth: 1, borderRadius: 30, padding: 3, borderColor: 'navy'}} color={'navy'}/>
                            </View>

                            <View style={styles.sound}>
                                <Text style={{alignSelf: 'center', fontSize: 17, fontFamily: 'Tomorrow', color: 'goldenrod'}}>RAIN SOUNDS</Text>
                                <MaterialCommunityIcons name="volume-high" size={25} onPress={playSound5} style={{alignSelf: 'flex-end', borderWidth: 1, borderRadius: 30, padding: 3, borderColor: 'navy'}} color={'navy'}/>
                            </View>

                            <View style={{flexDirection:'row', justifyContent: 'space-around', marginTop:30}}>
                                <TouchableOpacity style={styles.stop_sound} onPress={stopSound}>
                                    <Text style={{alignSelf: 'center', fontSize: 17, fontWeight: 'bold', fontFamily: 'Tomorrow', color: 'navy'}}>STOP SOUND</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity onPress={toggleModal} style={{alignSelf: 'center'}}> 
                                    <Text style={{alignSelf: 'center', fontSize: 17, color: 'grey', fontFamily: 'Tomorrow'}}>CLOSE</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </Modal>
                </TouchableOpacity>

                <MaterialCommunityIcons name="stop-circle" size={50} onPress={stopSound} style={{alignSelf: 'center'}} color={'navy'}/>
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'lightyellow',
    },
    timer_view: {
        borderWidth: 1,
        borderRadius: 20,
        margin: 20,
        padding: 15,
        borderLeftWidth: 5,
        borderBottomWidth: 5,
        borderColor: 'goldenrod'
    },
    set_timer_button: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderWidth: 2,
        borderRadius: 10,
        fontSize: 18,
        overflow: "hidden",
        borderColor: "goldenrod",
        color: "navy",
        fontFamily: 'Tomorrow',
        marginTop: 10
    },
    task_name: {
        fontSize: 25,
        alignSelf: 'center',
        fontWeight: '500',
        color: 'midnightblue',
        fontFamily: 'Noto-arabic'
    },
    buttons_psl: {
        borderWidth: 1.5,
        padding: 10,
        borderRadius: 15,
        borderBottomWidth: 4,
        borderRightWidth: 4,
        borderColor: 'midnightblue' 
    },
    modal: {
        width: 350, 
		height: 550, 
		backgroundColor: 'aliceblue', 
		borderRadius: 20, 
        alignSelf: 'center'
    },
    bs_title: {
        borderWidth: 2, 
        padding: 10, 
        margin: 10, 
        borderRadius: 15, 
        alignSelf: 'center', 
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Tomorrow',
        color: 'navy',
        borderColor: 'goldenrod'
    },
    sound: {
        borderWidth: 1,
        marginTop: 15,
        marginLeft: 20,
        marginRight: 20,
        padding: 10,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        borderBottomWidth: 3,
        borderColor: 'navy'
    },
    stop_sound: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderWidth: 3,
        alignSelf: 'center',
        padding: 10,
        borderRadius: 15,
        borderColor: 'goldenrod'
    },
    onselect: {
        borderWidth: 2,
        padding: 10,
        borderRadius: 15,
        borderTopWidth: 4,
        borderLeftWidth: 4,
        borderColor: 'navy',

    },
    timer_controls: {
        borderWidth: 2, 
        padding: 7, 
        borderRadius: 10, 
        borderColor: 'navy'
    }
});
