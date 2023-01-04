import pkg from "../../../../package.json";

{
  // console 재정의 필요하면 활용!
  const log = console.log.bind(console);
  const info = console.info.bind(console);
  const error = console.error.bind(console);

  log(`
███████████████████████████████████████████████████████████

 █████╗ ██╗  ██╗███████╗██████╗  █████╗ ███╗   ███╗███████╗
██╔══██╗╚██╗██╔╝██╔════╝██╔══██╗██╔══██╗████╗ ████║██╔════╝
███████║ ╚███╔╝ █████╗  ██████╔╝███████║██╔████╔██║█████╗
██╔══██║ ██╔██╗ ██╔══╝  ██╔══██╗██╔══██║██║╚██╔╝██║██╔══╝
██║  ██║██╔╝ ██╗██║     ██║  ██║██║  ██║██║ ╚═╝ ██║███████╗
╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝

${` ${pkg.name} v${pkg.version} `.padStart(50, "█")}█████████
 
`);

  const getTimeValue = () =>
    `${new Date().getSeconds().toString().padStart(2, "0")}:${new Date()
      .getMilliseconds()
      .toString()
      .padStart(3, "0")}`;

  console.log = (...args) => {
    log(`%c**log[${getTimeValue()}]`, "background: #222; color: #bada55", ...args);
  };
  console.info = (...args) => {
    // log("my console");
    info(`%c*info[${getTimeValue()}]`, "background: #222; color: #16BFFF", ...args);
  };
  console.error = (option, ...args) => {
    // log("my console");
    if (option === "test") {
      log(`%cerror[${getTimeValue()}]`, "background: #222; color: #FF4000", ...args);
    } else {
      error(`%cerror[${getTimeValue()}]`, "background: #222; color: #FF4000", option, ...args);
    }
  };

  console.log("console.log test succeeded");
  console.info("console.info test succeeded");
  console.error("test", "console.error test succeeded");

  log(`Enjoy your developer life.
  
`);
}
