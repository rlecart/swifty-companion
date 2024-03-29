import React, { Fragment, useEffect, useState } from 'react';
import { ActivityIndicator, Button, Image, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import SettingsIcon from '../../assets/icons/settings.png';

import RenderIf from '../components/RenderIf';
import ModalSetLanguage from '../containers/ModalSetLanguage';

import { isAValidLogin } from '../utils/utils';

import db from '../db/db';
import api from '../api/api';

const StudentFinderScreen = ({ navigation, isLoaded }) => {
  const isFocused = useIsFocused();

  const theme = useColorScheme();

  const [language, setLanguage] = useState('fr');

  const [searchText, setSearchText] = useState('');
  const [showCancel, setShowCancel] = useState(false);
  const [searchError, setSearchError] = useState(false);

  const [modalLanguageVisible, setModalLanguageVisible] = useState(false);

  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      getLanguageFromDB();
    }
  }, [isLoaded, isFocused]);

  const getLanguageFromDB = async () => {
    try {
      const language = await db.getLanguage();
      setLanguage(language);
    } catch (error) {
      console.error('error fetching language: ', error);
    }
  };

  const handleChangeText = (text) => {
    setSearchError(false);
    setShowCancel(text === '' ? false : true);
    setSearchText(text);
  };

  const handleCancel = () => {
    setSearchError(false);
    setSearchText('');
    setShowCancel(false);
  };

  const handleSubmit = async (login) => {
    if (isFetching)
      return;

    setIsFetching(true);

    try {
      if (login === '' || login === undefined || login === null)
        throw new Error('login is empty');

      if (!isAValidLogin(login)) {
        setSearchError(true);
        throw new Error('login is not valid');
      }

      const student = await api.get('student', login);

      await navigation.navigate('StudentProfileScreen', { student });
      handleCancel();
    } catch (error) {
      console.error('error handleSubmit: ', error);
      setSearchError(true);
    }

    setIsFetching(false);
  };

  const goToFriendsList = () => {
    navigation.navigate('FriendsListScreen');
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
      <StatusBar style='dark' />

      <ModalSetLanguage
        modalVisible={modalLanguageVisible}
        handleCloseModal={handleCloseLanguageModal}
      />

      <View style={[
        style.container,
        theme === 'dark' && { backgroundColor: '#171717' },
      ]}>
        <View style={style.square} />

        <View style={style.logoContainer}>
          <Image style={style.logo} source={require('../../assets/logo.png')} />
        </View>

        <View style={style.studentFinderContainer}>
          <Text style={style.studentFinder}>
            Student Finder
          </Text>

          <View style={[style.searchBarContainer, searchError && style.searchBarError]}>
            <View style={style.searchBar}>
              <Image source={require('../../assets/icons/search.png')} style={style.searchIcon} />
              <TextInput
                style={style.searchText}
                placeholderTextColor={theme === 'dark' ? '#98989F80' : '#7F7F8580'}
                placeholder={language === 'fr' ? 'Login' : 'Login'}
                onChangeText={handleChangeText}
                value={searchText}
                platform="ios"
                autoCapitalize='none'
                autoComplete='off'
                autoCorrect={false}
              />
              <RenderIf isTrue={showCancel}>
                <Button
                  onPress={handleCancel}
                  title={language === 'fr' ? 'Annuler' : "Cancel"}
                />
              </RenderIf>
            </View>
          </View>

          <TouchableOpacity style={[
            style.searchButton,
            isFetching && { opacity: 0.5 },
          ]}
            onPress={() => handleSubmit(searchText)}
            disabled={isFetching}
          >
            <RenderIf isTrue={!isFetching}>
              <Text style={style.searchButtonText}>
                {language === 'fr' ? 'ÇA PART !' : 'LET\'S GO !'}
              </Text>
            </RenderIf>

            <RenderIf isTrue={isFetching}>
              <ActivityIndicator size='small' style={style.searchButtonText} />
            </RenderIf>
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
  searchBarError: {
    borderColor: '#FF0000',
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
    backgroundColor: '#246B68',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginHoriz: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 140,
    height: 43,
  },
  searchButtonText: {
    color: '#F2F2F7',
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 12,
    textAlign: 'center',
    width: 110,
    height: 43,
  },

  bottomActionsContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    paddingBottom: 50,
    paddingHorizontal: 35,
  },
  bottomActions: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  friendsList: {
    backgroundColor: '#FFA5BB',
    borderRadius: 10,
    paddingHorizontal: 15,
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
  },
  settingsIcon: {
    width: 40,
    height: 40,
  },

});

export default StudentFinderScreen;