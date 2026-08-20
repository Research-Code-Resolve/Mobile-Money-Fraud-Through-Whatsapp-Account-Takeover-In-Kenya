// Trusted contacts store.
// In-memory module-level store so data persists across screens during the app session.
// Swap this for AsyncStorage or a backend API later.

let trustedContacts = [
  { id: '1', name: 'Mum', phone: '+254712345678', relation: 'Family' },
  { id: '2', name: 'Kevin', phone: '+254798765432', relation: 'Friend' },
  { id: '3', name: 'Boss', phone: '+254733111222', relation: 'Work' },
];

let listeners = [];

export function getContacts() {
  return [...trustedContacts];
}

export function addContact(contact) {
  const newContact = {
    id: String(Date.now()),
    name: contact.name,
    phone: contact.phone,
    relation: contact.relation || 'Other',
  };
  trustedContacts = [...trustedContacts, newContact];
  notify();
  return newContact;
}

export function removeContact(id) {
  trustedContacts = trustedContacts.filter((c) => c.id !== id);
  notify();
}

export function subscribe(listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function notify() {
  listeners.forEach((l) => l(trustedContacts));
}