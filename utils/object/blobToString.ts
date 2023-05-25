export type BlobToType = "text" | "arrayBuffer" | "buffer" | "binary" | "binaryString" | "dataURL" | "base64";
export type BlobTo<T extends BlobToType> = T extends "arrayBuffer" | "buffer" ? ArrayBuffer : string;

export function blobConverter<T extends BlobToType>(blob: Blob, type: T) {
  const method =
    type === "arrayBuffer" || type === "buffer"
      ? "readAsArrayBuffer"
      : type === "binary" || type === "binaryString"
      ? "readAsBinaryString"
      : type === "dataURL" || type === "base64"
      ? "readAsDataURL"
      : "readAsText";
  return new Promise<BlobTo<typeof type>>((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (e: any) => {
      resolve(e.target.result);
    };
    fileReader.onerror = (e: any) => {
      reject(e.target.error);
    };
    fileReader[method](blob);
  });
}
