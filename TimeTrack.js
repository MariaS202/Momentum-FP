import { useContext } from "react";
import { TasksContext } from "./Context";
import { View, Text, StyleSheet, SafeAreaView, Button} from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useStopwatch } from 'react-timer-hook';

export default function TimeTrack({navigation}) {
    const {name} = useContext(TasksContext)

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

                <Text style={{alignSelf:'center'}}>{isRunning ? 'Running' : 'Not running'}</Text>

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
                {/* This view includes:
                * Task name
                * Timer clock
                * Start, Stop and Pause Buttons
                */}
                <Text>{name}</Text>
                <Stopwatch />
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
});