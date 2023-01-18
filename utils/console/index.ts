import pkg from "../../../../package.json";

{
  console.log(`
███████████████████████████████████████████████████████████

 █████╗ ██╗  ██╗███████╗██████╗  █████╗ ███╗   ███╗███████╗
██╔══██╗╚██╗██╔╝██╔════╝██╔══██╗██╔══██╗████╗ ████║██╔════╝
███████║ ╚███╔╝ █████╗  ██████╔╝███████║██╔████╔██║█████╗
██╔══██║ ██╔██╗ ██╔══╝  ██╔══██╗██╔══██║██║╚██╔╝██║██╔══╝
██║  ██║██╔╝ ██╗██║     ██║  ██║██║  ██║██║ ╚═╝ ██║███████╗
╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝

${` ${pkg.name} v${pkg.version} `.padStart(50, "█")}█████████
 
`);
  if (!window.log) {
    if (process.env.API_PHASE !== "production") {
      const consoleLog = console.log.bind(console);
      const consoleInfo = console.info.bind(console);
      const consoleWarn = console.warn.bind(console);
      const consoleError = console.error.bind(console);

      window.log = {
        error: consoleError,
        warn: consoleWarn,
        info: consoleInfo,
        debug: consoleLog,
      };
    } else {
      window.log = {
        error: () => {},
        warn: () => {},
        info: () => {},
        debug: () => {},
      };
    }
  }

  console.info(`Enjoy your developer life.

  `);
}
