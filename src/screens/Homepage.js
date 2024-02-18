import {Alert, BackHandler, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Homepage = ({ navigation }) => {
    const { width, height } = useWindowDimensions()

    const fetchAcceptDose = (dosename, id) => {
        try {
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            fetch(`https://meduptodate.in/saathi/accept_dose.php?name_of_eyedrop=${dosename}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log('name of doses', result)
                    if (result?.status == 'true') {
                        return deleteRecords(id)
                    }
                    return
                })
                .catch(error => console.log('error', error));
        } catch (error) {
            console.log(error)
        }
    }

    const fetchRemainingdose = (dosename, id) => {
        try {
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            fetch(`https://meduptodate.in/saathi/not_accept_dose.php?name_of_eyedrop=${dosename}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log(result)
                    if (result?.status == 'true') {
                        return deleteRecords(id)
                    }
                    return
                })
                .catch(error => console.log('error', error));
        } catch (error) {
            console.log(error)
        }
    }

    const deleteRecords = (id) => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Cookie", "PHPSESSID=7dcfcdac4b3c10551bd25d7a60c1e51f");
            
            const requestOptions = {
              method: "DELETE",
              headers: myHeaders,
              redirect: "follow"
            };
            
            console.log('delete id', id)
            fetch(`https://meduptodate.in/saathi/show_execute_notification.php?id=${id}`, requestOptions)
              .then((response) => response.json())
              .then((result) => {
                console.log('result delte', result)
                return result
              })
              .catch((error) => console.error(error));
        } catch (error) {
            console.log(error)
        }
    }

    const fetchAppoinments = async () => {
        try {
            console.log('done')
            const auth = await AsyncStorage.getItem('auth')
            const userProfile = JSON.parse(auth)
            console.log('user profile', userProfile)
            const myHeaders = new Headers();
            myHeaders.append("Cookie", "PHPSESSID=be468bfa2c6e5dd3a20c1f7af5a9bbbc");

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            fetch(`https://meduptodate.in/saathi/show_execute_notification.php?email=${userProfile?.user_email}`, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    // console.log(result)
                    if (result?.status === true) {
                        if (result?.appointments?.length > 0) {
                            result?.appointments?.map((ele, idx) => {
                                Alert.alert(`${ele?.name_of_eyedrop} - ${ele?.dose_time}`, 'Have you taken your dose!', [
                                    { text: 'Yes', onPress: () => fetchAcceptDose(ele?.name_of_eyedrop,ele?.id) },
                                    { text: 'No', onPress: () => fetchRemainingdose(ele?.name_of_eyedrop,ele?.id) },
                                ]);
                            })
                            return
                        }
                        return
                    }
                    return
                })
                .catch((error) => console.error(error));
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const subscribe = fetchAppoinments()

        return () => [subscribe]
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, []),
    );


    return (
        <View style={{ flex: 1 }}>
            <ImageBackground source={require('../assets/images/Background.png')} style={{ flex: 1, width: width }}>
                <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../assets/images/eyepressurelogo.png')} style={{ width: 120, height: 120 }} resizeMode='cover' />
                </View>
                <View style={{ flex: 0.8, justifyContent: 'flex-start', alignItems: 'center' }}>
                    <TouchableOpacity style={[styles.optionBox, { width: width - 30 }]} onPress={() => navigation.navigate('schedule-drops-reminder')}>
                        <Image source={require('../assets/images/dropreminder.png')} style={styles.optionImage} resizeMode='cover' />
                        <Text style={styles.optionsText}>Schedule Drops Reminder</Text>
                        <View style={[styles.bottomBorder, { width: width - 100 }]}></View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.optionBox, { width: width - 30 }]} onPress={() => navigation.navigate('upload-prescription')}>
                        <Image source={require('../assets/images/Prescription.png')} style={styles.optionImage} resizeMode='cover' />
                        <Text style={styles.optionsText}>Upload Prescription</Text>
                        <View style={[styles.bottomBorder, { width: width - 100 }]}></View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.optionBox, { width: width - 30 }]} onPress={() => navigation.navigate('next-appointment')}>
                        <Image source={require('../assets/images/Appointment.png')} style={styles.optionImage} resizeMode='cover' />
                        <Text style={styles.optionsText}>Next Appointment Reminder</Text>
                        <View style={[styles.bottomBorder, { width: width - 100 }]}></View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.optionBox, { width: width - 30 }]} onPress={() => navigation.navigate('eye-drops-refill')}>
                        <Image source={require('../assets/images/Refill.png')} style={styles.optionImage} resizeMode='cover' />
                        <Text style={styles.optionsText}>Eyedrops Refill / Repurchase Remainder</Text>
                        <View style={[styles.bottomBorder, { width: width - 100 }]}></View>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    )
}
const styles = StyleSheet.create({
    optionBox: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        borderColor: '#fff',
        borderWidth: 1,
        paddingVertical: 8,
        marginVertical: 8
    },
    optionsText: {
        color: '#253d95',
        textAlign: 'center',
        fontSize: 16,
        paddingVertical: 2,
        marginBottom: 6,
        marginTop: 2,
        fontWeight: '600'
    },
    bottomBorder: {
        backgroundColor: '#fff',
        borderBottomColor: '#fff',
        borderBottomWidth: 3
    },
    optionImage: {
        width: 45,
        height: 45
    }
})

export default Homepage
