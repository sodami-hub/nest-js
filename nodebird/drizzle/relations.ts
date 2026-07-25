import { relations } from 'drizzle-orm/relations';
import { users, posts, hashtags, postsToHashtags, follows } from './schema.ts';

export const postsRelations = relations(posts, ({ one, many }) => ({
    user: one(users, {
        fields: [posts.userId],
        references: [users.id],
    }),
    postsToHashTags: many(postsToHashtags),
}));

export const hashtagRelations = relations(hashtags, ({ many }) => ({
    postsToHashtags: many(postsToHashtags),
}));

export const postsToHashtagsRelations = relations(postsToHashtags, ({ one }) => ({
    post: one(posts, {
        fields: [postsToHashtags.postId],
        references: [posts.id],
    }),
    hashtag: one(hashtags, {
        fields: [postsToHashtags.hashtagId],
        references: [hashtags.id],
    }),
}));

export const userRelations = relations(users, ({ many }) => ({
    posts: many(posts),
    // 내가 팔로우한 사람들
    followings: many(follows, {
        relationName: 'followers',
    }),
    // 나를 팔로우한 사람들
    followers: many(follows, {
        relationName: 'followings',
    }),
}));

export const followRelations = relations(follows, ({ one }) => ({
    follower: one(users, {
        fields: [follows.followerId],
        references: [users.id],
        relationName: 'followings',
    }),
    following: one(users, {
        fields: [follows.followingId],
        references: [users.id],
        relationName: 'followers',
    }),
}));
