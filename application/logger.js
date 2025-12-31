import pino from "pino";
import pretty from "pino-pretty";

const stream = pretty({
  ignore: "pid,hostname",
});

export default pino({ level: "debug" }, stream);
