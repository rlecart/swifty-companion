import { useIsFocused } from '@react-navigation/native';
import React, { Fragment, useEffect, useState } from 'react';

const StudentProfileScreen = ({ route, navigation, isLoaded }) => {
  const { student } = route.params;

  const isFocused = useIsFocused();

  const [language, setLanguage] = useState('fr');

  const [friendsList, setFriendsList] = useState(null);

  useEffect(() => {
    if (isLoaded) {
      getFriendsListFromDB();
      getLanguageFromDB();
    }
  }, [isLoaded, isFocused]);


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
      // const friends = await db.getFriendsList();
      const friends = [
        {
          type: 'friend',
          login: 'rlecart',
          image: 'https://cdn.intra.42.fr/users/c5f1f122c36f732a9a22af2531029ff6/rlecart.jpg',
        },
        {
          type: 'friend',
          login: 'valecart',
          image: 'https://cdn.intra.42.fr/users/9a6a60b928108deff03ed6f152bcd6ca/valecart.jpg',
        },
        {
          type: 'friend',
          login: 'cboudrin',
          image: 'https://cdn.intra.42.fr/users/b0cf67c26a1bbcc3824f50701f9ecb23/cboudrin.jpg',
        },
        // {
        //   type: 'friend',
        //   login: 'rlecart',
        //   image: 'https://cdn.intra.42.fr/users/c5f1f122c36f732a9a22af2531029ff6/rlecart.jpg',
        // },
        // {
        //   type: 'friend',
        //   login: 'valecart',
        //   image: 'https://cdn.intra.42.fr/users/9a6a60b928108deff03ed6f152bcd6ca/valecart.jpg',
        // },
        // {
        //   type: 'friend',
        //   login: 'cboudrin',
        //   image: 'https://cdn.intra.42.fr/users/b0cf67c26a1bbcc3824f50701f9ecb23/cboudrin.jpg',
        // },
        // {
        //   type: 'friend',
        //   login: 'rlecart',
        //   image: 'https://cdn.intra.42.fr/users/c5f1f122c36f732a9a22af2531029ff6/rlecart.jpg',
        // },
        // {
        //   type: 'friend',
        //   login: 'valecart',
        //   image: 'https://cdn.intra.42.fr/users/9a6a60b928108deff03ed6f152bcd6ca/valecart.jpg',
        // },
        // {
        //   type: 'friend',
        //   login: 'cboudrin',
        //   image: 'https://cdn.intra.42.fr/users/b0cf67c26a1bbcc3824f50701f9ecb23/cboudrin.jpg',
        // },
      ];
      setFriendsList(friends);
    } catch (error) {
      console.log('error fetching friendsList: ', error);
    }
  };

  console.log('student: ', student);

  return (
    <Fragment>

    </Fragment>
  );
};

export default StudentProfileScreen;