export const bizNumFormatter = (value) => {
  const str = `${value}`.substring(0, 10);
  if (str.length < 4) return str;
  else if (str.length < 6) return str.replace(/(\d{3})(\d{1,2})/, "$1-$2");
  return str.replace(/(\d{3})(\d{2})(\d{1,5})/, "$1-$2-$3");
};

export const bizNumParser = (value) => {
  return `${value}`!.replace(/[^0-9]/g, "");
};

export const phoneNumFormatter = (value) => {
  let str = `${value}`;
  if (str.startsWith("0.")) {
    str = str.replace(/^0./, "0");
  }

  if (str.length < 3) {
    return str;
  } else {
    const first = str.substring(0, 2);
    if (first === "02") {
      if (str.length < 7) return str.replace(/(\d{2})(\d{1,4})/, "$1-$2");
      else if (str.length < 11) return str.replace(/(\d{2})(\d{1,4})(\d{1,4})/, "$1-$2-$3");
      return str.replace(/(\d{2})(\d{1,4})(\d{1,4})(\d+)/, "$1-$2-$3,$4");
    } else {
      if (str.length < 8) return str.replace(/(\d{3})(\d{1,4})/, "$1-$2");
      else if (str.length < 12) return str.replace(/(\d{3})(\d{1,4})(\d{1,4})/, "$1-$2-$3");
      return str.replace(/(\d{3})(\d{1,4})(\d{1,4})(\d+)/, "$1-$2-$3,$4");
    }
  }
};

export const phoneNumParser = (value) => {
  return `${value}`!.replace(/[^0-9]/g, "");
};

export const bizNumProps = {
  formatter: bizNumFormatter,
  parser: bizNumParser,
};
