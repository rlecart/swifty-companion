import AsyncStorage from "@react-native-async-storage/async-storage";
import { generateNewId } from "../utils/utils";

const setContactsList = async (contacts) => {
  try {
    const filteredContacts = contacts.filter(contact => contact.type === 'contact');
    await AsyncStorage.setItem('@swifty-companion:contacts', JSON.stringify(filteredContacts));
  } catch (error) {
    console.log('Error saving data', error);
    throw error;
  }
};

const getContactsList = async () => {
  try {
    const contacts = await AsyncStorage.getItem('@swifty-companion:contacts');
    // console.log('get contacghfts: ', contacts, JSON.parse(contacts));
    return (JSON.parse(contacts) || []);
  } catch (error) {
    console.log('Error getting contacts list', error);
    throw error;
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await getContactsList();
    const contact = contacts.find(c => c.id === contactId);
    return contact;
  } catch (error) {
    console.log('Error getting contact by id', error);
    throw error;
  }
};

const getContactByPhoneNumber = async (phoneNumber) => {
  try {
    const contacts = await getContactsList();
    const contact = contacts.find(c => c.phones.includes(phoneNumber));
    return contact;
  } catch (error) {
    console.log('Error getting contact by phoneNumber', error);
    throw error;
  }
};

const setSelfContact = async (selfContact) => {
  try {
    await AsyncStorage.setItem('@swifty-companion:self', JSON.stringify(selfContact));
    console.log('set selfContact: ', selfContact);
  } catch (error) {
    console.log('Error saving data', error);
    throw error;
  }
};

const getSelfContact = async () => {
  try {
    const self = await AsyncStorage.getItem('@swifty-companion:self');
    const parsedSelf = JSON.parse(self);
    return (parsedSelf || {});
  } catch (error) {
    console.log('Error getting self list', error);
    throw error;
  }
};

const saveSelfContact = async (self) => {
  try {
    await setSelfContact(self).then(() => Promise.resolve());
  } catch (error) {
    console.log('Error getting self list', error);
    throw error;
  }
};

const saveContact = async (contact) => {
  try {
    const contacts = await getContactsList();
    const contactIndex = contacts.findIndex(c => c.id === contact.id);
    if (contactIndex === -1)
      contacts.push(contact);
    else
      contacts[contactIndex] = contact;
    await setContactsList(contacts);

    const conversation = await getConversationById(contact.id);
    if (conversation?.messages?.length > 0) {
      const conversationsList = await getConversationsList();
      const conversationIndex = conversationsList.findIndex(c => c.contact.id === contact.id);
      if (conversationIndex !== -1)
        conversationsList[conversationIndex] = { ...conversation, contact };
      await setConversationsList(conversationsList);
    }
  } catch (error) {
    console.log('Error saving new contact', error);
    throw error;
  }
};

const deleteContact = async (contactId) => {
  try {
    const contacts = await getContactsList();
    const newContacts = contacts.filter(contact => contact.id !== contactId);
    await setContactsList(newContacts);
    await deleteConversation(contactId);
  } catch (error) {
    console.log('Error deleting contact', error);
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

const getHeaderColor = async () => {
  try {
    const headerColor = await AsyncStorage.getItem('@swifty-companion:headerColor');
    return (JSON.parse(headerColor) || 'teal');
  } catch (error) {
    console.log('Error getting headerColor', error);
    throw error;
  }
};

const setHeaderColor = async (headerColor) => {
  try {
    await AsyncStorage.setItem('@swifty-companion:headerColor', JSON.stringify(headerColor));
  } catch (error) {
    console.log('Error saving headerColor', error);
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

const setConversationsList = async (conversations) => {
  try {
    await AsyncStorage.setItem('@swifty-companion:conversations', JSON.stringify(conversations));
  } catch (error) {
    console.log('Error saving conversations list', error);
    throw error;
  }
};

const getConversationsList = async () => {
  try {
    const conversations = await AsyncStorage.getItem('@swifty-companion:conversations');
    return (JSON.parse(conversations) || []);
  } catch (error) {
    console.log('Error getting conversations list', error);
    throw error;
  }
};

const deleteConversation = async (contactId) => {
  try {
    const conversations = await getConversationsList();
    const newConversationsList = conversations.filter(conversation => conversation.contact.id !== contactId);
    await setConversationsList(newConversationsList);
  } catch (error) {
    console.log('Error deleting conversation', error);
    throw error;
  }
};

const getConversationById = async (contactId) => {
  try {
    const contact = await getContactById(contactId);
    const conversations = await getConversationsList();
    const conversation = conversations.find(c => c.contact.id === contact?.id);
    return (conversation || {
      contact: contact,
      messages: [],
    });
  } catch (error) {
    console.log('Error getting conversation by id', error);
    throw error;
  }
};

const getConversationByPhoneNumber = async (phoneNumber) => {
  try {
    const contact = await getContactByPhoneNumber(phoneNumber);
    const conversations = await getConversationsList();
    const conversation = conversations.find(c => c.contact.id === contact?.id);
    return (conversation || {
      contact: contact,
      messages: [],
    });
  } catch (error) {
    console.log('Error getting conversation by id', error);
    throw error;
  }
};

const saveConversation = async (conversation) => {
  try {
    const conversations = await getConversationsList();
    const conversationsWithoutContact = conversations.filter(c => c.contact.id !== conversation.contact.id);
    conversationsWithoutContact.unshift(conversation);
    await setConversationsList(conversationsWithoutContact);
  } catch (error) {
    console.log('Error saving conversation', error);
    throw error;
  }
};

const sendMessage = async (message, contactId, isSelf, phoneNumber) => {
  try {
    let conversation = await getConversationById(contactId);
    if (conversation?.contact === undefined || conversation?.contact === null)
      conversation = await getConversationByPhoneNumber(phoneNumber);

    if (conversation?.contact === undefined || conversation?.contact === null) {
      const contactsList = await getContactsList();
      const selfContact = await getSelfContact();
      const newContactId = generateNewId([...contactsList, selfContact]);
      const contactType = 'contact';

      const newContact = {
        id: newContactId,
        type: contactType,
        image: undefined,
        firstName: `${phoneNumber}`,
        lastName: '',
        company: '',
        phones: [phoneNumber],
        emails: [],
        notes: '',
      };
      await saveContact(newContact);
      conversation.contact = newContact;
    }

    const messageToPush = {
      type: isSelf ? 'self' : 'contact',
      content: message,
      date: new Date(),
    };
    conversation.messages.push(messageToPush);
    await saveConversation(conversation);
    return (conversation.contact.id);
  } catch (error) {
    console.log('Error sending message', error);
    throw error;
  }
};

const areThesePhoneAlreadyUsed = async (contactId, phonesNumbers) => {
  try {
    const contactsList = await getContactsList();
    const selfContact = await getSelfContact();
    const allContacts = [...contactsList, selfContact];
    const contactsListWithoutThisContact = allContacts.filter(contact => contact.id !== contactId);

    const contactsListWithThesePhones = contactsListWithoutThisContact.filter(contact => contact.phones.some(phone => phonesNumbers.includes(phone)));
    return [contactsListWithThesePhones.length > 0, contactsListWithThesePhones];
  } catch (error) {
    console.log('Error checking if this phone number is already used', error);
    throw error;
  }
};

const deletePhoneFromContact = async (whoAskId, contactId, phoneToDelete, forceDelete) => {
  try {
    const contactsList = await getContactsList();
    const selfContact = await getSelfContact();
    const allContacts = [...contactsList, selfContact];
    const allContactsWithoutWhoAsk = allContacts.filter(contact => contact.id !== whoAskId);
    const contact = allContactsWithoutWhoAsk.find(contact => contact.id === contactId);
    if (contact === undefined || contact === null)
      throw ('ContactNotFound');
    if (contact.type === 'self')
      throw ('SelfContact');

    const newPhonesList = contact.phones.filter(phone => phone !== phoneToDelete);

    if (forceDelete === true) {
      await deleteContact(contactId);
    }
    else {
      if (newPhonesList.length <= 0)
        throw ('NoPhoneLeft');

      contact.phones = newPhonesList;
      await saveContact(contact);
    }
  } catch (error) {
    console.log('Error deletePhoneFromContact', error);
    throw (error);
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
    }
    await AsyncStorage.setItem('@swifty-companion:accessToken', JSON.stringify(newAccessToken));
    // console.log('accessToken', JSON.stringify(newAccessToken))
  } catch (error) {
    console.log('Error setAccessToken', error);
    throw (error);
  }
};

export default {
  setContactsList,
  getContactsList,
  saveContact,
  deleteContact,
  getLanguage,
  setLanguage,
  setFirstLaunch,
  isTheFirstLaunch,

  getAccessToken,
  setAccessToken,
};