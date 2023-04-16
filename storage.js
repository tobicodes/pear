const STORAGE_KEY = "ESSENCE_DATA_STORE"

function readFromLocalStorage() {
  if (typeof window !== "undefined") {
    const data = window.localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  }
  return {}
}

function writeToLocalStorage(data) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

function storeData(url, data) {
  const dataStore = readFromLocalStorage();
  if (!dataStore[url]) {
    dataStore[url] = { heading: "", tweets: [], linkedInPosts: [] };
  }
  dataStore[url] = { ...dataStore[url], ...data };
  writeToLocalStorage(dataStore);
}

function getDataForUrl(url) {
  const dataStore = readFromLocalStorage();
  return dataStore[url] ?? { heading: "", tweets: [], linkedInPosts: [] };
}

export {getDataForUrl, storeData, writeToLocalStorage, readFromLocalStorage}
