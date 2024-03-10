import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomButton from '../components/CustomButton'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Loader from '../components/Loader'

const ViewEyeDropSummaryList = ({ navigation }) => {
    const { width, height } = useWindowDimensions()

    const [eyeDropList, setEyeDropList] = useState([])
    const [loading, setLoading] = useState(false)

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
                    console.log('list----', result)
                    return setEyeDropList(result)
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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width, backgroundColor: '#fff' }} >
            <ImageBackground source={require('../assets/images/Background.png')} style={{ flex: 1, width: width }}>
                <View style={{ flex: 0.14, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../assets/images/eyepressurelogo.png')} style={{ width: 100, height: 100 }} resizeMode='cover' />
                </View>
                <View style={{ flex: 0.86, justifyContent: 'flex-start', alignItems: 'center' }}>
                    <View style={{ width, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: "#253d95", fontSize: width / 17, fontWeight: '600', paddingVertical: 4, }}>View/Edit Eye Drop Schedule</Text>
                        <View style={{ borderBottomColor: '#253d95', borderBottomWidth: 3, width: width - 50, height: 4 }} />
                    </View>
                    <View style={{ flex: 0.99, justifyContent: 'flex-start', alignItems: 'center', marginVertical: 10, }}>
                        <ScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 4 }}>
                            {
                                eyeDropList?.data?.filter(ele => ele?.end_date !== '0000-00-00').map((ele, idx) => {
                                    return (
                                        <CustomButton key={idx} buttonText={ele?.name_of_eyedrop} backgroundColor="#fff" borderColor="#fff" color="#253d95" onPress={() => navigation.navigate('eye-drop-details', { details: ele })} />
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                </View>
            </ImageBackground>
            <Loader loading={loading} />
        </View>
    )
}

export default ViewEyeDropSummaryList

const styles = StyleSheet.create({})