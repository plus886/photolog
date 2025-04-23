import { defineMiddleware } from "astro:middleware";
import childProcess from "child_process";
import dayjs from "dayjs";

export const onRequest = defineMiddleware((context, next) => {
  const hash = childProcess
    .execSync("git rev-parse --short HEAD")
    .toString()
    .trim();

  const time = dayjs(
    childProcess
      .execSync(`git show ${hash} --no-patch --no-notes --pretty='%cd'`)
      .toString(),
  )
    .locale("ja")
    .format("YYYY/M/D H:mm");

  context.locals.lastCommitHash = hash;
  context.locals.lastCommitTime = time;
  return next();
});
