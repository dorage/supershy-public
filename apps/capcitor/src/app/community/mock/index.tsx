import Gender from '@/components/commons/gender';
import Layouts from '@/components/layouts';
import Locale from '@/constants/locale';
import { ESchoolType, EUserGender } from '@/types/enum';
import type { Component } from 'solid-js';

interface CommunityMockPageProps {}

const Comment = (props: {
  gender: EUserGender;
  school: ESchoolType;
  name: string;
  message: string;
  time: string;
}) => (
  <div class="py-4 border-y-[1px] border-[#333333]">
    <div class="flex gap-2 items-center text-xs opacity-70">
      <span>
        <Gender gender={props.gender} />
      </span>
      <span>{props.school.toUpperCase()}</span>
      <span class="font-bold">{props.name}</span>
    </div>
    <div class="pt-3 pb-4 px-1">{props.message}</div>
    <div class="flex gap-2 items-center text-xs opacity-70">
      <i class="iconoir-timer" />
      <span>{props.time}</span>
    </div>
  </div>
);

const Reply = (props: {
  gender: EUserGender;
  school: ESchoolType;
  name: string;
  message: string;
  time: string;
}) => (
  <div class="py-4 border-y-[1px] border-[#333333] bg-black bg-opacity-20">
    <div class="pl-3">
      <div class="flex gap-2 items-center text-xs opacity-70">
        <span>
          <Gender gender="f" />
        </span>
        <span>{props.school.toUpperCase()}</span>
        <span class="font-bold">{props.name}</span>
      </div>
      <div class="pt-3 pb-4 px-1">{props.message}</div>
      <div class="flex gap-2 items-center text-xs opacity-70">
        <i class="iconoir-timer" />
        <span>{props.time}</span>
      </div>
    </div>
  </div>
);

const CommunityMockPage: Component<CommunityMockPageProps> = (props) => {
  return (
    <div class="w-screen min-h-screen bg-[#212121]">
      <Layouts.Header title={Locale.community.header} />
      <Layouts.Body>
        <div>
          <div class="flex flex-col gap-3">
            <div class="text-lg font-bold">Sudah dapat suara, Tetapi bagaimana selanjutnya?</div>
            <div class="flex gap-2 items-center text-xs opacity-70">
              <span>
                <Gender gender="f" />
              </span>
              <span>SMP</span>
            </div>
            <div class="flex gap-5 items-center text-xs opacity-70">
              <div class="flex gap-1 items-center">
                <i class="iconoir-timer" />
                <span>5 waktu</span>
              </div>
              <div class="flex gap-1 items-center">
                <i class="iconoir-eye" />
                <span>1,423</span>
              </div>
              <div class="flex gap-1 items-center">
                <i class="iconoir-chat-bubble" />
                <span>210</span>
              </div>
            </div>
          </div>
          <div class="divider" />
          <div class="py-5">
            Ada seorang pria yang memilihku, sebagai teman kencannya dalam pemilihan itu... Aku juga
            tertarik padanya.
            <br />
            <br />
            Bagaimana cara terbaik untuk mengatasi situasi ini?
          </div>
        </div>
        <div class="divider" />
        <div class="pb-5 text-lg font-bold">Komentar</div>
        <Comment
          school="smk"
          gender="f"
          message={'Tentu lakukan saja'}
          name={'Anonym 1'}
          time="59 menit"
        />
        <Reply
          school="smp"
          gender="f"
          message={'Tapi aku terlalu gugup'}
          name={'Penulis'}
          time="59 menit"
        />
        <Comment
          school="sma"
          gender="m"
          message="Cepat hubungi dia dan katakan padanya"
          name={'Anonym 2'}
          time="57 menit"
        />
        <Comment
          school="smp"
          gender="f"
          message="Aku sangat penasaran dengan jawabannya hehe"
          name={'Anonym 3'}
          time="55 menit"
        />
      </Layouts.Body>
    </div>
  );
};

export default CommunityMockPage;
