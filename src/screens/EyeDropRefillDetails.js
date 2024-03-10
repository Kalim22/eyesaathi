import { Alert, StyleSheet, Text, View,ScrollView, TouchableOpacity, Image, ImageBackground, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomButton from '../components/CustomButton'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FullPageModal from '../components/FullPageModal'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Material from 'react-native-vector-icons/MaterialCommunityIcons'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import Loader from '../components/Loader'

const EyeDropRefillDetails = ({ navigation }) => {

    const { width, height } = useWindowDimensions()

    const [eyeRefillData, setEyeRefillData] = useState({})
    const [eyeDropName, setEyeDropName] = useState('')
    const [eyeDropPurchaseDate, setEyeDropPurchaseDate] = useState(null)
    const [showCalender, setShowCalender] = useState(false)
    const [previousPurchaseDate, setPreviousPurchaseDate] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [singleData, setSingleData] = useState(null)

    const handleCalenderDate = date => {
        setEyeDropPurchaseDate(date)
        return handleCloseCalender()
    }

    const handleCloseCalender = () => {
        return setShowCalender(false)
    }

    const fetchData = async () => {
        try {
            setLoading(true)
            const auth = await AsyncStorage.getItem('auth')
            const userProfile = JSON.parse(auth)

            const requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            fetch(`https://meduptodate.in/saathi/show_eye_drop_refill.php?email=${userProfile?.user_email}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    setLoading(false)
                    // console.log('sinlge',result)
                    return setEyeRefillData(result)
                })
                .catch(error => console.log('error', error));
        } catch (error) {
            console.log(error)
        }
    }

    const fetchSingleData = async (id) => {
        try {
            setLoading(true)
            const auth = await AsyncStorage.getItem('auth')
            const userProfile = JSON.parse(auth)

            const requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            fetch(`https://meduptodate.in/saathi/single_show_eye_drop_refill.php?id=${id}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    setLoading(false)
                    console.log('sinlge',result?.data?.reminder_date_time)
                    return setSingleData(result)
                })
                .catch(error => console.log('error', error));
        } catch (error) {
            console.log(error)
        }
    }

    const fetchUpdateEyeDropRefiil = async () => {
        try {
            setLoading(true)
            const date = new Date()
            const formdata = new FormData();
            formdata.append("name", eyeDropName);
            formdata.append("new_date_of_purchase", eyeDropPurchaseDate === null ? previousPurchaseDate : `${eyeDropPurchaseDate.toJSON().split('T')[0]} ${date.toString().split(' ')[4]}`);

            const requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
            };

            fetch("https://meduptodate.in/saathi/update_eye_drop_refill.php", requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log(result)
                    setLoading(false)
                    if (result.status === "true") {
                        setShowModal(false)
                        setEyeDropPurchaseDate(null)
                        alert(result?.message)
                        return fetchData()
                    }
                    return alert(result?.message)
                })
                .catch(error => console.log('error', error));
        } catch (error) {
            console.log(error)
        }
    }

    const fetchDeleteRecord = id => {
        try {
            setLoading(true)
            const myHeaders = new Headers();
            myHeaders.append("Cookie", "PHPSESSID=5554e5816cf3d1388df46709eb31e406");

            const requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch(`https://meduptodate.in/saathi/delete_eye_drop_refill.php?id=${id}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log(result)
                    setLoading(false)
                    if (result?.status === "true") {
                        alert(result?.message)
                        return fetchData()
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


    useEffect(() => {
        const subscribe = fetchData()

        return () => [subscribe]
    }, [])

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width, backgroundColor: '#fff' }} >
            <ImageBackground source={require('../assets/images/Background.png')} style={{ flex: 1, width: width,  justifyContent: 'center', alignItems: 'center'}}>
                <ScrollView>
                    <View style={{ flex: 0.14, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={require('../assets/images/eyepressurelogo.png')} style={{ width: 100, height: 100 }} resizeMode='cover' />
                    </View>
                    <View style={{ flex: 0.86, justifyContent: 'flex-start', alignItems: 'center' }}>
                        <View style={{ width, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: "#253d95", fontSize: width / 17, fontWeight: '600', paddingVertical: 4, }}>Eye Drop Refill Summary</Text>
                            <View style={{ borderBottomColor: '#253d95', borderBottomWidth: 3, width: width - 50, height: 4 }} />
                        </View>
                        <View style={{ justifyContent: 'flex-start', alignItems: 'center', marginVertical: 20 }}>
                            {
                                eyeRefillData?.data?.map((ele, idx) => {
                                    return (
                                        <View style={[styles.doseContainer, { width: width - 20 }]} key={idx}>
                                            <View style={{ width: width - 20, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, flexDirection: 'row', overflow: 'hidden', backgroundColor: '#fff', borderRadius: 50 }}>
                                                <View style={{ paddingHorizontal: 30 }}>
                                                    <Text style={{ fontSize: 22, color: '#253d95' }}>{ele?.name}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', paddingRight: 15 }}>
                                                    <FontAwesome name="edit" size={30}
                                                        onPress={() => {
                                                            setShowModal(true)
                                                            setEyeDropName(ele?.name)
                                                            setPreviousPurchaseDate(ele?.date_of_purchase)
                                                            fetchSingleData(ele?.id)
                                                        }}
                                                        color="#253d95" style={{ marginRight: 30, top: 2 }} />
                                                    <Material name="delete" size={30} color="#253d95" onPress={() => handleOpenDeleteAlert(ele?.id)} />
                                                </View>
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                </ScrollView>
                <CustomButton buttonText="BACK" marginTop={10} onPress={() => navigation.goBack(-1)} backgroundColor="transparent" borderColor="#fff" color="#253d95" />
            </ImageBackground>
            <FullPageModal visible={showModal} heading="View/Edit Eye Drop Refill Date">
                <View style={{ width, justifyContent: 'center', alignItems: 'center' }}>
                    <CustomButton buttonText={eyeDropName} onPress={() => null} marginTop={10} activeOpacity={1} />
                    <CustomButton buttonText={eyeDropPurchaseDate === null ? previousPurchaseDate : `${eyeDropPurchaseDate.toJSON().split('T')[0]}`} color="#253d95" backgroundColor="transparent" borderColor="#fff" onPress={() => setShowCalender(true)} />
                    <CustomButton opacity={0.7} disabled={true} buttonText={'Reminder 1'} color="#253d95" backgroundColor="transparent" borderColor="#fff" />
                    <CustomButton opacity={0.7} disabled={true} buttonText={singleData?.data?.reminder_date_time} color="#253d95" backgroundColor="transparent" borderColor="#fff" />
                    <CustomButton opacity={0.7} disabled={true} buttonText={'Reminder 2'} color="#253d95" backgroundColor="transparent" borderColor="#fff" />
                    <CustomButton opacity={0.7} disabled={true} buttonText={singleData?.data?.reminder_date_time1} color="#253d95" backgroundColor="transparent" borderColor="#fff" />
                    <CustomButton buttonText="SAVE" onPress={fetchUpdateEyeDropRefiil} marginTop={20} disabled={eyeDropPurchaseDate === null ? true : false} opacity={eyeDropPurchaseDate === null ? 0.6 : 1} />
                    <CustomButton buttonText="BACK"
                        onPress={() => {
                            setShowModal(false)
                            setEyeDropPurchaseDate(null)
                        }}
                        color="#253d95" backgroundColor="transparent" borderColor="#fff" />
                </View>
            </FullPageModal>
            <DateTimePickerModal isVisible={showCalender}
                mode="date"
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


export default EyeDropRefillDetails