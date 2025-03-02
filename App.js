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

export default function App(){

    const MyTabs = createBottomTabNavigator()
    const Stack = createStackNavigator();
    
    function NavigationRoot() {
        return(
            <MyTabs.Navigator screenOptions={{headerShown: false}} initialRouteName='Home'>
                <MyTabs.Screen name="Calendar" component={Cal} 
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
                            <MaterialCommunityIcons name='cog' color={color} size={size} />
                        )
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
                </Stack.Navigator>
            </NavigationContainer>
        </TasksProvider>
        
    ); 
}
