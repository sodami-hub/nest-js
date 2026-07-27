export type MyError = Error & { status?: number };

type FollowUser = {
    id: string;
    nick: string;
};

declare global {
    namespace Express {
        interface User {
            id: string;
            nick: string;
            provider: 'local' | 'kakao';

            followers: Array<{
                followerId: string;
                followingId: string;
                follower: FollowUser;
            }>;

            followings: Array<{
                followerId: string;
                followingId: string;
                following: FollowUser;
            }>;
        }
    }
}
