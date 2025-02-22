// データベースにアクセスするためのクライアントライブラリ
// import { PrismaClient } from '@prisma/client/edge';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // const newLink = await prisma.link.create({
  //   data: {
  //     description: 'Fullstack tutorial for GraphQL',
  //     url: 'www.howtographql.com',
  //   },
  // });

  const allLinks = await prisma.link.findMany();
  console.log(allLinks);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    // db接続を切断
    await prisma.$disconnect();
  });
