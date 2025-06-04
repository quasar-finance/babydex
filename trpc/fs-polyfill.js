export function stat(path, callback) {
  // Dummy polyfill: always returns a fake stat object with no error
  const fakeStat = {
    isFile: () => true,
    isDirectory: () => false,
    size: 0,
    mtime: new Date(),
    ctime: new Date(),
    atime: new Date(),
    birthtime: new Date(),
  };
  if (typeof callback === "function") {
    callback(null, fakeStat);
  }
}

export function statSync(path) {
  // Dummy polyfill: always returns a fake stat object
  return {
    isFile: () => true,
    isDirectory: () => false,
    size: 0,
    mtime: new Date(),
    ctime: new Date(),
    atime: new Date(),
    birthtime: new Date(),
  };
}
