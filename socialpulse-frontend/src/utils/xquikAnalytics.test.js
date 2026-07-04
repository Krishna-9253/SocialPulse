import { mergeAnalytics, normalizeXquikTweets } from "./xquikAnalytics";

describe("xquikAnalytics", () => {
  it("normalizes Xquik tweet search metrics by date", () => {
    const rows = normalizeXquikTweets({
      data: [
        {
          created_at: "2026-07-04T10:00:00Z",
          public_metrics: {
            like_count: 12,
            reply_count: 3,
            retweet_count: 2,
            quote_count: 1,
          },
        },
        {
          created_at: "2026-07-04T12:00:00Z",
          like_count: 5,
          reply_count: 1,
          retweet_count: 1,
        },
      ],
    });

    expect(rows).toEqual([
      {
        date: "2026-07-04",
        likes: 17,
        comments: 4,
        shares: 4,
      },
    ]);
  });

  it("merges Xquik rows with existing dashboard analytics", () => {
    const merged = mergeAnalytics(
      [{ date: "2026-07-04", likes: 10, comments: 2, shares: 1 }],
      [{ date: "2026-07-04", likes: 4, comments: 3, shares: 2 }]
    );

    expect(merged).toEqual([
      {
        date: "2026-07-04",
        likes: 14,
        comments: 5,
        shares: 3,
      },
    ]);
  });
});
