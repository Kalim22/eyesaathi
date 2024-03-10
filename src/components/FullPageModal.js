import { StyleSheet, Text, View, ImageBackground, Image, Modal, useWindowDimensions, PixelRatio } from 'react-native'
import React from 'react'

const FullPageModal = ({children, visible, heading}) => {

    const {width, height} = useWindowDimensions()
    const pixelratio = PixelRatio.get()

    const fontSize = pixelratio * 16
    return (
        <Modal visible={visible} transparent={true} animationType='slides'>
            <ImageBackground source={require('../assets/images/Background.png')} style={{ flex: 1, width: width }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width, backgroundColor: 'transparent' }} >
                    <View style={{ flex: 0.20, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={require('../assets/images/eyepressurelogo.png')} style={{ width: 100, height: 100 }} resizeMode='cover' />
                        <Text style={{ color: "#253d95", fontSize: width / 17, fontWeight: '600', paddingVertical: 4, }}>{heading}</Text>
                        <View style={{ borderBottomColor: '#253d95', borderBottomWidth: 3, width: width - 50, height: 4 }} />
                    </View>
                    <View style={{ flex: 0.80, justifyContent: 'flex-start', alignItems: 'center' }}>
                        {children}
                    </View>
                </View>
            </ImageBackground>
        </Modal>
    )
}

export default FullPageModal

const styles = StyleSheet.create({})