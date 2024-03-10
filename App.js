import {  Alert,  StyleSheet, } from 'react-native'
import React, { useEffect, useState } from 'react'
import Splash from './src/screens/Splash'
import {  NavigationContainer, } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ScheduleDropsReminder from './src/screens/ScheduleDropsReminder'
import GetStarted from './src/screens/GetStarted'
import Login from './src/screens/authentication/Login'
import Register from './src/screens/authentication/Register'
import VerifyOtp from './src/screens/authentication/VerifyOtp'
import UploadPrescription from './src/screens/UploadPrescription'
import NextAppointmentReminder from './src/screens/NextAppointmentReminder'
import EyeDropsRefillPurchase from './src/screens/EyeDropsRefillPurchase'
import DropDoseDateTime from './src/screens/DropDoseDateTime'
import EyeDropSummary from './src/screens/EyeDropSummary'
import EyeSummaryDetails from './src/screens/EyeSummaryDetails'
import BottomNavigation from './src/screens/BottomNavigation'
import EyeDropRefillDetails from './src/screens/EyeDropRefillDetails'
import AppointmentDetails from './src/screens/AppointmentDetails'
import UserProfile from './src/screens/UserProfile'
import UploadPrescriptionDetails from './src/screens/UploadPrescriptionDetails'
import ViewEyeDropSummaryList from './src/screens/ViewEyeDropSummaryList'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { Linking } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { check, RESULTS, request, PERMISSIONS } from 'react-native-permissions'



const Stack = createNativeStackNavigator()

const App = ({ navigation }) => {

  const [eyeDropList, setEyeDropList] = useState({})

  const fetchEyeDropData = async () => {
    try {
      const auth = await AsyncStorage.getItem('auth')
      const userProfile = JSON.parse(auth)

      var myHeaders = new Headers();
      myHeaders.append("Cookie", "PHPSESSID=af38ffd86acb1dc25d21a826e37f2527");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch(`https://meduptodate.in/saathi/show_drop_time.php?email=${userProfile?.user_email}`, requestOptions)
        .then(response => response.json())
        .then(result => {
          // console.log('eyedrop', result?.dose_time[0])
          setEyeDropList(result)
        })
        .catch(error => console.log('error', error));
    } catch (error) {
      console.log(error)
    }
  }
  
  const requestNotificationPermission = async () => {
    const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    console.log('result', result)
    return result;
  };

  const requestPermission = async () => {
    const checkPermission = await checkNotificationPermission();
    if (checkPermission !== RESULTS.GRANTED) {
      const request = await requestNotificationPermission();
      // 
      if (request !== RESULTS.GRANTED) {

        // permission not granted
        // const newrequest = await requestNotificationPermission();
        // return newrequest
        Alert.alert('Notification', 'Your notification permission is blocked. Please access!', [
          { text: 'OK', onPress: () => Linking.openSettings() },
        ]);
      }
    }

  };

  const checkNotificationPermission = async () => {
    const result = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    console.log('check', result)
    return result;
  };

  const notification = async () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      return console.log('Notification caused background', remoteMessage)
    })

    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        return console.log('Notification when application is fully closed', remoteMessage)
      }
    })
  }

  

  useEffect(() => {
    const subscribe = requestPermission()
    const subscribe2 = notification()
    const subscribe3 = fetchEyeDropData()

    return () => [subscribe, subscribe2, subscribe3]
  }, [])


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='splash' screenOptions={{ headerShown: false }}>
        <Stack.Screen name='splash' component={Splash} />
        <Stack.Screen name='bottom-navigation' component={BottomNavigation} />
        <Stack.Screen name='schedule-drops-reminder' component={ScheduleDropsReminder} />
        <Stack.Screen name='get-started' component={GetStarted} />
        <Stack.Screen name='login' component={Login} />
        <Stack.Screen name='register' component={Register} />
        <Stack.Screen name='verify-otp' component={VerifyOtp} />
        <Stack.Screen name='upload-prescription' component={UploadPrescription} />
        <Stack.Screen name='next-appointment' component={NextAppointmentReminder} />
        <Stack.Screen name='eye-drops-refill' component={EyeDropsRefillPurchase} />
        <Stack.Screen name='drop-dose-time' component={DropDoseDateTime} />
        <Stack.Screen name='eye-drop-summary' component={EyeDropSummary} />
        <Stack.Screen name='eye-drop-details' component={EyeSummaryDetails} />
        <Stack.Screen name='eye-drop-refill-details' component={EyeDropRefillDetails} />
        <Stack.Screen name='eye-drop-refill-summary' component={EyeDropSummary} />
        <Stack.Screen name='appointment-details' component={AppointmentDetails} />
        <Stack.Screen name='user-profile' component={UserProfile} />
        <Stack.Screen name='upload-prescription-details' component={UploadPrescriptionDetails} />
        <Stack.Screen name='view-eye-drop-summary-list' component={ViewEyeDropSummaryList} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})