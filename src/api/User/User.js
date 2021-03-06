import { prisma } from "../../../generated/prisma-client";

export default {  
    User: {
        comments: (parent) => {                       // 아래의 posts, likes 등과 같이 코드를 줄일수 있다.
            const { id } = parent;
            return prisma.user({id}).comments
        },
        posts: ({id}) => prisma.user({id}).posts(),               // 코드줄임형태
        likes: ({id}) => prisma.user({id}).likes(),               // 코드줄임형태
        following: ({ id }) => prisma.user({ id }).following(),   // 코드줄임형태
        followers: ({ id }) => prisma.user({ id }).followers(),   //코드줄임형태
        _postsCount: ({ id }) =>{
          return prisma
                    .postsConnection({ where:{ user: { id }}})
                    .aggregate()
                    .count()
        },
        _followingCount: ({id}) =>{
            return prisma
                    .usersConnection({ where: { followers_some: { id }}})
                    .aggregate()
                    .count();
        },
        _followersCount: ({ id }) => {
            return prisma
                .usersConnection({ where:{ following_some: { id }}})
                .aggregate()
                .count();
        },

        // 디비의 성과 이름을 연결하여 전체이름을 리턴한다.
        _fullName: (parent) => {
            return `${parent.lastName} ${parent.firstName} `;
        },

        // 내가 팔로우하고 있는 유저이면 return true
        _amIFollowing: async (parent, _, { request, isAuthToken }) => {
            const reqUser = isAuthToken(request);
            const { id: parentId } = parent;
         
            const isExist = await prisma.$exists.user({
                AND:[
                    { id: parentId },
                    { followers_some:{ id: reqUser.id }}
                ]
            })
            console.log(`접속자:${reqUser.id}  검색된유저:${parentId}`);
            return isExist;
        },

        // 현재유저가 바로 나 자신이면 return true
        _itsMe: (parent, _, { request, isAuthToken }) => {
            const reqUser = isAuthToken(request);
            return reqUser.id == parent.id            
        },
    },
}
