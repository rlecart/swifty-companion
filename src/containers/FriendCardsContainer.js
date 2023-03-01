import { useEffect, useState } from 'react';
import FriendCard from '../components/FriendCard';

const FriendCardsContainer = ({ friendsListFiltered, handleOpenFriendProfile, handleRemoveFriend }) => {
  const [friendsList, setFriendsList] = useState(friendsListFiltered);

  useEffect(() => {
    if (friendsListFiltered !== undefined && friendsListFiltered !== null)
      setFriendsList([...friendsListFiltered, { type: 'add' }]);
  }, [friendsListFiltered]);

  useEffect(() => {
    if (friendsList !== undefined && friendsList !== null) {
      if ((friendsList.length) % 2 !== 0)
        setFriendsList([...friendsList, { type: 'empty' }]);
    }
  }, [friendsList]);

  return (
    friendsList?.map((friend, index) => <FriendCard key={index} index={index} friend={friend} handleOpenFriendProfile={handleOpenFriendProfile} handleRemoveFriend={handleRemoveFriend} />)
  );
};

export default FriendCardsContainer;