/*
  Auth API Test Script
  --------------------
  Run: node tests/auth.test.js

  Make sure the server is running first (npm run dev).
  Update BASE_URL if your server is on a different port.
*/

const BASE_URL = "http://localhost:3000/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const post = async (path, body, token) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  return { status: res.status, data: await res.json() };
};

const get = async (path, token) => {
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, { headers });
  return { status: res.status, data: await res.json() };
};

const patch = async (path, body, token) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
  });
  return { status: res.status, data: await res.json() };
};

let passed = 0;
let failed = 0;

const assert = (testName, condition, details = "") => {
  if (condition) {
    console.log(`  ✅ ${testName}`);
    passed++;
  } else {
    console.log(`  ❌ ${testName}${details ? ` — ${details}` : ""}`);
    failed++;
  }
};

// ─── Test Data ────────────────────────────────────────────────────────────────
const testEmail = `testuser_${Date.now()}@example.com`;
const testPassword = "TestPass123!";
const testName = "Test User";

let token = null;

// ─── Tests ────────────────────────────────────────────────────────────────────
const runTests = async () => {
  console.log("\n🧪 AUTH API TESTS\n" + "═".repeat(50));

  // ──── 1. Register ───────────────────────────────────────────────────────────
  console.log("\n📌 POST /auth/register");

  // 1a. Successful registration
  const reg = await post("/auth/register", {
    name: testName,
    email: testEmail,
    password: testPassword,
  });
  assert("Register — 201 Created", reg.status === 201);
  assert("Register — returns token", !!reg.data.token);
  assert("Register — returns user", !!reg.data.user?.id);
  assert("Register — correct email", reg.data.user?.email === testEmail);
  token = reg.data.token;

  // 1b. Duplicate email
  const regDup = await post("/auth/register", {
    name: testName,
    email: testEmail,
    password: testPassword,
  });
  assert("Register duplicate — 409 Conflict", regDup.status === 409);

  // 1c. Missing fields
  const regMissing = await post("/auth/register", { email: testEmail });
  assert("Register missing fields — 400", regMissing.status === 400);

  // 1d. Short password
  const regShort = await post("/auth/register", {
    name: "X",
    email: "short@test.com",
    password: "123",
  });
  assert("Register short password — 400", regShort.status === 400);

  // ──── 2. Login ──────────────────────────────────────────────────────────────
  console.log("\n📌 POST /auth/login");

  // 2a. Successful login
  const login = await post("/auth/login", {
    email: testEmail,
    password: testPassword,
  });
  assert("Login — 200 OK", login.status === 200);
  assert("Login — returns token", !!login.data.token);
  assert("Login — correct email", login.data.user?.email === testEmail);
  token = login.data.token; // use fresh token

  // 2b. Wrong password
  const loginWrong = await post("/auth/login", {
    email: testEmail,
    password: "WrongPassword!",
  });
  assert("Login wrong password — 401", loginWrong.status === 401);

  // 2c. Non-existent email
  const loginNoUser = await post("/auth/login", {
    email: "nobody@example.com",
    password: testPassword,
  });
  assert("Login non-existent — 401", loginNoUser.status === 401);

  // 2d. Missing fields
  const loginMissing = await post("/auth/login", {});
  assert("Login missing fields — 400", loginMissing.status === 400);

  // ──── 3. Get Me ─────────────────────────────────────────────────────────────
  console.log("\n📌 GET /auth/me");

  // 3a. Authenticated
  const me = await get("/auth/me", token);
  assert("Get me — 200 OK", me.status === 200);
  assert("Get me — has user", !!me.data.user?.id);
  assert("Get me — correct email", me.data.user?.email === testEmail);

  // 3b. No token
  const meNoToken = await get("/auth/me");
  assert("Get me no token — 401", meNoToken.status === 401);

  // 3c. Invalid token
  const meInvalid = await get("/auth/me", "invalid.token.here");
  assert("Get me invalid token — 401", meInvalid.status === 401);

  // ──── 4. Update Profile ────────────────────────────────────────────────────
  console.log("\n📌 PATCH /auth/profile");

  // 4a. Update name
  const updateName = await patch("/auth/profile", { name: "Updated Name" }, token);
  assert("Update name — 200 OK", updateName.status === 200);
  assert("Update name — name changed", updateName.data.user?.name === "Updated Name");

  // 4b. Update resume_text
  const updateResume = await patch(
    "/auth/profile",
    { resume_text: "Experienced developer with 5 years in Node.js" },
    token
  );
  assert("Update resume — 200 OK", updateResume.status === 200);
  assert(
    "Update resume — text saved",
    updateResume.data.user?.resume_text === "Experienced developer with 5 years in Node.js"
  );

  // 4c. No token
  const updateNoToken = await patch("/auth/profile", { name: "Hacker" });
  assert("Update no token — 401", updateNoToken.status === 401);

  // ──── Summary ───────────────────────────────────────────────────────────────
  console.log("\n" + "═".repeat(50));
  console.log(`📊 Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
  if (failed === 0) {
    console.log("🎉 All tests passed!\n");
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
