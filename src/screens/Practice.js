import {Alert, StyleSheet, Text, View, Button, Platform, PermissionsAndroid } from 'react-native'
import React, { useEffect, useCallback } from 'react'
import CustomButton from '../components/CustomButton';
import BackgroundService from 'react-native-background-actions';
import { Linking } from 'react-native';
import notifee from '@notifee/react-native'
import messaging from '@react-native-firebase/messaging';
import {check,RESULTS, Permission, request, PERMISSIONS} from 'react-native-permissions'


const Practice = () => {

  const getmessage = () => {
    messaging().onMessage(async remoteMessage => {
      Alert.alert('a message from practice page', JSON.stringify(remoteMessage));
    });
  }

    const checkApplicationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          console.log('platform', Platform)
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
        } catch (error) {
        }
      }
    };

    const requestNotificationPermission = async () => {
      const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
      console.log('result', result)
      return result;
    };

    const requestPermission = async () => {
      const checkPermission = await checkNotificationPermission();
      if (checkPermission !== RESULTS.GRANTED) {
       const request = await requestNotificationPermission();
         if(request !== RESULTS.GRANTED){
              // permission not granted
              Alert.alert('Notification will be off!')
          }
      }
    };
    
    const checkNotificationPermission = async () => {
      const result = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
      console.log('check', result)
      return result;
    };

  useEffect(() => {
    const unsubscribe = getmessage()

    return unsubscribe;
  }, []);



  const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

  const veryIntensiveTask = async (taskDataArguments) => {
    // Example of an infinite loop task
    const { delay } = taskDataArguments;
    await new Promise(async (resolve) => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
        console.log(i);
        await sleep(delay);
      }
    });
  };

  const options = {
    taskName: 'Eye Sight',
    taskTitle: 'Your Next Appoinment',
    taskDesc: 'Check your next appointment! if you forget',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
    parameters: {
      delay: 4000,
    },
  };

  const startForegroundService = async () => {
    await BackgroundService.start(veryIntensiveTask, options);
    await BackgroundService.updateNotification({ taskDesc: 'Eyesight, Your next appointment remainder' }); // Only Android, iOS will ignore this call
  }

  // iOS will also run everything here in the background until .stop() is called

  const stopService = async () => {
    await BackgroundService.stop();
  }


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Practice</Text>
        <Button title='notifee' onPress={requestPermission}/>
    </View>
  )
}

export default Practice
