#!/usr/bin/env node
import { runCli } from "./src/cli.js";
runCli().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
});
