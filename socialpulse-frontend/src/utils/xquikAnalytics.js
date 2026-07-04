const DATE_LENGTH = 10;

const COLLECTION_KEYS = ["data", "tweets", "results", "items"];

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function getMetric(tweet, names) {
  const publicMetrics = tweet.public_metrics || tweet.publicMetrics || {};
  for (const name of names) {
    if (tweet[name] !== undefined) return toNumber(tweet[name]);
    if (publicMetrics[name] !== undefined) return toNumber(publicMetrics[name]);
  }
  return 0;
}

function extractTweets(payload) {
  if (typeof payload === "string") {
    return extractTweets(JSON.parse(payload));
  }

  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  for (const key of COLLECTION_KEYS) {
    const value = payload[key];
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") {
      const nested = extractTweets(value);
      if (nested.length > 0) return nested;
    }
  }

  return [];
}

export function normalizeXquikTweets(payload) {
  const byDate = new Map();

  extractTweets(payload).forEach((tweet) => {
    const rawDate = tweet.created_at || tweet.createdAt || tweet.date;
    if (!rawDate) return;

    const date = String(rawDate).slice(0, DATE_LENGTH);
    const current = byDate.get(date) || {
      date,
      likes: 0,
      comments: 0,
      shares: 0,
    };

    current.likes += getMetric(tweet, ["like_count", "likeCount", "likes"]);
    current.comments += getMetric(tweet, ["reply_count", "replyCount", "comments"]);
    current.shares +=
      getMetric(tweet, ["retweet_count", "retweetCount", "retweets"]) +
      getMetric(tweet, ["quote_count", "quoteCount", "quotes"]);

    byDate.set(date, current);
  });

  return [...byDate.values()].sort((left, right) =>
    left.date.localeCompare(right.date)
  );
}

export function mergeAnalytics(existingAnalytics, xquikAnalytics) {
  const byDate = new Map();

  [...existingAnalytics, ...xquikAnalytics].forEach((row) => {
    const current = byDate.get(row.date) || {
      date: row.date,
      likes: 0,
      comments: 0,
      shares: 0,
    };

    current.likes += toNumber(row.likes);
    current.comments += toNumber(row.comments);
    current.shares += toNumber(row.shares);
    byDate.set(row.date, current);
  });

  return [...byDate.values()].sort((left, right) =>
    left.date.localeCompare(right.date)
  );
}
