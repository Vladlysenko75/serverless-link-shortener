const crypto = require('crypto');
const shortLinkLength = parseInt(process.env.SHORT_LINK_LENGTH, 10)

export const createShortLink = (link: string): string => {
  const hash = crypto.createHash('sha256').update(link).digest('hex');
  const shortHash = hash.substr(0, shortLinkLength);
  return shortHash;
};