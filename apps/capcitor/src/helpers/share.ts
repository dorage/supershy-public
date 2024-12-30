import { Share } from '@capacitor/share';

/**
 * @returns
 */
const inviteFriend = async (props: { name: string; school: string }) => {
  if ((await Share.canShare()).value)
    return Share.share({
      title: 'SuperShy - Cari siapa kamu suka',
      dialogTitle: 'Daftar Super Shy',
      url: `https://supershy.playplease.us?name=${props.name}&school=${props.school}`,
    });
};

const ShareHelpers = { inviteFriend };

export default ShareHelpers;
