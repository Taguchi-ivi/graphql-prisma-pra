const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET } = require('../utils');

// ユーザの新規登録のリゾルバ
async function signup(parent, args, context) {
  // パスワードのハッシュ化
  const password = await bcrypt.hash(args.password, 10);

  // ユーザの作成
  const user = await context.prisma.user.create({
    data: { ...args, password },
  });
  // JWTの生成
  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  // 生成したトークンとユーザを返す
  return {
    token,
    user,
  };
}

// ユーザログイン
async function login(parent, args, context) {
  // ユーザの取得
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });
  if (!user) {
    throw new Error('No such user found');
  }

  // パスワードの照合
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error('Invalid password');
  }

  // JWTの生成
  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  // 生成したトークンとユーザを返す
  return {
    token,
    user,
  };
}

// ニュースを投稿するリゾルバ
// publisher(送信者)の処理を定義
async function post(parent, args, context) {
  const { userId } = context;

  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    },
  });

  // 送信 [NEW_LINK]部分は受信者と一致させること
  context.pubsub.publish('NEW_LINK', newLink);
  return newLink;
}

async function vote(parent, args, context) {
  const { userId } = context;

  const vote = await context.prisma.vote.findUnique({
    where: {
      linkId_userId: {
        linkId: Number(args.linkId),
        userId: userId,
      },
    },
  });

  // 2回投票していないか確認
  if (Boolean(vote)) {
    throw new Error(`Already voted for link: ${args.linkId}`);
  }

  const newVote = context.prisma.vote.create({
    data: {
      user: { connect: { id: userId } },
      link: { connect: { id: Number(args.linkId) } },
    },
  });

  // 送信
  context.pubsub.publish('NEW_VOTE', newVote);
  return newVote;
}

module.exports = {
  signup,
  login,
  post,
  vote,
};
