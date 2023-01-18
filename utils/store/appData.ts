import LZUTF8 from "lzutf8";

interface AppData {
  name: string;
  version: string;
  authorization: string;
  token: string;
}

export function setAppData(values: AppData) {
  sessionStorage.setItem(
    "appData",
    LZUTF8.compress(JSON.stringify(values), {
      outputEncoding: "StorageBinaryString",
    })
  );
}

export function updateAppData(key: keyof AppData, value: string) {
  const appData = sessionStorage.getItem("appData") ?? {};
  appData[key] = value;
  setAppData(appData as AppData);
}

export function getAppData(): AppData | null {
  const appData = sessionStorage.getItem("appData");
  if (appData) {
    try {
      return JSON.parse(
        LZUTF8.decompress(appData, {
          inputEncoding: "StorageBinaryString",
        })
      );

      // console.log("state", state.me);
    } finally {
    }
  }

  return null;
}
