import { View, Text, StyleSheet} from "react-native";
export default function Calendar() {
    return (
        <View style={styles.container}>
            <Text>WELCOME CALENDAAAAAAARR</Text>
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