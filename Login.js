import { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TextInput, KeyboardAvoidingView, Button} from "react-native";
import Home from './Home'
// import auth from "@react-native-firebase/auth"

export default function Login({navigation}) {
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    // const [initializing, setInitializing] = useState(true)
    // const [user, setUser] = useState();

    // Handle user state changes
    // function onAuthStateChanged(user) {
    //     console.log('onAuthStateChanged',user);
        
    //     setUser(user);
    //     if (initializing) setInitializing(false);
    // }

    // useEffect(() => {
    //     const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    //     return subscriber; // unsubscribe on unmount
    // }, []);

    // if (initializing) return null;

    // if (!user) {
    //     return (
    //     <View>
    //         <Text>Login</Text>
    //     </View>
    //     );
    // }
    // if(user) {
    //     return (
    //         <View>
    //         <Text>Welcome {user.email}</Text>
    //         </View>
    //     );
    // }
    // const signUp = async() =>{
    //     await auth()
    //     .createUserWithEmailAndPassword(email, pass)
    //     .then(() => {
    //         console.log('User account created & signed in!');
    //     })
    //     .catch(error => {
    //         if (error.code === 'auth/email-already-in-use') {
    //         console.log('That email address is already in use!');
    //         }

    //         if (error.code === 'auth/invalid-email') {
    //         console.log('That email address is invalid!');
    //         }

    //         console.error(error);
    //     });
    // }

    // const signIn = async() => {
    //     await auth()
    //     .signInWithEmailAndPassword(email, pass)
    //     .then(() => {
    //         console.log('User account signed in!');
    //     })
    //     .catch(error => {
    //         if (error.code === 'auth/invalid-email') {
    //         console.log('That email address is invalid!');
    //         }

    //         console.error(error);
    //     });
    // }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior="padding">
                <Text style={styles.welcome_text}>Welcome to Momentum!</Text>
                {/* email and password view */}
                <View style={{marginTop: 120, }}>
                    <TextInput 
                    placeholder="Enter your email"
                    placeholderTextColor={"grey"}
                    onChangeText={setEmail}
                    style={styles.inputs}
                    value={email}/>

                    <TextInput 
                    placeholder="Enter password"
                    placeholderTextColor={"grey"}
                    style={styles.inputs}
                    onChangeText={setPass}
                    value={pass}
                    secureTextEntry/>
                </View>
                {/* buttons view */}
                <View style={{flexDirection: 'row', alignSelf: "center", margin: 10}}>
                    <Button title="Sign-In" onPress={()=> navigation.navigate(Home)} 
                        // onPress={signIn}
                        />
                    <Button title="Sign-Up" onPress={()=> navigation.navigate(Home)}
                        // onPress={signUp}
                         />
                    <Button title="Sign-up / Login with Googal" 
                        color={"black"}/>
                </View>
                {/* <View>
                </View> */}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    welcome_text: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'darkblue',
        marginTop: 50,
        alignSelf: 'center',
        
    },
    inputs: {
        borderWidth: 1,
        margin: 7,
        marginRight: 20,
        marginLeft: 20,
        padding: 15,
        borderRadius: 10,
        borderColor: "lightgrey"
    }
});