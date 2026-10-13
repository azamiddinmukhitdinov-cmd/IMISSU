import { cp, mkdir } from "node:fs/promises";

const root = new URL("../", import.meta.url);
await mkdir(new URL("dist/", root), { recursive: true });
await cp(new URL("docs/", root), new URL("dist/", root), { recursive: true });
console.log("Postcard is ready in dist/");
