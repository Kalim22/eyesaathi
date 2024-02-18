import {PermissionsAndroid, StyleSheet, Text, View, ImageBackground, Image, useWindowDimensions, Platform } from 'react-native'
import React, { useState, useEffect,useRef } from 'react'
import CustomButton from '../components/CustomButton'
import { captureRef } from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Loader from '../components/Loader';


const EyeSummaryDetails = ({ route }) => {

    const { width } = useWindowDimensions()
    const [loading, setLoading] = useState(false)

    const data = route
    // console.log('data ---', data?.params?.details)
    const [details, setDetails] = useState({})

    const requestStorage = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                { 
                  title: 'Cool Photo App Camera Permission',
                  message:
                    'Cool Photo App needs access to your camera ' +
                    'so you can take awesome pictures.',
                  buttonNeutral: 'Ask Me Later',
                  buttonNegative: 'Cancel',
                  buttonPositive: 'OK',
                },
              );

              const res = await granted
              console.log('granted', res)
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the camera");
              } else {
                console.log("Camera permission denied");
              }
              
        } catch (error) {
            console.log(error)
        }
    }

    const fetchEyeSummaryDetails = () => {
        try {
            setLoading(true)
            const requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            fetch(`https://meduptodate.in/saathi/show_eyedrop_summary.php?name_of_eyedrop=${data?.params?.details?.name_of_eyedrop}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    setLoading(false)
                    console.log(result)
                    return setDetails(result)
                })
                .catch(error => console.log('error', error));
        } catch (error) {
            console.log(error)
        }
    }

    const viewRef = useRef();

    const captureScreen = async () => {
        try {
            const result = await captureRef(viewRef, {
                format: 'jpg',
                quality: 0.8,
            });

            console.log('PDF saved successfully!', result);
        } catch (error) {
            console.error('Error capturing or saving the PDF:', error);
        }
    };

    const saveFile = async () => {
        try {
            const externalDir = RNFS.ExternalStorageDirectoryPath;
            const fileName = 'example.jpg';
            const filePath = `${externalDir}/${fileName}`;

            // Content to be saved in the file
            const fileContent = 'Hello, this is the content!';

            // Write the content to the file
            await RNFS.writeFile(filePath, fileContent, 'utf8');

            console.log('File saved successfully:', filePath);
        } catch (error) {
            console.error('Error saving file:', error);
        }
    }

        useEffect(() => {
            const subscribe = fetchEyeSummaryDetails()
            
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
                            <View style={{ width: width - 20, backgroundColor: '#fff', elevation: 4, borderRadius: 8 }}>
                                <View style={{ width: width, justifyContent: 'center', alignItems: 'center', paddingVertical: 20, }}  >
                                    <Image source={require('../assets/images/Summary.png')} style={{ width: 60, height: 60, }} resizeMode='cover' />
                                    <Text style={{ color: "#253d95", fontSize: 26, fontWeight: '600', paddingVertical: 4, }}>Eyedrops Summary</Text>
                                    {/*<View style={{ borderBottomColor: '#253d95', borderBottomWidth: 3, width: width - 30, height: 4 }} />*/}
                                </View>
                                <View style={{ width: width, justifyContent: 'flex-start', alignItems: 'center' }}  >
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={[styles.fonts, { fontWeight: '600' }]}>{data?.params?.details?.drop_date_time.toString().split(' ')[0]} </Text>
                                        <Text style={[styles.fonts]}> to </Text>
                                        <Text style={[styles.fonts, { fontWeight: '600' }]}> {data?.params?.details?.end_date.toString().split(' ')[0]}</Text>
                                    </View>
                                    <Text style={[styles.fonts, styles.space]}>Total Dosage</Text>
                                    <Text style={[styles.fonts, styles.fontweight]}>{details?.total_dose}</Text>
                                    <Text style={[styles.fonts, styles.space]}>Missed Dosage</Text>
                                    <Text style={[styles.fonts, styles.fontweight]}>{details?.miss_dose}</Text>
                                    <Text style={[styles.fonts, styles.space]}>Remaining Dosage</Text>
                                    <Text style={[styles.fonts, styles.fontweight]}>{details?.total_dose - details?.accept_dose}</Text>
                                </View>
                                <View style={{ width, justifyContent: 'center', alignItems: 'center', marginTop: 25, paddingVertical: 16 }}>
                                    <Text style={{ fontSize: 16, color: "#253d95" }}>A Patient Initiative from</Text>
                                    <Image source={require('../assets/images/alkemlogo.png')} style={{ width: 80, height: 80 }} resizeMode='contain' />
                                </View>
                            </View>
                            <CustomButton elevation={2} borderColor="transparent" color="#fff" marginTop={20} buttonText="DOWLOAD" onPress={requestStorage} />
                        </View>
                    </View>
                </ImageBackground>
<Loader loading={loading} />
            </View>
        )
    }

    export default EyeSummaryDetails

    const styles = StyleSheet.create({
        fonts: {
            fontSize: 20,
            color: '#253d95'
        },
        fontweight: {
            fontWeight: '600'
        },
        space: {
            marginTop: 24
        }
    })