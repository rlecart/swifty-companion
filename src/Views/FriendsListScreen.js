import { ScrollView, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";

import ContactCardsContainer from "../containers/ContactCardsContainer";

import ModalContactSheet from "../containers/ModalContactSheet";
import ModalSetLanguage from "../containers/ModalSetLanguage";
import ModalSetHeaderColor from "../containers/ModalSetHeaderColor";

import Header from "../containers/Header";
import TitleWithCTA from "../components/TitleWithCTA";
import EmptyNavMargin from "../components/EmptyNavMargin";

import { filterContacts } from "../components/filters/filterContacts";

import db from "../db/db";

const FriendsListScreen = ({ route, navigation, isLoaded, setLanguage }) => {
  const isFocused = useIsFocused();

  const [selfContact, setSelfContact] = useState(null);

  const [headerColor, setHeaderColor] = useState('teal');

  const [contactsList, setContactsList] = useState(null);
  const [contactsListFiltered, setContactsListFiltered] = useState(null);

  const [modalContactVisible, setModalContactVisible] = useState(false);
  const [modalContact, setModalContact] = useState({});
  const [modalContactType, setModalContactType] = useState('read');

  const [modalLanguageVisible, setModalLanguageVisible] = useState(false);

  const [modalColorVisible, setModalColorVisible] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      getContactsListFromDB();
      getLanguageFromDB();
      getHeaderColorFromDB();
      getSelfContactFromDB();
    }
  }, [isLoaded, isFocused]);

  useEffect(() => {
    if (contactsList !== undefined && contactsList !== null)
      setContactsListFiltered(contactsList);
  }, [contactsList]);

  const getSelfContactFromDB = async () => {
    try {
      const self = await db.getSelfContact();
      setSelfContact(self);
    } catch (error) {
      console.log('error fetching selfContact: ', error);
    }
  };

  const getHeaderColorFromDB = async () => {
    try {
      const headerColor = await db.getHeaderColor();
      setHeaderColor(headerColor);
    } catch (error) {
      console.log('error fetching headerColor: ', error);
    }
  };

  const getLanguageFromDB = async () => {
    try {
      const language = await db.getLanguage();
      setLanguage(language);
    } catch (error) {
      console.log('error fetching language: ', error);
    }
  };

  const getContactsListFromDB = async () => {
    try {
      const contacts = await db.getContactsList();
      setContactsList(contacts);
    } catch (error) {
      console.log('error fetching contactsList: ', error);
    }
  };

  const handleOpenUserModal = (contact) => {
    if (!modalContactVisible) {
      if (contact.type === 'contact')
        setModalContactType('read');
      else if (contact.type === 'add')
        setModalContactType('edit');
      setModalContact(contact);
      setModalContactVisible(!modalContactVisible);
    }
  };

  const handleCloseUserModal = (userType) => {
    if (modalContactVisible) {
      if (userType === 'contact') {
        getContactsListFromDB();
        setModalContactVisible(!modalContactVisible);
        setModalContact({});
      }
      else if (userType === 'self') {
        getSelfContactFromDB();
        setModalContactVisible(!modalContactVisible);
        setModalContact({});
      }
      else if (userType === 'add') {
        setModalContactVisible(!modalContactVisible);
        setModalContact({});
      }
    }
  };

  const handleCloseLanguageModal = () => {
    if (modalLanguageVisible) {
      getLanguageFromDB();
      setModalLanguageVisible(false);
    }
  };

  const handleCloseColorModal = () => {
    if (modalColorVisible) {
      getHeaderColorFromDB();
      setModalColorVisible(false);
    }
  };

  return (
    <View style={style.container}>
      <ModalContactSheet
        route={route}
        navigation={navigation}
        type={modalContactType}
        setType={setModalContactType}
        contact={modalContact}
        handleCloseUserModal={handleCloseUserModal}
        modalContactVisible={modalContactVisible}
        disabledActions={{
          message: modalContact?.type !== 'contact' || modalContact.phones.length <= 0 ? true : false,
          call: modalContact?.type !== 'contact' || modalContact.phones.length <= 0 ? true : false,
          FaceTime: modalContact?.type !== 'contact' || modalContact.phones.length <= 0 ? true : false,
          email: modalContact?.type !== 'contact' || modalContact.emails.length <= 0 ? true : false,
        }}
      />
      <ModalSetLanguage
        modalVisible={modalLanguageVisible}
        handleCloseModal={handleCloseLanguageModal}
      />
      <ModalSetHeaderColor
        modalVisible={modalColorVisible}
        handleCloseModal={handleCloseColorModal}
      />
      <ScrollView style={style.scrollView}>
        <Header
          headerColor={headerColor}
          user={selfContact}
          handleOpenUserModal={handleOpenUserModal}
          handleOpenColorModal={() => setModalColorVisible(true)}
        />
        <TitleWithCTA
          title="Contacts"
          cta={() => setModalLanguageVisible(true)}
          ctaIcon={require('../../assets/icons/ellipsis.circle.png')}
          withSearchBar
          allData={contactsList}
          setDataFiltered={setContactsListFiltered}
          filterFunction={filterContacts}
        />
        <View style={style.contactsList}>
          <ContactCardsContainer
            headerColor={headerColor}
            contactsListFiltered={contactsListFiltered}
            handleOpenUserModal={handleOpenUserModal}
          />
        </View>
        <EmptyNavMargin />
      </ScrollView>
    </View >
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  scrollView: {
    width: '100%',
  },

  contactsList: {
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