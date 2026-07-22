/**
 * API Key Validation Middleware
 * Checks API key presence and format without storing or logging.
 */
export function validateApiKey(req, res, next) {
  const apiKey = req.body?.apiKey || req.headers.authorization?.replace("Bearer ", "")?.trim();

  if (!apiKey) {
    return res.status(400).json({
      error: "Missing API Key",
      message: "An API key is required. Please provide a valid NVIDIA NIM API Key (nvapi-...)."
    });
  }

  // Validate format for NVIDIA NIM
  if (req.originalUrl.includes("/nvidia") && !apiKey.startsWith("nvapi-")) {
    return res.status(400).json({
      error: "Invalid API Key Format",
      message: "Invalid NVIDIA NIM API Key format. Keys must start with 'nvapi-'."
    });
  }

  req.apiKey = apiKey;
  next();
}
