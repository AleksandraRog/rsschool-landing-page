export const START_CATEGORY = "coffee"; // или "tea", смотря что у вас по дефолту
export const PAGE_SIZE_768 = 4;

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function withLock(fn, delay = 500) {
  let isLocked = false;

  return function (...args) {
    if (isLocked) return; // Если стоит замок — игнорируем клик

    isLocked = true;
    fn.apply(this, args);

    setTimeout(() => {
      isLocked = false;
    }, delay);
  };
}
