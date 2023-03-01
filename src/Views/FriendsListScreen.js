import { ScrollView, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
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
    try {
      const { login } = friend;

      if (login === '' || login === undefined || login === null)
        return;

      const student = await api.getStudentByLogin(login);
      // console.log('student: ', student);
      const projects = await api.getStudentProjects(student.id);
      // console.log('projects: ', projects);
      const skills = await api.getStudentSkills(student.id);
      // console.log('skills: ', skills);

      await navigation.goBack();
      await navigation.navigate('StudentProfileScreen', {
        student,
        projects,
        skills,
      });
    } catch (error) {
      console.log('error handleSubmit: ', error);
    }
  };

  const handleRemoveFriend = async (friend) => {
    try {
      db.removeFriend(friend)
        .then(getFriendsListFromDB);
    } catch (error) {
      console.log('error deleting friend: ', error);
    }
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