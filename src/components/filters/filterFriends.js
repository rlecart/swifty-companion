export const filterFriends = (friend, searchText) => {
  return (friend.type === 'friend'
    && (friend.login.toLowerCase().includes(searchText.toLowerCase())
    ));
};
