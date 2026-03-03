import { Router } from "express";
import { requireAuth, requireAdmin, AuthRequest } from "../middleware/auth.js";
import { getAllUsers, updateUserRole } from "../services/user.service.js";

const router = Router();

router.use(requireAuth);
router.use(requireAdmin);

// GET /api/admin/users
router.get("/users", async (_req: AuthRequest, res) => {
  try {
    const users = await getAllUsers();
    res.json({ users });
  } catch (error) {
    console.error("Admin list users error:", error);
    res.status(500).json({ error: "Failed to list users" });
  }
});

// PATCH /api/admin/users/:id/role
router.patch("/users/:id/role", async (req: AuthRequest, res) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      res.status(400).json({ error: "Role must be 'user' or 'admin'" });
      return;
    }
    const user = await updateUserRole(req.params.id as string, role);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ user });
  } catch (error) {
    console.error("Admin update role error:", error);
    res.status(500).json({ error: "Failed to update role" });
  }
});

export default router;
