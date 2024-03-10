import { ScrollView, StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, useWindowDimensions, TextInput, ActivityIndicator, Modal, FlatListComponent } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Loader from '../components/Loader'
import CustomButton from '../components/CustomButton'

const UploadPrescriptionDetails = ({ navigation }) => {
    const { width } = useWindowDimensions()

    const [uploadFiles, setUploadFiles] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchUploadFiles = async () => {
        try {
            setLoading(true)
            const auth = await AsyncStorage.getItem('auth')
            const userProfile = JSON.parse(auth)

            var myHeaders = new Headers();
            myHeaders.append("Cookie", "PHPSESSID=eaf6c2f393986cb857ae8da9c66670c6");

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch(`https://meduptodate.in/saathi/upload_prescription.php?email=${userProfile?.user_email}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    setLoading(false)
                    console.log('uploadd', result)
                    return setUploadFiles(result)
                })
                .catch(error => console.log('error', error));
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const subscribe = fetchUploadFiles()

        return () => [subscribe]
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <ImageBackground source={require('../assets/images/Background.png')} style={{ flex: 1, width: width }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                    <View style={{ width: width, flex: 0.18, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', }}>
                        <Image source={require('../assets/images/eyepressurelogo.png')} style={{ width: 120, height: 120, }} resizeMode='cover' />
                    </View>
                    <View style={{ width: width, flex: 0.82, justifyContent: 'flex-start', paddingVertical: 10, alignItems: 'center' }}  >
                        <View style={{ width: width, justifyContent: 'center', alignItems: 'center', }}  >
                            <Text style={{ color: "#253d95", fontSize: width / 17, fontWeight: '600' }}>Upload Prescription Files</Text>
                            <View style={{ borderBottomColor: '#253d95', borderBottomWidth: 3, width: width - 30, height: 4 }} />
                        </View>
                        <View style={{ width: width, justifyContent: 'center', alignItems: 'center' }}>
                            <ScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 35 }}>
                                {
                                    uploadFiles?.length < 1 ?
                                        <Text style={{ fontSize: 22, fontWeight: '600', color: '#253d95', marginTop: 60 }}>There is no upload files!</Text>
                                        :
                                        uploadFiles?.map((ele, idx) => {
                                            return (
                                                <View style={{ width: width - 20, backgroundColor: '#fff', marginVertical: 10, elevation: 6, borderRadius: 3, overflow: 'hidden' }} key={idx}>
                                                    <View style={{ width }}>
                                                        <Image source={{ uri: `https://meduptodate.in/saathi/${ele?.prescription_files}` }} style={{ width: width, height: 200 }} />
                                                    </View>
                                                    <View style={{ paddingVertical: 10 }}>
                                                        <Text style={{ textAlign: 'center', fontSize: 22, fontWeight: '600', color: '#253d95' }}>{ele?.Prescriptons_date_time}</Text>
                                                    </View>
                                                </View>
                                            )
                                        })
                                }
                            </ScrollView>
                        </View>
                    </View>
                    <CustomButton buttonText="BACK" onPress={() => navigation.goBack(-1)} backgroundColor="transparent" borderColor="#fff" color="#253d95" />
                </View>
            </ImageBackground>
            <Loader loading={loading} />
        </View>
    )
}

export default UploadPrescriptionDetails

const styles = StyleSheet.create({})