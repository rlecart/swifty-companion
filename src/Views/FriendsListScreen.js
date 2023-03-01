import { ActionSheetIOS, ActivityIndicator, Alert, ScrollView, StyleSheet, useColorScheme, View } from "react-native";
import { Fragment, useEffect, useRef, useState } from "react";
import { useIsFocused } from "@react-navigation/native";

import TitleWithCTA from "../components/TitleWithCTA";

import db from "../db/db";
import { filterFriends } from "../components/filters/filterFriends";
import FriendCardsContainer from "../containers/FriendCardsContainer";
import api from "../api/api";
import RenderIf from "../components/RenderIf";

const FriendsListScreen = ({ route, navigation, isLoaded }) => {
  const isFocused = useIsFocused();

  const theme = useColorScheme();

  const [language, setLanguage] = useState('fr');

  const [friendsList, setFriendsList] = useState(null);
  const [friendsListFiltered, setFriendsListFiltered] = useState(null);

  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      getFriendsListFromDB();
      getLanguageFromDB();
    }
  }, [isLoaded, isFocused]);

  useEffect(() => {
    console.log('friendsList: ', friendsList);
    if (friendsList !== undefined && friendsList !== null)
      setFriendsListFiltered(friendsList);
  }, [friendsList]);

  const getLanguageFromDB = async () => {
    try {
      const language = await db.getLanguage();
      setLanguage(language);
    } catch (error) {
      console.log('error fetching language: ', error);
    }
  };

  const getFriendsListFromDB = async () => {
    try {
      const friends = await db.getFriendsList();
      setFriendsList(friends);
    } catch (error) {
      console.log('error fetching friendsList: ', error);
    }
  };

  const handleOpenFriendProfile = async (friend) => {
    if (isFetching)
      return;

    setIsFetching(true);

    try {
      const { login } = friend;

      if (login === '' || login === undefined || login === null)
        throw new Error('login is empty');

      const { student, projects, skills } = await api.getStudentInfosByLogin(login);

      await navigation.goBack();
      await navigation.navigate('StudentProfileScreen', {
        student,
        projects,
        skills,
      });
    } catch (error) {
      console.log('error handleSubmit: ', error);
    }

    setIsFetching(false);
  };

  const handleRemoveFriend = async (friend) => {
    if (isFetching)
      return;

    setIsFetching(true);

    try {
      db.removeFriend(friend)
        .then(getFriendsListFromDB);
    } catch (error) {
      console.log('error deleting friend: ', error);
    }

    setIsFetching(false);
  };

  const handleAddFriend = () => {
    if (isFetching)
      return;

    Alert.prompt(
      language === 'fr' ? 'Ajouter un ami' : 'Add a friend',
      language === 'fr' ? 'Entrez le login de votre ami' : 'Enter your friend\'s login',
      [
        {
          text: language === 'fr' ? 'Annuler' : 'Cancel',
          style: 'cancel',
        },
        {
          text: language === 'fr' ? 'Ajouter' : 'Add',
          onPress: async (login) => {
            if (login === '' || login === undefined || login === null)
              return;

            setIsFetching(true);

            try {
              let student;

              try { student = await api.getStudentByLogin(login); }
              catch { throw new Error(404); }

              try { await db.addFriend(student).then(getFriendsListFromDB); }
              catch { throw new Error(500); }

            } catch (error) {
              console.log('error adding friend: ', error.message);
              Alert.alert(
                language === 'fr' ? 'Erreur' : 'Error',
                `${error.message}` === `${404}`
                  ? (language === 'fr' ? 'Ce student n\'existe pas' : 'This student does not exist')
                  : (language === 'fr' ? 'Ce student est deja dans votre liste d\'amis' : 'This student is already in your friends list'),
              );
            }

            setIsFetching(false);
          },
        },
      ],
      'plain-text',
      '',
    );
  };

  return (
    <Fragment>

      <RenderIf isTrue={isFetching}>
        <View style={style.loader}>
          {isFetching && <ActivityIndicator size="large" color="#FFA5BB" />}
        </View>
      </RenderIf>

      <View style={[
        style.container,
        theme === 'dark' && { backgroundColor: '#171717' },
      ]}>
        <View style={style.square} />

        <ScrollView style={style.scrollView}>
          <TitleWithCTA
            title={language === 'fr' ? 'Liste d\'amis' : "Friends list"}
            withSearchBar
            allData={friendsList}
            setDataFiltered={setFriendsListFiltered}
            filterFunction={filterFriends}
          />
          <View style={style.friendsList}>
            <FriendCardsContainer
              friendsListFiltered={friendsListFiltered}
              handleOpenFriendProfile={handleOpenFriendProfile}
              handleRemoveFriend={handleRemoveFriend}
              handleAddFriend={handleAddFriend}
            />
          </View>
          <View style={{ height: 50 }} />
        </ScrollView>
      </View >
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

  loader: {
    zIndex: 5,
    position: 'absolute',
    // top: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#000000AA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  square: {
    // zIndex: 5,
    position: 'absolute',
    bottom: -380,
    right: 0,
    width: 200,
    height: 200,
    backgroundColor: '#FFA5BB',
    transform: [
      { rotate: '-35deg' },
      { scaleX: 7 },
      { scaleY: 3.4 },
    ],
  },

  scrollView: {
    width: '100%',
  },

  friendsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    padding: 20,
  },

  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default FriendsListScreen;