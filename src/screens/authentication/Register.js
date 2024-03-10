import {ScrollView, StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, useWindowDimensions, TextInput, ActivityIndicator, Modal } from 'react-native'
import React, { useState } from 'react'
import Loader from '../../components/Loader'
import ErrorComponent from '../../components/ErrorComponent'

const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep",
    "Delhi",
    "Puducherry"
  ];
  
const Register = ({ navigation }) => {

    const { width, height } = useWindowDimensions()

    const [loading, setLoading] = useState(false)
    const [check, setCheck] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [mobile, setMobile] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [doctor, setDoctor] = useState('')
    const [hospital, setHospital] = useState('')
    const [errorName, setErrorName] = useState(false)
    const [errorEmail, setErrorEmail] = useState(false)
    const [errorMobile, setErrorMobile] = useState(false)
    const [errorCity, setErrorCity] = useState(false)
    const [errorState, setErrorState] = useState(false)
    const [errorDoctor, setErrorDoctor] = useState(false)
    const [errorHospital, setErrorHospital] = useState(false)
    const [showState, setShowState] = useState(false)
    

    const handleSelectedState = (id) => {
        setShowState(false)
        return setState(id)
    }

    const handleReselectState = () => {
        setShowState(!showState)
        return setState('')
    }

    const fetchRegister = () => {
        try {

            if(name === ""){
                return setErrorName(true)
            }
            if(email === "" ){
                return setErrorEmail(true)
            }
            if( mobile === "" ){
                return setErrorMobile(true)
            }
            if( city === "" ){
                return setErrorCity(true)
            }
            if(state === "" ){
                return setErrorState(true)
            }
            if( doctor === "" ){
                return setErrorDoctor(true)
            }
            if(hospital === ""){
                return setErrorHospital(true)
            }
            if(check == false){
                return alert('Please accept terms and condtion!')
            }
            setLoading(true)
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", "PHPSESSID=9b11b605e0cb37817d03b612cfaaca61");

            const raw = JSON.stringify({
                "name": name,
                "email": email,
                "mobile": mobile,
                "city": city,
                "doctor_name": doctor,
                "state": state,
                "hospital": hospital
            });

            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://meduptodate.in/saathi/register.php", requestOptions)
                .then(response => response.json())
                .then(result => {
                    setLoading(false)
                    console.log('register',result)
                    if(result?.status === 'true'){
                        alert(result?.message)
                        return navigation.navigate('login')
                    }
                    return alert(result?.message)
                })
                .catch(error => console.log('error', error));
        } catch (error) {
            console.log(error)
        }
    }

    
    return (
        <View style={{ flex: 1 }}>
            <ImageBackground source={require('../../assets/images/Background.png')} style={{ flex: 1, width: width, position: 'relative' }}>

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                    <View style={{ width: width, flex: 0.2, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                        <Image source={require('../../assets/images/eyepressurelogo.png')} style={{ width: 120, height: 120, }} resizeMode='cover' />
                    </View>
                    <ScrollView nestedScrollEnabled={true} style={{ width: width, flex: 1 }} contentContainerStyle={{flexGrow: 1,justifyContent: 'flex-start', alignItems: 'center', }}>
                        <TextInput onChangeText={text => {
                            setErrorName(false)
                            setName(text)
                        }} value={name} style={[styles.input, { width: width - 20 }]} placeholderTextColor="#253d95" placeholder='Name of the Patient'></TextInput>
                        {errorName && <ErrorComponent error="Please enter your name" /> }
                        <TextInput onChangeText={text => {
                            setEmail(text)
                            setErrorEmail(false)
                        }} value={email} style={[styles.input, { width: width - 20 }]} placeholderTextColor="#253d95" placeholder='Email Address'></TextInput>
                        {errorEmail && <ErrorComponent error="Please enter your email" /> }
                        <TextInput onChangeText={text => {
                            setErrorMobile(false)
                            setMobile(text)
                        }} value={mobile} keyboardType='numeric' style={[styles.input, { width: width - 20 }]} placeholderTextColor="#253d95" placeholder='Mobile No.'></TextInput>
                        {errorMobile && <ErrorComponent error="Please enter your mobile" /> }
                        <TextInput onChangeText={text => {
                            setErrorCity(false)
                            setCity(text)
                        }} value={city} style={[styles.input, { width: width - 20 }]} placeholderTextColor="#253d95" placeholder='City'></TextInput>
                        {errorCity && <ErrorComponent error="Please enter your city" /> }
                        <TouchableOpacity style={[styles.input, { width: width - 20 }]} onPress={() => handleReselectState()}>
                            <Text style={{color: "#253d95",fontSize: 20,fontWeight: '600',textAlign: 'center'}}>{state == '' ? 'Select State' : state}</Text>
                        </TouchableOpacity>
                        {
                            showState &&
                            <View style={{height: 330, width: width - 15, backgroundColor: '#fff', elevation: 2, justifyContent: 'center', alignItems: 'center', paddingVertical: 20, zIndex: 1, alignSelf: 'center', borderRadius: 8 }}>
                                <ScrollView nestedScrollEnabled={true} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center',}}>
                                    {
                                        indianStates?.map((ele, idx) => {
                                            return (
                                                <TouchableOpacity style={{ width: width - 50, marginVertical: 10, paddingHorizontal: 20, borderRadius: 10, borderColor: '#253d95', borderWidth: 2 }} key={idx} onPress={() => handleSelectedState(ele)}>
                                                    <Text style={{ fontWeight: '500', fontSize: 20, paddingVertical: 10, color: '#253d95', paddingHorizontal: 10, }}>{ele}</Text>
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </ScrollView>
                            </View>
                        }
                        {errorState && <ErrorComponent error="Please enter your state" /> }
                        <TextInput onChangeText={text => {
                            setErrorDoctor(false)
                            setDoctor(text)
                        }} value={doctor} style={[styles.input, { width: width - 20 }]} placeholderTextColor="#253d95" placeholder='Name of the Doctor'></TextInput>
                        {errorDoctor && <ErrorComponent error="Please enter your doctar name" /> }
                        <TextInput onChangeText={text => {
                            setErrorHospital(false)
                            setHospital(text)
                        }} value={hospital} style={[styles.input, { width: width - 20 }]} placeholderTextColor="#253d95" placeholder='Hospital/Clinic'></TextInput>
                        {errorHospital && <ErrorComponent error="Please enter your hospital" /> }
                        <View style={{ flexDirection: 'row', width: width - 20, justifyContent: 'center', alignItems: 'center', marginVertical: 20 }}>
                            <TouchableOpacity onPress={() => setCheck(!check)} activeOpacity={1} style={{ width: 20, height: 20, zIndex: 2, borderColor: "#253d95", borderWidth: 2, marginRight: 8, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', }} >
                                <View style={{ width: 14, height: 14, backgroundColor: check ? '#253d95' : 'transparent', zIndex: 1 }} />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 15, color: '#304494' }}>I Agree to the  T&C and Privacy Policy</Text>
                        </View>
                        <TouchableOpacity activeOpacity={0.8} style={{ width: width - 40, borderRadius: 30, backgroundColor: "#253d95", marginBottom: 10 }} onPress={fetchRegister}>
                            <Text style={{ fontSize: 24, fontWeight: '600', color: '#fff', textAlign: 'center', paddingVertical: 12, }}>REGISTER</Text>
                        </TouchableOpacity>
                        <View style={{ justifyContent: 'center', alignItems: 'center', width: width - 20, flexDirection: 'row' }}>
                            <Text style={{ fontSize: 18, color: "#253d95" }}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('login')}><Text style={{ fontWeight: '600', fontSize: 20, color: '#253d95' }}>Login</Text></TouchableOpacity>
                        </View>
                    </ScrollView>

                </View>
            </ImageBackground>
            <Loader loading={loading} />
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        borderRadius: 50,
        borderColor: "#fff",
        borderWidth: 1,
        marginVertical: 8,
        textAlign: 'center',
        color: "#253d95",
        fontSize: 20,
        fontWeight: '600',
        paddingVertical: 13
    }
})

export default Register