import { useContext, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TextInput, KeyboardAvoidingView, Button} from "react-native";
import Home from './Home'
import { auth } from "./firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, } from "firebase/auth";
import { TasksContext } from "./Context";

export default function Login({navigation}) {
    const {email, setEmail} = useContext(TasksContext)
    const {pass, setPass} = useContext(TasksContext)

    const signUp = () => {
        createUserWithEmailAndPassword(auth, email, pass)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            console.log(email);
            
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    }

    const signIn = () => {
        signInWithEmailAndPassword(auth, email, pass)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log();
            
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    }

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
                <View style={{flexDirection: 'row', alignSelf: "center", margin: 20}}>
                    <Button title="Sign-In"  
                        onPress={()=> {
                            signIn()
                            console.log(email, pass);                         
                            navigation.navigate(Home)
                        }}/>

                    <Button title="Sign-Up" 
                        onPress={()=> {
                            signUp()
                        }}/>
                </View>

                {/* <Button title="Login with Google" 
                    onPress={()=> {
                        googleSignIn()
                    }}
                    color={"black"}/> */}

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
        borderColor: "lightgrey",
        fontSize: 17
    }
});