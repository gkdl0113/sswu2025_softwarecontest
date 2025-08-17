import { create } from 'zustand';

export type User = {
  id: string;               // 내부 식별자(없어도 OK)
  name: string;             // 닉네임/이름 (마이페이지에 표시)
  handle: string;           // 아이디(표시용). 공란이면 렌더링 X
  avatarUrl?: string | null;
};

// 게스트(로그아웃) 상태: 요구사항에 맞춰 기본값 세팅
export const GUEST: User = {
  id: 'guest',
  name: '로그인하세요',  // 닉네임 텍스트
  handle: '',            // 아이디 공란
  avatarUrl: null,       // 기본 아이콘
};

type State = {
  user: User;
  setUser: (u: User) => void;
  resetToGuest: () => void;
};

export const useUser = create<State>((set) => ({
  user: GUEST,
  setUser: (u) => set({ user: u }),
  resetToGuest: () => set({ user: GUEST }),
}));

/** 로그인 성공 후 어디서든 호출해서 상태 적용 */
export function applyLoginUser(payload: Partial<User> & { name: string }) {
  // 백엔드 응답 형태에 맞춰 매핑해서 setUser 호출
  // 예: { name, handle, avatarUrl } 만 왔다고 가정
  const u: User = {
    id: payload.id ?? 'me',
    name: payload.name,
    handle: payload.handle ?? '',
    avatarUrl: payload.avatarUrl ?? null,
  };
  useUser.getState().setUser(u);
}