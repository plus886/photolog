import type {
  MicroCMSQueries,
  MicroCMSListContent,
  MicroCMSImage,
} from "microcms-js-sdk";
import { createClient } from "microcms-js-sdk";
import dayjs from "./dayjs";

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
};

type Day = DayContent & MicroCMSListContent;
export type OptimizedDay = ReturnType<typeof addSlug>;
export type GetAllDays = Awaited<ReturnType<typeof getAllDays>>;
export type GetDays = Awaited<ReturnType<typeof getDays>>;
export const DEFAULT_LIMIT = 100;

const addSlug = (item: Day) => {
  const { date, ...rest } = item;
  return {
    slug: dayjs.tz(dayjs(date)).format("YYYYMMDD"),
    date,
    ...rest,
  };
};

export const getDays = async (queries?: MicroCMSQueries) => {
  const { contents, ...rest } = await client.getList<Day>({
    endpoint: "days",
    queries: {
      limit: DEFAULT_LIMIT,
      orders: "-date",
      ...queries,
    },
  });
  return {
    contents: contents.map((e) => addSlug(e)),
    ...rest,
  };
};

export const getAllDays = async (queries?: MicroCMSQueries) => {
  const response = await client.getAllContents<Day>({
    endpoint: "days",
    queries: {
      orders: "-date",
      ...queries,
    },
  });

  return {
    items: response.map((e) => addSlug(e)),
  };
};

export const getAllDayIds = async () => {
  const response = await client.getAllContentIds({
    endpoint: "days",
  });
  return response;
};

export const getDayDetail = async (
  contentId: string,
  queries?: MicroCMSQueries,
) => {
  const result = await client.getListDetail<Day>({
    endpoint: "days",
    contentId,
    queries,
  });
  return addSlug(result);
};
