import { Alert, Modal, BackHandler, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Loader from '../components/Loader'

const Homepage = ({ navigation }) => {

    const { width, height } = useWindowDimensions()

    const [showModal, setShowModal] = useState(false)

    const [appoinmentList, setAppointmentList] = useState(null)
    const [currentIndex, setCurrentIndex] = useState(null)
    const [loading, setLoading] = useState(false)
    const [userProfile, setUserProfile] = useState(null)

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
                        deleteRecords(id)
                        return fetchAppoinments()
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
                        deleteRecords(id)
                        return fetchAppoinments()

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
            setLoading(true)
            const auth = await AsyncStorage.getItem('auth')
            const userProfile = JSON.parse(auth)
            setUserProfile(userProfile)
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
                    setLoading(false)
                    // console.log('result of ===>',result)
                    if (result?.status === true) {
                        return setAppointmentList(result)
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
        const interval = setInterval(() => {
            fetchAppoinments()
        }, 60000);

        return () => clearInterval(interval)
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
            {
                appoinmentList?.appointments?.length > 0 ?
                    appoinmentList?.appointments?.reverse()?.map((ele, idx) => {
                        return (
                            <Modal visible={true} transparent={true} key={idx}>
                                <View style={{ flex: 1, justifyContent: "center", alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.4)' }}>
                                    <ImageBackground source={require('../assets/images/Background.png')} style={{ width: width - 50, paddingVertical: 20, justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Image source={require('../assets/images/dropreminder.png')} style={{ width: 80, height: 80 }} resizeMode='cover' />
                                        </View>
                                        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
                                            <Text style={{ color: '#000', fontSize: 24, textAlign: 'center', marginVertical: 8 }}>{userProfile?.doctor_name} has advised to take</Text>
                                            <Text style={{ color: '#000', fontSize: 30, textAlign: 'center', marginVertical: 4 }}>{ele?.name_of_eyedrop} - {ele?.dose_time}</Text>
                                            <Text style={{ color: '#000', fontSize: 24, fontWeight: '600', textAlign: 'center', marginVertical: 4 }}>Have you taken?</Text>
                                            <TouchableOpacity activeOpacity={0.8} style={{ elevation: 1, width: "100%", borderRadius: 50, backgroundColor: "#253d95", marginTop: 15, marginBottom: 10 }}
                                                onPress={() => fetchAcceptDose(ele?.name_of_eyedrop, ele?.id)}
                                            >
                                                <Text style={{ fontSize: 20, fontWeight: '600', color: '#fff', textAlign: 'center', paddingVertical: 12, }}>Yes</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity activeOpacity={0.8} style={{ elevation: 1, width: "100%", borderRadius: 50, backgroundColor: "#3fbc96", marginBottom: 10 }}
                                                onPress={() => fetchRemainingdose(ele?.name_of_eyedrop, ele?.id)}
                                            >
                                                <Text style={{ fontSize: 20, fontWeight: '600', color: '#fff', textAlign: 'center', paddingVertical: 12, }}>No</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </ImageBackground>
                                </View>
                            </Modal>
                        )
                    })
                    : null
            }
            <Loader loading={loading} />
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

// if (result?.appointments?.length > 0) {
                            // setShowModal(true)
                            // result?.appointments?.map((ele, idx) => {
                            //     Alert.alert(`${ele?.name_of_eyedrop} - ${ele?.dose_time}`, 'Have you taken your dose!', [
                            //         { text: 'Yes', onPress: () => fetchAcceptDose(ele?.name_of_eyedrop, ele?.id) },
                            //         { text: 'No', onPress: () => fetchRemainingdose(ele?.name_of_eyedrop, ele?.id) },
                            //     ]);
                            // })
                        // }