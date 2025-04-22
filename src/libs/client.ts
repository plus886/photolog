import type {
  MicroCMSQueries,
  MicroCMSListContent,
  MicroCMSImage,
} from "microcms-js-sdk";
import { createClient } from "microcms-js-sdk";
import dayjs from "dayjs";
import orderBy from "lodash/orderBy";

const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

type DayContent = {
  image: MicroCMSImage;
  camera: string[];
  lens: string[];
  date?: string;
  featured: boolean;
};

export type Day = DayContent & MicroCMSListContent;

const optimizeDate = (item: Day) => {
  const { date, ...rest } = item;
  const safeDate = date || rest.publishedAt || rest.createdAt;
  return {
    date: safeDate,
    slug: dayjs(safeDate).format("YYYYMMDD"),
    ...rest,
  };
};

export const getDays = async (queries?: MicroCMSQueries) => {
  const { contents, ...rest } = await client.getList<Day>({
    endpoint: "days",
    queries,
  });
  return {
    contents: orderBy(
      contents.map((e) => optimizeDate(e)),
      (i) => i.date,
      "desc",
    ),
    ...rest,
  };
};

export const getAllDays = async (queries?: MicroCMSQueries) => {
  const response = await client.getAllContents<Day>({
    endpoint: "days",
    queries,
  });
  return orderBy(
    response.map((e) => optimizeDate(e)),
    (i) => i.date,
    "desc",
  );
};

export const getDayDetail = async (
  contentId: string,
  queries?: MicroCMSQueries,
) => {
  const result = await client.getListDetail({
    endpoint: "days",
    contentId,
    queries,
  });
  return optimizeDate(result);
};
