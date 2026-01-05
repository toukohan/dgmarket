import { Router, Request, Response, NextFunction } from "express";
import { validate } from "../middleware/validate";
import { authenticate, AuthenticatedRequest } from "../middleware/authenticate";
import { createDiscSchema, updateDiscSchema, discSearchSchema } from "@/schemas/discSchemas";
import {
  createDiscForSeller,
  getDiscById,
  getDiscsBySeller,
  updateDiscForSeller,
  removeDisc,
  searchDiscsWithFilters,
} from "../services/discService";

const router = Router();

// Public routes - search and browse discs
router.get("/search", validate(discSearchSchema, "query"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = req.query as any;
    const result = await searchDiscsWithFilters(filters);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Default search with no filters
    const result = await searchDiscsWithFilters({
      limit: 20,
      offset: 0,
      sortBy: "created_at",
      sortOrder: "desc",
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const disc = await getDiscById(parseInt(req.params.id));
    res.json(disc);
  } catch (err) {
    next(err);
  }
});

// Protected routes - seller operations
router.post("/", authenticate, validate(createDiscSchema), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const disc = await createDiscForSeller(req.userId!, req.body);
    res.status(201).json(disc);
  } catch (err) {
    next(err);
  }
});

router.get("/seller/my-discs", authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const discs = await getDiscsBySeller(req.userId!);
    res.json(discs);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", authenticate, validate(updateDiscSchema), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const disc = await updateDiscForSeller(parseInt(req.params.id), req.userId!, req.body);
    res.json(disc);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await removeDisc(parseInt(req.params.id), req.userId!);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

export default router;
