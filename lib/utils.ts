
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
