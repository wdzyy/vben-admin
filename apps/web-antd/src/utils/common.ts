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

/**
 * -转大驼峰
 * @param str
 */
export const toPascalCase = (str: any) => {
  // 将连字符或下划线替换为空格，以便后续处理
  const words = str.replaceAll(/[-_]/g, ' ').split(' ');

  // 将每个单词的首字母大写，并将其余部分保持原样
  const pascalCaseWords = words.map((word: any) => {
    if (word) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
    return word;
  });

  // 将处理后的单词拼接成一个新的字符串
  return pascalCaseWords.join('');
};

/**
 * 获取文件名，不包含扩展名
 * @param path
 * @returns
 */
export const getFileNameWithoutExtension = (path?: string) => {
  if (!path?.trim()) return null;

  // 使用正则表达式一次性完成所有操作
  const match = path.trim().match(/[^/\\]+(?=\.[^.]+$|$)/);
  return match?.[0].replace(/\.[^/.]+$/, '') ?? null;
};
