import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import db from "../db/db";

import CustomAnimatedModal from "../components/CustomAnimatedModal";

const ModalSetLanguage = ({ modalVisible, handleCloseModal, children }) => {
  const handleChangeLanguage = (lang) => {
    db.setLanguage(lang).then(() => {
      handleCloseModal();
    });
  };

  return (
    <CustomAnimatedModal
      modalVisible={modalVisible}
      handleCloseModal={handleCloseModal}
      height={200}
      children={children}
      color='#FAFAFAEE'
      header={{
        title: 'Language',
        leftIcon: require('../../assets/icons/AppleLogo.png'),
        crossIcon: true,
      }}
    >
      <StatusBar style="light" />
      <View style={style.container}>
        <TouchableOpacity style={[style.languageButton, { backgroundColor: '#946AD4', marginRight: 10 }]} onPress={() => handleChangeLanguage('fr')}>
          <Text style={style.languageButtonText}>
            Français
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[style.languageButton, { backgroundColor: '#D08090' }]} onPress={() => handleChangeLanguage('en')}>
          <Text style={style.languageButtonText}>
            English
          </Text>
        </TouchableOpacity>
      </View>
    </CustomAnimatedModal>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'start',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  languageButton: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    borderRadius: 10,
  },
  languageButtonText: {
    fontSize: 25,
    fontWeight: '200',
    color: '#FFF',
  },
});

export default ModalSetLanguage;