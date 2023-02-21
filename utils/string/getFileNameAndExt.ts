export function getFileNameAndExt(filePath: string): {
  fileName?: string;
  fileExt?: string;
  fileNameExt: string;
} {
  try {
    const [, fileName, fileExt] = /([^.\\/]+)\.?([^.]*)$/.exec(filePath) ?? [];
    return {
      fileName: fileName === "" ? undefined : fileName,
      fileExt: fileExt === "" ? undefined : fileExt,
      fileNameExt: `${fileName}.${fileExt}`,
    };
  } catch (err) {
    return {
      fileNameExt: "",
    };
  }
}
