import { Router } from "express";
import { ProviderController } from "../controllers/provider.controller.js";
import { connectionLimiter, chatLimiter, healthLimiter } from "../middleware/rateLimiter.js";

const router = Router();

/**
 * Universal Provider Gateway Routes
 */
router.post("/connect", connectionLimiter, ProviderController.connect);
router.post("/chat", chatLimiter, ProviderController.chat);
router.post("/stream", ProviderController.stream);
router.post("/models", connectionLimiter, ProviderController.models);
router.post("/health", healthLimiter, ProviderController.health);
router.post("/disconnect", ProviderController.disconnect);

export default router;
