import { View, Text, StyleSheet, TouchableOpacity} from "react-native";
import { auth } from "./firebaseConfig";
import { signOut } from "firebase/auth";
import Login from "./Login";

export default function Settings({navigation}) {
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

    return (
        <View style={styles.container}>
            <Text style={{fontSize: 27, marginTop: 35, fontWeight: 'bold'}}>Settings</Text>
            <TouchableOpacity onPress={userSignOut}>
                <Text style={{fontSize: 19, fontWeight: 'bold', color: 'red'}}>SIGN OUT</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },

});