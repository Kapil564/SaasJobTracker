/*
  Applications API Test Script
  ─────────────────────────────
  Run:   node tests/applications.test.js
  Needs: Server running (npm run dev)

  This script registers a fresh user, then tests
  every application endpoint end-to-end.
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
const del = (p, token) => request("DELETE", p, { token });

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

// ─── Tests ────────────────────────────────────────────────────────────────────
const runTests = async () => {
  console.log("\n🧪 APPLICATIONS API TESTS\n" + "═".repeat(50));

  // ── 0. Setup: register a test user ──────────────────────────────────────────
  console.log("\n⚙️  Setup — creating test user");
  const email = `apptest_${Date.now()}@example.com`;
  const reg = await post("/auth/register", {
    name: "App Tester",
    email,
    password: "TestPass123!",
  });
  assert("Setup — user created", reg.status === 201);
  token = reg.data.token;

  if (!token) {
    console.log("\n💥 Cannot proceed without auth token.");
    process.exit(1);
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // 1. CREATE APPLICATION
  // ══════════════════════════════════════════════════════════════════════════════
  console.log("\n📌 POST /applications");

  // 1a. Create valid application
  const create = await post(
    "/applications",
    {
      company: "Google",
      role: "Senior SDE",
      status: "SAVED",
      job_url: "https://careers.google.com/jobs/123",
      job_description: "Build scalable distributed systems using Go and gRPC. 5+ years experience required.",
      notes: "Referred by John",
      location: "Bangalore, India",
      salary: "₹40-60 LPA",
      source: "LinkedIn",
    },
    token
  );
  assert("Create — 201 Created", create.status === 201);
  assert("Create — has application id", !!create.data.application?.id);
  assert("Create — company matches", create.data.application?.company === "Google");
  assert("Create — role matches", create.data.application?.role === "Senior SDE");
  assert("Create — status is SAVED", create.data.application?.status === "SAVED");
  appId = create.data.application?.id;

  // 1b. Create second application (for stats testing)
  const create2 = await post(
    "/applications",
    {
      company: "Microsoft",
      role: "Software Engineer",
      status: "APPLIED",
      job_description: "Work on Azure cloud services.",
      location: "Hyderabad",
    },
    token
  );
  assert("Create 2nd app — 201", create2.status === 201);

  // 1c. Create with follow_up_date = today (for follow-up stat)
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const create3 = await post(
    "/applications",
    {
      company: "Amazon",
      role: "SDE-2",
      status: "INTERVIEW",
      follow_up_date: today,
    },
    token
  );
  assert("Create 3rd app with follow-up — 201", create3.status === 201);

  // 1d. Missing required fields
  const createBad = await post("/applications", { company: "NoRole" }, token);
  assert("Create missing role — 400", createBad.status === 400);

  // 1e. No auth token
  const createNoAuth = await post("/applications", {
    company: "Test",
    role: "Test",
  });
  assert("Create no token — 401", createNoAuth.status === 401);

  // ══════════════════════════════════════════════════════════════════════════════
  // 2. GET ALL APPLICATIONS
  // ══════════════════════════════════════════════════════════════════════════════
  console.log("\n📌 GET /applications");

  // 2a. Get all
  const all = await get("/applications", token);
  assert("Get all — 200 OK", all.status === 200);
  assert("Get all — returns array", Array.isArray(all.data.applications));
  assert("Get all — has 3 apps", all.data.applications?.length === 3);

  // 2b. Filter by status
  const filtered = await get("/applications?status=APPLIED", token);
  assert("Filter by APPLIED — 200", filtered.status === 200);
  assert(
    "Filter by APPLIED — 1 result",
    filtered.data.applications?.length === 1
  );
  assert(
    "Filter — correct company",
    filtered.data.applications?.[0]?.company === "Microsoft"
  );

  // 2c. Search by company name
  const searched = await get("/applications?search=google", token);
  assert("Search 'google' — 200", searched.status === 200);
  assert("Search — 1 result", searched.data.applications?.length === 1);

  // 2d. Search by role
  const searchRole = await get("/applications?search=SDE", token);
  assert("Search 'SDE' — 200", searchRole.status === 200);
  assert("Search role — 2 results", searchRole.data.applications?.length === 2);

  // 2e. No auth
  const allNoAuth = await get("/applications");
  assert("Get all no token — 401", allNoAuth.status === 401);

  // ══════════════════════════════════════════════════════════════════════════════
  // 3. GET SINGLE APPLICATION
  // ══════════════════════════════════════════════════════════════════════════════
  console.log("\n📌 GET /applications/:id");

  // 3a. Get by id
  const single = await get(`/applications/${appId}`, token);
  assert("Get single — 200 OK", single.status === 200);
  assert("Get single — correct id", single.data.application?.id === appId);
  assert("Get single — has activities", Array.isArray(single.data.application?.activities));
  assert(
    "Get single — CREATED activity logged",
    single.data.application?.activities?.some((a) => a.type === "CREATED")
  );

  // 3b. Non-existent id
  const notFound = await get("/applications/non-existent-id-123", token);
  assert("Get non-existent — 404", notFound.status === 404);

  // ══════════════════════════════════════════════════════════════════════════════
  // 4. UPDATE APPLICATION
  // ══════════════════════════════════════════════════════════════════════════════
  console.log("\n📌 PATCH /applications/:id");

  // 4a. Update status (should log STATUS_CHANGE activity)
  const updateStatus = await patch(
    `/applications/${appId}`,
    { status: "APPLIED" },
    token
  );
  assert("Update status — 200 OK", updateStatus.status === 200);
  assert(
    "Update status — changed to APPLIED",
    updateStatus.data.application?.status === "APPLIED"
  );

  // 4b. Verify STATUS_CHANGE activity was logged
  const afterUpdate = await get(`/applications/${appId}`, token);
  const statusActivity = afterUpdate.data.application?.activities?.find(
    (a) => a.type === "STATUS_CHANGE"
  );
  assert("Status change activity logged", !!statusActivity);
  assert(
    "Activity text correct",
    statusActivity?.text?.includes("SAVED") && statusActivity?.text?.includes("APPLIED")
  );

  // 4c. Update multiple fields
  const updateMulti = await patch(
    `/applications/${appId}`,
    {
      notes: "Updated notes — had phone screen",
      salary: "₹50-70 LPA",
      status: "INTERVIEW",
    },
    token
  );
  assert("Update multi — 200 OK", updateMulti.status === 200);
  assert("Update multi — notes changed", updateMulti.data.application?.notes?.includes("phone screen"));
  assert("Update multi — status INTERVIEW", updateMulti.data.application?.status === "INTERVIEW");

  // 4d. Update non-existent
  const updateNotFound = await patch(
    "/applications/fake-id-xyz",
    { status: "OFFER" },
    token
  );
  assert("Update non-existent — 404", updateNotFound.status === 404);

  // 4e. Empty update
  const updateEmpty = await patch(`/applications/${appId}`, {}, token);
  assert("Update empty body — 400", updateEmpty.status === 400);

  // ══════════════════════════════════════════════════════════════════════════════
  // 5. STATS
  // ══════════════════════════════════════════════════════════════════════════════
  console.log("\n📌 GET /applications/stats");

  const stats = await get("/applications/stats", token);
  assert("Stats — 200 OK", stats.status === 200);
  assert("Stats — total is 3", stats.data.total === 3);
  assert("Stats — has statuses", !!stats.data.statuses);
  assert("Stats — INTERVIEW count ≥ 1", stats.data.statuses?.INTERVIEW >= 1);
  assert("Stats — APPLIED count ≥ 1", stats.data.statuses?.APPLIED >= 1);
  assert("Stats — responseRate is number", typeof stats.data.responseRate === "number");
  assert("Stats — followUpsToday ≥ 1", stats.data.followUpsToday >= 1);

  // ══════════════════════════════════════════════════════════════════════════════
  // 6. DELETE APPLICATION
  // ══════════════════════════════════════════════════════════════════════════════
  console.log("\n📌 DELETE /applications/:id");

  // 6a. Delete existing
  const deleteRes = await del(`/applications/${appId}`, token);
  assert("Delete — 200 OK", deleteRes.status === 200);

  // 6b. Verify deleted
  const afterDelete = await get(`/applications/${appId}`, token);
  assert("Deleted app — 404", afterDelete.status === 404);

  // 6c. Delete non-existent
  const deleteNotFound = await del("/applications/fake-id-xyz", token);
  assert("Delete non-existent — 404", deleteNotFound.status === 404);

  // 6d. Verify total went down
  const statsAfter = await get("/applications/stats", token);
  assert("Stats after delete — total is 2", statsAfter.data.total === 2);

  // ══════════════════════════════════════════════════════════════════════════════
  // Summary
  // ══════════════════════════════════════════════════════════════════════════════
  console.log("\n" + "═".repeat(50));
  console.log(`📊 Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
  if (failed === 0) {
    console.log("🎉 All application tests passed!\n");
  } else {
    console.log("⚠️  Some tests failed.\n");
    process.exit(1);
  }
};

runTests().catch((err) => {
  console.error("\n💥 Test runner error:", err.message);
  console.error("   Make sure the server is running (npm run dev)\n");
  process.exit(1);
});
