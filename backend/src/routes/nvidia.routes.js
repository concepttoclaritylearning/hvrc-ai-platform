import { Router } from "express";
import { getModelsController, chatCompletionController, healthCheckController } from "../controllers/nvidia.controller.js";
import { validateApiKey } from "../middleware/validateApiKey.js";
import { validateChatBody } from "../middleware/validateBody.js";
import { modelsLimiter, chatLimiter } from "../middleware/rateLimiter.js";

const router = Router();

// Model Discovery Endpoint
router.post("/models", modelsLimiter, validateApiKey, getModelsController);

// Chat Completion Endpoint (SSE streaming + standard JSON)
router.post("/chat", chatLimiter, validateApiKey, validateChatBody, chatCompletionController);

// Health Badge Endpoint
router.get("/health", healthCheckController);

export default router;
