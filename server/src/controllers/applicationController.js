import pool from "../lib/db.js";

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

    const { rows } = await pool.query(
      `INSERT INTO applications
        (company, role, status, job_url, job_description, notes, location, salary, source, applied_date, follow_up_date, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        company, role, status || "SAVED", job_url || null, job_description || null,
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

    addField("company", company);
    addField("role", role);
    addField("status", status);
    addField("job_url", job_url);
    addField("job_description", job_description);
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
