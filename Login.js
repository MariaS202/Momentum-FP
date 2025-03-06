import { useContext, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TextInput, KeyboardAvoidingView, Button, Touchable, TouchableOpacity} from "react-native";
import Home from './Home'
import { auth } from "./firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, } from "firebase/auth";
import { TasksContext } from "./Context";

export default function Login({navigation}) {
    const [signInMode, setSignInMode] = useState(false)
    const [signUpMode, setSignUpMode] = useState(false)
    const [username, setUsername] = useState('')
    
    const {email, setEmail} = useContext(TasksContext)
    const {pass, setPass} = useContext(TasksContext)

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

    }

    return (
        <SafeAreaView style={styles.container}>            
            <KeyboardAvoidingView behavior="padding">
                <Text style={styles.welcome_text}>Welcome to Momentum!</Text>

                <View style={{flexDirection: 'row', justifyContent: 'space-around' , marginTop: 50}}> 
                    <TouchableOpacity style={styles.buttons_siso_mode}
                        onPress={() => {
                            setSignUpMode(true)
                            setSignInMode(false)
                        }}>
                        <Text style={{fontSize: 18, fontWeight: 'bold'}}>SIGN UP</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.buttons_siso_mode}
                        onPress={()=>{
                            setSignInMode(true)
                            setSignUpMode(false)
                        }}>
                        <Text style={{fontSize: 18, fontWeight: 'bold'}}>SIGN IN</Text>
                    </TouchableOpacity>
                </View>
                
                {signUpMode &&
                    <View>
                        {/* email and password view in sign up */}
                        <View style={{marginTop: 50, }}>
                            <TextInput 
                            placeholder="Username"
                            placeholderTextColor={"grey"}
                            onChangeText={setUsername}
                            style={styles.inputs}
                            value={username}
                            
                            />
        
                            <TextInput 
                            keyboardType="email-address"
                            placeholder="Email"
                            placeholderTextColor={"grey"}
                            onChangeText={setEmail}
                            style={styles.inputs}
                            value={email}/>
        
                            <TextInput 
                            placeholder="New password"
                            placeholderTextColor={"grey"}
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
                                } else {
                                    alert('some/all fields are empty!')
                                    return
                                }
                            }}>
                            <Text style={{fontSize: 20, fontWeight: '400', alignSelf: 'center'}}>Sign Up</Text>
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
                            placeholderTextColor={"grey"}
                            onChangeText={setEmail}
                            style={styles.inputs}
                            value={email}/>
        
                            <TextInput 
                            placeholder="Password"
                            placeholderTextColor={"grey"}
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
                            <Text style={{fontSize: 20, fontWeight: '400', alignSelf: 'center'}}>Sign In</Text>
                        </TouchableOpacity>
        
                    </View>
                }
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
        marginRight: 25,
        marginLeft: 25,
        padding: 15,
        borderRadius: 10,
        borderColor: "lightgrey",
        fontSize: 17
    },
    buttons_siso_mode: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
    },
    signup_signin_buttons: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        marginLeft: 100,
        marginRight: 100,
    }

});