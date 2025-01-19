import { View, Text, StyleSheet} from "react-native";
export default function Focus() {
    return (
        <View style={styles.container}>
            <Text>WELCOME PHOCUSSSS</Text>
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