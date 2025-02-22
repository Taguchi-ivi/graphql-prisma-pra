// 受け取る側の処理を定義(subscribe)
function newLinkSubscribe(parent, args, context) {
  return context.pubsub.asyncIterator('NEW_LINK');
}

const newLink = {
  subscribe: newLinkSubscribe,
  resolve: (payload) => {
    return payload;
  },
};

function newVoteSubscribe(parent, args, context) {
  return context.pubsub.asyncIterator('NEW_VOTE');
}

const newVote = {
  subscribe: newVoteSubscribe,
  resolve: (payload) => {
    return payload;
  },
};

module.exports = {
  newLink,
  newVote,
};
