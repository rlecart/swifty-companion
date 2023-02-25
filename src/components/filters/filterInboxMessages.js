export const filterInboxMessages = (inboxMessage, searchText) => {
  return (
    inboxMessage?.contact?.firstName.toLowerCase().includes(searchText.toLowerCase())
    || inboxMessage?.contact?.lastName.toLowerCase().includes(searchText.toLowerCase())
    || `${inboxMessage?.contact?.firstName} ${inboxMessage?.contact?.lastName}`.toLowerCase().includes(searchText.toLowerCase())
  );
};
