import { globalA } from './globalA.ts';

globalThis.globalMessage = 'hi';

console.log(globalA()); // hi
