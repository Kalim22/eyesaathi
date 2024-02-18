import { StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React from 'react'

const ErrorComponent = ({error, color, weight, size}) => {
    const {width} = useWindowDimensions()
  return (
      <Text style={{fontSize: size || 14, color: color || 'red', textAlign: 'center',fontWeight: weight }}>{error}</Text>
  )
}

export default ErrorComponent

const styles = StyleSheet.create({})