import { StyleSheet, Text, TouchableOpacity, useWindowDimensions} from 'react-native'
import React from 'react'
import { opacity } from 'react-native-reanimated/lib/typescript/reanimated2/Colors'

const CustomButton = ({buttonText, onPress, length, backgroundColor, borderColor, color,opacity,marginTop, elevation, activeOpacity, borderRadius, disabled}) => {

    const {width} = useWindowDimensions()
    return (
        <TouchableOpacity activeOpacity={activeOpacity || 0.8} style={{opacity: opacity, elevation: elevation, borderColor: borderColor, borderWidth: 1,  width: width - (length || 20), borderRadius: borderRadius || 50, backgroundColor: backgroundColor || "#253d95", marginTop: marginTop, marginBottom: 10 }} onPress={onPress} disabled={disabled}>
            <Text style={{ fontSize: 20, fontWeight: '600', color: color || '#fff', textAlign: 'center', paddingVertical: 12, }}>{buttonText}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({})

export default CustomButton
