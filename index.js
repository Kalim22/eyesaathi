/**
 * 
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import SplashScreen from 'react-native-splash-screen';
import { useEffect } from 'react';

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
});

const MainApp = () => {
    useEffect(() => {
        SplashScreen.hide()
    }, [])

    return <App />
}

AppRegistry.registerComponent(appName, () => MainApp);
