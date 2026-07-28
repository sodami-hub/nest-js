
// 전역 객체에는 globalMessage라는 속성이 있을 수 있으며 타입은 string 또는 undefined 이다.
declare global {
  var globalMessage: string | undefined;
}

// 전역값을 읽어서 반환하는 getter 함수
export const globalA = (): string | undefined => globalThis.globalMessage;
