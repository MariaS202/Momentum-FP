import { NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Calendar from './Calendar'
import Settings from "./Settings";
import Focus from './Focus'
import Labels from './Labels'
import Login from './Login'
import Home from './Home';

export default function App(){

    const MyTabs = createBottomTabNavigator()
    const Stack = createStackNavigator();

    function NavigationRoot() {
        return(
            <MyTabs.Navigator screenOptions={{headerShown: false}} initialRouteName='Home'>
                <MyTabs.Screen name="Calendar" component={Calendar} 
                    options={{
                        tabBarIcon: ({color, size}) => (
                            <MaterialCommunityIcons name='calendar-month' color={color} size={size} />
                        )
                    }}
                />
                <MyTabs.Screen name="Labels" component={Labels}
                    options={{
                        tabBarIcon: ({color, size}) => (
                            <MaterialCommunityIcons name='label' color={color} size={size} />
                        )
                    }}
                />
                <MyTabs.Screen name="Home" component={Home} 
                    options={{
                        tabBarIcon: ({color, size}) => (
                            <MaterialCommunityIcons name='home' color={color} size={size} />
                        )
                    }}
                />
                <MyTabs.Screen name="Focus" component={Focus}
                    options={{
                        tabBarIcon: ({color, size}) => (
                            <MaterialCommunityIcons name='flower-tulip' color={color} size={size} />
                        )
                    }}
                />
                <MyTabs.Screen name="Settings" component={Settings} 
                    options={{
                        tabBarIcon: ({color, size}) => (
                            <MaterialCommunityIcons name='tune' color={color} size={size} />
                        )
                    }}
                />

            </MyTabs.Navigator>
        );
    }
   

    return(
        <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false}}>
            {/* <Stack.Screen name='Login' component={Login}/> */}
            <Stack.Screen name='Home' component={NavigationRoot}/>
        </Stack.Navigator>
        </NavigationContainer>
    );
}
