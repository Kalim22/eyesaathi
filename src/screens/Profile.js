import { Alert, StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomButton from '../components/CustomButton'
import AsyncStorage from '@react-native-async-storage/async-storage'


const Profile = ({ navigation }) => {

    const { width } = useWindowDimensions()

    const handleLogout = async () => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Cookie", "PHPSESSID=729e643e0577ba9194549e9185f2f746");

            const requestOptions = {
                method: "DELETE",
                headers: myHeaders,
                redirect: "follow"
            };

            const res = await fetch("https://meduptodate.in/saathi/logout.php", requestOptions)
            const data = await res.json()
            if (data?.status == true) {
                await AsyncStorage.removeItem('auth')
                return navigation.navigate('splash')
            }
            return alert(result?.message)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width, backgroundColor: '#fff' }} >
            <ImageBackground source={require('../assets/images/Background.png')} style={{ flex: 1, width: width }}>
                <View style={{ flex: 0.14, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../assets/images/eyepressurelogo.png')} style={{ width: 100, height: 100 }} resizeMode='cover' />
                </View>
                <View style={{ flex: 0.86, justifyContent: 'flex-start', alignItems: 'center' }}>
                    <View style={{ width, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: "#253d95", fontSize: 26, fontWeight: '600', paddingVertical: 4, }}>Settings</Text>
                        <View style={{ borderBottomColor: '#253d95', borderBottomWidth: 3, width: width - 50, height: 4 }} />
                    </View>
                    <View style={{ position: "relative" }}>
                    </View>
                    <View style={{ justifyContent: 'flex-start', alignItems: 'center', marginVertical: 20 }}>
                        <CustomButton buttonText="User Profile" onPress={() => navigation.navigate('user-profile')} backgroundColor="transparent" color="#253d95" borderColor="#fff" />
                        <CustomButton buttonText="Appointment Details" onPress={() => navigation.navigate('appointment-details')} backgroundColor="transparent" color="#253d95" borderColor="#fff" />
                        <CustomButton buttonText="Eyedrops Refill Purchase" onPress={() => navigation.navigate('eye-drop-refill-details')} backgroundColor="transparent" color="#253d95" borderColor="#fff" />
                        <CustomButton buttonText="Eyedrops Summary" onPress={() => navigation.navigate('eye-drop-summary')} backgroundColor="transparent" color="#253d95" borderColor="#fff" />
                        <CustomButton buttonText="Upload Prescription Details" onPress={() => navigation.navigate('upload-prescription-details')} backgroundColor="transparent" color="#253d95" borderColor="#fff" />
                        <CustomButton buttonText="Log Out" onPress={handleLogout} marginTop={30} />
                    </View>
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    doseBox: {
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    doseText: {
        fontWeight: '500',
        fontSize: 20,
        color: '#253d95',
        paddingHorizontal: 20,
        paddingVertical: 4,

    },
    doseContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5,
        paddingHorizontal: 4,
        flexDirection: 'row'
    },
    buttonText: {
        fontSize: 19,
        fontWeight: '600',
        color: '#fff',
        textAlign: 'center',
        paddingVertical: 4,
        paddingHorizontal: 20,

    },
    modalView: {
        // position: 'absolute',
        // top: '40%',
        alignSelf: 'center',
        elevation: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        overflow: 'hidden',
        paddingVertical: 20,
        borderRadius: 5
    },
    optionsText: {
        color: '#253d95',
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 6,
        marginTop: 2
    },
    bottomBorder: {
        backgroundColor: '#253d95',
        height: 3,
    },
    input: {
        borderColor: "#fff",
        borderWidth: 1,
        borderRadius: 30,
        fontWeight: '500',
        fontSize: 18,
        textAlign: 'center',
        color: '#253d95',
        paddingVertical: 6,
        marginVertical: 4

    },
    btn: {
        backgroundColor: "#304494",
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        borderRadius: 5,
        marginVertical: 10
    }
})

export default Profile
