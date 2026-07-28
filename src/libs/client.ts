import type {
  MicroCMSQueries,
  MicroCMSListContent,
  MicroCMSImage,
} from "microcms-js-sdk";
import { createClient } from "microcms-js-sdk";

const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

// A place the photos were taken, referenced from `days`. Entered by hand in
// microCMS, so precision varies: `nameJa`/`nameZh` hold the area someone
// would actually search for (大稻埕, 九份 — not the administrative division),
// and are empty when only the city was remembered.
export type Location = MicroCMSListContent & {
  nameJa?: string;
  nameZh?: string;
  cityJa: string;
  cityZh: string;
  // microCMS select fields come back as arrays even when single-choice.
  country: string[];
};

type DayContent = {
  image: MicroCMSImage;
  camera: string[];
  lens: string[];
  featured: boolean;
  // When the photo was taken. Distinct from publishedAt, which is when it
  // went up — often a day or more later.
  date?: string;
  location?: Location;
  // Per-locale vertical-text passage (microCMS textArea fields).
  // Optional: existing entries are empty until filled in microCMS.
  passageJa?: string;
  passageZh?: string;
  // Per-locale alt text: a concrete description of what the photo shows,
  // for screen readers and image search. Written on the CMS side; optional
  // because older entries predate the field.
  altJa?: string;
  altZh?: string;
};

export type Day = DayContent & MicroCMSListContent;
export type GetDays = Awaited<ReturnType<typeof getDays>>;
export const DEFAULT_LIMIT = 100;

export const getDays = async (queries?: MicroCMSQueries) => {
  return client.getList<Day>({
    endpoint: "days",
    queries: {
      limit: DEFAULT_LIMIT,
      orders: "-publishedAt",
      ...queries,
    },
  });
};

// 指定コンテンツの公開日時の前後（隣接）の day を 1 件ずつ取得する。
// 全件取得を避け、写真枚数に依存しない一定コストにするためのもの。
export const getAdjacentDays = async (publishedAt: string) => {
  const neighbor = (filters: string, orders: string) =>
    client.getList<Day>({
      endpoint: "days",
      // `image` is included so the detail page can preload the
      // adjacent photos and make next/prev navigation instant.
      queries: { filters, orders, limit: 1, fields: ["id", "image"] },
    });
  const [newer, older] = await Promise.all([
    neighbor(`publishedAt[greater_than]${publishedAt}`, "publishedAt"),
    neighbor(`publishedAt[less_than]${publishedAt}`, "-publishedAt"),
  ]);
  return {
    nextPost: newer.contents[0] ?? null,
    prevPost: older.contents[0] ?? null,
  };
};

export const getAllDayIds = async () => {
  return client.getAllContentIds({ endpoint: "days" });
};

export type DayPeek = { id: string; imageUrl: string };

// Random ボタン用のミニマルなリスト：id と写真 URL だけ全件分。
// ページロード時に飛び先を 1 件選んで HTML と写真をプリフェッチするのに
// 使う。`image` だけに絞ることで全件取得でも転送量を小さく保てる。
export const getAllDayPeeks = async (): Promise<DayPeek[]> => {
  const items = await client.getAllContents<Pick<Day, "image">>({
    endpoint: "days",
    queries: { fields: ["id", "image"] },
  });
  return items.map(({ id, image }) => ({ id, imageUrl: image.url }));
};

export const getAllLocations = async (): Promise<Location[]> => {
  return client.getAllContents<Omit<Location, keyof MicroCMSListContent>>({
    endpoint: "locations",
  });
};

export const getLocation = async (contentId: string): Promise<Location> => {
  return client.getListDetail<Omit<Location, keyof MicroCMSListContent>>({
    endpoint: "locations",
    contentId,
  });
};

// What a photo grid needs and nothing else — no passages, camera or lens.
export type DayCard = MicroCMSListContent &
  Pick<Day, "image" | "altJa" | "altZh" | "date" | "featured">;

// Every photo taken at one place, newest first. `location` is a content
// reference, so it filters on the referenced entry's ID.
export const getDaysByLocation = async (
  contentId: string,
): Promise<DayCard[]> => {
  return client.getAllContents<
    Pick<Day, "image" | "altJa" | "altZh" | "date" | "featured">
  >({
    endpoint: "days",
    queries: {
      filters: `location[equals]${contentId}`,
      orders: "-publishedAt",
      fields: [
        "id",
        "image",
        "altJa",
        "altZh",
        "date",
        "featured",
        "publishedAt",
      ],
    },
  });
};

// One pass over every day, grouped by place: gives both the count and a
// cover photo for the index without a query per location.
export type LocationSummary = {
  location: Location;
  count: number;
  cover: MicroCMSImage;
};

export const getLocationSummaries = async (): Promise<LocationSummary[]> => {
  const days = await client.getAllContents<Pick<Day, "image" | "location">>({
    endpoint: "days",
    queries: { orders: "-publishedAt", fields: ["id", "image", "location"] },
  });
  const byId = new Map<string, LocationSummary>();
  for (const day of days) {
    if (!day.location) continue;
    const found = byId.get(day.location.id);
    // Days arrive newest first, so the first one seen is the cover.
    if (found) found.count++;
    else
      byId.set(day.location.id, {
        location: day.location,
        count: 1,
        cover: day.image,
      });
  }
  return [...byId.values()].sort((a, b) => b.count - a.count);
};

// Sitemap input: enough of every day to emit its URL, its photo and a
// lastmod, without pulling the passages and camera data along for 529 items.
export type DaySummary = MicroCMSListContent & {
  image: MicroCMSImage;
  revisedAt?: string;
};

export const getAllDaySummaries = async (): Promise<DaySummary[]> => {
  return client.getAllContents<Pick<Day, "image">>({
    endpoint: "days",
    queries: { fields: ["id", "image", "revisedAt", "publishedAt"] },
  });
};

export const getDayDetail = async (
  contentId: string,
  queries?: MicroCMSQueries,
) => {
  return client.getListDetail<Day>({ endpoint: "days", contentId, queries });
};
