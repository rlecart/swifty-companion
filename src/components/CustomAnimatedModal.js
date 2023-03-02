import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Modal, StyleSheet, Pressable, View, Image, Text } from "react-native";

import CrossIconWhite from '../../assets/icons/CrossIconWhite.png';

import RenderIf from "./RenderIf";

const CustomAnimatedModal = ({ theme, modalVisible, handleCloseModal, height, color, header, children }) => {
  const [visible, setVisible] = useState(false);
  const animation = useRef(new Animated.Value(0));

  const bottom = animation.current.interpolate({
    inputRange: [0, 1],
    outputRange: [-height, 0]
  });

  useEffect(() => {
    if (modalVisible) {
      showModal();
    } else {
      hideModal();
    }
  }, [modalVisible]);

  const showModal = () => {
    setVisible(true);
    setTimeout(() => {
      Animated.timing(animation.current, {
        toValue: 1,
        duration: 150,
        easing: Easing.easeOutCubic,
        useNativeDriver: false,
      }).start();
    }, 100);
  };

  const hideModal = () => {
    Animated.timing(animation.current, {
      toValue: 0,
      duration: 150,
      easing: Easing.easeOutCubic,
      useNativeDriver: false,
    }).start(() => {
      setVisible(false);
      handleCloseModal();
    });
  };

  return (

    <Modal
      animationType="fade"
      visible={visible}
      presentationStyle='pageSheet'
      transparent={true}
      onRequestClose={handleCloseModal}
    >
      <Pressable
        style={style.modalBackground}
        onPress={() => hideModal()}
      />
      <Animated.View style={{
        backgroundColor: color,
        borderRadius: 20,
        bottom: bottom,
        position: 'absolute',
        width: '100%',
        height: height,
      }}>

        <RenderIf isTrue={header !== undefined && header !== null}>
          <View style={style.header}>

            <View style={style.headerTitle}>

              <RenderIf isTrue={header?.leftIcon !== undefined && header?.leftIcon !== null}>
                <Image style={style.headerIcon} source={header?.leftIcon} resizeMode='contain' />
              </RenderIf>

              <Text style={[
                style.headerTitleText,
                theme === 'dark' && { color: '#fff' },
              ]}>
                {header?.title ?? ''}
              </Text>
            </View>

            <RenderIf isTrue={header?.crossIcon === true}>
              <Pressable style={[
                style.headerButtonCrossIcon,
                theme === 'dark' && { backgroundColor: '#2C2C2EEE' },
              ]} onPress={hideModal}>
                <Image style={[
                  style.headerCrossIcon,
                  theme === 'dark' && { tintColor: '#fff' },
                ]} source={CrossIconWhite} resizeMode='contain' />
              </Pressable>
            </RenderIf>
          </View>
        </RenderIf>

        {children}
      </Animated.View>
    </Modal >
  );
};

const style = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  header: {
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: 70,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 20,
    height: 21,
    marginRight: 4,
    marginBottom: 2,
  },
  headerTitleText: {
    fontSize: 24,
  },
  headerCrossIcon: {
    width: 12,
    height: 12,
  },
  headerButtonCrossIcon: {
    height: 35,
    width: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
  }
});

export default CustomAnimatedModal;