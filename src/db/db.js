import AsyncStorage from "@react-native-async-storage/async-storage";
import { generateNewId } from "../utils/utils";

const setFriendsList = async (friends) => {
  try {
    const filteredFriends = friends.filter(friend => friend.type === 'friend');
    await AsyncStorage.setItem('@swifty-companion:friends', JSON.stringify(filteredFriends));
  } catch (error) {
    console.log('Error saving friends', error);
    throw error;
  }
};

const getFriendsList = async () => {
  try {
    const friends = await AsyncStorage.getItem('@swifty-companion:friends');
    return (JSON.parse(friends) || []);
  } catch (error) {
    console.log('Error getting friends list', error);
    throw error;
  }
};

const getLanguage = async () => {
  try {
    const language = await AsyncStorage.getItem('@swifty-companion:language');
    return (JSON.parse(language) || 'fr');
  } catch (error) {
    console.log('Error getting language', error);
    throw error;
  }
};

const setLanguage = async (language) => {
  try {
    await AsyncStorage.setItem('@swifty-companion:language', JSON.stringify(language));
  } catch (error) {
    console.log('Error saving language', error);
    throw error;
  }
};

const setFirstLaunch = async () => {
  try {
    await AsyncStorage.setItem('@swifty-companion:firstLaunch', JSON.stringify(false));
  } catch (error) {
    console.log('Error saving firstLaunch', error);
    throw error;
  }
};

const isTheFirstLaunch = async () => {
  try {
    const firstLaunch = await AsyncStorage.getItem('@swifty-companion:firstLaunch');
    return (JSON.parse(firstLaunch) ?? true);
  } catch (error) {
    console.log('Error getting firstLaunch', error);
    throw error;
  }
};

const getAccessToken = async () => {
  try {
    const accessToken = await AsyncStorage.getItem('@swifty-companion:accessToken');
    // console.log('accessToken', accessToken)
    return (JSON.parse(accessToken));
  } catch (error) {
    console.log('Error getAccessToken', error);
    throw (error);
  }
};

const setAccessToken = async (accessToken) => {
  try {
    const newAccessToken = {
      access_token: accessToken.access_token,
      token_type: accessToken.token_type,
      expires_in: accessToken.expires_in,
      scope: accessToken.scope,
      created_at: accessToken.created_at,
    };
    await AsyncStorage.setItem('@swifty-companion:accessToken', JSON.stringify(newAccessToken));
    // console.log('accessToken', JSON.stringify(newAccessToken))
  } catch (error) {
    console.log('Error setAccessToken', error);
    throw (error);
  }
};

const addFriend = async (student) => {
  try {
    const friendsList = await getFriendsList();
    const newFriend = {
      type: 'friend',
      login: student.login,
      image: student.image.link,
    };
    await setFriendsList([...friendsList, newFriend]);
  } catch (error) {
    console.log('Error adding friend', error);
    throw error;
  }
};

const removeFriend = async (student) => {
  try {
    const friends = await getFriendsList();
    const newFriends = friends.filter(friend => friend.login !== student.login);
    await setFriendsList(newFriends);
  } catch (error) {
    console.log('Error deleting friend', error);
    throw error;
  }
};

export default {
  setFriendsList,
  getFriendsList,

  getLanguage,
  setLanguage,

  setFirstLaunch,
  isTheFirstLaunch,

  getAccessToken,
  setAccessToken,

  addFriend,
  removeFriend,
};