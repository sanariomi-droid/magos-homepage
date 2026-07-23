import test from "node:test";
import assert from "node:assert/strict";
import contact from "../api/contact.js";

const allowedOrigin = "https://magos.ai.kr";

function request(path = "https://magos.ai.kr/api/contact", options = {}) {
  return new Request(path, {
    headers: {
      origin: allowedOrigin,
      "content-type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
}

test("GET /api/contact returns relay health", async () => {
  const response = await contact.fetch(request(undefined, { method: "GET" }));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.ok, true);
  assert.equal(body.version, "3.3.0");
  assert.equal(body.service, "MAGOS Contact Relay");
});

test("POST rejects missing required fields", async () => {
  const response = await contact.fetch(
    request(undefined, { method: "POST", body: JSON.stringify({ name: "김황준" }) }),
  );
  assert.equal(response.status, 422);
  const body = await response.json();
  assert.equal(body.ok, false);
  assert.equal(body.status, 422);
});

test("POST relays a valid inquiry to EmailJS", async () => {
  const originalFetch = globalThis.fetch;
  let captured = null;
  globalThis.fetch = async (url, options) => {
    captured = { url, options };
    return new Response("OK", { status: 200 });
  };

  try {
    const response = await contact.fetch(
      request(undefined, {
        method: "POST",
        body: JSON.stringify({
          inquiry_id: "MAGOS-TEST-001",
          from_name: "김황준",
          reply_to: "test@example.com",
          message: "상담메일 서버중계 시험",
          inquiry_type: "현장 적용 상담",
        }),
      }),
    );

    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.ok, true);
    assert.equal(body.inquiry_id, "MAGOS-TEST-001");
    assert.equal(captured.url, "https://api.emailjs.com/api/v1.0/email/send");

    const payload = JSON.parse(captured.options.body);
    assert.equal(payload.template_params.to_email, "ceo@magos.ai.kr");
    assert.equal(payload.template_params.reply_to, "test@example.com");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("POST exposes EmailJS upstream status without hiding it", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response("Forbidden origin", { status: 403 });

  try {
    const response = await contact.fetch(
      request(undefined, {
        method: "POST",
        body: JSON.stringify({
          inquiry_id: "MAGOS-TEST-403",
          from_name: "김황준",
          reply_to: "test@example.com",
          message: "오류표시 시험",
        }),
      }),
    );

    assert.equal(response.status, 502);
    const body = await response.json();
    assert.equal(body.ok, false);
    assert.equal(body.status, 403);
    assert.match(body.detail, /Forbidden origin/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
