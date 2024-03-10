import {PixelRatio, Alert, StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground, useWindowDimensions, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomButton from '../components/CustomButton'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FullPageModal from '../components/FullPageModal'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Material from 'react-native-vector-icons/MaterialCommunityIcons'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import Input from '../components/Input'
import Loader from '../components/Loader'

const AppointmentDetails = ({navigation}) => {

    const { width, height } = useWindowDimensions()

    const [showModal, setShowModal] = useState(false)
    const [showCalender, setShowCalender] = useState(false)
    const [loading, setLoading] = useState(false)
    const [appointmentTitle, setAppointmentTitle] = useState('')
    const [appointmentDate, setAppointmentDate] = useState(null)
    const [appointmentList, setAppointmentList] = useState([])
    const [appointmentId, setAppointmentId] = useState('')
    const [singleAppointmentOrder, setSingleAppointmentOrder] = useState({})

    const handleCalenderDate = date => {
        setAppointmentDate(date)
        return handleCloseCalender()
    }

    const handleCloseCalender = () => {
        return setShowCalender(false)
    }

    const fetchAppointmentList = async () => {
        try {
            setLoading(true)
            const auth = await AsyncStorage.getItem('auth')
            const userProfile = JSON.parse(auth)

            const myHeaders = new Headers();
            myHeaders.append("Cookie", "PHPSESSID=0e5f37e8a50cb2e59da9bc814ed4b585");

            const requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch(`https://meduptodate.in/saathi/show_appointment_reminder.php?email=${userProfile?.user_email}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    setLoading(false)
                    setAppointmentList(result)
                    return
                })
                .catch(error => console.log('error', error));
        } catch (error) {
            console.log(error)
        }
    }

    const fetchSingleAppointment = (id) => {
        try {
            setLoading(true)
            setAppointmentId(id)
            const myHeaders = new Headers();
            myHeaders.append("Cookie", "PHPSESSID=0e5f37e8a50cb2e59da9bc814ed4b585");

            const requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch("https://meduptodate.in/saathi/single_show_appointment_reminder.php?appointment_id=" + id, requestOptions)
                .then(response => response.json())
                .then(result => {
                    setLoading(false)
                    setSingleAppointmentOrder(result)
                    console.log('single order', result)
                    return
                })
                .catch(error => console.log('error', error));
        } catch (error) {
            console.log(error)
        }
    }

    const fetchupdateAppointment = async () => {
        try {
            setLoading(true)
            const myHeaders = new Headers();
            myHeaders.append("Cookie", "PHPSESSID=0e5f37e8a50cb2e59da9bc814ed4b585");

            const formdata = new FormData();
            formdata.append("appointment_id", appointmentId);
            formdata.append("new_appointment_date", `${appointmentDate.toJSON().split('T')[0]} ${appointmentDate.toString().split(' ')[4]}`);
            formdata.append("new_appointment_title", appointmentTitle === "" ? singleAppointmentOrder?.appointment?.appointment_title : appointmentTitle);

            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: formdata,
                redirect: 'follow'
            };

            fetch("https://meduptodate.in/saathi/update_appointment_reminder.php", requestOptions)
                .then(response => response.json())
                .then(result => {
                    setLoading(false)
                    console.log('update',result)
                    if (result?.status === true) {
                        setShowModal(false)
                        alert(result?.message)
                        return fetchAppointmentList()
                    }
                    return alert(result?.message)
                })
                .catch(error => console.log('error', error));
        } catch (error) {
            console.log(error)
        }
    }

    const fetchDeleteRecord = async (id) => {
        try {
            
            const auth = await AsyncStorage.getItem('auth')
            const userProfile = JSON.parse(auth)

            const myHeaders = new Headers();
            myHeaders.append("Cookie", "PHPSESSID=0e5f37e8a50cb2e59da9bc814ed4b585");

            const requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch("https://meduptodate.in/saathi/show_appointment_reminder.php?email=" + userProfile?.user_email + "&appointment_id=" + id, requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log(result)
                    if (result?.status === true) {
                        alert(result?.message)
                        return fetchAppointmentList()
                    }
                    return alert(result?.message)
                })
                .catch(error => console.log('error', error));
        } catch (error) {
            console.log(error)
        }
    }

    const handleOpenDeleteAlert = id => {
        Alert.alert('Delete', 'Are you sure want to delete', [
            {
                text: 'Yes',
                onPress: () => fetchDeleteRecord(id),
                style: 'default'
            },
            {
                text: 'No',
                onPress: () => null,
                style: 'cancel'
            }
        ])
    }

    const openEditModal = id => {
        setShowModal(true)
        return fetchSingleAppointment(id)
    }


    useEffect(() => {
        const subscribe = fetchAppointmentList()

        return () => [subscribe]
    }, [])

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width, backgroundColor: '#fff' }} >
            <ImageBackground source={require('../assets/images/Background.png')} style={{ flex: 1, width: width }}>
                <View style={{ flex: 0.14, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../assets/images/eyepressurelogo.png')} style={{ width: 100, height: 100 }} resizeMode='cover' />
                </View>
                <View style={{ flex: 0.86, justifyContent: 'flex-start', alignItems: 'center' }}>
                    <View style={{ width, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: "#253d95", fontSize: width / 17, fontWeight: '600', paddingVertical: 4, }}>Appointment Details</Text>
                        <View style={{ borderBottomColor: '#253d95', borderBottomWidth: 3, width: width - 50, height: 4 }} />
                    </View>
                    <View style={{ justifyContent: 'flex-start', alignItems: 'center', marginTop: 14,marginBottom: 5, flex: 1, width }}>
                        <ScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', width }} >
                            {
                                appointmentList?.appointments?.map((ele, idx) => {
                                    return (
                                        <View style={[styles.doseContainer, { width: width - 20 }]} key={idx}>
                                            <View style={{ width: width - 20, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, flexDirection: 'row', overflow: 'hidden', backgroundColor: '#fff', borderRadius: 50 }}>
                                                <View style={{ paddingHorizontal: 30 }}>
                                                    <Text style={{ fontSize: 22, color: '#253d95' }}>{ele?.appointment_title}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', paddingRight: 15 }}>
                                                    <FontAwesome name="edit" size={30} onPress={() => openEditModal(ele?.appointment_id)} color="#253d95" style={{ marginRight: 30, top: 2 }} />
                                                    <Material name="delete" size={30} color="#253d95" onPress={() => handleOpenDeleteAlert(ele?.appointment_id)} />
                                                </View>
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </ScrollView>
                        <CustomButton buttonText="BACK" marginTop={10} onPress={() => navigation.goBack(-1)} backgroundColor="transparent" borderColor="#fff" color="#253d95" />
                    </View>
                </View>
            </ImageBackground>
            <FullPageModal visible={showModal} heading="View/Edit Appointment Details">
                <View style={{ width, justifyContent: 'center', alignItems: 'center' }}>
                    <Input onChangeText={text => setAppointmentTitle(text)} marginVertical={6} value={appointmentTitle} placeholder={singleAppointmentOrder?.appointment?.appointment_title}/>
                    <CustomButton buttonText={`${appointmentDate === null ? singleAppointmentOrder?.appointment?.appointment_date : appointmentDate.toJSON().split('T')[0] + ' ' + appointmentDate.toString().split(' ')[4]}`} onPress={() => setShowCalender(true)} backgroundColor="transparent" borderColor="#fff" color="#253d95" marginTop={6} />
                    <CustomButton buttonText="SAVE" onPress={fetchupdateAppointment} marginTop={30} />
                    <CustomButton buttonText="BACK" onPress={() => {
                        setShowModal(false)
                    }} backgroundColor="transparent" borderColor="#fff" color="#253d95" />
                </View>
            </FullPageModal>
            <DateTimePickerModal isVisible={showCalender}
                mode="datetime"
                minimumDate={new Date(new Date().toJSON().split('T')[0])}
                onConfirm={handleCalenderDate}
                onCancel={handleCloseCalender}
                isDarkModeEnabled={true}
            />
            <Loader loading={loading} />
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


export default AppointmentDetails