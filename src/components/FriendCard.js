import { useEffect, useState } from 'react';
import { ActionSheetIOS, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import RenderIf from './RenderIf';

import db from '../db/db';

const FriendCard = ({ index, friend, handleOpenFriendProfile, handleRemoveFriend, handleAddFriend }) => {
  const [language, setLanguage] = useState('fr');
  db.getLanguage().then(lang => setLanguage(lang));

  let cardStyle = style.friendCard;

  if (friend.type === 'add')
    cardStyle = style.friendCardAdd;
  else if (friend.type === 'empty')
    cardStyle = style.friendCardEmpty;

  const handleLongPressFriend = (friend) => {
    if (friend.type !== 'friend')
      return;

    ActionSheetIOS.showActionSheetWithOptions({
      options: [
        language === 'fr' ? 'Annuler' : 'Cancel',
        language === 'fr' ? 'Supprimer' : 'Delete',
      ],
      destructiveButtonIndex: 1,
      cancelButtonIndex: 0,
    }, (buttonIndex) => {
      if (buttonIndex === 1) {
        console.log('delete friend: ', friend);
        handleRemoveFriend(friend);
      }
    });
  };

  const handleOnPressFriend = (friend) => {
    if (friend.type === 'friend')
      handleOpenFriendProfile(friend);
    else if (friend.type === 'add')
      handleAddFriend();
  };

  return (
    <View style={[cardStyle, {
      marginTop: index !== 0 && index !== 1 ? 10 : 0,
      marginLeft: index % 2 === 0 ? 0 : 10,
    }]}>

      <RenderIf isTrue={friend.type === 'friend' && (friend.image !== undefined && friend.image !== null)}>
        <Image source={{ uri: friend.image }} style={friend.type === 'friend' ? style.friendCardImage : null} />
      </RenderIf>

      <RenderIf isTrue={friend.type === 'friend' && (friend.image === undefined || friend.image === null)}>
        <View style={friend.type === 'friend' ? style.friendCardImage : null}>
          <Text style={style.friendCardImageText}>{`${friend.firstName} ${friend.lastName}`}</Text>
        </View>
      </RenderIf>

      <View style={friend.type === 'friend' ? style.friendCardGradient : null} />
      <Text numberOfLines={1} style={friend.type === 'friend' ? style.friendCardText : style.friendCardAddText}>
        {friend.type === 'friend' && `${friend?.login ?? ''}`}
        {friend.type === 'add' && '+'}
      </Text>
      <RenderIf isTrue={friend.type !== 'empty'}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          onPress={() => handleOnPressFriend(friend)}
          onLongPress={() => handleLongPressFriend(friend)}
        />
      </RenderIf>
    </View>
  );
};

const style = StyleSheet.create({
  friendCard: {
    borderRadius: 10,
    flex: 1,
    minWidth: '40%',
    height: 170,
    backgroundColor: '#3C3C435C',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  friendCardImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendCardImageText: {
    lineHeight: 50,
    fontSize: 50,
    fontWeight: '600',
    color: '#fff',
  },
  friendCardEmpty: {
    borderRadius: 10,
    flex: 1,
    minWidth: '40%',
    height: 170,
    backgroundColor: 'transparent',
    margin: 10,
  },
  friendCardAdd: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    flex: 1,
    minWidth: '40%',
    height: 170,
    backgroundColor: '#E7E7E8CC',
    // backgroundColor: '#F9CBD9CC',
    // borderColor: '#B7576F88',
    // borderWidth: 0.5,
  },
  friendCardAddText: {
    fontSize: 80,
    fontWeight: '100',
    color: '#B7576FAA',
    lineHeight: 85,
  },
  friendCardText: {
    fontSize: 20,
    padding: 20,
    color: '#fff',
  },
  friendCardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,
    backgroundColor: '#00000020',
  },
});

export default FriendCard;