import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Homepage from './Homepage'
import EyeDropSummary from './EyeDropSummary'
import Icon from "react-native-vector-icons/Entypo"
import FontAwesome from 'react-native-vector-icons/FontAwesome5'
import Profile from './Profile'

const Tabs = createBottomTabNavigator()

const BottomNavigation = () => {
    return (
        <Tabs.Navigator initialRouteName='homepage' screenOptions={{ headerShown: false, tabBarStyle: {backgroundColor: '#253d95',paddingTop: 6 }}}>
            <Tabs.Screen name='homepage' component={Homepage} options={{title:'',  tabBarIcon: ({focused}) => (<Icon name="home" size={30} color={focused ? '#fff' : 'gray'} />), tabBarActiveTintColor: 'red'}}></Tabs.Screen>
            <Tabs.Screen name='profile' component={Profile} options={{ title: "", tabBarIcon: ({focused}) => (<FontAwesome name="user-circle" size={30} color={focused ? '#fff' : 'gray'} />) }} ></Tabs.Screen>
        </Tabs.Navigator>
    )
}

export default BottomNavigation

const styles = StyleSheet.create({})