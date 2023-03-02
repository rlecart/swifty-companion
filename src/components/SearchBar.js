import { useEffect, useState } from 'react';
import { Button, Image, StyleSheet, TextInput, useColorScheme, View } from 'react-native';
import db from '../db/db';

import RenderIf from './RenderIf';

const SearchBar = ({ allData, setDataFiltered, filterFunction }) => {
  const theme = useColorScheme();

  const [searchText, setSearchText] = useState('');
  const [showCancel, setShowCancel] = useState(false);
  const [language, setLanguage] = useState('fr');
  db.getLanguage().then(lang => setLanguage(lang));

  const handleCancel = () => {
    setSearchText('');
    setShowCancel(false);
  };

  const handleChangeText = (text) => {
    setSearchText(text);
    if (text.length > 0)
      setShowCancel(true);
    else
      setShowCancel(false);
  };

  useEffect(() => {
    if (searchText.length <= 0)
      setDataFiltered(allData);
    else {
      setDataFiltered(allData.filter(e => filterFunction(e, searchText)));
    }
  }, [searchText]);

  useEffect(() => {
    handleCancel();
  }, [allData]);

  return (
    <View style={style.searchBar}>
      <Image source={require('../../assets/icons/search.png')} style={style.searchIcon} />
      <TextInput
        style={[
          style.searchText,
          theme === 'dark' && { color: 'white' },
        ]}
        placeholder={language === 'fr' ? 'Recherche' : 'Search'}
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
  );
};

const style = StyleSheet.create({
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
});

export default SearchBar;