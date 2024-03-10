import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, useWindowDimensions, TextInput } from 'react-native'
import React, { useState } from 'react'
import ErrorComponent from '../../components/ErrorComponent'
import Loader from '../../components/Loader'

const Login = ({navigation}) => {

    const { width, height } = useWindowDimensions()

    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const sendOtp = () => {
        try {

            if (email === '') {
                setError(true)
                setErrorMessage('Please entered registered email address!')
                return
            }
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
                    if(result?.status === 'true'){
                        return navigation.navigate('verify-otp', {email: email})
                    }
                    setError(true)
                    return setErrorMessage(result?.message)
                })
                .catch(error => console.log('error', error));
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
                        <TextInput onChangeText={text => {
                            setError(false)
                            setEmail(text)
                        }} value={email} style={[styles.input, { width: width - 30 }]} placeholderTextColor="#253d95" placeholder='Email Address'></TextInput>
                        {error && <ErrorComponent error={errorMessage} /> }
                        <TouchableOpacity activeOpacity={0.8} style={{ width: width - 30, borderRadius: 30, backgroundColor: "#253d95", marginTop: 20, marginBottom: 10 }} onPress={sendOtp}>
                            <Text style={{ fontSize: 24, fontWeight: '600', color: '#fff', textAlign: 'center', paddingVertical: 12, }}>LOGIN</Text>
                        </TouchableOpacity>
                        <View style={{ justifyContent: 'center', alignItems: 'center', width: width - 20, flexDirection: 'row' }}>
                            <Text style={{ fontSize: 16, color: "#253d95" }}>Don't have an account? </Text>
                            <TouchableOpacity activeOpacity={0.8} onPress={() => {
                                navigation.navigate('register')
                                return setEmail('')
                            }} style={{ alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontWeight: '700', fontSize: 17, color: "#253d95" }}>Sign Up</Text></TouchableOpacity>
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

export default Login
