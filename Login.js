import { useContext, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TextInput, KeyboardAvoidingView, TouchableOpacity, ScrollView } from "react-native";
import Home from './Home'
import { auth } from "./firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, } from "firebase/auth";
import { TasksContext } from "./Context";

export default function Login({navigation}) {
    const [signInMode, setSignInMode] = useState(false)
    const [signUpMode, setSignUpMode] = useState(false)
    const [select1, setSelect1] = useState(true)
    const handleSelect1 = () => {
        setSelect1(!select1)
    }
    const [select2, setSelect2] = useState(false)
    const handleSelect2 = () => {
        setSelect2(!select2)
    }
    const {username, setUsername} = useContext(TasksContext)
    const {email, setEmail} = useContext(TasksContext)
    const {pass, setPass} = useContext(TasksContext)
    // link for user authentication code with firebase auth -> https://firebase.google.com/docs/auth/web/password-auth 
    // setting SignUp as the default display
    if(!signInMode && !signUpMode) {
        setSignUpMode(true)
        setSignInMode(false)
    }

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
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    }

    // Greeting pop up when user signs up
    const greetingText = () => {
        alert('Thank you for signing up with Momentum!')
    }

    return (
        <ScrollView style={styles.container}>            
            <KeyboardAvoidingView behavior='position'>
                <Text style={styles.welcome_text}>Welcome to</Text>
                <Text style={{fontFamily: 'Bungee Shade', color: 'darkblue', alignSelf: 'center', fontSize: 50}}>Momentum!</Text>

                <View style={{ margin: 13, marginTop: 40, paddingBottom: 20, borderRadius: 40, backgroundColor: 'aliceblue', borderColor: 'white', borderBottomWidth: 10, borderLeftWidth: 10, }}>

                    <View style={{flexDirection: 'row', justifyContent: 'space-evenly' , marginTop: 20}}> 
                        <TouchableOpacity style={select1 ? styles.onSelectSiso : styles.buttons_siso_mode}
                            onPress={() => {
                                setSignUpMode(true)
                                setSignInMode(false)
                                handleSelect1()
                                setSelect2(false)
                                setSelect1(true)
                            }}>
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: 'midnightblue'}}>SIGN UP</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={select2 ? styles.onSelectSiso : styles.buttons_siso_mode}
                            onPress={()=>{
                                setSignInMode(true)
                                setSignUpMode(false)
                                handleSelect2()
                                setSelect1(false)
                                setSelect2(true)
                            }}>
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: 'midnightblue'}}>SIGN IN</Text>
                        </TouchableOpacity>
                    </View>
                    
                    {signUpMode &&
                        <View>
                            {/* email and password view in sign up */}
                            <View style={{marginTop: 50, }}>
                                <TextInput 
                                placeholder="First Name"
                                placeholderTextColor={'lightslategrey'}
                                onChangeText={setUsername}
                                style={styles.inputs}
                                value={username}
                                />
            
                                <TextInput 
                                keyboardType="email-address"
                                placeholder="Email"
                                placeholderTextColor={"lightslategrey"}
                                onChangeText={setEmail}
                                style={styles.inputs}
                                value={email}/>
            
                                <TextInput 
                                placeholder="New password"
                                placeholderTextColor={"lightslategrey"}
                                style={styles.inputs}
                                onChangeText={setPass}
                                value={pass}
                                secureTextEntry/>
                            </View>
            
                            <TouchableOpacity style={[styles.signup_signin_buttons, {marginTop: 40}]}
                                onPress={()=> {
                                    if(username !== '' && email !== '' && pass !== '') {
                                        signUp()
                                        console.log(username, email, pass);                         
                                        navigation.navigate(Home) 
                                        greetingText()
                                    } else {
                                        alert('some/all fields are empty!')
                                        return
                                    }
                                }}>
                                <Text style={{fontSize: 23, fontWeight: '400', alignSelf: 'center', fontFamily: 'Tomorrow', color: 'midnightblue'}}>SIGN UP</Text>
                            </TouchableOpacity>
                        </View>
                    }

                    {signInMode &&
                        <View>
                        {/* email and password view  in sign in*/}
                            <View style={{marginTop: 50, }}>
                                <TextInput 
                                keyboardType="email-address"
                                placeholder="Email"
                                placeholderTextColor={"lightslategrey"}
                                onChangeText={setEmail}
                                style={styles.inputs}
                                value={email}/>
            
                                <TextInput 
                                placeholder="Password"
                                placeholderTextColor={"lightslategrey"}
                                style={styles.inputs}
                                onChangeText={setPass}
                                value={pass}
                                secureTextEntry/>
                            </View>
            
                            
                            <TouchableOpacity style={[styles.signup_signin_buttons, {marginTop: 50}]}
                                onPress={()=> {
                                    if(email !== '' && pass !== '') {
                                        signIn()
                                        navigation.navigate(Home)
                                    } else {
                                        alert('Email and password inputs are empty!')
                                        return
                                    }
                                }}>
                                <Text style={{fontSize: 23, fontWeight: '400', alignSelf: 'center', fontFamily: 'Tomorrow', color: 'midnightblue'}}>SIGN IN</Text>
                            </TouchableOpacity>
            

                        </View>
                    }
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'lemonchiffon',
    },
    welcome_text: {
        fontSize: 27,
        fontWeight: 'bold',
        color: 'darkblue',
        marginTop: 110,
        alignSelf: 'center',
        
    },
    inputs: {
        borderWidth: 2,
        margin: 7,
        marginRight: 25,
        marginLeft: 25,
        padding: 15,
        borderRadius: 10,
        borderColor: 'lightsteelblue',
        fontSize: 17,
    },
    buttons_siso_mode: {
        borderWidth: 2,
        padding: 10,
        borderRadius: 10,
        paddingLeft: 30,
        paddingRight: 30,
        borderColor: 'navy',
        backgroundColor: 'white'
    },
    signup_signin_buttons: {
        borderWidth: 2.5,
        padding: 10,
        borderRadius: 10,
        marginLeft: 100,
        marginRight: 100,
        borderColor: 'midnightblue',
        backgroundColor: 'white',
        borderBottomWidth: 5,
        borderLeftWidth: 5
    },
    onSelectSiso: {
        borderWidth: 3,
        padding: 10,
        borderRadius: 10,
        paddingLeft: 30,
        paddingRight: 30,
        borderColor: 'sandybrown',
        backgroundColor: 'lemonchiffon'
    }

});