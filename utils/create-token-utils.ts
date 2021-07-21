export function createTokenUtils(tokens) {
  const getTokenByAddress = address =>
    tokens.find(token => token.address === address);
  const getTokenByKey = key => tokens.find(token => token.key === key);
  const tokenKeys = tokens.map(token => token.key);
  const rootTokens = tokens.map(token => token.root);

  return {
    allTokens: tokens,
    tokenKeys,
    getTokenByAddress,
    getTokenByKey,
    rootTokens
  };
}
