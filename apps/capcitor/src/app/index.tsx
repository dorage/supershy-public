import Log from '@/components/log';
import ModalRoot from '@/components/modal';
import routes from '@/constants/url';
import AdmobHelper from '@/helpers/admob';
import { addAppUrlOpenEventListener, getAppState } from '@/helpers/app';
import ContactsHelper from '@/helpers/contacts';
import AuthSignal from '@/signals/auth';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Navigate, Route, Router, Routes } from '@solidjs/router';
import { Match, Show, Switch, createEffect, onMount, type Component } from 'solid-js';
import CheckRegistrationPage from './check-registration';
import CommunityPage from './community';
import CommunityMockPage from './community/mock';
import PhoneEditPage from './phone/edit';
import PollPage from './poll';
import PollDetailPage from './poll/[id]';
import PollMockPage from './poll/mock';
import PollVotePage from './poll/vote';
import PollWinPage from './poll/win';
import PremiumCreatePage from './premium/create';
import PremiumJoinPage from './premium/join';
import ProfilePage from './profile';
import ProfileEditPage from './profile/edit';
import SchoolEditPage from './school/edit';
import EditSchoolGradePage from './school/grade/edit';
import SettingPage from './setting';
import SettingLogoutPage from './setting/logout';
import SignInPage from './signin';
import SplashPage from './splash';
import ShopPage from './shop';

const App: Component = () => {
  createEffect(async () => {
    console.log(AuthSignal.getAuthState(), AuthSignal.get());
  });

  onMount(async () => {
    // Google Auth initialize
    GoogleAuth.initialize();
    // for-Deeplink
    addAppUrlOpenEventListener();
    // admob initialize
    await AdmobHelper.initialize();
    // prepare candidates
    await ContactsHelper.initialize();
  });

  return (
    <Router>
      <Routes>
        <Switch>
          <Match when={AuthSignal.getAuthState() === 'LOADING'}>
            {/* 기타 url */}
            <Route path={routes.all} component={SplashPage} />
          </Match>
          <Match when={AuthSignal.getAuthState() === 'UNSIGNED'}>
            {/* 구글 로그인 / 애플 로그인 */}
            <Route path={routes.signin.index} component={SignInPage} />
            {/* 기티 url */}
            <Route path={routes.all} element={<SignInPage />} />
          </Match>
          <Match when={AuthSignal.getAuthState() === 'SIGNED'}>
            {/* 체크 */}
            <Route path={routes.checkRegistration} component={CheckRegistrationPage} />
            {/* 내가 받은 투표 리스트 */}
            <Route path={routes.poll.win} component={PollWinPage} />
            {/* 내가 한 투표 리스트 */}
            <Route path={routes.poll.vote} component={PollVotePage} />
            {/* 오늘의 투표 */}
            <Route path={routes.poll.index} component={PollPage} />
            {/* 투표했던 화면 */}
            <Route path={routes.poll.detail} component={PollDetailPage} />
            {/* 배포 후 추후 업데이트 / 공사중 이런식으로 덮어두기 */}
            <Route path={routes.community.index} component={CommunityPage} />
            {/* 내 정보 / 내 정보 수정 / 내 학교 정보 / 내 학교 수정 */}
            <Route path={routes.profile.index} component={ProfilePage} />
            {/* 내 정보 등록 */}
            <Route path={routes.profile.register} component={ProfileEditPage} />
            {/* 전화번호 수정 페이지 */}
            <Route path={routes.phone.edit} component={PhoneEditPage} />
            {/* 내 학교 학년 등록 */}
            <Route path={routes.school.grade.register} component={EditSchoolGradePage} />
            {/* 내 학교 설정 */}
            <Route path={routes.school.register} component={SchoolEditPage} />
            {/* 프리미엄 조인 페이지 */}
            <Route path={routes.premium.join} component={PremiumJoinPage} />
            {/* 프리미엄 생성 페이지 */}
            <Route path={routes.premium.create} component={PremiumCreatePage} />
            {/* 샵 페이지 */}
            <Route path={routes.shop} component={ShopPage} />
            {/* 세팅 페이지 / 요청사항 / 로그아웃 */}
            <Route path={routes.setting.index} component={SettingPage} />
            {/* 로그아웃 */}
            <Route path={routes.setting.logout} component={SettingLogoutPage} />
            {/* 목업페이지 */}
            <Route path={routes.poll.mock} component={PollMockPage} />
            {/* 목업페이지 */}
            <Route path={routes.community.mock} component={CommunityMockPage} />
            {/* 기타 url은 모두 404로 이동 */}
            <Route path={routes.all} component={CheckRegistrationPage} />
          </Match>
        </Switch>
      </Routes>
      <ModalRoot />
      <Show when={getAppState() === 'LOADING'}>
        <div class="fixed top-0 left-0 right-0 bottom-0 flex flex-col gap-2 justify-center items-center bg-black opacity-50 z-50">
          <div class="loading loading-lg loading-ring bg-white" />
        </div>
      </Show>
      <Show when={import.meta.env.MODE === 'development'}>
        <Log />
      </Show>
    </Router>
  );
};

export default App;
