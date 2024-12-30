import Images from '@/assets/images';
import Layouts from '@/components/layouts';
import Locale from '@/constants/locale';
import { useNavigate } from '@solidjs/router';
import type { Component } from 'solid-js';

interface CommunityPageProps {}

const CommunityPage: Component<CommunityPageProps> = (props) => {
  const navigator = useNavigate();
  return (
    <Layouts.Screen>
      <Layouts.Header title={Locale.community.header} />
      <Layouts.Body class="h-full flex flex-col justify-center items-center">
        <div class="flex-1 w-full h-full flex flex-col items-center justify-center">
          <div class="font-bold text-center text-2xl">Buka segara</div>
          <img src={Images.Resources.satellite} />
        </div>
      </Layouts.Body>
      <Layouts.NavBar />
    </Layouts.Screen>
  );
};

export default CommunityPage;
