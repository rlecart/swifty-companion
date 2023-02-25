import React, { Fragment, useEffect, useState } from 'react';
import { Button, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import SettingsIcon from '../../assets/icons/settings.png';

import RenderIf from '../components/RenderIf';
import SearchBar from '../components/SearchBar';
import ModalSetLanguage from '../containers/ModalSetLanguage';

import db from '../db/db';

const StudentFinderScreen = ({ isLoaded }) => {
  const isFocused = useIsFocused();

  const [language, setLanguage] = useState('fr');

  const [searchText, setSearchText] = useState('');
  const [showCancel, setShowCancel] = useState(false);

  const [modalLanguageVisible, setModalLanguageVisible] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      getLanguageFromDB();
    }
  }, [isLoaded, isFocused]);

  const getLanguageFromDB = async () => {
    try {
      const language = await db.getLanguage();
      console.log('language: ', language);
      setLanguage(language);
    } catch (error) {
      console.log('error fetching language: ', error);
    }
  };

  const handleChangeText = (text) => {
    setShowCancel(text === '' ? false : true);
    setSearchText(text);
  };

  const handleCancel = () => {
    setSearchText('');
    setShowCancel(false);
  };

  const handleSubmit = (login) => {
    console.log('login: ', login);
    handleCancel();
  };

  const goToFriendsList = () => {
    console.log('go to friends list');
  };

  const handleCloseLanguageModal = () => {
    if (modalLanguageVisible) {
      getLanguageFromDB();
      setModalLanguageVisible(false);
    }
  };

  const handleOpenLanguageModal = () => {
    if (!modalLanguageVisible) {
      setModalLanguageVisible(true);
    }
  };

  return (
    <Fragment>
      <ModalSetLanguage
        modalVisible={modalLanguageVisible}
        handleCloseModal={handleCloseLanguageModal}
      />

      <View style={style.container}>
        <View style={style.square} />

        <View style={style.logoContainer}>
          <Image style={style.logo} source={require('../../assets/logo.png')} />
        </View>

        <View style={style.studentFinderContainer}>
          <Text style={style.studentFinder}>
            Student Finder
          </Text>

          <View style={style.searchBarContainer}>
            <View style={style.searchBar}>
              <Image source={require('../../assets/icons/search.png')} style={style.searchIcon} />
              <TextInput
                style={style.searchText}
                placeholder={language === 'fr' ? 'Login' : 'Login'}
                onChangeText={handleChangeText}
                value={searchText}
                platform="ios"
                autoCapitalize='words'
              />
              <RenderIf isTrue={showCancel}>
                <Button
                  onPress={handleCancel}
                  title={language === 'fr' ? 'Annuler' : "Cancel"}
                />
              </RenderIf>
            </View>
          </View>

          <TouchableOpacity style={style.searchButton} onPress={() => handleSubmit(searchText)}>
            <Text style={style.searchButtonText}>
              {language === 'fr' ? 'ÇA PART !' : 'LET\'S GO !'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={style.bottomActionsContainer}>
          <View style={style.bottomActions}>
            <TouchableOpacity style={style.friendsList} onPress={goToFriendsList}>
              <Text style={style.friendsListText}>
                {language === 'fr' ? 'LISTE D\'AMIS' : 'FRIENDS LIST'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={style.settingsContainer} onPress={handleOpenLanguageModal}>
              <Image style={style.settingsIcon} source={SettingsIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Fragment>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 100,
  },

  square: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 200,
    height: 200,
    backgroundColor: '#9BD1CE',
    transform: [
      { rotate: '-45deg' },
      { scaleX: 7 },
      { scaleY: 3.4 },
    ],

  },

  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red',
    padding: 50,
  },
  logo: {
    width: 150,
    height: 150,
  },

  studentFinderContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red',
    paddingHorizontal: 85,
  },
  studentFinder: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#246B68',
    marginBottom: 10,
  },

  searchBarContainer: {
    backgroundColor: '#FFFFFF33',
    marginBottom: 25,
    borderRadius: 10,
    filter: 'blur(4px)',
    borderWidth: 1,
    borderColor: '#9BD1CE',
  },
  searchBar: {
    backgroundColor: '#BEFFFB80',
    blendMode: 'overlay',
    width: '100%',
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginHoriz: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  searchText: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 16,
  },

  searchButton: {
    // width: '100%',
    // height: 40,
    backgroundColor: '#246B68',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginHoriz: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

  },
  searchButtonText: {
    color: '#F2F2F7',
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  bottomActionsContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red',
    // paddingHorizontal: 85,
    position: 'absolute',
    bottom: 0,
    paddingBottom: 50,
    paddingHorizontal: 35,
  },
  bottomActions: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: 'red',
    flexDirection: 'row',
  },
  friendsList: {
    backgroundColor: '#FFA5BB',
    borderRadius: 10,
    paddingHorizontal: 15,
    // marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendsListText: {
    color: '#B7576F',
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  settingsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red',
    // paddingHorizontal: 85,
  },
  settingsIcon: {
    width: 40,
    height: 40,
    color: 'red',
  },

});

export default StudentFinderScreen;