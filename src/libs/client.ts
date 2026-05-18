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

type DayContent = {
  image: MicroCMSImage;
  camera: string[];
  lens: string[];
  date: string;
  featured: boolean;
  // Per-locale vertical-text passage (microCMS textArea fields).
  // Optional: existing entries are empty until filled in microCMS.
  passageJa?: string;
  passageZh?: string;
};

export type Day = DayContent & MicroCMSListContent;
export type GetDays = Awaited<ReturnType<typeof getDays>>;
export const DEFAULT_LIMIT = 100;

export const getDays = async (queries?: MicroCMSQueries) => {
  return client.getList<Day>({
    endpoint: "days",
    queries: {
      limit: DEFAULT_LIMIT,
      orders: "-date",
      ...queries,
    },
  });
};

// 指定日の前後（隣接）の day を 1 件ずつ取得する。
// 全件取得を避け、写真枚数に依存しない一定コストにするためのもの。
export const getAdjacentDays = async (date: string) => {
  const neighbor = (filters: string, orders: string) =>
    client.getList<Day>({
      endpoint: "days",
      queries: { filters, orders, limit: 1, fields: ["id", "date"] },
    });
  const [newer, older] = await Promise.all([
    neighbor(`date[greater_than]${date}`, "date"),
    neighbor(`date[less_than]${date}`, "-date"),
  ]);
  return {
    nextPost: newer.contents[0] ?? null,
    prevPost: older.contents[0] ?? null,
  };
};

export const getAllDayIds = async () => {
  return client.getAllContentIds({ endpoint: "days" });
};

export const getDayDetail = async (
  contentId: string,
  queries?: MicroCMSQueries,
) => {
  return client.getListDetail<Day>({ endpoint: "days", contentId, queries });
};
