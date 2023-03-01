import { Image, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import RenderIf from "./RenderIf";

import SearchBar from "./SearchBar";

const TitleWithCTA = ({ title, cta, ctaIcon, withSearchBar, allData, setDataFiltered, filterFunction }) => {
  const theme = useColorScheme();
  
  return (
    <View style={style.menuView}>
      <View style={style.menuViewTitleRow}>
        <Text style={[
          style.menuViewTitle,
          theme === 'dark' && { color: '#fff' },
          ]}>{title ?? ''}</Text>

        <RenderIf isTrue={cta !== undefined && cta !== null}>
          <TouchableOpacity onPress={cta}>
            <Image source={ctaIcon} style={{ width: 20, height: 20 }} />
          </TouchableOpacity>
        </RenderIf>

      </View>

      <RenderIf isTrue={withSearchBar}>
        <SearchBar
          allData={allData}
          setDataFiltered={setDataFiltered}
          filterFunction={filterFunction}
        />
      </RenderIf>

    </View>
  );
};

const style = StyleSheet.create({
  menuView: {
    paddingVertical: 10,
    width: '100%',
    paddingHorizontal: 20,
  },
  menuViewTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 10,
  },
  menuViewTitle: {
    fontSize: 34,
    fontWeight: 'bold',
  },
});

export default TitleWithCTA;