import { app } from "./app";

const server = app.listen(3000, () => {
  // TODO: replace console.log with bunyan(logger)
  console.log(
    "  App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env")
  );
  console.log("  Press CTRL-C to stop\n");
});;

export default server;
