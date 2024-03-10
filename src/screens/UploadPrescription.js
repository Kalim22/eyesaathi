import { ScrollView, StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, useWindowDimensions, TextInput, ActivityIndicator, Modal, FlatListComponent } from 'react-native'
import React, { useState } from 'react'
import Input from '../components/Input'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Loader from '../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../components/CustomButton';


const UploadPrescription = ({navigation}) => {

    const { width } = useWindowDimensions()

    const [showDate] = useState(new Date())
    const [cameraOpen, setCamerOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [photo, setPhoto] = useState(null)

    const openGallery = async () => {
        try {
            setLoading(true)
            const data = await launchImageLibrary({mediaType: 'mixed'}, (response) => {
                return response
            })
            setLoading(false)
            setCamerOpen(false)
            if(data?.didCancel === true){
                setPhoto(null)
                return
            }else{
                setPhoto(data)
                return
            }
        } catch (error) {
            console.log(error)
        }
    }


    const openCamera = async () => {
        try {
            setLoading(true)
            const data = await launchCamera({mediaType: 'mixed'}, (response) => {
                return response
            })
            setLoading(false)
            setCamerOpen(false)
            if(data?.didCancel === true){
                return setPhoto(null)
            }else{
                return setPhoto(data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchUploadDescription = async () => {
        try {

            if(photo === null){
                return alert('Please upload a file!')
            }
            setLoading(true)
            const date = new Date()
            const auth = await AsyncStorage.getItem('auth')
            const userProfile = JSON.parse(auth)

            const myHeaders = new Headers();
            myHeaders.append("Cookie", "PHPSESSID=1f7e5ea942425a2648dae890699bae59");

            const formdata = new FormData();
            formdata.append("email", userProfile?.user_email);
            formdata.append("prescription_files", { uri: photo?.assets[0]?.uri, name: 'upload-prescription-file', type: 'image/jpg' });
            formdata.append("Prescriptons_date_time", `${date.toJSON().split('T')[0]} ${date.toString().split(' ')[4]}`);

            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: formdata,
                redirect: 'follow'
            };

            fetch("https://meduptodate.in/saathi/upload_prescription.php", requestOptions)
                .then(response => response.json())
                .then(result => {
                    setLoading(false)
                    if(result?.status === true){
                        setPhoto(null)
                        return alert(result?.message)
                    }
                    setPhoto(null)
                    return alert(result?.message)
                })
                .catch(error => console.log('error', error));
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <ImageBackground source={require('../assets/images/Background.png')} style={{ flex: 1, width: width, position: 'relative' }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                    <View style={{ width: width, flex: 1, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                        <Image source={require('../assets/images/eyepressurelogo.png')} style={{ width: 120, height: 120, }} resizeMode='cover' />
                    </View>
                    <View style={{ width: width, flex: 4, justifyContent: 'flex-start', paddingVertical: 10, alignItems: 'center' }}  >
                        <View style={{ width: width, justifyContent: 'center', alignItems: 'center', paddingVertical: 20, }}  >
                            <Image source={require('../assets/images/Prescription.png')} style={{ width: 45, height: 45, }} resizeMode='cover' />
                            <Text style={{ color: "#253d95", fontSize: 18, paddingVertical: 4, }}>Upload Prescription</Text>
                            <View style={{ borderBottomColor: '#253d95', borderBottomWidth: 3, width: width - 30, height: 4 }} />
                        </View>
                        <Input placeholder="Date" value={`${showDate.toJSON().split('T')[0]}  ${showDate.toLocaleTimeString().split(' ')[0]}`} />
                        <TouchableOpacity activeOpacity={0.8} style={[styles.input, { width: width - 30 }]} onPress={() => setCamerOpen(true)}>
                            <Text style={{ fontSize: 18, fontWeight: '600', color: '#253d95', textAlign: 'center', }}>{photo === null ? 'Upload Prescription / Take Photo' : 'File Added'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} style={{ width: width - 40, borderRadius: 30, backgroundColor: "#253d95", marginTop: 15 }} onPress={fetchUploadDescription} >
                            <Text style={{ fontSize: 24, fontWeight: '600', color: '#fff', textAlign: 'center', paddingVertical: 12, }}>ADD</Text>
                        </TouchableOpacity>
                        <CustomButton buttonText="BACK" length={40} marginTop={10} onPress={() => navigation.goBack(-1)}  backgroundColor="transparent" borderColor="#fff" color="#253d95" />
                    </View>
                </View>
            </ImageBackground>
            <Modal visible={cameraOpen} transparent={true} animationType='slide'>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width, backgroundColor: 'rgba(0,0,0,0.6)',  }}>
                    <View style={{ width: width - 20, borderRadius: 6, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', elevation: 6, paddingVertical: 20 }}>
                        <TouchableOpacity activeOpacity={0.8} style={[styles.input, { width: width - 30, backgroundColor: '#253d95',  }]} onPress={openCamera}>
                            <Text style={{ fontSize: 18, fontWeight: '600', color: '#fff', textAlign: 'center', }}>Take Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} style={[styles.input, { width: width - 30,backgroundColor: '#253d95',  }]} onPress={openGallery}>
                            <Text style={{ fontSize: 18, fontWeight: '600', color: '#fff', textAlign: 'center', }}>Choose Gallery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} style={[styles.input, { width: width - 30, borderColor: '#253d95' }]} onPress={() => setCamerOpen(false)}>
                            <Text style={{ fontSize: 18, fontWeight: '600', color: '#253d95', textAlign: 'center', }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Loader loading={loading} />
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        borderRadius: 50,
        borderColor: "#fff",
        borderWidth: 1,
        marginVertical: 10,
        paddingHorizontal: 6,
        paddingVertical: 16,
        overflow: 'hidden',
        textAlign: 'center',
        color: "#253d95",
        fontSize: 20,
        fontWeight: '600',
    },
})


export default UploadPrescription