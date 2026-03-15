import pool from "../lib/db.js";

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

// ─── Helper: Call Gemini API ──────────────────────────────────────────────────
const callGemini = async (prompt) => {
  const res = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    console.error("Gemini API error:", errBody);
    throw new Error("Gemini API request failed.");
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
};

// ─── Helper: Get application with ownership check ────────────────────────────
const getOwnedApplication = async (applicationId, userId) => {
  const { rows } = await pool.query(
    `SELECT * FROM applications WHERE id = $1 AND user_id = $2`,
    [applicationId, userId]
  );
  return rows[0] || null;
};

// ─── COVER LETTER ─────────────────────────────────────────────────────────────
export const generateCoverLetter = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id;

    const app = await getOwnedApplication(applicationId, userId);
    if (!app) return res.status(404).json({ error: "Application not found." });

    const resumeText = req.user.resume_text || "No resume provided.";

    const prompt = `You are a professional cover letter writer.

Write a compelling, personalized cover letter for the following job application.
Keep it concise (3-4 paragraphs), professional, and tailored to the role.

Company: ${app.company}
Role: ${app.role}
Job Description: ${app.job_description || "Not provided"}
Location: ${app.location || "Not specified"}

Candidate Resume:
${resumeText}

Write only the cover letter text, no extra commentary.`;

    const coverLetter = await callGemini(prompt);

    // Log activity
    await pool.query(
      `INSERT INTO activities (text, type, application_id) VALUES ($1, $2, $3)`,
      ["AI generated a cover letter", "AI", app.id]
    );

    res.json({ coverLetter });
  } catch (error) {
    console.error("Cover letter error:", error);
    res.status(500).json({ error: "Server error generating cover letter." });
  }
};

// ─── RESUME MATCH SCORE ───────────────────────────────────────────────────────
export const getMatchScore = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id;

    const app = await getOwnedApplication(applicationId, userId);
    if (!app) return res.status(404).json({ error: "Application not found." });

    const resumeText = req.user.resume_text || "No resume provided.";

    const prompt = `You are an expert ATS (Applicant Tracking System) analyzer.

Compare the candidate's resume against the job description and return a JSON object with:
- "score": a number from 0 to 100 representing the match percentage
- "strengths": array of 3-5 matching strengths
- "gaps": array of 2-4 areas where the candidate falls short
- "suggestions": array of 2-3 actionable suggestions to improve the match

Job: ${app.role} at ${app.company}
Job Description: ${app.job_description || "Not provided"}

Resume:
${resumeText}

Return ONLY valid JSON, no explanation.`;

    const raw = await callGemini(prompt);
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const result = JSON.parse(cleaned);

    // Save match_score to DB
    if (result.score !== undefined) {
      await pool.query(
        `UPDATE applications SET match_score = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3`,
        [result.score, applicationId, userId]
      );
    }

    // Log activity
    await pool.query(
      `INSERT INTO activities (text, type, application_id) VALUES ($1, $2, $3)`,
      [`AI scored resume match: ${result.score}%`, "AI", app.id]
    );

    res.json(result);
  } catch (error) {
    console.error("Match score error:", error);
    res.status(500).json({ error: "Server error generating match score." });
  }
};

// ─── INTERVIEW PREP ───────────────────────────────────────────────────────────
export const getInterviewPrep = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id;

    const app = await getOwnedApplication(applicationId, userId);
    if (!app) return res.status(404).json({ error: "Application not found." });

    const prompt = `You are an expert interview coach.

Generate exactly 5 likely interview questions for this position, along with tips on how to answer each one.

Return a JSON array of objects, each with:
- "question": the interview question
- "tip": a concise tip on how to answer it well

Company: ${app.company}
Role: ${app.role}
Job Description: ${app.job_description || "Not provided"}

Return ONLY valid JSON array, no explanation.`;

    const raw = await callGemini(prompt);
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const questions = JSON.parse(cleaned);

    // Log activity
    await pool.query(
      `INSERT INTO activities (text, type, application_id) VALUES ($1, $2, $3)`,
      ["AI generated interview prep questions", "AI", app.id]
    );

    res.json({ questions });
  } catch (error) {
    console.error("Interview prep error:", error);
    res.status(500).json({ error: "Server error generating interview prep." });
  }
};

// ─── RED FLAGS ────────────────────────────────────────────────────────────────
export const getRedFlags = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id;

    const app = await getOwnedApplication(applicationId, userId);
    if (!app) return res.status(404).json({ error: "Application not found." });

    if (!app.job_description) {
      return res.status(400).json({ error: "No job description available to analyze." });
    }

    const prompt = `You are an expert career advisor who helps job seekers identify red flags in job postings.

Analyze the following job description and identify any red flags or concerns.

Return a JSON object with:
- "redFlags": array of objects with "flag" (the concern) and "severity" ("low", "medium", "high")
- "overallRisk": "low", "medium", or "high"
- "summary": a brief 1-2 sentence summary

Company: ${app.company}
Role: ${app.role}
Job Description: ${app.job_description}

Return ONLY valid JSON, no explanation.`;

    const raw = await callGemini(prompt);
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const result = JSON.parse(cleaned);

    // Log activity
    await pool.query(
      `INSERT INTO activities (text, type, application_id) VALUES ($1, $2, $3)`,
      ["AI analyzed job red flags", "AI", app.id]
    );

    res.json(result);
  } catch (error) {
    console.error("Red flags error:", error);
    res.status(500).json({ error: "Server error analyzing red flags." });
  }
};

// ─── EMAIL REPLY ──────────────────────────────────────────────────────────────
export const generateEmailReply = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id;
    const { email_body, tone } = req.body;

    const app = await getOwnedApplication(applicationId, userId);
    if (!app) return res.status(404).json({ error: "Application not found." });

    if (!email_body) {
      return res.status(400).json({ error: "email_body is required." });
    }

    const prompt = `You are a professional email writer helping a job candidate respond to a recruiter.

Write a ${tone || "professional"} reply to the following recruiter email.
Keep it concise, polite, and relevant to the job application.

Candidate is applying for: ${app.role} at ${app.company}

Recruiter's email:
${email_body}

Write only the email reply text (no subject line, no extra commentary).`;

    const emailReply = await callGemini(prompt);

    // Log activity
    await pool.query(
      `INSERT INTO activities (text, type, application_id) VALUES ($1, $2, $3)`,
      ["AI generated an email reply", "AI", app.id]
    );

    res.json({ emailReply });
  } catch (error) {
    console.error("Email reply error:", error);
    res.status(500).json({ error: "Server error generating email reply." });
  }
};
