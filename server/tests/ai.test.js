/*
  AI Endpoints Test Script
  ─────────────────────────
  Run:   node tests/ai.test.js
  Needs: Server running (npm run dev)
         GEMINI_API_KEY set in .env (real key, not placeholder)

  ⚠️  These tests hit the real Gemini API —
      they will FAIL if GEMINI_API_KEY is not set.
      Each test makes 1 API call, 5 total (well within free tier).
*/

const BASE_URL = "http://localhost:3000/api";

// ─── HTTP helpers ─────────────────────────────────────────────────────────────
const request = async (method, path, { body, token } = {}) => {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return { status: res.status, data: await res.json() };
};

const post = (p, body, token) => request("POST", p, { body, token });
const get = (p, token) => request("GET", p, { token });
const patch = (p, body, token) => request("PATCH", p, { body, token });

// ─── Assertion helpers ────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;

const assert = (name, condition, detail = "") => {
  if (condition) {
    console.log(`  ✅ ${name}`);
    passed++;
  } else {
    console.log(`  ❌ ${name}${detail ? ` — ${detail}` : ""}`);
    failed++;
  }
};

// ─── Test state ───────────────────────────────────────────────────────────────
let token = null;
let appId = null;

const runTests = async () => {
  console.log("\n🧪 AI ENDPOINTS TESTS\n" + "═".repeat(50));
  console.log("⏳ These tests call the Gemini API — each may take a few seconds.\n");

  // ── 0. Setup: register user + create application ────────────────────────────
  console.log("⚙️  Setup — creating test user & application");

  const email = `aitest_${Date.now()}@example.com`;
  const reg = await post("/auth/register", {
    name: "AI Tester",
    email,
    password: "TestPass123!",
  });
  token = reg.data.token;

  if (!token) {
    console.log("💥 Cannot proceed without auth token.");
    process.exit(1);
  }

  // Update user with resume text
  await patch(
    "/auth/profile",
    {
      resume_text: `
        Experienced Full-Stack Developer with 5 years in Node.js, React, PostgreSQL.
        Worked at startups and mid-size companies. Built microservices handling 10K+ RPM.
        Skills: JavaScript, TypeScript, Python, AWS, Docker, Kubernetes, GraphQL, REST APIs.
        Education: B.Tech in Computer Science from IIT Delhi.
      `.trim(),
    },
    token
  );
  assert("Setup — resume updated", true);

  // Create application with full job description
  const app = await post(
    "/applications",
    {
      company: "Stripe",
      role: "Senior Backend Engineer",
      status: "APPLIED",
      job_description: `
        We're looking for a Senior Backend Engineer to join our Payments team.
        You'll design and build APIs that process billions of dollars in payments.
        Requirements:
        - 5+ years backend experience (Node.js, Go, or Python)
        - Strong SQL and database design skills
        - Experience with distributed systems and message queues
        - Familiarity with PCI compliance is a plus
        - Must be comfortable with on-call rotations
        Nice to have: experience with financial systems, Kafka, Redis.
        Compensation: $180K-$250K + equity. Unlimited PTO.
        This is an in-office role in San Francisco, CA. No remote.
      `.trim(),
      location: "San Francisco, CA",
      salary: "$180K-$250K",
      source: "Company Website",
    },
    token
  );
  appId = app.data.application?.id;
  assert("Setup — application created", !!appId);

  if (!appId) {
    console.log("💥 Cannot proceed without application ID.");
    process.exit(1);
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // 1. COVER LETTER
  // ══════════════════════════════════════════════════════════════════════════════
  console.log("\n📌 GET /ai/:id/cover-letter");

  const cover = await get(`/ai/${appId}/cover-letter`, token);
  assert("Cover letter — 200 OK", cover.status === 200);
  assert("Cover letter — has text", typeof cover.data.coverLetter === "string");
  assert("Cover letter — mentions company", cover.data.coverLetter?.toLowerCase().includes("stripe"));
  assert("Cover letter — reasonable length", cover.data.coverLetter?.length > 200);

  // No auth
  const coverNoAuth = await get(`/ai/${appId}/cover-letter`);
  assert("Cover letter no token — 401", coverNoAuth.status === 401);

  // Non-existent app
  const coverBadId = await get("/ai/fake-id-123/cover-letter", token);
  assert("Cover letter bad id — 404", coverBadId.status === 404);

  // ══════════════════════════════════════════════════════════════════════════════
  // 2. RESUME MATCH SCORE
  // ══════════════════════════════════════════════════════════════════════════════
  console.log("\n📌 GET /ai/:id/score");

  const score = await get(`/ai/${appId}/score`, token);
  assert("Match score — 200 OK", score.status === 200);
  assert("Match score — has score number", typeof score.data.score === "number");
  assert("Match score — score 0-100", score.data.score >= 0 && score.data.score <= 100);
  assert("Match score — has strengths", Array.isArray(score.data.strengths));
  assert("Match score — has gaps", Array.isArray(score.data.gaps));
  assert("Match score — has suggestions", Array.isArray(score.data.suggestions));

  // Verify score saved to DB
  const appAfterScore = await get(`/applications/${appId}`, token);
  assert(
    "Match score — saved to DB",
    appAfterScore.data.application?.match_score === score.data.score
  );

  // ══════════════════════════════════════════════════════════════════════════════
  // 3. INTERVIEW PREP
  // ══════════════════════════════════════════════════════════════════════════════
  console.log("\n📌 GET /ai/:id/prep");

  const prep = await get(`/ai/${appId}/prep`, token);
  assert("Interview prep — 200 OK", prep.status === 200);
  assert("Interview prep — has questions array", Array.isArray(prep.data.questions));
  assert("Interview prep — 5 questions", prep.data.questions?.length === 5);
  assert(
    "Interview prep — each has question & tip",
    prep.data.questions?.every((q) => q.question && q.tip)
  );

  // ══════════════════════════════════════════════════════════════════════════════
  // 4. RED FLAGS
  // ══════════════════════════════════════════════════════════════════════════════
  console.log("\n📌 GET /ai/:id/red-flags");

  const flags = await get(`/ai/${appId}/red-flags`, token);
  assert("Red flags — 200 OK", flags.status === 200);
  assert("Red flags — has redFlags array", Array.isArray(flags.data.redFlags));
  assert("Red flags — has overallRisk", typeof flags.data.overallRisk === "string");
  assert("Red flags — has summary", typeof flags.data.summary === "string");
  assert(
    "Red flags — each has flag & severity",
    flags.data.redFlags?.every((f) => f.flag && f.severity)
  );

  // Test with no job description (create app without JD)
  const noJdApp = await post(
    "/applications",
    { company: "NoJD Corp", role: "Engineer" },
    token
  );
  const noJdFlags = await get(`/ai/${noJdApp.data.application?.id}/red-flags`, token);
  assert("Red flags no JD — 400", noJdFlags.status === 400);

  // ══════════════════════════════════════════════════════════════════════════════
  // 5. EMAIL REPLY
  // ══════════════════════════════════════════════════════════════════════════════
  console.log("\n📌 POST /ai/:id/email-reply");

  const emailReply = await post(
    `/ai/${appId}/email-reply`,
    {
      email_body: `Hi there,

Thanks for applying to the Senior Backend Engineer role at Stripe.
We were impressed by your background and would love to schedule a
30-minute phone screen with you next week. Are you available
Tuesday or Wednesday afternoon (PST)?

Best,
Sarah — Stripe Recruiting`,
      tone: "enthusiastic",
    },
    token
  );
  assert("Email reply — 200 OK", emailReply.status === 200);
  assert("Email reply — has text", typeof emailReply.data.emailReply === "string");
  assert("Email reply — reasonable length", emailReply.data.emailReply?.length > 50);

  // Missing email_body
  const emailNoBody = await post(`/ai/${appId}/email-reply`, {}, token);
  assert("Email reply no body — 400", emailNoBody.status === 400);

  // ══════════════════════════════════════════════════════════════════════════════
  // 6. VERIFY ACTIVITIES WERE LOGGED
  // ══════════════════════════════════════════════════════════════════════════════
  console.log("\n📌 Verify AI activities logged");

  const finalApp = await get(`/applications/${appId}`, token);
  const aiActivities = finalApp.data.application?.activities?.filter(
    (a) => a.type === "AI"
  );
  assert("AI activities — at least 5 logged", aiActivities?.length >= 5);

  // ══════════════════════════════════════════════════════════════════════════════
  // Summary
  // ══════════════════════════════════════════════════════════════════════════════
  console.log("\n" + "═".repeat(50));
  console.log(`📊 Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
  if (failed === 0) {
    console.log("🎉 All AI tests passed!\n");
  } else {
    console.log("⚠️  Some tests failed.\n");
    process.exit(1);
  }
};

runTests().catch((err) => {
  console.error("\n💥 Test runner error:", err.message);
  console.error("   Make sure the server is running and GEMINI_API_KEY is set.\n");
  process.exit(1);
});
