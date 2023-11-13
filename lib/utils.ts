
export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function removeUndifinedKeys(obj: any) {
  Object.keys(obj).forEach(key => {
    if (obj[key] === undefined) {
      delete obj[key];
    }
  });
}

 // 时间戳转换为中国时间的函数
export const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleString('zh-CN',
    {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Shanghai', // 设置中国时区
    }
  );
};
