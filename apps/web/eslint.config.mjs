import base from "../../eslint.config.ts";
import next from "eslint-config-next";

export default [...base, ...next()];
