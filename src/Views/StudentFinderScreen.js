import React, { Fragment, useState } from 'react';
import { Button, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import RenderIf from '../components/RenderIf';
import SearchBar from '../components/SearchBar';

import SettingsIcon from '../../assets/icons/settings.png';

const StudentFinderScreen = () => {
  const language = 'fr';

  const [searchText, setSearchText] = useState('');
  const [showCancel, setShowCancel] = useState(false);

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

  return (
    <Fragment>
      <View style={style.container}>
        <View style={style.square} />

        <View style={style.logoContainer}>
          <Image style={style.logo} source={require('../../assets/logo.png')} />
        </View>

        <View style={style.studentFinderContainer}>
          <Text style={style.studentFinder}>
            Student Finder
          </Text>

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

          <TouchableOpacity style={style.searchButton} onPress={() => handleSubmit(searchText)}>
            <Text style={style.searchButtonText}>
              ÇA PART
            </Text>
          </TouchableOpacity>
        </View>

        <View style={style.bottomActionsContainer}>
          <View style={style.bottomActions}>
            <TouchableOpacity style={style.friendsList} onPress={goToFriendsList}>
              <Text style={style.friendsListText}>
                FRIENDS LIST
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={style.settingsContainer} onPress={() => console.log('go to settings')}>
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

  searchBar: {
    width: '100%',
    height: 40,
    backgroundColor: '#76768030',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginHoriz: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
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