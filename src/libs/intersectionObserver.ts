const createObserver = (cb: () => void) =>
  new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          cb();
          observer.disconnect();
        }
      });
    },
    {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    },
  );

export { createObserver };
