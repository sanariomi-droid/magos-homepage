import { access, readFile, stat } from "node:fs/promises";
import { constants } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const required = [
  "api/contact.js",
  "public/assets/favicon.png",
  "public/assets/magos-logo.png",
  "public/assets/og-magos.jpg",
  "public/documents/MAGOS_LedgerProof_PoC_v0.1.pdf",
  "src/App.jsx",
  "src/App.css",
  "src/index.css",
  "src/main.jsx",
  "src/entry-server.jsx",
  "build.mjs",
  "index.html",
  "package.json",
  "package-lock.json",
  "vercel.json",
  "vite.config.js",
];

const forbidden = [
  ".git",
  "node_modules",
  "dist",
  "dist-ssr",
  ".vercel",
  "App.jsx",
  "App.css",
  "main.jsx",
  "entry-server.jsx",
  "contact.js",
];

const failures = [];

for (const item of required) {
  try {
    await access(resolve(root, item), constants.R_OK);
  } catch {
    failures.push(`필수 파일 누락: ${item}`);
  }
}

for (const item of forbidden) {
  try {
    await stat(resolve(root, item));
    failures.push(`배포본에 포함되면 안 되는 항목: ${item}`);
  } catch {
    // absent: expected
  }
}

const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const lockJson = JSON.parse(await readFile(resolve(root, "package-lock.json"), "utf8"));
const vercelJson = JSON.parse(await readFile(resolve(root, "vercel.json"), "utf8"));
const appSource = await readFile(resolve(root, "src/App.jsx"), "utf8");
const apiSource = await readFile(resolve(root, "api/contact.js"), "utf8");
const html = await readFile(resolve(root, "index.html"), "utf8");

if (packageJson.version !== "3.3.0") failures.push("package.json 버전이 3.3.0이 아닙니다.");
if (lockJson.version !== "3.3.0") failures.push("package-lock.json 버전이 3.3.0이 아닙니다.");
if (packageJson.engines?.node !== "22.x") failures.push("Node.js 엔진은 22.x로 고정해야 합니다.");
if ("functions" in vercelJson) failures.push("vercel.json의 functions 사용자 지정 패턴을 제거해야 합니다.");
if (!appSource.includes('const CONTACT_API_URL = "/api/contact"')) failures.push("App.jsx가 /api/contact를 사용하지 않습니다.");
if (!appSource.includes('CONTACT_RELAY_VERSION = "3.3.0"')) failures.push("App.jsx 릴레이 버전이 3.3.0이 아닙니다.");
if (!apiSource.includes('RELAY_VERSION = "3.3.0"')) failures.push("api/contact.js 릴레이 버전이 3.3.0이 아닙니다.");
if (!apiSource.includes("export default")) failures.push("api/contact.js에 기본 export가 없습니다.");

const inlineScripts = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)]
  .filter((match) => !/\bsrc=/.test(match[1]));
const cspHeader = vercelJson.headers
  ?.flatMap((entry) => entry.headers || [])
  .find((header) => header.key === "Content-Security-Policy")?.value || "";

for (const script of inlineScripts) {
  const hash = createHash("sha256").update(script[2]).digest("base64");
  if (!cspHeader.includes(`'sha256-${hash}'`)) {
    failures.push(`CSP에 인라인 스크립트 해시가 없습니다: sha256-${hash}`);
  }
}

if (failures.length) {
  console.error("\nMAGOS 프로젝트 검증 실패\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("✓ 필수 경로 및 중복 파일 검사 완료");
console.log("✓ package.json / package-lock.json / vercel.json 검사 완료");
console.log("✓ Vercel Function 자동 탐지 구조(api/contact.js) 확인");
console.log("✓ CSP 인라인 스크립트 SHA-256 해시 확인");
console.log("✓ MAGOS v3.3.0 프로젝트 정적 검증 완료");
