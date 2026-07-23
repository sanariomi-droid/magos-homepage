const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";
const MAX_BODY_BYTES = 16_000;

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

const CONTACT_EMAIL = "ceo@magos.ai.kr";
const ALLOWED_ORIGINS = new Set([
  "https://magos.ai.kr",
  "https://www.magos.ai.kr",
  "https://magos.co.kr",
  "https://www.magos.co.kr",
]);

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...extraHeaders,
    },
  });
}

function normalize(value, maxLength) {
  return String(value ?? "").replace(/\0/g, "").trim().slice(0, maxLength);
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          Allow: "GET, POST, OPTIONS",
          "Cache-Control": "no-store",
        },
      });
    }

    if (request.method === "GET") {
      return json({
        ok: true,
        service: "MAGOS Contact Relay",
        version: "3.2.0",
        configured: Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY),
      });
    }

    if (request.method !== "POST") {
      return json({ ok: false, status: 405, message: "GET, POST 요청만 허용됩니다." }, 405, {
        Allow: "GET, POST, OPTIONS",
      });
    }

    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > MAX_BODY_BYTES) {
      return json({ ok: false, status: 413, message: "문의 내용이 너무 큽니다." }, 413);
    }

    let input;
    try {
      input = await request.json();
    } catch {
      return json({ ok: false, status: 400, message: "요청 형식이 올바르지 않습니다." }, 400);
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
      return json({ ok: false, status: 422, message: "성명, 이메일, 문의 내용은 필수입니다." }, 422);
    }
    if (!validEmail(replyTo)) {
      return json({ ok: false, status: 422, message: "이메일 형식을 확인해 주세요." }, 422);
    }
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      return json({ ok: false, status: 500, message: "상담메일 서버 설정값이 누락되었습니다." }, 500);
    }

    const requestOrigin = request.headers.get("origin") || "";
    const forwardedHost = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
    const safeOrigin = ALLOWED_ORIGINS.has(requestOrigin)
      ? requestOrigin
      : forwardedHost.endsWith(".vercel.app")
        ? `https://${forwardedHost}`
        : "https://magos.ai.kr";

    const templateParams = {
      inquiry_id: inquiryId,
      from_name: fromName,
      name: fromName,
      company,
      reply_to: replyTo,
      email: replyTo,
      phone,
      inquiry_type: inquiryType,
      subject: normalize(input.subject, 200) || `[MAGOS 상담] ${inquiryType} · ${fromName}`,
      message,
      to_email: CONTACT_EMAIL,
      submitted_at: submittedAt,
      page_url: pageUrl,
      site_domain: siteDomain,
    };

    try {
      const emailResponse = await fetch(EMAILJS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/plain, application/json",
          Origin: safeOrigin,
          Referer: `${safeOrigin}/`,
        },
        body: JSON.stringify({
          service_id: SERVICE_ID,
          template_id: TEMPLATE_ID,
          user_id: PUBLIC_KEY,
          template_params: templateParams,
        }),
      });

      const detail = (await emailResponse.text()).trim();
      if (!emailResponse.ok) {
        console.error("EmailJS relay failure", {
          status: emailResponse.status,
          detail,
          inquiryId,
          origin: safeOrigin,
        });
        return json({
          ok: false,
          status: emailResponse.status,
          message: "EmailJS가 상담메일 전송을 거절했습니다.",
          detail: detail || `EmailJS HTTP ${emailResponse.status}`,
          inquiry_id: inquiryId,
        }, 502);
      }

      return json({
        ok: true,
        status: emailResponse.status,
        message: "문의가 접수되었습니다.",
        inquiry_id: inquiryId,
      });
    } catch (error) {
      console.error("EmailJS relay network error", error);
      return json({
        ok: false,
        status: 503,
        message: "상담메일 중계 서버에서 EmailJS에 연결하지 못했습니다.",
        detail: error instanceof Error ? error.message : "알 수 없는 네트워크 오류",
        inquiry_id: inquiryId,
      }, 503);
    }
  },
};
