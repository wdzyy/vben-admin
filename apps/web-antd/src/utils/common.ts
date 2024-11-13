/**
 * 格式化秒数为HH:mm:ss
 * @param s 秒数
 * @returns HH:mm:ss
 */
export const formatSeconds = (s: number): string => {
  return [
    Number.parseInt(String(s / 60 / 60)),
    Number.parseInt(String((s / 60) % 60)),
    Number.parseInt(String(s % 60)),
  ]
    .join(':')
    .replaceAll(/\b(\d)\b/g, '0$1');
};

/**
 * 获取 url 参数
 * @param query
 * @returns
 * const params = getUrlParams(location.search);
 */
export const getUrlParams = (
  query: string,
): Record<string, string | string[]> => {
  const result: Record<string, string | string[]> = {};
  for (const [key, value] of new URLSearchParams(query)) {
    if (result[key]) {
      result[key] = Array.isArray(result[key])
        ? [...(result[key] as string[]), value]
        : [result[key] as string, value];
    } else {
      result[key] = value;
    }
  }
  return result;
};
