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
                    <Text>{hours < 10 ? '0' : ''}{hours}:</Text>
                    <Text>{minutes < 10 ? '0' : ''}{minutes}:</Text>
                    <Text>{seconds < 10 ? '0' : ''}{seconds}</Text>
                </View>

                <Text style={{alignSelf:'center'}}>{isRunning ? 'Timer has started!' : 'Start your Timer!'}</Text>

                <View style={{flexDirection: 'row'}}>
                    <Button title="Start" onPress={start}/>
                    <Button title="Pause" onPress={pause}/>
                    <Button title="Reset" onPress={reset}/>
                </View>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>

            <MaterialCommunityIcons name="arrow-left-bold-circle-outline" size={40} onPress={()=> navigation.goBack()} style={{marginLeft: 10, }} color={'orange'}/>
            <Text style={{fontSize: 35,  fontWeight: 'bold', alignSelf: 'center'}}>Time Track</Text>

            <View style={styles.timer_view}>
                <Text style={styles.task_name}>{name}</Text>
                <Stopwatch />
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
        alignItems: 'center',
        margin: 25,
        height: 400
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
    },
    task_name: {
        fontSize: 25,
        alignSelf: 'center',
        fontWeight: '500',
        color: 'darkslateblue',
        fontStyle: 'italic'
    },

});