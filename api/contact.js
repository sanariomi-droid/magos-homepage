const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";
const RELAY_VERSION = "3.3.0";
const MAX_BODY_BYTES = 16_000;
const UPSTREAM_TIMEOUT_MS = 12_000;

const SERVICE_ID = (
  process.env.EMAILJS_SERVICE_ID ||
  process.env.VITE_EMAILJS_SERVICE_ID ||
  "service_grnbxc8"
).trim();

const TEMPLATE_ID = (
  process.env.EMAILJS_TEMPLATE_ID ||
  process.env.VITE_EMAILJS_TEMPLATE_ID ||
  "template_ry142uj"
).trim();

const PUBLIC_KEY = (
  process.env.EMAILJS_PUBLIC_KEY ||
  process.env.VITE_EMAILJS_PUBLIC_KEY ||
  "GvUELP6idsY4ppGNa"
).trim();

// 선택사항: EmailJS 계정에서 Private Key 사용을 강제한 경우에만
// Vercel의 EMAILJS_PRIVATE_KEY 환경변수로 등록합니다. GitHub에는 넣지 않습니다.
const PRIVATE_KEY = (process.env.EMAILJS_PRIVATE_KEY || "").trim();

const CONTACT_EMAIL = "ceo@magos.ai.kr";
const ALLOWED_ORIGINS = new Set([
  "https://magos.ai.kr",
  "https://www.magos.ai.kr",
  "https://magos.co.kr",
  "https://www.magos.co.kr",
]);

function responseHeaders(extra = {}) {
  return {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store, max-age=0",
    "X-Content-Type-Options": "nosniff",
    "X-MAGOS-Relay-Version": RELAY_VERSION,
    ...extra,
  };
}

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: responseHeaders(extraHeaders),
  });
}

function normalize(value, maxLength) {
  return String(value ?? "")
    .replace(/\0/g, "")
    .replace(/\r\n?/g, "\n")
    .trim()
    .slice(0, maxLength);
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function resolveRequestOrigin(request) {
  const origin = request.headers.get("origin") || "";
  if (ALLOWED_ORIGINS.has(origin)) return origin;

  const forwardedHost =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "";

  if (forwardedHost.endsWith(".vercel.app")) {
    return `https://${forwardedHost}`;
  }

  return "https://magos.ai.kr";
}

function corsHeaders(request) {
  const origin = request.headers.get("origin") || "";
  if (ALLOWED_ORIGINS.has(origin) || origin.endsWith(".vercel.app")) {
    return {
      "Access-Control-Allow-Origin": origin,
      Vary: "Origin",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
    };
  }
  return {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
  };
}

function configStatus() {
  return {
    service_id: Boolean(SERVICE_ID),
    template_id: Boolean(TEMPLATE_ID),
    public_key: Boolean(PUBLIC_KEY),
    private_key_optional: Boolean(PRIVATE_KEY),
  };
}

async function relayToEmailJs(templateParams, safeOrigin) {
  const payload = {
    service_id: SERVICE_ID,
    template_id: TEMPLATE_ID,
    user_id: PUBLIC_KEY,
    template_params: templateParams,
  };

  if (PRIVATE_KEY) {
    payload.accessToken = PRIVATE_KEY;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    return await fetch(EMAILJS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/plain, application/json",
        Origin: safeOrigin,
        Referer: `${safeOrigin}/`,
        "User-Agent": "MAGOS-Contact-Relay/3.3",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

export default {
  async fetch(request) {
    const cors = corsHeaders(request);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          ...cors,
          "Cache-Control": "no-store",
          "X-MAGOS-Relay-Version": RELAY_VERSION,
        },
      });
    }

    if (request.method === "GET") {
      const status = configStatus();
      return json(
        {
          ok: true,
          service: "MAGOS Contact Relay",
          version: RELAY_VERSION,
          configured: status.service_id && status.template_id && status.public_key,
          configuration: status,
          accepted_methods: ["GET", "POST", "OPTIONS"],
        },
        200,
        cors,
      );
    }

    if (request.method !== "POST") {
      return json(
        {
          ok: false,
          status: 405,
          message: "GET, POST, OPTIONS 요청만 허용됩니다.",
        },
        405,
        { ...cors, Allow: "GET, POST, OPTIONS" },
      );
    }

    const requestOrigin = request.headers.get("origin") || "";
    if (
      requestOrigin &&
      !ALLOWED_ORIGINS.has(requestOrigin) &&
      !requestOrigin.endsWith(".vercel.app")
    ) {
      return json(
        {
          ok: false,
          status: 403,
          message: "허용되지 않은 출처의 요청입니다.",
        },
        403,
        cors,
      );
    }

    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > MAX_BODY_BYTES) {
      return json(
        { ok: false, status: 413, message: "문의 내용이 너무 큽니다." },
        413,
        cors,
      );
    }

    let input;
    try {
      input = await request.json();
    } catch {
      return json(
        { ok: false, status: 400, message: "요청 형식이 올바르지 않습니다." },
        400,
        cors,
      );
    }

    const fromName = normalize(input.from_name || input.name, 50);
    const replyTo = normalize(input.reply_to || input.email, 120);
    const message = normalize(input.message, 3000);
    const company = normalize(input.company, 100) || "미입력";
    const phone = normalize(input.phone, 30) || "미입력";
    const inquiryType = normalize(input.inquiry_type, 120) || "홈페이지 상담";
    const inquiryId = normalize(input.inquiry_id, 80) || `MAGOS-${Date.now()}`;
    const submittedAt = normalize(input.submitted_at, 100);
    const pageUrl = normalize(input.page_url, 500);
    const siteDomain = normalize(input.site_domain, 150);

    if (!fromName || !replyTo || !message) {
      return json(
        {
          ok: false,
          status: 422,
          message: "성명, 이메일, 문의 내용은 필수입니다.",
        },
        422,
        cors,
      );
    }

    if (!validEmail(replyTo)) {
      return json(
        { ok: false, status: 422, message: "이메일 형식을 확인해 주세요." },
        422,
        cors,
      );
    }

    const status = configStatus();
    if (!status.service_id || !status.template_id || !status.public_key) {
      return json(
        {
          ok: false,
          status: 500,
          message: "상담메일 서버 설정값이 누락되었습니다.",
          configuration: status,
        },
        500,
        cors,
      );
    }

    const safeOrigin = resolveRequestOrigin(request);
    const templateParams = {
      inquiry_id: inquiryId,
      from_name: fromName,
      name: fromName,
      company,
      reply_to: replyTo,
      email: replyTo,
      phone,
      inquiry_type: inquiryType,
      subject:
        normalize(input.subject, 200) ||
        `[MAGOS 상담] ${inquiryType} · ${fromName}`,
      message,
      to_email: CONTACT_EMAIL,
      submitted_at: submittedAt,
      page_url: pageUrl,
      site_domain: siteDomain,
    };

    try {
      const emailResponse = await relayToEmailJs(templateParams, safeOrigin);
      const detail = (await emailResponse.text()).trim();

      if (!emailResponse.ok) {
        console.error("EmailJS relay failure", {
          status: emailResponse.status,
          detail,
          inquiryId,
          origin: safeOrigin,
        });

        return json(
          {
            ok: false,
            status: emailResponse.status,
            message: "EmailJS가 상담메일 전송을 거절했습니다.",
            detail: detail || `EmailJS HTTP ${emailResponse.status}`,
            inquiry_id: inquiryId,
          },
          502,
          cors,
        );
      }

      return json(
        {
          ok: true,
          status: emailResponse.status,
          message: "문의가 접수되었습니다.",
          detail: detail || "OK",
          inquiry_id: inquiryId,
          relay_version: RELAY_VERSION,
        },
        200,
        cors,
      );
    } catch (error) {
      const aborted = error instanceof Error && error.name === "AbortError";
      console.error("EmailJS relay network error", error);

      return json(
        {
          ok: false,
          status: aborted ? 504 : 503,
          message: aborted
            ? "EmailJS 응답시간이 초과되었습니다."
            : "상담메일 중계 서버에서 EmailJS에 연결하지 못했습니다.",
          detail: error instanceof Error ? error.message : "알 수 없는 네트워크 오류",
          inquiry_id: inquiryId,
        },
        aborted ? 504 : 503,
        cors,
      );
    }
  },
};
