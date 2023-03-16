import * as path from "path";
import * as fs from "fs-extra";

const srcPath = "../../styles/theme.ts";
const srcTheme = path.resolve(__dirname, srcPath);
const less = require("less");
const theme = require(srcPath);

function compileLESS(from, to) {
  from = path.join(__dirname, from);
  to = path.join(__dirname, to);
  fs.readFile(from, function (err, data) {
    if (err) return;
    less.render(
      data.toString(),
      { compress: true, paths: [path.join(__dirname, "../../styles/less")], javascriptEnabled: true },
      function (e, output) {
        if (e) console.error(e);
        if (!e) {
          fs.writeFile(to, output.css);
        }
      }
    );
  });
}

const buildLessVar = () => {
  delete require.cache[srcTheme];

  Object.keys(theme.themePalette).forEach((palette) => {
    const themeValue = theme.themePalette[palette];

    fs.writeFileSync(
      path.resolve(__dirname, `../../styles/palette/theme-${palette}.less`),
      Object.keys(themeValue)
        .map((k) => {
          if (k === "token") {
            return "";
          }

          if (typeof themeValue[k] !== "string" || !themeValue[k].includes("#")) {
            return `@${k.replace(/_/g, "-")}: ${themeValue[k]};`;
          }

          return `@${k.replace(/_/g, "-")}: ${themeValue[k].toLowerCase()};`;
        })
        .join("\r\n") + "\r\n"
    );
    compileLESS(`../../styles/less/app-${palette}.less`, `../../../public/app-${palette}.css`);
  });

  console.log("compiled css file");
};

// build less vars
buildLessVar();
