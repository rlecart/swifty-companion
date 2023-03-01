import { ActionSheetIOS, Alert, ScrollView, StyleSheet, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useIsFocused } from "@react-navigation/native";

import TitleWithCTA from "../components/TitleWithCTA";

import db from "../db/db";
import { filterFriends } from "../components/filters/filterFriends";
import FriendCardsContainer from "../containers/FriendCardsContainer";
import api from "../api/api";

const FriendsListScreen = ({ route, navigation, isLoaded }) => {
  const isFocused = useIsFocused();

  const [language, setLanguage] = useState('fr');

  const [friendsList, setFriendsList] = useState(null);
  const [friendsListFiltered, setFriendsListFiltered] = useState(null);

  const isFetching = useRef(false);

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
    if (isFetching.current)
      return;

    isFetching.current = true;

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

    isFetching.current = false;
  };

  const handleRemoveFriend = async (friend) => {
    if (isFetching.current)
      return;

    isFetching.current = true;

    try {
      db.removeFriend(friend)
        .then(getFriendsListFromDB);
    } catch (error) {
      console.log('error deleting friend: ', error);
    }

    isFetching.current = false;
  };

  const handleAddFriend = () => {
    if (isFetching.current)
      return;

    isFetching.current = true;

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
          },
        },
      ],
      'plain-text',
      '',
    );

    isFetching.current = false;
  };

  return (
    <View style={style.container}>
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