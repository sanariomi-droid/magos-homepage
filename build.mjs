import { readFile, writeFile, rm } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { build } from "vite";

await build();
await build({
  build: {
    ssr: "src/entry-server.jsx",
    outDir: "dist-ssr",
    emptyOutDir: true,
    copyPublicDir: false,
    minify: false,
  },
});

const serverEntry = pathToFileURL(resolve("dist-ssr/entry-server.js")).href;
const { render } = await import(`${serverEntry}?v=${Date.now()}`);
const appHtml = render();
const indexPath = resolve("dist/index.html");
let template = await readFile(indexPath, "utf8");

if (!template.includes('<div id="root"></div>')) {
  throw new Error("정적 사전 렌더링 삽입 지점을 찾지 못했습니다.");
}

template = template
  .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
  .replace("<!-- PRERENDER_STATUS -->", '<meta name="magos-prerender" content="complete" />');

await writeFile(indexPath, template, "utf8");
await rm(resolve("dist-ssr"), { recursive: true, force: true });
console.log("✓ MAGOS static prerender completed");
