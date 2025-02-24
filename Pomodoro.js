import { View, Text, StyleSheet, SafeAreaView, Button, TouchableOpacity} from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TasksContext } from "./Context";
import { useContext, useState } from "react";
import { useTimer } from 'react-timer-hook';

export default function Pomodoro({navigation}) {
    const {name} = useContext(TasksContext)
    const [pomodoroDisplay, setPomodoroDisplay] = useState(false)
    const [shortBreakDisplay, setShortBreakDisplay] = useState(false)
    const [longBreakDisplay, setLongBreakDisplay] = useState(false)

    const time = new Date();
    time.setSeconds(time.getSeconds() + 2500);

    // to set pomodoro display to default
    if (!pomodoroDisplay && !shortBreakDisplay && !longBreakDisplay) {
        setPomodoroDisplay(true)
        setLongBreakDisplay(false)
        setShortBreakDisplay(false)
    }

    function PomodoroTimer ({expiryTimestamp}) {
        const {
            seconds,
            minutes,
            hours,
            isRunning,
            start,
            pause,
            resume,
            restart,
        } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called'), autoStart: false });

        return (
            <View>
                <View style={{flexDirection: 'row', alignSelf:'center'}}>
                    <Text>{hours < 10 ? '0' : ''}{hours}:</Text>
                    <Text>{minutes < 10 ? '0' : ''}{minutes}:</Text>
                    <Text>{seconds < 10 ? '0' : ''}{seconds}</Text>
                </View>

                <Text style={{alignSelf:'center'}}>{isRunning ? 'Running' : 'Not running'}</Text>

                <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                    <Button title="Start" onPress={start}/>
                    <Button title="Pause" onPress={pause}/>
                    <Button title="Resume" onPress={resume}/>
                    <Button title="Restart" onPress={() => {
                        const time = new Date();
                        time.setSeconds(time.getSeconds() + 600);
                        restart(time)
                    }}/>
                </View>
            </View>
        );

    }

    function ShortBreak () {
        return (
            <View>
                <Text> Short Break</Text>
            </View>
        );
    }

    function LongBreak () {
        return (
            <View>
                <Text> Long Break</Text>
            </View>
        );
    }

    // ========================================================================================================

    return (
        <SafeAreaView style={styles.container}>
            <MaterialCommunityIcons name="arrow-left-bold-circle-outline" size={40} onPress={()=> navigation.goBack()} style={{marginLeft: 20, }} color={'orange'}/>

            <Text style={{fontSize: 35,  fontWeight: 'bold', alignSelf: 'center'}}>Pomodoro</Text>
            
            <View style={styles.timer_view}>

                <View style={{flexDirection: 'row', margin: 10, justifyContent: 'space-evenly'}}>
                    {/* this view includes: Pomodoro, Short Break and Long Break */}
                    {/* Pomodoro */}
                    <TouchableOpacity onPress={() => {
                            setPomodoroDisplay(true)
                            setShortBreakDisplay(false)
                            setLongBreakDisplay(false)
                        }}>
                        <Text>Pomodoro</Text>
                    </TouchableOpacity>

                    {/* Short Break */}
                    <TouchableOpacity onPress={() => {
                            setShortBreakDisplay(true)
                            setPomodoroDisplay(false)
                            setLongBreakDisplay(false)
                        }}>
                        <Text>Short Break</Text>
                    </TouchableOpacity>

                    {/* Long Break */}
                    <TouchableOpacity onPress={() => {
                            setLongBreakDisplay(true)
                            setShortBreakDisplay(false)
                            setPomodoroDisplay(false)
                        }}>
                        <Text>Long Break</Text>
                    </TouchableOpacity>
                </View>

                {/* This view includes:
                * Task name
                * Timer clock
                * Start, Stop and Pause Buttons
                */}
                <Text>{name}</Text>

                {/* <PomodoroTimer expiryTimestamp={time}/> */}
                {pomodoroDisplay && <PomodoroTimer expiryTimestamp={time}/>}
                {shortBreakDisplay && <ShortBreak />}
                {longBreakDisplay && <LongBreak />}

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
        margin: 25,
        height: 400
    },
});