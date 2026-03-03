import { pool } from "../config/db.js";

export async function upsertUser(
  uid: string,
  email: string,
  displayName?: string,
  photoUrl?: string
) {
  const result = await pool.query(
    `INSERT INTO app_user (id, email, display_name, photo_url, last_login_at)
     VALUES ($1, $2, $3, $4, NOW())
     ON CONFLICT (id) DO UPDATE SET
       email = EXCLUDED.email,
       display_name = COALESCE(EXCLUDED.display_name, app_user.display_name),
       photo_url = COALESCE(EXCLUDED.photo_url, app_user.photo_url),
       last_login_at = NOW()
     RETURNING *`,
    [uid, email, displayName || null, photoUrl || null]
  );
  return result.rows[0];
}

export async function getUserById(uid: string) {
  const result = await pool.query(
    "SELECT * FROM app_user WHERE id = $1 AND active = true",
    [uid]
  );
  return result.rows[0] || null;
}

export async function getAllUsers() {
  const result = await pool.query(
    "SELECT * FROM app_user ORDER BY created_at DESC"
  );
  return result.rows;
}

export async function updateUserRole(uid: string, role: string) {
  const result = await pool.query(
    "UPDATE app_user SET role = $1 WHERE id = $2 RETURNING *",
    [role, uid]
  );
  return result.rows[0] || null;
}

export async function updateUserPreferences(
  uid: string,
  preferences: Record<string, any>
) {
  const result = await pool.query(
    `UPDATE app_user SET preferences = preferences || $1::jsonb WHERE id = $2 RETURNING *`,
    [JSON.stringify(preferences), uid]
  );
  return result.rows[0] || null;
}
