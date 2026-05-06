import pool from "../lib/db.js";
import axios from 'axios';
import * as cheerio from 'cheerio';

const scrapeJobDescription = async (urlStr) => {
  if (!urlStr) return null;
  
  try {
    const parsedUrl = new URL(urlStr);
    
    // 1. SSRF PREVENTION: Allow only HTTP/HTTPS
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      throw new Error("Invalid URL protocol. Only HTTP/HTTPS are allowed.");
    }

    // 2. SSRF PREVENTION: Block internal / private IP ranges and localhost
    const hostname = parsedUrl.hostname.toLowerCase();
    const isInternal = 
      /^localhost$/.test(hostname) ||
      /^127(?:\.[0-9]+){0,2}\.[0-9]+$/.test(hostname) || // 127.0.0.0/8
      /^10(?:\.[0-9]+){3}$/.test(hostname) || // 10.0.0.0/8
      /^192\.168(?:\.[0-9]+){2}$/.test(hostname) || // 192.168.0.0/16
      /^172\.(?:1[6-9]|2[0-9]|3[0-1])(?:\.[0-9]+){2}$/.test(hostname) || // 172.16.0.0/12
      /^169\.254(?:\.[0-9]+){2}$/.test(hostname) || // 169.254.0.0/16 (AWS metadata)
      /^0\.0\.0\.0$/.test(hostname);
      
    if (isInternal) {
      throw new Error("Access to internal/private networks is strictly forbidden.");
    }

    const { data } = await axios.get(urlStr, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 8000, // 8 seconds timeout
    });
    const $ = cheerio.load(data);
    // Remove unnecessary elements
    $('script, style, noscript, nav, header, footer, iframe, img, svg').remove();
    // Extract readable text and compact whitespaces
    const text = $('body').text().replace(/\s+/g, ' ').trim();
    return text.substring(0, 10000); // limit to 10k chars
  } catch (err) {
    console.error("Scraping failed for URL:", urlStr, err.message);
    return null;
  }
};

export const getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const { rows: statusCounts } = await pool.query(
      `SELECT status, COUNT(*)::int AS count
       FROM applications
       WHERE user_id = $1
       GROUP BY status`,
      [userId]
    );

    const { rows: totalRows } = await pool.query(
      `SELECT COUNT(*)::int AS total FROM applications WHERE user_id = $1`,
      [userId]
    );

    // Response rate: (INTERVIEW + OFFER + REJECTED) / total applied (all except SAVED)
    const { rows: responseRows } = await pool.query(
      `SELECT
         COUNT(*) FILTER (WHERE status IN ('INTERVIEW','OFFER','REJECTED'))::int AS responded,
         COUNT(*) FILTER (WHERE status != 'SAVED')::int AS applied
       FROM applications
       WHERE user_id = $1`,
      [userId]
    );

    // Follow-ups due today
    const { rows: followUpRows } = await pool.query(
      `SELECT COUNT(*)::int AS count
       FROM applications
       WHERE user_id = $1 AND follow_up_date::date = CURRENT_DATE`,
      [userId]
    );

    const statusMap = {};
    statusCounts.forEach((r) => {
      statusMap[r.status] = r.count;
    });

    const total = totalRows[0].total;
    const { responded, applied } = responseRows[0];
    const responseRate = applied > 0 ? Math.round((responded / applied) * 100) : 0;

    res.json({
      total,
      statuses: {
        SAVED: statusMap.SAVED || 0,
        APPLIED: statusMap.APPLIED || 0,
        INTERVIEW: statusMap.INTERVIEW || 0,
        OFFER: statusMap.OFFER || 0,
        REJECTED: statusMap.REJECTED || 0,
      },
      responseRate,
      followUpsToday: followUpRows[0].count,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ error: "Server error fetching stats." });
  }
};

// ─── GET All Applications ────────────────────────────────────────────────────
export const getApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, search } = req.query;

    let query = `SELECT * FROM applications WHERE user_id = $1`;
    const params = [userId];
    let paramIndex = 2;

    if (status) {
      query += ` AND status = $${paramIndex++}`;
      params.push(status);
    }

    if (search) {
      query += ` AND (company ILIKE $${paramIndex} OR role ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC`;

    const { rows } = await pool.query(query, params);

    res.json({ applications: rows });
  } catch (error) {
    console.error("Get applications error:", error);
    res.status(500).json({ error: "Server error fetching applications." });
  }
};

// ─── GET Single Application ──────────────────────────────────────────────────
export const getApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get the application (ownership check)
    const { rows: appRows } = await pool.query(
      `SELECT * FROM applications WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (appRows.length === 0) {
      return res.status(404).json({ error: "Application not found." });
    }

    // Get activities for this application
    const { rows: activities } = await pool.query(
      `SELECT * FROM activities WHERE application_id = $1 ORDER BY created_at DESC`,
      [id]
    );
    
    res.json({ application: { ...appRows[0], activities } });
  } catch (error) {
    console.error("Get application error:", error);
    res.status(500).json({ error: "Server error fetching application." });
  }
};

// ─── CREATE Application ──────────────────────────────────────────────────────
export const createApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      company, role, status, job_url, job_description,
      notes, location, salary, source, applied_date, follow_up_date,
    } = req.body;

    if (!company || !role) {
      return res.status(400).json({ error: "Company and role are required." });
    }

    let finalJobDescription = job_description;
    
    // Scrape job description if URL is provided and we don't already have one
    if (job_url && !finalJobDescription) {
      const scrapedText = await scrapeJobDescription(job_url);
      if (scrapedText) {
        finalJobDescription = scrapedText;
      }
    }

    const { rows } = await pool.query(
      `INSERT INTO applications
        (company, role, status, job_url, job_description, notes, location, salary, source, applied_date, follow_up_date, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        company, role, status || "SAVED", job_url || null, finalJobDescription || null,
        notes || null, location || null, salary || null, source || null,
        applied_date || null, follow_up_date || null, userId,
      ]
    );

    const application = rows[0];

    // Log activity
    await pool.query(
      `INSERT INTO activities (text, type, application_id)
       VALUES ($1, $2, $3)`,
      [`Application created for ${role} at ${company}`, "CREATED", application.id]
    );

    res.status(201).json({ message: "Application created.", application });
  } catch (error) {
    console.error("Create application error:", error);
    res.status(500).json({ error: "Server error creating application." });
  }
};

// ─── UPDATE Application ──────────────────────────────────────────────────────
export const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Ownership check
    const { rows: existing } = await pool.query(
      `SELECT * FROM applications WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: "Application not found." });
    }

    const oldApp = existing[0];

    const {
      company, role, status, job_url, job_description,
      notes, location, salary, source, applied_date, follow_up_date,
    } = req.body;

    const fields = [];
    const values = [];
    let paramIndex = 1;

    const addField = (name, value) => {
      if (value !== undefined) {
        fields.push(`${name} = $${paramIndex++}`);
        values.push(value);
      }
    };

    let finalJobDescription = job_description;

    // Only scrape on update if a NEW url is provided and description isn't manually updated
    if (job_url && job_url !== oldApp.job_url && !job_description) {
      const scrapedText = await scrapeJobDescription(job_url);
      if (scrapedText) {
        finalJobDescription = scrapedText;
      }
    }

    addField("company", company);
    addField("role", role);
    addField("status", status);
    addField("job_url", job_url);
    addField("job_description", finalJobDescription);
    addField("notes", notes);
    addField("location", location);
    addField("salary", salary);
    addField("source", source);
    addField("applied_date", applied_date);
    addField("follow_up_date", follow_up_date);

    if (fields.length === 0) {
      return res.status(400).json({ error: "Nothing to update." });
    }

    fields.push(`updated_at = NOW()`);
    values.push(id, userId);

    const { rows } = await pool.query(
      `UPDATE applications SET ${fields.join(", ")}
       WHERE id = $${paramIndex++} AND user_id = $${paramIndex}
       RETURNING *`,
      values
    );

    const application = rows[0];

    // Log status change activity
    if (status && status !== oldApp.status) {
      await pool.query(
        `INSERT INTO activities (text, type, application_id)
         VALUES ($1, $2, $3)`,
        [
          `Status changed from ${oldApp.status} to ${status}`,
          "STATUS_CHANGE",
          id,
        ]
      );
    }

    res.json({ message: "Application updated.", application });
  } catch (error) {
    console.error("Update application error:", error);
    res.status(500).json({ error: "Server error updating application." });
  }
};

// ─── DELETE Application ──────────────────────────────────────────────────────
export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { rows } = await pool.query(
      `DELETE FROM applications WHERE id = $1 AND user_id = $2 RETURNING id`,
      [id, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Application not found." });
    }

    res.json({ message: "Application deleted." });
  } catch (error) {
    console.error("Delete application error:", error);
    res.status(500).json({ error: "Server error deleting application." });
  }
};

// ─── GET Saved Cover Letter ──────────────────────────────────────────────────
export const getSavedCoverLetter = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check ownership
    const { rows: appRows } = await pool.query(
      `SELECT id FROM applications WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (appRows.length === 0) {
      return res.status(404).json({ error: "Application not found." });
    }

    const { rows } = await pool.query(
      `SELECT body FROM cover_letters WHERE application_id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (rows.length === 0) {
      return res.json({ coverLetter: null });
    }

    res.json({ coverLetter: rows[0].body });
  } catch (error) {
    console.error("Get cover letter error:", error);
    res.status(500).json({ error: "Server error fetching cover letter." });
  }
};

// ─── SAVE Cover Letter ───────────────────────────────────────────────────────
export const saveCoverLetter = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { body } = req.body;

    if (!body) {
      return res.status(400).json({ error: "Cover letter body is required." });
    }

    // Check ownership
    const { rows: appRows } = await pool.query(
      `SELECT id FROM applications WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (appRows.length === 0) {
      return res.status(404).json({ error: "Application not found." });
    }

    const { rows } = await pool.query(
      `INSERT INTO cover_letters (user_id, application_id, body, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (application_id) 
       DO UPDATE SET body = EXCLUDED.body, updated_at = NOW()
       RETURNING *`,
      [userId, id, body]
    );

    res.json({ message: "Cover letter saved.", coverLetter: rows[0].body });
  } catch (error) {
    console.error("Save cover letter error:", error);
    res.status(500).json({ error: "Server error saving cover letter." });
  }
};
