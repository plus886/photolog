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
export type OptimizedDay = ReturnType<typeof optimizeDate>;
export type GetAllDays = Awaited<ReturnType<typeof getAllDays>>;
export const DEFAULT_LIMIT = 10;

const optimizeDate = (item: Day) => {
  const { date, ...rest } = item;
  return {
    slug: dayjs.tz(dayjs(date)).format("YYYYMMDD"),
    date,
    ...rest,
  };
};

const annotate = (optimizedArr: OptimizedDay[]) =>
  optimizedArr.map((item, idx, arr) => {
    const year = dayjs.tz(dayjs(item.date)).format("YYYY");
    const nextYear =
      idx < arr.length - 1
        ? dayjs.tz(dayjs(arr[idx + 1].date)).format("YYYY")
        : null;
    return {
      ...item,
      year,
      isLastOfYear: nextYear !== year,
    };
  });

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
    contents: annotate(contents.map((e) => optimizeDate(e))),
    ...rest,
  };
};

export const getAllDays = async (queries?: MicroCMSQueries) => {
  const response = await client.getAllContents<Day>({
    endpoint: "days",
    queries,
  });
  const annotated = annotate(response.map((e) => optimizeDate(e)));

  return {
    items: annotated,
  };
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
  return optimizeDate(result);
};
