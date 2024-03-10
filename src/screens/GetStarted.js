import { Image, ImageBackground, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import React, { useState, useEffect } from 'react'

import Loader from '../components/Loader'
import { useIsFocused } from '@react-navigation/native'
import messaging from '@react-native-firebase/messaging';

const GetStarted = ({ navigation, route }) => {

    const data = route;

    const { width } = useWindowDimensions()

    async function requestUserPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            console.log('Authorization status:', authStatus);
        }
    }


    useEffect(() => {
        const subscribe = requestUserPermission()
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <ImageBackground source={require('../assets/images/Background.png')} style={{ flex: 1, width: width }}>
                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', }}>
                    <View style={{ width: width, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={require('../assets/images/eyepressurelogo.png')} style={{ width: 200, height: 200, }} resizeMode='cover' />
                    </View>
                    <View style={{ width: width, flex: 3 / 2, justifyContent: 'flex-end', alignItems: 'center', paddingVertical: 40 }}>
                        <Text style={{ textAlign: 'center', color: '#253d95', fontWeight: '800', fontSize: 60, letterSpacing: 1 }}>Welcome</Text>
                        <Text style={{ textAlign: 'center', color: '#253d95', fontWeight: '500', fontSize: 36, marginBottom: 20 }}>to relieve</Text>
                        <Text style={{ textAlign: 'center', color: '#008751', fontWeight: '800', fontSize: 38 }}>EyePressure</Text>
                        <Text style={{ textAlign: 'center', color: '#253d95', fontWeight: '800', fontSize: 38 }}>and</Text>
                        <Text style={{ textAlign: 'center', color: '#253d95', fontWeight: '800', fontSize: 38 }}>Preserve Sight</Text>
                        <TouchableOpacity activeOpacity={0.8}
                            style={{ width: width - 30, borderRadius: 30, backgroundColor: "#253d95", marginTop: 30 }}
                            onPress={() => navigation.navigate('login')}
                            disabled={data?.params?.disable ? false : true}
                        >
                            <Text style={{ fontSize: 22, fontWeight: '600', color: '#fff', textAlign: 'center', paddingVertical: 12, }}>GET STARTED</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
            <Loader loading={data?.params?.disable == '' ? true : false} />
        </View>
    )
}

export default GetStarted

const styles = StyleSheet.create({})