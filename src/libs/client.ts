import type {
  MicroCMSQueries,
  MicroCMSListContent,
  MicroCMSListResponse,
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
  date?: string;
};

export type Day = DayContent & MicroCMSListContent;

const optimizeDate = (item: Day) => {
  const { date, ...rest } = item;
  if (date)
    return {
      date,
      ...item,
    };
  return {
    date: rest.publishedAt || rest.createdAt,
    ...rest,
  };
};

export const getDays = async (queries?: MicroCMSQueries) => {
  const { contents, ...rest } = await client.getList<Day>({
    endpoint: "days",
    queries,
  });
  return {
    contents: contents.map((e) => optimizeDate(e)),
    ...rest,
  };
};

export const getDayDetail = async (
  contentId: string,
  queries?: MicroCMSQueries,
) => {
  return optimizeDate(
    await client.getListDetail({
      endpoint: "days",
      contentId,
      queries,
    }),
  );
};
