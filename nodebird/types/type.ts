export type MyError = Error & { status?: number };
export type MessageType = string | { message: string };