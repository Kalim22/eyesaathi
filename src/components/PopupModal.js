import { View, Modal } from 'react-native'
import React from 'react'

const PopupModal = ({ childrem, visible }) => {
    return (
        <Modal visible={visible} transparent={true}>
            <View style={{ width, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' }}>
                <View style={{ width: width - 20, justifyContent: 'center', alignItems: 'center' }}>
                    {childrem}
                </View>
            </View>
        </Modal>
    )
}

export default PopupModal
