import messaging from '@react-native-firebase/messaging';


export const notification = async () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
        return console.log('Notification caused background', remoteMessage)
    })

    messaging().getInitialNotification().then(remoteMessage => {
        if(remoteMessage){
            return console.log('Notification when application is fully closed', remoteMessage)
        }
    })
}


export const fetchToken = async () => {
    try {
        await messaging().registerDeviceForRemoteMessages();
        const token = await messaging().getToken();
        console.log('fcm toke---', token)
        return token
    } catch (error) {
        console.log(error)
    }
}

export const requestForPermission = async () => {
    try {
        const permission = await messaging().requestPermission()
        const enabled = permission === messaging.AuthorizationStatus.AUTHORIZED || messaging.AuthorizationStatus.PROVISIONAL

        if(enabled){
            return console.log('Authorized', enabled)
        }
    } catch (error) {
        console.log(error)
    }
}