import { StyleSheet, Text, View, ActivityIndicator, Modal, useWindowDimensions } from 'react-native'
import React from 'react'

const Loader = ({loading}) => {

    const {width} = useWindowDimensions()
    return (
        <Modal visible={loading} transparent={true} >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: width, backgroundColor: 'rgba(255,255,255,0.3)' }}>
                <ActivityIndicator size={60} color="#253d95" />
            </View>
        </Modal>
    )
}

export default Loader

const styles = StyleSheet.create({})