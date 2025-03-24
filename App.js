import { NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Cal from './Calendar'
import Settings from "./Settings";
import Focus from './Focus'
import Labels from './Labels'
import Login from './Login'
import Home from './Home';
import { TasksProvider } from'./Context'
import FilteredTasks from './FilteredTasks';
import Pomodoro from './Pomodoro';
import TimeTrack from './TimeTrack';
import UpcomingTasks from './UpcomingTasks';
import { useFonts } from 'expo-font';

export default function App(){
    const [fontLoaded, error] = useFonts({
        'Tomorrow': require('./assets/fonts/Tomorrow-Bold.ttf'),
        'Sriracha': require('./assets/fonts/Sriracha-Regular.ttf'),
        'Bungee Shade': require('./assets/Bungee_Shade/BungeeShade-Regular.ttf'),
        'mogra': require('./assets/fonts/Mogra-Regular.ttf'),
        'Noto-arabic' : require('./assets/fonts/NotoKufiArabic-Medium.ttf')
    })  
    if (!fontLoaded && !error) {
        return null;
    }
    
    const MyTabs = createBottomTabNavigator()
    const Stack = createStackNavigator();
    
    function NavigationRoot() {
        return(
            <MyTabs.Navigator screenOptions={{headerShown: false}} initialRouteName='Home' >
                <MyTabs.Screen name="Calendar" component={Cal} 
                    options={{
                        tabBarIcon: ({color, size}) => (
                            <MaterialCommunityIcons name='calendar-month' color={color} size={30} />
                        ),
                        tabBarStyle: {backgroundColor: 'aliceblue'},
                        tabBarActiveTintColor: 'goldenrod',
                        tabBarInactiveTintColor: 'lightslategrey',
                    }}
                />
                <MyTabs.Screen name="Labels" component={Labels}
                    options={{
                        tabBarIcon: ({color, size}) => (
                            <MaterialCommunityIcons name='label' color={color} size={30} />
                        ),
                        tabBarStyle: {backgroundColor: 'aliceblue'},
                        tabBarActiveTintColor: 'goldenrod',
                        tabBarInactiveTintColor: 'lightslategrey',
                    }}
                />
                <MyTabs.Screen name="Home" component={Home} 
                    options={{
                        tabBarIcon: ({color, size}) => (
                            <MaterialCommunityIcons name='home' color={color} size={30} />
                        ),
                        tabBarStyle: {backgroundColor: 'aliceblue'},
                        tabBarActiveTintColor: 'goldenrod',
                        tabBarInactiveTintColor: 'lightslategrey',
                    }}
                />
                <MyTabs.Screen name="Focus" component={Focus}
                    options={{
                        tabBarIcon: ({color, size}) => (
                            <MaterialCommunityIcons name='flower-tulip' color={color} size={30} />
                        ),
                        tabBarStyle: {backgroundColor: 'aliceblue'},
                        tabBarActiveTintColor: 'goldenrod',
                        tabBarInactiveTintColor: 'lightslategrey',
                    }}
                />
                <MyTabs.Screen name="Settings" component={Settings} 
                    options={{
                        tabBarIcon: ({color, size}) => (
                            <MaterialCommunityIcons name='cog' color={color} size={30} />
                        ),
                        tabBarStyle: {backgroundColor: 'aliceblue'},
                        tabBarActiveTintColor: 'goldenrod',
                        tabBarInactiveTintColor: 'lightslategrey',
                    }}
                />

            </MyTabs.Navigator>
        );
    }
   

    return(
        <TasksProvider>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false}}>
                    <Stack.Screen name='Login' component={Login}/>
                    <Stack.Screen name='Home' component={NavigationRoot}/>
                    <Stack.Screen name='FilteredTasks' component={FilteredTasks}/>
                    <Stack.Screen name='Pomodoro' component={Pomodoro}/>
                    <Stack.Screen name='TimeTrack' component={TimeTrack}/>
                    <Stack.Screen name='UpcomingTasks' component={UpcomingTasks}/>
                </Stack.Navigator>
            </NavigationContainer>
        </TasksProvider>
        
    ); 
}
