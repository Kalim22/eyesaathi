import { ScrollView, TextInput, Alert, StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground, useWindowDimensions, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomButton from '../components/CustomButton'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Input from '../components/Input'


const UserProfile = ({ navigation }) => {

    const { width } = useWindowDimensions()
    const [profile, setProfile] = useState({})
    const [showModal, setShowModal] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [mobile, setMobile] = useState()
    const [city, setCity] = useState()
    const [state, setState] = useState()
    const [doctor, setDoctor] = useState()
    const [hospital, setHospital] = useState()


    const fetchProfile = async () => {
        try {
            const auth = await AsyncStorage.getItem('auth')
            const userProfile = JSON.parse(auth)

            const myHeaders = new Headers();
            myHeaders.append("Cookie", "PHPSESSID=0e5f37e8a50cb2e59da9bc814ed4b585");

            const requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch(`https://meduptodate.in/saathi/user_show_update.php?email=${userProfile?.user_email}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    setProfile(result)
                    setName(result?.name)
                    setMobile(result?.mobile)
                    setCity(result?.city)
                    setState(result?.state)
                    setDoctor(result?.doctor_name)
                    setHospital(result?.hospital)
                    return
                })
                .catch(error => console.log('error', error));
        } catch (error) {
            console.log(error)
        }
    }

    const fetchUpdateProfile = () => {
        try {
            console.log('profile')
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", "PHPSESSID=0e5f37e8a50cb2e59da9bc814ed4b585");

            const raw = JSON.stringify({
                "email": email === "" ? profile?.email : email,
                "name": name === "" ? profile?.name : name,
                "mobile": mobile === "" ? profile?.mobile : mobile,
                "city": city === "" ? profile?.city : city,
                "doctor_name": doctor === "" ? profile?.doctor_name : doctor,
                "state": state === "" ? profile?.state : state,
                "hospital": hospital === "" ? profile?.hospital : hospital
            });

            const requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://meduptodate.in/saathi/user_show_update.php", requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log(result)
                    if (result?.status === true) {
                        setShowModal(false)
                        alert(result?.message)
                        fetchProfile()
                        return result
                    }
                    return alert(result?.message)
                })
                .catch(error => console.log('error', error));
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const subscribe = fetchProfile()

        return () => [subscribe]
    }, [])

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width, backgroundColor: '#fff' }} >
            <ImageBackground source={require('../assets/images/Background.png')} style={{ flex: 1, width: width }}>
                <ScrollView>
                    <View style={{ flex: 0.14, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={require('../assets/images/eyepressurelogo.png')} style={{ width: 100, height: 100 }} resizeMode='cover' />
                    </View>
                    <View style={{ flex: 0.86, justifyContent: 'flex-start', alignItems: 'center' }}>
                        <View style={{ width, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: "#253d95", fontSize: 26, fontWeight: '600', paddingVertical: 4, }}>Profile</Text>
                            <View style={{ borderBottomColor: '#253d95', borderBottomWidth: 3, width: width - 50, height: 4 }} />
                        </View>
                        <View style={{ position: "relative" }}>
                        </View>
                        <View style={{ justifyContent: 'flex-start', alignItems: 'center', marginVertical: 20 }}>
                            <Input marginVertical={6} value={profile?.name} editable={false} />
                            <Input marginVertical={6} value={profile?.email} editable={false} />
                            <Input marginVertical={6} value={profile?.mobile} editable={false} />
                            <Input marginVertical={6} value={profile?.city} editable={false} />
                            <Input marginVertical={6} value={profile?.state} editable={false} />
                            <Input marginVertical={6} value={profile?.doctor_name} editable={false} />
                            <Input marginVertical={6} value={profile?.hospital} editable={false} />
                            <CustomButton buttonText="EDIT" marginTop={25} onPress={() => setShowModal(true)} />
                            <CustomButton buttonText="BACK" onPress={() => navigation.goBack(-1)} backgroundColor="transparent" borderColor="#fff" color="#253d95" />
                        </View>
                    </View>
                </ScrollView>
            </ImageBackground>
            <Modal visible={showModal} transparent={true}>
                <View style={{ flex: 1 }}>
                    <ImageBackground source={require('../assets/images/Background.png')} style={{ flex: 1, width: width }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                            <View style={{ width: width, flex: 0.2, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                                <Image source={require('../assets/images/eyepressurelogo.png')} style={{ width: 120, height: 120, }} resizeMode='cover' />
                            </View>
                            <ScrollView style={{ width: width, flex: 1 }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', alignItems: 'center', }}>
                                <TextInput onChangeText={text => {
                                    setName(text)
                                }} value={name} style={[styles.input, { width: width - 20 }]} placeholderTextColor="#253d95" placeholder="Name"></TextInput>

                                <TextInput onChangeText={text => {
                                    setMobile(text)
                                }} value={mobile} keyboardType='numeric' style={[styles.input, { width: width - 20 }]} placeholderTextColor="#253d95" placeholder="Mobile"></TextInput>
                                <TextInput onChangeText={text => {
                                    setCity(text)
                                }} value={city} style={[styles.input, { width: width - 20 }]} placeholderTextColor="#253d95" placeholder="City"></TextInput>
                                <TextInput onChangeText={text => {
                                    setState(text)
                                }} value={state} style={[styles.input, { width: width - 20 }]} placeholderTextColor="#253d95" placeholder="State"></TextInput>
                                <TextInput onChangeText={text => {
                                    setDoctor(text)
                                }} value={doctor} style={[styles.input, { width: width - 20 }]} placeholderTextColor="#253d95" placeholder="Doctor Name"></TextInput>
                                <TextInput onChangeText={text => {
                                    setHospital(text)
                                }} value={hospital} style={[styles.input, { width: width - 20 }]} placeholderTextColor="#253d95" placeholder="Hospital Name"></TextInput>

                                <TouchableOpacity activeOpacity={0.8} style={{ width: width - 40, borderRadius: 30, backgroundColor: "#253d95", marginBottom: 10, marginTop: 25 }} onPress={fetchUpdateProfile}>
                                    <Text style={{ fontSize: 24, fontWeight: '600', color: '#fff', textAlign: 'center', paddingVertical: 12, }}>SAVE</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.8} style={{ width: width - 40, borderRadius: 30, backgroundColor: "transparent", borderColor: '#fff', borderWidth: 1, marginBottom: 10 }} onPress={() => setShowModal(false)}>
                                    <Text style={{ fontSize: 24, fontWeight: '600', color: '#fff', textAlign: 'center', paddingVertical: 12, color: '#253d95', }}>BACK</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </ImageBackground>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        borderRadius: 50,
        borderColor: "#fff",
        borderWidth: 1,
        marginVertical: 7,
        textAlign: 'center',
        color: "#253d95",
        fontSize: 20,
        fontWeight: '600',
        paddingVertical: 13
    }
})

export default UserProfile