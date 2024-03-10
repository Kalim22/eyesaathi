import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, useWindowDimensions, TextInput, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import ErrorComponent from '../../components/ErrorComponent'
import Loader from '../../components/Loader'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { fetchToken } from '../../utils/Notification'

const VerifyOtp = ({ navigation, route }) => {

    const email = route?.params?.email;

    const { width } = useWindowDimensions()
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const sendOtp = () => {
        try {
            console.log('send otp')
            setLoading(true)
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", "PHPSESSID=9b11b605e0cb37817d03b612cfaaca61");

            const raw = JSON.stringify({
                "email": email
            });

            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://meduptodate.in/saathi/login.php", requestOptions)
                .then(response => response.json())
                .then(result => {
                    setLoading(false)
                    console.log(result)
                    return
                })
                .catch(error => console.log('error', error));
        } catch (error) {
            console.log(error)
        }
    }

    const verifyOtp = async () => {
        try {
            
            if (otp === '') {
                setErrorMessage('Please enter your OTP!')
                return setError(true)
            }
            setLoading(true)
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", "PHPSESSID=9b11b605e0cb37817d03b612cfaaca61");

            const raw = JSON.stringify({
                "email": email,
                "otp": otp,
                "fcm_token": await fetchToken()
            });

            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const res = await fetch("https://meduptodate.in/saathi/otp_verify.php", requestOptions)
            const result = await res.json()
            setLoading(false)
            console.log(result)
            if(result?.status === true){
                await AsyncStorage.setItem('auth', JSON.stringify(result))
                return navigation.navigate('bottom-navigation')
            }
            return Alert.alert(result?.message)
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <View style={{ flex: 1 }}>
            <ImageBackground source={require('../../assets/images/Background.png')} style={{ flex: 1, width: width }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                    <View style={{ width: width, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={require('../../assets/images/eyepressurelogo.png')} style={{ width: 200, height: 200, }} resizeMode='cover' />
                    </View>
                    <View style={{ width: width, flex: 2, justifyContent: 'flex-start', alignItems: 'center', }}>
                        <Text style={{ color: '#253d95', fontSize: 15, marginBottom: 20, fontWeight: '600' }}>We have sent OTP to your registered email address {email}</Text>
                        <TextInput onChangeText={text => {
                            setError(false)
                            setOtp(text)
                        }} value={otp} keyboardType='numeric' style={[styles.input, { width: width - 30 }]} placeholderTextColor="#253d95" placeholder='OTP'></TextInput>
                        {error && <ErrorComponent error={errorMessage} />}
                        <TouchableOpacity activeOpacity={0.8} style={{ width: width - 30, borderRadius: 30, backgroundColor: "#253d95", marginTop: 20, marginBottom: 10 }} onPress={verifyOtp}>
                            <Text style={{ fontSize: 24, fontWeight: '600', color: '#fff', textAlign: 'center', paddingVertical: 12, }}>Verify OTP</Text>
                        </TouchableOpacity>
                        <View style={{ justifyContent: 'center', alignItems: 'center', width: width - 20, flexDirection: 'row' }}>
                            <Text style={{ fontSize: 16, color: "#253d95" }}>Don't Receive the OTP. </Text>
                            <TouchableOpacity onPress={sendOtp} activeOpacity={0.8} style={{ alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontWeight: '700', fontSize: 17, color: '#204490' }}>Resend</Text></TouchableOpacity>
                        </View>
                    </View>

                </View>
            </ImageBackground>
            <Loader loading={loading} />
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        borderRadius: 50,
        borderColor: "#fff",
        borderWidth: 1,
        marginVertical: 10,
        paddingHorizontal: 6,
        paddingVertical: 12,
        overflow: 'hidden',
        textAlign: 'center',
        color: "#253d95",
        fontSize: 20,
        fontWeight: '600',
    },
})

export default VerifyOtp
