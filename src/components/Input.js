import { StyleSheet, TextInput, useWindowDimensions } from 'react-native'
import React from 'react'

const Input = ({ onChangeText, value, keyboardType, placeholder, borderColor, length, editable, marginVertical }) => {

    const { width } = useWindowDimensions()
    return (
        <TextInput onChangeText={onChangeText}
            value={value}
            keyboardType={keyboardType}
            style={[styles.input, { width: width - (length || 20), borderColor: borderColor || '#fff', marginVertical: marginVertical || 10, }]}
            placeholderTextColor="#253d95"
            placeholder={placeholder}
            editable={editable}>
        </TextInput>
    )
}

const styles = StyleSheet.create({
    input: {
        borderRadius: 50,
        borderWidth: 1,
        paddingHorizontal: 6,
        paddingVertical: 12,
        overflow: 'hidden',
        textAlign: 'center',
        color: "#253d95",
        fontSize: 18,
        fontWeight: '600',
    },
})

export default Input
