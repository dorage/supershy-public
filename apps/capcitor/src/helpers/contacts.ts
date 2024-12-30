import {
  ContactPayload,
  Contacts,
  GetContactsResult,
  PhoneType,
} from '@capacitor-community/contacts';
import { Capacitor } from '@capacitor/core';
import { faker } from '@faker-js/faker';
import { createSignal } from 'solid-js';
import { nativeHelper } from './capacitor';

const retrieveMock = async (): Promise<GetContactsResult> => {
  const contacts: ContactPayload[] = [
    {
      contactId: '-1',
      name: {
        display: '',
        middle: null,
        prefix: null,
        suffix: null,
        given: null,
        family: null,
      },
      phones: [{ number: '', type: PhoneType.Main }],
    },
  ];

  for (let i = 0; i < 3; i++) {
    contacts.push({
      contactId: `${i}`,
      name: {
        display: faker.person.fullName(),
        middle: null,
        prefix: null,
        suffix: null,
        given: null,
        family: null,
      },
      phones: [{ number: '0'.repeat(12), type: PhoneType.Mobile }],
    });
  }

  return {
    contacts,
  };
};

const refinePhone = (phone: string | null | undefined) => {
  if (phone == null) return '0'.repeat(12);
  const nums = phone.match(/[0-9]/g);
  if (nums == null) return '0'.repeat(12);
  if (nums.length === 13) {
    if (nums.slice(0, 2).join('') !== '62') return '0'.repeat(12);
    return `0${nums.join('').slice(2)}`;
  }
  if (nums.length === 12) return nums.join('');
  if (nums.length === 11) return `0${nums.join('')}`;
  return nums.join('');
};

const [_permission, stPermission] = createSignal<boolean>(true);
const [_contacts, setContacts] = createSignal<{ name: string; phone: string }[]>([]);

const initialize = async () => {
  const permission = await nativeHelper({
    native() {
      return Contacts.checkPermissions();
    },
    web() {
      return { contacts: 'access' };
    },
  });

  if (Capacitor.isNativePlatform() && permission.contacts === 'denied') {
    stPermission(false);
    return;
  }

  const contacts = await nativeHelper({
    native: () =>
      Contacts.getContacts({
        projection: { name: true, phones: true },
      }),
    web: () => {
      return retrieveMock();
    },
  });

  setContacts(
    contacts.contacts.map((e) => ({
      name:
        e.name?.display ??
        e.name?.family ??
        e.name?.middle ??
        e.name?.given ??
        e.name?.prefix ??
        e.name?.suffix ??
        'Unnamed',
      phone: refinePhone(e.phones?.[0].number),
    }))
  );
};

const contacts = _contacts;
const permission = _permission;

const ContactsHelper = { initialize, contacts, permission };

export default ContactsHelper;
