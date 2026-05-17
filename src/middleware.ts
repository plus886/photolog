import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
  context.locals.lastCommitHash = __COMMIT_HASH__;
  context.locals.lastCommitTime = __COMMIT_TIME__;
  return next();
});
