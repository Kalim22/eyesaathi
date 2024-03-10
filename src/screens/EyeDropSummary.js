import { ScrollView, Button, TouchableOpacity, StyleSheet, Text, View, ImageBackground, Image, useWindowDimensions, Modal } from 'react-native'
import Input from '../components/Input'
import React, { useState, useEffect } from 'react'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import CustomButton from '../components/CustomButton'
import CalenderPicker from 'react-native-calendar-picker'
import Icon from 'react-native-vector-icons/MaterialIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Loader from '../components/Loader'


const EyeDropSummary = ({ navigation }) => {

    const { width } = useWindowDimensions()

    const [showCalender, setShowCalender] = useState(false)
    const [selectStartDate, setSelectStartDate] = useState(null)
    const [selectEndDate, setSelectEndDate] = useState(null)
    const [eyeDropList, setEyeDropList] = useState([])
    const [modalEyeDropList, setModalEyeDropList] = useState(false)
    const [selectedEyeDrop, setSelectedEyeDrop] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSelectedEyeDrop = (id) => {
        setModalEyeDropList(false)
        setSelectedEyeDrop(id)
        return
    }


    const handleChange = (date, type) => {
        if (type == 'END_DATE') {
            return setSelectEndDate(date)
        } else {
            return setSelectStartDate(date)
        }
    }

    const handleCloseCalender = () => {
        setSelectStartDate(null)
        setSelectEndDate(null)
        return setShowCalender(false)
    }

    const fetchEyeDropData = async () => {
        try {
            setLoading(true)
            const auth = await AsyncStorage.getItem('auth')
            const userProfile = JSON.parse(auth)

            var myHeaders = new Headers();
            myHeaders.append("Cookie", "PHPSESSID=912f7145bb3bd5209a9a9a1281cc4e71");

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch(`https://meduptodate.in/saathi/show_schedule_drop_data.php?email=${userProfile?.user_email}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    setLoading(false)
                    console.log('result ----', result)
                    return setEyeDropList(result)
                })
                .catch(error => console.log('error', error));
        } catch (error) {
            console.log(error)
        }
    }


    const fetchAddEyeSummary = () => {
        try {
            if(selectStartDate === null){
                return alert('Please select date')
            }
            if(selectEndDate === null){
                return alert('Please select date')
            }
            setLoading(true)
            const myHeaders = new Headers();
            myHeaders.append("Cookie", "PHPSESSID=eaf6c2f393986cb857ae8da9c66670c6");

            const formdata = new FormData();
            formdata.append("name_of_eyedrop", selectedEyeDrop);
            formdata.append("new_drop_date_time", selectStartDate.toJSON().split('T')[0]);
            formdata.append("new_end_date", selectEndDate.toJSON().split('T')[0]);

            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: formdata,
                redirect: 'follow'
            };

            fetch("https://meduptodate.in/saathi/eyedrop_summary.php", requestOptions)
                .then(response => response.json())
                .then(result => {
                    setLoading(false)
                    if (result?.status === true) {
                        console.log(result)
                        setSelectEndDate(null)
                        setSelectStartDate(null)
                        setSelectedEyeDrop('')
                        return alert(result?.message)
                    }
                    return alert(result?.message)
                })
                .catch(error => console.log('error', error));
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const subscribe = fetchEyeDropData()

        return () => [subscribe]
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <ImageBackground source={require('../assets/images/Background.png')} style={{ flex: 1, width: width }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                    <View style={{ width: width, flex: 0.16, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', }}>
                        <Image source={require('../assets/images/eyepressurelogo.png')} style={{ width: 120, height: 120, }} resizeMode='cover' />
                    </View>
                    <View style={{ width: width, flex: 0.84, justifyContent: 'flex-start', paddingVertical: 10, alignItems: 'center' }}  >
                        <View style={{ width: width, justifyContent: 'center', alignItems: 'center', paddingVertical: 20, }}  >
                            <Image source={require('../assets/images/Summary.png')} style={{ width: 50, height: 50, }} resizeMode='cover' />
                            <Text style={{ color: "#253d95", fontSize: width / 17, fontWeight: '600', paddingVertical: 4, }}>Eyedrops Summary</Text>
                            {/*<View style={{ borderBottomColor: '#253d95', borderBottomWidth: 3, width: width - 30, height: 4 }} />*/}
                        </View>
                        <View style={{ position: "relative" }}>
                            <TouchableOpacity activeOpacity={0.8} style={{ elevation: 6, width: width - 20, borderRadius: 50, backgroundColor: "#253d95", marginTop: 20, marginBottom: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} onPress={() => setModalEyeDropList(!modalEyeDropList)}>
                                <Text style={{ fontSize: 20, fontWeight: '600', color: '#fff', textAlign: 'center', paddingVertical: 12, }}>{selectedEyeDrop === "" ? `Select Eye Drop` : selectedEyeDrop}</Text>
                                {modalEyeDropList === true ? <Icon name='keyboard-arrow-up' size={30} color="#fff" /> : <Icon name='keyboard-arrow-down' size={30} color="#fff" />}
                            </TouchableOpacity>
                            {
                                modalEyeDropList &&
                                <View style={{flex: 0.85, width: width - 15, backgroundColor: '#fff', elevation: 2, justifyContent: 'center', alignItems: 'center', paddingVertical: 20, zIndex: 1, alignSelf: 'center', borderRadius: 8 }}>
                                    <ScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'center',}}>
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

                        {
                            selectStartDate === null ? <CustomButton onPress={() => setShowCalender(true)} backgroundColor="transparent" borderColor="#fff" color="#253d95" marginTop={6} buttonText="Date: From_____to_____" />
                                : <CustomButton onPress={() => setShowCalender(true)} backgroundColor="transparent" borderColor="#fff" color="#253d95" marginTop={6} buttonText={`Date: From ${selectStartDate?.toJSON()?.split('T')[0]} to ${selectEndDate?.toJSON()?.split('T')[0]}`} />
                        }
                        <CustomButton elevation={2} borderColor="transparent" color="#fff" marginTop={30} buttonText="SAVE" onPress={fetchAddEyeSummary} />
                        <CustomButton elevation={2} backgroundColor="#3fbc96" borderColor="transparent" color="#fff" marginTop={0} buttonText="VIEW" onPress={() => navigation.navigate('view-eye-drop-summary-list')} />
                        <CustomButton buttonText="BACK" onPress={() => navigation.goBack(-1)}  backgroundColor="transparent" borderColor="#fff" color="#253d95" />                  
                    </View>
                </View>
            </ImageBackground>
            <Modal visible={showCalender} transparent={true}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', width }}>
                    <ImageBackground source={require('../assets/images/Background.png')} style={{ position: 'relative', width: width - 20, backgroundColor: '#fff', borderRadius: 6, justifyContent: 'center', alignItems: 'center', padding: 15, overflow: 'hidden' }}>
                        <CalenderPicker onDateChange={handleChange}
                            allowRangeSelection={true}
                            selectedDayColor="#6cbcbb"
                            selectedRangeStartStyle={{ justifyContent: 'center', alignItems: 'center', width: 40, height: 40, backgroundColor: '#253d95' }}
                            selectedRangeStartTextStyle={{ fontSize: 20, color: '#fff', fontWeight: '500' }}
                            selectedRangeEndStyle={{ justifyContent: 'center', alignItems: 'center', width: 40, height: 40, backgroundColor: '#253d95' }}
                            selectedRangeEndTextStyle={{ fontSize: 20, color: '#fff', fontWeight: '500' }}
                        />
                        <View style={{ paddingVertical: 15, width: width - 20, justifyContent: 'space-between', paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center' }}>
                            <CustomButton elevation={4} marginTop={20} length={width / 2 + 30} buttonText="Cancel" onPress={handleCloseCalender} />
                            <CustomButton elevation={4} marginTop={20} length={width / 2 + 30} buttonText="Apply" onPress={() => setShowCalender(false)} />
                        </View>
                    </ImageBackground>
                </View>
            </Modal>
            <Loader loading={loading} />
        </View>
    )
}

export default EyeDropSummary

const styles = StyleSheet.create({})

