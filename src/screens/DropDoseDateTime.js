import {PixelRatio, StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomButton from '../components/CustomButton'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ErrorComponent from '../components/ErrorComponent'
import Loader from '../components/Loader'

const DropDoseDateTime = ({ route, navigation }) => {

    const routeData = route;

    const { width, height } = useWindowDimensions()

    const [dropData, setDropData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [doseOneTime, setDoseOneTime] = useState('')
    const [doseTwoTime, setDoseTwoTime] = useState('')
    const [doseThreeTime, setDoseThreeTime] = useState('')
    const [doseFourTime, setDoseFourTime] = useState('')
    const [doseFiveTime, setDoseFiveTime] = useState('')
    const [doseSixTime, setDoseSixTime] = useState('')

    const [doseDateOneTimeModal, setDoseOneTimeModal] = useState(false)
    const [doseDateTwoTimeModal, setDoseTwoTimeModal] = useState(false)
    const [doseDateThreeTimeModal, setDoseThreeTimeModal] = useState(false)
    const [doseDateFourTimeModal, setDoseFourTimeModal] = useState(false)
    const [doseDateFiveTimeModal, setDoseFiveTimeModal] = useState(false)
    const [doseDateSixTimeModal, setDoseSixTimeModal] = useState(false)

    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [color, setColor] = useState('red')

    const hideDoseOneDateTimeModal = () => {
        return setDoseOneTimeModal(false)
    }
    const hideDoseTwoDateTimeModal = () => {
        return setDoseTwoTimeModal(false)
    }
    const hideDoseThreeDateTimeModal = () => {
        return setDoseThreeTimeModal(false)
    }
    const hideDoseFourDateTimeModal = () => {
        return setDoseFourTimeModal(false)
    }
    const hideDoseFiveDateTimeModal = () => {
        return setDoseFiveTimeModal(false)
    }
    const hideDoseSixDateTimeModal = () => {
        return setDoseSixTimeModal(false)
    }

    const handleAddDoseOneTime = (date) => {
        setDoseOneTime(date)
        return hideDoseOneDateTimeModal()
    }
    const handleAddDoseTwoTime = (date) => {
        setDoseTwoTime(date)
        return hideDoseTwoDateTimeModal()
    }
    const handleAddDoseThreeTime = (date) => {
        setDoseThreeTime(date)
        return hideDoseThreeDateTimeModal()
    }
    const handleAddDoseFourTime = (date) => {
        setDoseFourTime(date)
        return hideDoseFourDateTimeModal()
    }
    const handleAddDoseFiveTime = (date) => {
        setDoseFiveTime(date)
        return hideDoseFiveDateTimeModal()
    }
    const handleAddDoseSixTime = (date) => {
        setDoseSixTime(date)
        return hideDoseSixDateTimeModal()
    }


    const fetchDropDoseTimings = () => {
        try {
            setLoading(true)
            const requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            fetch(`https://meduptodate.in/saathi/single_schedule_data.php?id=${routeData?.params?.eyeDropId}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    setLoading(false)
                    return setDropData(result)
                })
                .catch(error => console.log('error', error));
        } catch (error) {
            console.log(error)
        }
    }

    const fetchUpdateDrops = async () => {
        try {
            setLoading(true)
            const auth = await AsyncStorage.getItem('auth')
            const userProfile = JSON.parse(auth)

            const formdata = new FormData();
            formdata.append("name_of_eyedrop", dropData?.data?.name_of_eyedrop)
            formdata.append("dose1", "Dose 1")
            formdata.append("dose2", "Dose 2")
            formdata.append("dose3", "Dose 3")
            formdata.append("dose4", "Dose 4")
            formdata.append("dose5", "Dose 5")
            formdata.append("dose6", "Dose 6")
            formdata.append("email", userProfile?.user_email)
            formdata.append("drop_date_time", dropData?.data?.drop_date_time)
            formdata.append("dose1_time", doseOneTime === "" ? dropData?.data?.dose1_time : doseOneTime.toString().split(' ')[4])
            formdata.append("dose2_time", doseTwoTime === "" ? dropData?.data?.dose2_time : doseTwoTime.toString().split(' ')[4])
            formdata.append("dose3_time", doseThreeTime === "" ? dropData?.data?.dose3_time : doseThreeTime.toString().split(' ')[4])
            formdata.append("dose4_time", doseFourTime === "" ? dropData?.data?.dose4_time : doseFourTime.toString().split(' ')[4])
            formdata.append("dose5_time", doseFiveTime === "" ? dropData?.data?.dose5_time : doseFiveTime.toString().split(' ')[4])
            formdata.append("dose6_time", doseSixTime === "" ? dropData?.data?.dose6_time : doseSixTime.toString().split(' ')[4])


            const requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
            };

            fetch("https://meduptodate.in/saathi/update_schedule_drop.php", requestOptions)
                .then(response => response.json())
                .then(result => {
                    setLoading(false)
                    console.log('updated first result---<-->', result?.status, result?.message)
                    console.log('updated result---<-->', result)
                    if (result?.status == true) {
                        setDoseOneTime('')
                        setDoseTwoTime('')
                        setDoseThreeTime('')
                        setDoseFourTime('')
                        setDoseFiveTime('')
                        setDoseSixTime('')
                        fetchDropDoseTimings()
                        setError(true)
                        setErrorMessage(result?.message)
                        setColor('#253d95')
                        return setTimeout(() => {
                            return setError(false)
                        }, 3500)
                    }
                    setError(true)
                        setErrorMessage(result?.message)
                        return setTimeout(() => {
                            return setError(false)
                        }, 3500)

                })
                .catch(error => console.log('error', error));
        } catch (error) {
            console.log(error)
        }
    }
 

    useEffect(() => {
        const subscribe = fetchDropDoseTimings()

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
                        <Text style={{ color: "#253d95", fontSize: width / 17, fontWeight: '600', paddingVertical: 4, }}>Views/Edit Eye Drop Schedule</Text>
                        <View style={{ borderBottomColor: '#253d95', borderBottomWidth: 3, width: width - 50, height: 4 }} />
                    </View>
                    <View style={{ position: "relative" }}>
                        <CustomButton buttonText={dropData?.data?.name_of_eyedrop.toUpperCase()} length={0} marginTop={30} elevation={2} onPress={() => null} activeOpacity={1} />
                    </View>
                    <View style={{ justifyContent: 'flex-start', alignItems: 'center', marginVertical: 10 }}>
                        <View style={[styles.doseContainer, { width: width - 20 }]}>
                            <TouchableOpacity style={{ width: width - 20, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, flexDirection: 'row', overflow: 'hidden', backgroundColor: '#fff', borderRadius: 50 }} onPress={() => setDoseOneTimeModal(true)}>
                                <View style={{ width: width / 2, paddingHorizontal: 30 }}>
                                    <Text style={{ fontSize: 22, color: '#253d95' }}>Dose 1</Text>
                                </View>
                                <View style={[styles.doseBox, { width: width / 2 }]} >
                                    <Text style={[styles.doseText]}>{doseOneTime === "" ? dropData?.data?.dose1_time == '00:00:00' ? null : dropData?.data?.dose1_time : doseOneTime.toString().split(' ')[4]}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.doseContainer, { width: width - 20 }]}>
                            <TouchableOpacity style={{ width: width - 20, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, flexDirection: 'row', overflow: 'hidden', backgroundColor: '#fff', borderRadius: 50 }} onPress={() => setDoseTwoTimeModal(true)}>
                                <View style={{ width: width / 2, paddingHorizontal: 30 }}>
                                    <Text style={{ fontSize: 22, color: '#253d95' }}>Dose 2</Text>
                                </View>
                                <View style={[styles.doseBox, { width: width / 2 }]} >
                                    <Text style={[styles.doseText]}>{doseTwoTime === "" ? dropData?.data?.dose2_time == '00:00:00' ? null : dropData?.data?.dose2_time : doseTwoTime.toString().split(' ')[4]}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.doseContainer, { width: width - 20 }]}>
                            <TouchableOpacity style={{ width: width - 20, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, flexDirection: 'row', overflow: 'hidden', backgroundColor: '#fff', borderRadius: 50 }} onPress={() => setDoseThreeTimeModal(true)}>
                                <View style={{ width: width / 2, paddingHorizontal: 30 }}>
                                    <Text style={{ fontSize: 22, color: '#253d95' }}>Dose 3</Text>
                                </View>
                                <View style={[styles.doseBox, { width: width / 2 }]} >
                                    <Text style={[styles.doseText]}>{doseThreeTime === "" ? dropData?.data?.dose3_time == '00:00:00' ? null : dropData?.data?.dose3_time : doseThreeTime.toString().split(' ')[4]}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.doseContainer, { width: width - 20 }]}>
                            <TouchableOpacity style={{ width: width - 20, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, flexDirection: 'row', overflow: 'hidden', backgroundColor: '#fff', borderRadius: 50 }} onPress={() => setDoseFourTimeModal(true)}>
                                <View style={{ width: width / 2, paddingHorizontal: 30 }}>
                                    <Text style={{ fontSize: 22, color: '#253d95' }}>Dose 4</Text>
                                </View>
                                <View style={[styles.doseBox, { width: width / 2 }]} >
                                    <Text style={[styles.doseText]}>{doseFourTime === "" ? dropData?.data?.dose4_time == '00:00:00' ? null : dropData?.data?.dose4_time : doseFourTime.toString().split(' ')[4]}</Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                        <View style={[styles.doseContainer, { width: width - 20 }]}>
                            <TouchableOpacity style={{ width: width - 20, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, flexDirection: 'row', overflow: 'hidden', backgroundColor: '#fff', borderRadius: 50 }} onPress={() => setDoseFiveTimeModal(true)}>
                                <View style={{ width: width / 2, paddingHorizontal: 30 }}>
                                    <Text style={{ fontSize: 22, color: '#253d95' }}>Dose 5</Text>
                                </View>
                                <View style={[styles.doseBox, { width: width / 2 }]} >
                                    <Text style={[styles.doseText]}>{doseFiveTime === "" ? dropData?.data?.dose5_time == '00:00:00' ? null : dropData?.data?.dose5_time : doseFiveTime.toString().split(' ')[4]}</Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                        <View style={[styles.doseContainer, { width: width - 20 }]}>
                            <TouchableOpacity style={{ width: width - 20, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, flexDirection: 'row', overflow: 'hidden', backgroundColor: '#fff', borderRadius: 50 }} onPress={() => setDoseSixTimeModal(true)}>
                                <View style={{ width: width / 2, paddingHorizontal: 30 }}>
                                    <Text style={{ fontSize: 22, color: '#253d95' }}>Dose 6</Text>
                                </View>
                                <View style={[styles.doseBox, { width: width / 2 }]} >
                                    <Text style={[styles.doseText]}>{doseSixTime === "" ? dropData?.data?.dose6_time == '00:00:00' ? null : dropData?.data?.dose6_time : doseSixTime.toString().split(' ')[4]}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {
                            error &&
                            <ErrorComponent error={errorMessage} size={20} color={color} />
                        }
                    </View>
                    <CustomButton buttonText="SAVE" marginTop={6} onPress={fetchUpdateDrops} />
                    <CustomButton buttonText="BACK" marginTop={0} backgroundColor="transparent" borderColor="#fff" color="#fff" onPress={() => navigation.goBack()} />
                </View>
            </ImageBackground>
            <DateTimePickerModal isVisible={doseDateOneTimeModal}
                mode="time"
                is24Hour={true}
                onConfirm={handleAddDoseOneTime}
                onCancel={hideDoseOneDateTimeModal}
                isDarkModeEnabled={true}
            />
            <DateTimePickerModal isVisible={doseDateTwoTimeModal}
                mode="time"
                is24Hour={true}
                onConfirm={handleAddDoseTwoTime}
                onCancel={hideDoseTwoDateTimeModal}
                isDarkModeEnabled={true}
            />
            <DateTimePickerModal isVisible={doseDateThreeTimeModal}
                mode="time"
                is24Hour={true}
                onConfirm={handleAddDoseThreeTime}
                onCancel={hideDoseThreeDateTimeModal}
                isDarkModeEnabled={true}
            />
            <DateTimePickerModal isVisible={doseDateFourTimeModal}
                mode="time"
                is24Hour={true}
                onConfirm={handleAddDoseFourTime}
                onCancel={hideDoseFourDateTimeModal}
                isDarkModeEnabled={true}
            />
            <DateTimePickerModal isVisible={doseDateFiveTimeModal}
                mode="time"
                is24Hour={true}
                onConfirm={handleAddDoseFiveTime}
                onCancel={hideDoseFiveDateTimeModal}
                isDarkModeEnabled={true}
            />
            <DateTimePickerModal isVisible={doseDateSixTimeModal}
                mode="time"
                is24Hour={true}
                onConfirm={handleAddDoseSixTime}
                onCancel={hideDoseSixDateTimeModal}
                isDarkModeEnabled={true}
            />
            <Loader loading={loading} />
        </View>
    )
}

const styles = StyleSheet.create({
    doseBox: {
        paddingRight: 20,
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


export default DropDoseDateTime