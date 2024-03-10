import { TouchableOpacity, ScrollView, StyleSheet, Text, View, ImageBackground, useWindowDimensions, Image, TextInput, Button, Modal, Alert, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomButton from '../components/CustomButton'
import Input from '../components/Input'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Material from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Loader from '../components/Loader'
import ErrorComponent from '../components/ErrorComponent'


const ScheduleDropsReminder = ({ navigation }) => {
    const { width, height } = useWindowDimensions()

    const [loading, setLoading] = useState(false)
    const [eyeDropList, setEyeDropList] = useState({})
    const [eyeDropForm, setEyeDropForm] = useState(false)
    const [eyeDropName, setEyeDropName] = useState('')
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [eyeDropDateTime, setEyeDropDateTime] = useState('')
    const [moreEyeDropForm, setMoreEyeDropForm] = useState(false)
    const [modalEyeDropList, setModalEyeDropList] = useState(false)
    const [selectedEyeDrop, setSelectedEyeDrop] = useState('')

    const [doseDateOneTimeModal, setDoseOneTimeModal] = useState(false)
    const [doseDateTwoTimeModal, setDoseTwoTimeModal] = useState(false)
    const [doseDateThreeTimeModal, setDoseThreeTimeModal] = useState(false)
    const [doseDateFourTimeModal, setDoseFourTimeModal] = useState(false)
    const [doseDateFiveTimeModal, setDoseFiveTimeModal] = useState(false)
    const [doseDateSixTimeModal, setDoseSixTimeModal] = useState(false)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [color, setColor] = useState('red')

    const [doseOneTime, setDoseOneTime] = useState('')
    const [doseTwoTime, setDoseTwoTime] = useState('')
    const [doseThreeTime, setDoseThreeTime] = useState('')
    const [doseFourTime, setDoseFourTime] = useState('')
    const [doseFiveTime, setDoseFiveTime] = useState('')
    const [doseSixTime, setDoseSixTime] = useState('')

    const handleSelectedEyeDrop = (id) => {
        setModalEyeDropList(false)
        setSelectedEyeDrop(id)
        return
    }

    const handleOpenForm = () => {
        setEyeDropName('')
        setEyeDropDateTime('')
        return setEyeDropForm(true)
    }

    const showDatePicker = () => {
        return setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        return setDatePickerVisibility(false);
    };

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
    const handleConfirm = (date) => {
        setEyeDropDateTime(date)
        return hideDatePicker();
    };

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

    const fetchEyeDropData = async () => {
        try {
            setLoading(true)
            const auth = await AsyncStorage.getItem('auth')
            const userProfile = JSON.parse(auth)

            const myHeaders = new Headers();
            myHeaders.append("Cookie", "PHPSESSID=912f7145bb3bd5209a9a9a1281cc4e71");

            const requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch(`https://meduptodate.in/saathi/show_schedule_drop_data.php?email=${userProfile?.user_email}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    setLoading(false)
                    // console.log('result ----', result)
                    return setEyeDropList(result)
                })
                .catch(error => console.log('error', error));
        } catch (error) {
            console.log(error)
        }
    }

    const fetchAddList = async () => {
        try {
            setLoading(true)
            const auth = await AsyncStorage.getItem('auth')
            const userProfile = JSON.parse(auth)

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "name_of_eyedrop": eyeDropName,
                "email": userProfile?.user_email,
                "drop_date_time": `${eyeDropDateTime.toJSON().split('T')[0]}, ${eyeDropDateTime.toString().split(' ')[4]}`
            });

            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            }

            fetch("https://meduptodate.in/saathi/schedule_drop_reminder.php", requestOptions)
                .then(response => response.json())
                .then(result => {
                    // console.log('add result', result)
                    setLoading(false)
                    if (result?.status === true) {
                        setEyeDropForm(false)
                        fetchEyeDropData()
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

    const fetchUpdateDrops = async () => {
        try {
            setLoading(true)
            const auth = await AsyncStorage.getItem('auth')
            const userProfile = JSON.parse(auth)

            var myHeaders = new Headers();
            myHeaders.append("Cookie", "PHPSESSID=fae58f5df3e1ae3b23a26ba477a9e614");

            var formdata = new FormData();
            formdata.append("name_of_eyedrop", selectedEyeDrop)
            doseOneTime === "" ? null : formdata.append("dose1", "Dose 1");
            doseTwoTime === "" ? null : formdata.append("dose2", "Dose 2");
            doseThreeTime === "" ? null : formdata.append("dose3", "Dose 3")
            doseFourTime === "" ? null : formdata.append("dose4", "Dose 4")
            doseFiveTime === "" ? null : formdata.append("dose5", "Dose 5")
            doseSixTime === "" ? null : formdata.append("dose6", "Dose 6")
            formdata.append("email", userProfile?.user_email)
            formdata.append("drop_date_time", "2024-01-13 12:00:00")
            doseOneTime === "" ? null : formdata.append("dose1_time", doseOneTime.toString().split(' ')[4])
            doseTwoTime === "" ? null : formdata.append("dose2_time", doseTwoTime.toString().split(' ')[4])
            doseThreeTime === "" ? null : formdata.append("dose3_time", doseThreeTime.toString().split(' ')[4])
            doseFourTime === "" ? null : formdata.append("dose4_time", doseFourTime.toString().split(' ')[4])
            doseFiveTime === "" ? null : formdata.append("dose5_time", doseFiveTime.toString().split(' ')[4])
            doseSixTime === "" ? null : formdata.append("dose6_time", doseSixTime.toString().split(' ')[4])
            console.log("dose1_time", doseOneTime.toString().split(' ')[4])
            console.log("dose2_time", doseTwoTime.toString().split(' ')[4])
            console.log("dose3_time", doseThreeTime.toString().split(' ')[4])
            console.log("dose4_time", doseFourTime.toString().split(' ')[4])
            console.log("dose5_time", doseFiveTime.toString().split(' ')[4])
            console.log("dose6_time", doseSixTime.toString().split(' ')[4])

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: formdata,
                redirect: 'follow'
            };

            fetch("https://meduptodate.in/saathi/update_schedule_drop.php", requestOptions)
                .then(response => response.json())
                .then(result => {
                    // console.log('schedule page 8**',result)
                    setLoading(false)
                    if (result?.status === true) {
                        setMoreEyeDropForm(false)
                        setDoseOneTime('')
                        setDoseTwoTime('')
                        setDoseThreeTime('')
                        setDoseFourTime('')
                        setDoseFiveTime('')
                        setDoseSixTime('')
                        fetchEyeDropData()
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

    const handleAddMoreModal = () => {
        setMoreEyeDropForm(false)
        setDoseOneTime('')
        setDoseTwoTime('')
        setDoseThreeTime('')
        setDoseFourTime('')
        setDoseFiveTime('')
        setDoseSixTime('')
        setSelectedEyeDrop('')
        return
    }

    const fetchDeleteRecord = id => {
        try {
            setLoading(true)
            const requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            fetch(`https://meduptodate.in/saathi/delete_schedule_drop_reminder.php?id=${id}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    // console.log(result)
                    setLoading(false)
                    if (result?.status === true) {
                        fetchEyeDropData()
                        return Alert.alert(result?.message)
                    }
                    return Alert.alert(result?.message)
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
        const subscribe = fetchEyeDropData()

        return () => [subscribe]
    }, [])

    return (
        <View style={{ flex: 1, position: 'relative' }}>
            <ImageBackground source={require('../assets/images/Background.png')} style={{ flex: 1, width: width }}>
                <View style={{ flex: 0.16, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../assets/images/eyepressurelogo.png')} style={{ width: 100, height: 100 }} resizeMode='cover' />
                </View>
                <View style={{ flex: 0.84, justifyContent: 'flex-start', alignItems: 'center' }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', width, marginTop: 10, paddingVertical: 4 }}>
                        <Image source={require('../assets/images/dropreminder.png')} style={{ width: 50, height: 50 }} resizeMode='cover' />
                        {/*<Text style={styles.optionsText}>Schedule Drops Reminder</Text>*/}
                    </View>
                    {/*<View style={[styles.bottomBorder, { width: width - 50 }]}></View>*/}
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <CustomButton buttonText="Add Eye Drop" onPress={handleOpenForm} backgroundColor="transparent" color="#253d95" borderColor='#fff' />
                        <View style={{ flex: 0.88 }}>
                            <ScrollView contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center', paddingVertical: 20 }}>
                                {
                                    eyeDropList?.data?.map((ele, idx) => {
                                        return (
                                            <View key={idx} style={{ width: width - 10, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, flexDirection: 'row', overflow: 'hidden', backgroundColor: '#fff', borderRadius: 50, marginVertical: 10, }}>
                                                <View style={{ width: width / 2, paddingHorizontal: 30 }}>
                                                    <Text style={{ fontSize: 22, fontWeight: '600', color: '#253d95' }}>{ele?.name_of_eyedrop}</Text>
                                                </View>
                                                <View style={{ width: width / 2, paddingRight: 20, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                    <FontAwesome name="edit" size={30} onPress={() => {
                                                        if (ele?.dose_status == 0) {
                                                            setError(true)
                                                            setErrorMessage('Please add first!')
                                                            return setTimeout(() => {
                                                                setError(false)
                                                            }, 3000)
                                                        }
                                                        return navigation.navigate('drop-dose-time', { eyeDropId: ele?.id })
                                                    }} color="#253d95" style={{ marginRight: 30, top: 2 }} />
                                                    <Material name="delete" size={30} onPress={() => handleOpenDeleteAlert(ele?.id)} color="#253d95" />
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                        <CustomButton elevation={1} marginTop={20} buttonText="Schedule Drop Reminder" onPress={() => setMoreEyeDropForm(true)} backgroundColor="#253d95" color="#fff"  />

                        {
                            error &&
                            <ErrorComponent error={errorMessage} size={20} color={color} />
                        }
                        <CustomButton buttonText="BACK" onPress={() => navigation.goBack(-1)}  backgroundColor="transparent" borderColor="#fff" color="#253d95" />
                        </View>
                </View >
            </ImageBackground >
            <Modal visible={eyeDropForm} transparent={true} >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width, backgroundColor: 'rgba(0,0,0,0.6)' }}>
                    <View style={[styles.modalView, { width: width - 30 }]}>
                        <Input value={eyeDropName} onChangeText={text => setEyeDropName(text)} placeholder="Name of Eye Drop" borderColor="#253d95" length={70} />
                        <CustomButton buttonText={eyeDropDateTime === "" ? 'Start Date' : `${eyeDropDateTime.toJSON().split('T')[0]}`} color="#253d95" length={70} onPress={showDatePicker} backgroundColor="#fff" borderColor="#253d95" />
                        <CustomButton buttonText="Add" length={70} marginTop={30} onPress={fetchAddList} elevation={4} />
                        <CustomButton buttonText="Close" length={70} backgroundColor="#fff" borderColor="#253d95" color="#253d95" onPress={() => setEyeDropForm(false)} elevation={4} />
                    </View>
                </View>
            </Modal>
            <Modal visible={moreEyeDropForm} transparent={true} >
                <ImageBackground source={require('../assets/images/Background.png')} style={{ flex: 1, width: width }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width, backgroundColor: 'transparent' }} >
                        <View style={{ flex: 0.20, justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('../assets/images/eyepressurelogo.png')} style={{ width: 100, height: 100 }} resizeMode='cover' />
                            <Text style={{ color: "#253d95", fontSize: width / 17, fontWeight: '600', paddingVertical: 4, }}>Add Eye Drop Schedule</Text>
                            <View style={{ borderBottomColor: '#253d95', borderBottomWidth: 3, width: width - 50, height: 4 }} />
                        </View>
                        <View style={{ flex: 0.80, justifyContent: 'flex-start', alignItems: 'center' }}>

                            <View style={{ position: "relative" }}>
                                <TouchableOpacity activeOpacity={0.8} style={{ elevation: 6, width: width - 20, borderRadius: 50, backgroundColor: "#253d95", marginTop: 20, marginBottom: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} onPress={() => setModalEyeDropList(!modalEyeDropList)}>
                                    <Text style={{ fontSize: 20, fontWeight: '600', color: '#fff', textAlign: 'center', paddingVertical: 12, }}>{selectedEyeDrop === "" ? `Select Eye Drop` : selectedEyeDrop}</Text>
                                    {modalEyeDropList === true ? <Icon name='keyboard-arrow-up' size={30} color="#fff" /> : <Icon name='keyboard-arrow-down' size={30} color="#fff" />}
                                </TouchableOpacity>
                                {
                                    modalEyeDropList &&
                                    <View style={{ flex: 0.97, width: width - 15, backgroundColor: '#fff', elevation: 2, justifyContent: 'center', alignItems: 'center', paddingVertical: 20, zIndex: 1, alignSelf: 'center', borderRadius: 8 }}>
                                        <ScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', }}>
                                            {
                                                eyeDropList?.data?.map((ele, idx) => {
                                                    return (
                                                        <TouchableOpacity style={{ width: width - 50, marginVertical: 10, paddingHorizontal: 20, borderRadius: 10, borderColor: '#253d95', borderWidth: 2 }} key={idx} onPress={() => handleSelectedEyeDrop(ele?.name_of_eyedrop)}>
                                                            <Text style={{ fontWeight: '500', fontSize: 20, paddingVertical: 10, color: '#253d95', paddingHorizontal: 10, }}>{ele?.name_of_eyedrop}</Text>
                                                        </TouchableOpacity>
                                                    )
                                                })
                                            }
                                        </ScrollView>
                                    </View>
                                }
                            </View>
                            <View style={{ justifyContent: 'flex-start', alignItems: 'center', marginVertical: 20 }}>
                                <View style={[styles.doseContainer, { width: width - 20 }]}>
                                    <View style={{ width: width - 20, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, flexDirection: 'row', overflow: 'hidden', backgroundColor: '#fff', borderRadius: 50 }}>
                                        <View style={{ width: width / 2, paddingHorizontal: 30 }}>
                                            <Text style={{ fontSize: 22, color: '#253d95' }}>Dose 1</Text>
                                        </View>
                                        <TouchableOpacity style={[styles.doseBox, { width: width / 2 }]} onPress={() => setDoseOneTimeModal(true)}>
                                            <Text style={[styles.doseText]}>{doseOneTime === "" ? "/ 00:00:00" : `${doseOneTime.toString().split(' ')[4]}`}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={[styles.doseContainer, { width: width - 20 }]}>
                                    <View style={{ width: width - 20, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, flexDirection: 'row', overflow: 'hidden', backgroundColor: '#fff', borderRadius: 50 }}>
                                        <View style={{ width: width / 2, paddingHorizontal: 30 }}>
                                            <Text style={{ fontSize: 22, color: '#253d95' }}>Dose 2</Text>
                                        </View>
                                        <TouchableOpacity style={[styles.doseBox, { width: width / 2 }]} onPress={() => setDoseTwoTimeModal(true)}>
                                            <Text style={[styles.doseText]}>{doseTwoTime === "" ? "/ 00:00:00" : `${doseTwoTime.toString().split(' ')[4]}`}</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                                {
                                    doseThreeTime.toString().split(' ')[4] === '00:00:00' ? null :
                                        <View style={[styles.doseContainer, { width: width - 20 }]}>
                                            <View style={{ width: width - 20, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, flexDirection: 'row', overflow: 'hidden', backgroundColor: '#fff', borderRadius: 50 }}>
                                                <View style={{ width: width / 2, paddingHorizontal: 30 }}>
                                                    <Text style={{ fontSize: 22, color: '#253d95' }}>Dose 3</Text>
                                                </View>
                                                <TouchableOpacity style={[styles.doseBox, { width: width / 2 }]} onPress={() => setDoseThreeTimeModal(true)}>
                                                    <Text style={[styles.doseText]}>{doseThreeTime === "" ? "/ 00:00:00" : `${doseThreeTime.toString().split(' ')[4]}`}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                }

                                <View style={[styles.doseContainer, { width: width - 20 }]}>
                                    <View style={{ width: width - 20, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, flexDirection: 'row', overflow: 'hidden', backgroundColor: '#fff', borderRadius: 50 }}>
                                        <View style={{ width: width / 2, paddingHorizontal: 30 }}>
                                            <Text style={{ fontSize: 22, color: '#253d95' }}>Dose 4</Text>
                                        </View>
                                        <TouchableOpacity style={[styles.doseBox, { width: width / 2 }]} onPress={() => setDoseFourTimeModal(true)}>
                                            <Text style={[styles.doseText]}>{doseFourTime === "" ? "/ 00:00:00" : `${doseFourTime.toString().split(' ')[4]}`}</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                                <View style={[styles.doseContainer, { width: width - 20 }]}>
                                    <View style={{ width: width - 20, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, flexDirection: 'row', overflow: 'hidden', backgroundColor: '#fff', borderRadius: 50 }}>
                                        <View style={{ width: width / 2, paddingHorizontal: 30 }}>
                                            <Text style={{ fontSize: 22, color: '#253d95' }}>Dose 5</Text>
                                        </View>
                                        <TouchableOpacity style={[styles.doseBox, { width: width / 2 }]} onPress={() => setDoseFiveTimeModal(true)}>
                                            <Text style={[styles.doseText]}>{doseFiveTime === "" ? "/ 00:00:00" : `${doseFiveTime.toString().split(' ')[4]}`}</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                                <View style={[styles.doseContainer, { width: width - 20 }]}>
                                    <View style={{ width: width - 20, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, flexDirection: 'row', overflow: 'hidden', backgroundColor: '#fff', borderRadius: 50 }}>
                                        <View style={{ width: width / 2, paddingHorizontal: 30 }}>
                                            <Text style={{ fontSize: 22, color: '#253d95' }}>Dose 6</Text>
                                        </View>
                                        <TouchableOpacity style={[styles.doseBox, { width: width / 2 }]} onPress={() => setDoseSixTimeModal(true)}>
                                            <Text style={[styles.doseText]}>{doseSixTime === "" ? "/ 00:00:00" : `${doseSixTime.toString().split(' ')[4]}`}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            {
                                error &&
                                <ErrorComponent error={errorMessage} size={20} color={color} />
                            }
                            <CustomButton buttonText="SAVE" marginTop={6} onPress={fetchUpdateDrops} />
                            <CustomButton buttonText="BACK" onPress={() => handleAddMoreModal()} backgroundColor="transparent" color="#253d95" borderColor="#fff" />
                        </View>
                    </View>
                </ImageBackground>
            </Modal>
            <DateTimePickerModal isVisible={isDatePickerVisible}
                mode="date"
                minimumDate={new Date(new Date().toJSON().split('T')[0])}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                isDarkModeEnabled={true}
            />
            <DateTimePickerModal isVisible={doseDateOneTimeModal}
                mode="time"
                is24Hour={true}
                minimumDate={new Date(new Date().toJSON().split('T')[0])}
                onConfirm={handleAddDoseOneTime}
                onCancel={hideDoseOneDateTimeModal}
                isDarkModeEnabled={true}
            />
            <DateTimePickerModal isVisible={doseDateTwoTimeModal}
                mode="time"
                is24Hour={true}
                minimumDate={new Date(new Date().toJSON().split('T')[0])}
                onConfirm={handleAddDoseTwoTime}
                onCancel={hideDoseTwoDateTimeModal}
                isDarkModeEnabled={true}
            />
            <DateTimePickerModal isVisible={doseDateThreeTimeModal}
                mode="time"
                is24Hour={true}
                minimumDate={new Date(new Date().toJSON().split('T')[0])}
                onConfirm={handleAddDoseThreeTime}
                onCancel={hideDoseThreeDateTimeModal}
                isDarkModeEnabled={true}
            />
            <DateTimePickerModal isVisible={doseDateFourTimeModal}
                mode="time"
                is24Hour={true}
                minimumDate={new Date(new Date().toJSON().split('T')[0])}
                onConfirm={handleAddDoseFourTime}
                onCancel={hideDoseFourDateTimeModal}
                isDarkModeEnabled={true}
            />
            <DateTimePickerModal isVisible={doseDateFiveTimeModal}
                mode="time"
                is24Hour={true}
                minimumDate={new Date(new Date().toJSON().split('T')[0])}
                onConfirm={handleAddDoseFiveTime}
                onCancel={hideDoseFiveDateTimeModal}
                isDarkModeEnabled={true}
            />
            <DateTimePickerModal isVisible={doseDateSixTimeModal}
                mode="time"
                is24Hour={true}
                minimumDate={new Date(new Date().toJSON().split('T')[0])}
                onConfirm={handleAddDoseSixTime}
                onCancel={hideDoseSixDateTimeModal}
                isDarkModeEnabled={true}
            />
            <Loader loading={loading} />
        </View >
    )
}

const styles = StyleSheet.create({
    doseBox: {
        paddingRight: 20,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    doseText: {
        fontSize: 20,
        color: '#235d95',
        paddingHorizontal: 20,
        paddingVertical: 0,
    },
    doseContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 6,
        paddingHorizontal: 4,
        flexDirection: 'row',
        zIndex: -1
    },
    buttonText: {
        fontSize: 19,
        fontWeight: '600',
        color: '#fff',
        textAlign: 'center',
        paddingVertical: 6,
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

export default ScheduleDropsReminder

