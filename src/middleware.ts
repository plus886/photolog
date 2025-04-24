import { defineMiddleware } from "astro:middleware";
import childProcess from "child_process";

export const onRequest = defineMiddleware((context, next) => {
  const hash = childProcess.execSync("git rev-parse HEAD").toString().trim();

  const time = childProcess
    .execSync(`git show ${hash} --no-patch --no-notes --pretty='%cd'`)
    .toString();

  context.locals.lastCommitHash = hash;
  context.locals.lastCommitTime = time;
  return next();
});
