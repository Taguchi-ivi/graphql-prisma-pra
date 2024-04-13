const { ApolloServer, gql } = require('apollo-server');
const fs = require('fs');
const path = require('path');

const { PrismaClient } = require('@prisma/client');
const { getUserId } = require('./utils');

// リゾルバ関係
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const Subscription = require('./resolvers/Subscription');
const User = require('./resolvers/User');
const Link = require('./resolvers/Link');
const Vote = require('./resolvers/Vote');

// サブスクリプションの実装
// publisher(送信者) / subscriber(受信者) / payload(データ)
const { PubSub } = require('apollo-server');

const prisma = new PrismaClient();
const pubsub = new PubSub();

// ダミーデータ
// let links = [
//   {
//     id: 'link-0',
//     description: 'Fullstack tutorial for GraphQL',
//     url: 'www.howtographql.com',
//   },
// ];

// リゾルバ関数を定義 (実際の処理の定義,型に対してどういう処理をするか)
const resolvers = {
  // Query: {
  //   info: () => `This is the API of a Hackernews Clone`,
  //   feed: async (parent, args, context) => {
  //     return context.prisma.link.findMany();
  //   },
  // },
  // Mutation: {
  //   // argsがクエリで受け取った引数
  //   post: (parent, args, context) => {
  //     const link = {
  //       id: `link-${links.length}`,
  //       description: args.description,
  //       url: args.url,
  //     };
  //     links.push(link);
  //     const newLink = context.prisma.link.create({
  //       data: {
  //         url: args.url,
  //         description: args.description,
  //       },
  //     });
  //     return newLink;
  //   },
  // },

  // リファクタ後
  Query,
  Mutation,
  Subscription,
  User,
  Link,
  Vote,
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
});

// サーバーを起動 ( node src/server.js で起動) apollo-serverが起動
server.listen().then(({ url }) => console.log(`Server is running on ${url}`));

// サーバーを起動すると、http://localhost:4000/ にアクセスするとGraphQLのPlaygroundが表示される
// PlaygroundはGraphQLのクエリを実行できる
// クエリを実行すると、resolversで定義した処理が実行される

// クエリ例
// select query
// query{
//   feed {
//     id
//     description
//     url
//   }
// }
// insert, update, delete mutation
// 関数名(引数) { 返り値 }
// mutation {
//   post(url: "https://news.yahoo.com/", description: "ヤフーニュース") {
//     id
//     description
//     url
//   }
// }
