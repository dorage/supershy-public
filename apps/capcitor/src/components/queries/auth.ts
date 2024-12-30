import StorageKeys from '@/constants/storage';
import Storage from '@/helpers/storage';
import AuthProvider from '@/providers/auth';
import { createMutation, createQuery } from '@tanstack/solid-query';

const sleep = (msg: string) =>
  new Promise((res) =>
    setTimeout(() => {
      console.log(msg);
      res(true);
    }, 3000)
  );

export const v1AuthDevMutate = () =>
  createMutation(
    async (option: {}) => {
      await sleep('async fn');
      return true;
    },
    {
      async onSuccess() {
        console.log(1);
        await sleep('onsuccess');
      },
    }
  );
