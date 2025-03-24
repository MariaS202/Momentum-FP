import { View, Text, StyleSheet, TouchableOpacity, Switch} from "react-native";
import { auth } from "./firebaseConfig";
import { signOut } from "firebase/auth";
import Login from "./Login";
import { useContext, useState } from "react";
import { TasksContext } from "./Context";
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location'
import * as Calendar from 'expo-calendar';


export default function Settings({navigation}) {
    const {pass, setPass} = useContext(TasksContext)
    const {email, setEmail} = useContext(TasksContext)
    const [isNotifsEnabled, setIsNotifsEnabled] = useState(false);
    const toggleNotifsSwitch = () => setIsNotifsEnabled(!isNotifsEnabled);
    const [isLocEnabled, setIsLocEnabled] = useState(false)
    const toggleLocsSwitch = () => setIsLocEnabled(!isLocEnabled)
    const [isCalEnabled, setIsCalEnabled] = useState(false)
    const toggleCalSwitch = ()=> setIsCalEnabled(!isCalEnabled)

    const userSignOut = () => {
        signOut(auth)
        .then(()=> {
            console.log('user signed out successfully');
            navigation.navigate(Login)
            
        })
        .catch((e) => {
            console.log('error', e);
            
        })
    }

    const notificationsPermission = async() => {        
        const {status} = await Notifications.requestPermissionsAsync()
        if(status === 'granted') {
            setIsNotifsEnabled(true)
            console.log('notifications permissions granted');
        }
        else {
            setIsNotifsEnabled(false)
            console.log('notifications permissions not granted');   
        }
    }

    const locationsPermissions = async() => {
        const {status} = await Location.requestForegroundPermissionsAsync();
            if(status !== 'granted') {
                console.log('Locations permissions not granted');
                setIsLocEnabled(false)
                return
            }
            else {
                setIsLocEnabled(true)
                console.log('Locations permission enabled');
            }
    }

    const calendarPermissions = async() => {
        const { status } = await Calendar.requestCalendarPermissionsAsync();
        if (status === 'granted') {            
            setIsCalEnabled(true)
            console.log('Calendar permission granted');
        }
        else {
            setIsCalEnabled(false)
            console.log('Calendar permissions denied');
        }
    }

    return (
        <View style={styles.container}>
            <Text style={{fontSize: 28, marginTop: 45, fontFamily:'Tomorrow', color: 'midnightblue'}}>SETTINGS</Text>
            
            {/* User Information */}
            <View style={styles.settings_sections}>
                <Text style={{alignSelf: 'center', fontFamily: 'Tomorrow', color: 'goldenrod', fontSize: 22, textDecorationStyle: 'dotted'}}>User Information</Text>

                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                    <Text style={{fontSize: 18, fontFamily: 'Noto-arabic', color: 'navy'}}>Email: </Text>
                    <Text style={{fontSize: 18, fontFamily: 'Noto-arabic'}}>{email}</Text>
                </View>

                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{fontSize: 18, fontFamily: 'Noto-arabic', color: 'navy'}}>Password: </Text>
                    <Text style={{fontSize: 18, fontFamily: 'Noto-arabic'}}>{pass}</Text>
                </View>
            </View>

            {/* Permissions for Notifiications, Calendar and Location */}
            <View style={styles.settings_sections}>
                <Text style={{alignSelf: 'center', fontFamily: 'Tomorrow', color: 'goldenrod', fontSize: 22, }}>Permissions</Text>

                <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 10}}>
                    <Text style={{fontSize: 18, fontFamily: 'Noto-arabic', color: 'navy'}}>Notifications: </Text>
                    <Switch
                        value={isNotifsEnabled}
                        onValueChange={()=>{
                            toggleNotifsSwitch()
                            notificationsPermission()
                        }}
                        trackColor={{false: 'whitesmoke', true: 'lightblue'}}
                        thumbColor={isNotifsEnabled ? 'gold' : '#f4f3f4'}
                    />
                </View>
                
                <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 10}}>
                    <Text style={{fontSize: 18, fontFamily: 'Noto-arabic', color: 'navy'}}>Locations: </Text>
                    <Switch 
                        value={isLocEnabled}
                        onValueChange={()=>{
                            toggleLocsSwitch()
                            locationsPermissions()
                        }}
                        trackColor={{false: 'whitesmoke', true: 'lightblue'}}
                        thumbColor={isLocEnabled ? 'gold' : '#f4f3f4'}
                    />
                </View>

                <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 10}}>
                    <Text style={{fontSize: 18, fontFamily: 'Noto-arabic', color: 'navy'}}>Calendar: </Text>
                    <Switch
                        value={isCalEnabled}
                        onValueChange={()=>{
                            toggleCalSwitch()
                            calendarPermissions()
                        }}
                        trackColor={{false: 'whitesmoke', true: 'lightblue'}}
                        thumbColor={isCalEnabled ? 'gold' : '#f4f3f4'}
                    />
                </View>
            </View>

            <View style={styles.settings_sections}>
                <Text style={{alignSelf: 'center', fontFamily: 'Tomorrow', color: 'goldenrod', fontSize: 22,}}>Feedback</Text>
                <Text style={{fontSize: 16, marginTop: 5, color:'navy', textAlign: 'center'}}>
                    Please share your feedback and apps feature recommendations at: johndoe@momentum.com
                </Text>
            </View>

            <TouchableOpacity onPress={userSignOut}>
                <Text style={styles.signOutText}>SIGN OUT</Text>
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
    settings_sections: {
        marginTop: 10, 
        borderWidth: 1, 
        padding: 20, 
        borderRadius: 30, 
        borderColor: 'navy', 
        borderLeftWidth: 4, 
        borderRightWidth: '4', 
        backgroundColor: 'white'
    },
    signOutText : {
        fontSize: 23, 
        fontWeight: 'bold', 
        color: 'red', 
        fontFamily: 'Tomorrow',
        alignSelf: 'center',
        borderWidth: 1,
        padding: 10,
        marginTop: 30,
        borderRadius: 20,
        borderBottomWidth:5,
        borderColor: 'darkred',
        backgroundColor: 'white'
    }

});