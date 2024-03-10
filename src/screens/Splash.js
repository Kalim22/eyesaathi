import {Image, ImageBackground, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Splash = ({ navigation }) => {

    const { width, height } = useWindowDimensions()

    const isFocused = useIsFocused()
    const [auth, setAuth] = useState('')
    const [loading, setLoading] = useState(false)
    const [buttonDisable, setButtonDisable] = useState(false)

    const checkAuth = async () => {
        try {
            setLoading(true)
            const auth = await AsyncStorage.getItem('auth')
            setLoading(false)
            const parseData = JSON.parse(auth)
            if(parseData?.status === true){
                return navigation.navigate('bottom-navigation')
            }else{
                setTimeout(() => {
                    setButtonDisable(true)
                    return navigation.navigate('get-started', {auth, disable: buttonDisable})
                }, 2000)
            }
            
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const subscribe = checkAuth()

        return () => [subscribe]
    }, [isFocused])

    return (
        <View style={{ flex: 1 }}>
            <ImageBackground source={require('../assets/images/Background.png')} style={{ flex: 1, width: width }}>
                <Image source={require('../assets/images/alkemlogo.png')} style={{ width: 70, height: 70, alignSelf: 'flex-end', margin: 10 }} resizeMode='contain' />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../assets/images/eyepressurelogo.png')} style={{ width: 200, height: 200 }} resizeMode='cover' />
                </View>
                <Text style={{ textAlign: 'center', color: '#253d95', fontWeight: '500', fontSize: 18 }}>A Patient Support Initiative From</Text>
                <Text style={{ textAlign: 'center', color: '#253d95', fontWeight: '600', fontSize: 20, marginBottom: 20 }}>Alkem | Eyecare</Text>
            </ImageBackground>
        </View>
    )
}

export default Splash

const styles = StyleSheet.create({})