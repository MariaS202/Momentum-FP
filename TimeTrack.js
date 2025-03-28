import { useContext, useState, useEffect } from "react";
import { TasksContext } from "./Context";
import { View, Text, StyleSheet, SafeAreaView, Button, TouchableOpacity} from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useStopwatch } from 'react-timer-hook';
import { Audio } from "expo-av";
import Modal from "react-native-modal";


export default function TimeTrack({navigation}) {
    const {name} = useContext(TasksContext)
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

    function Stopwatch() {
        const {
            seconds,
            minutes,
            hours,
            isRunning,
            start,
            pause,
            reset,
        } = useStopwatch();
        
        return (
            <View>
                <View style={{flexDirection: 'row', alignSelf:'center'}}>
                    <Text style={{fontSize: 45, fontFamily: 'Tomorrow', color: 'navy'}}>{hours < 10 ? '0' : ''}{hours}:</Text>
                    <Text style={{fontSize: 45, fontFamily: 'Tomorrow', color: 'goldenrod'}}>{minutes < 10 ? '0' : ''}{minutes}:</Text>
                    <Text style={{fontSize: 45, fontFamily: 'Tomorrow',}}>{seconds < 10 ? '0' : ''}{seconds}</Text>
                </View>

                <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 40}}>
                    <TouchableOpacity style={styles.timer_controls}
                    onPress={start}> 
                        <Text  style={{fontFamily: 'Tomorrow', fontSize: 19, color: 'goldenrod'}}>START</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={pause} style={styles.timer_controls}>
                        <Text style={{fontFamily: 'Tomorrow', fontSize: 19, color: 'goldenrod'}}>PAUSE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.timer_controls}
                    onPress={reset}>
                        <Text style={{fontFamily: 'Tomorrow', fontSize: 19, color: 'goldenrod'}}>RESET</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>

            <View style={{flexDirection: 'row', marginTop: 20}}>
                <MaterialCommunityIcons name="arrow-left-bold-circle-outline" size={40} onPress={()=> navigation.goBack()} style={{marginLeft: 20, marginRight: 40}} color={'orange'}/>

                <Text style={{fontSize: 35,  alignSelf: 'center', fontFamily: 'Tomorrow', color: 'navy'}}>TIME TRACK</Text>
            </View>

            <View style={styles.timer_view}>
                <Text style={styles.task_name}>{name}</Text>
                <Stopwatch />
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
        borderColor: 'goldenrod',
        paddingBottom: 50,
        marginTop: 40
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
    task_name: {
        fontSize: 25,
        alignSelf: 'center',
        fontWeight: '500',
        color: 'midnightblue',
        fontFamily: 'Noto-arabic'
    },
    timer_controls: {
        borderWidth: 2, 
        padding: 7, 
        borderRadius: 10, 
        borderColor: 'navy'
    }

});