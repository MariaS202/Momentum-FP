import { NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import Calendar from './Calendar'
import Settings from "./Settings";
import Focus from './Focus'
import Labels from './Labels'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Login from './Login'
import Home from './Home';

export default function App(){

    const CalendarStack = createStackNavigator()
    const SettingsStack = createStackNavigator()
    const FocusStack = createStackNavigator()
    const LabelsStack = createStackNavigator()
    const HomeStack = createStackNavigator()
    const MyTabs = createBottomTabNavigator()
    const Stack = createStackNavigator();
    
    function CalenderScreen() {
        return(
            <CalendarStack.Navigator screenOptions={{headerShown: false}}> 
                <CalendarStack.Screen name="Calendar Screen" component={Calendar}/>
            </CalendarStack.Navigator>
        );
    }
    function SettingsScreen() {
        return(
            <SettingsStack.Navigator screenOptions={{headerShown: false}}> 
                <SettingsStack.Screen name="Settings Screen" component={Settings}/>
            </SettingsStack.Navigator>
        );
    }
    function FocusScreen() {
        return(
            <FocusStack.Navigator screenOptions={{headerShown: false}}> 
                <FocusStack.Screen name="Focus Screen" component={Focus}/>
            </FocusStack.Navigator>
        );
    }
    function LabelsScreen() {
        return(
            <LabelsStack.Navigator screenOptions={{headerShown: false}}> 
                <LabelsStack.Screen name="Labels Screen" component={Labels}/>
            </LabelsStack.Navigator>
        );
    }
    function HomeScreen() {
        return(
            <HomeStack.Navigator screenOptions={{headerShown: false}}> 
                <HomeStack.Screen name="Home Screen" component={Home}/>
            </HomeStack.Navigator>
        );
    }
    function NavigationRoot() {
        return(
            <MyTabs.Navigator screenOptions={{headerShown: false}} initialRouteName='Home'>
                <MyTabs.Screen name="Calendar" component={CalenderScreen}/>
                <MyTabs.Screen name="Labels" component={LabelsScreen}/>
                <MyTabs.Screen name="Home" component={HomeScreen} />
                <MyTabs.Screen name="Focus" component={FocusScreen}/>
                <MyTabs.Screen name="Settings" component={SettingsScreen}/>
                
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


