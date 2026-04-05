import { createStartHandler } from "@tanstack/react-start/server";
import { createServerEntry } from "@tanstack/react-start/server-entry";
import { customHandler } from "./server-handler";

const fetch = createStartHandler(customHandler);

export default createServerEntry({ fetch });
