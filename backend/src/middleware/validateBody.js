/**
 * Request Body Validation Middleware
 * Ensures required parameters exist and are well-formed before calling provider APIs.
 */
export function validateChatBody(req, res, next) {
  const { model, messages } = req.body;

  if (!model) {
    return res.status(400).json({
      error: "Missing Parameter",
      message: "Model identifier parameter ('model') is required."
    });
  }

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({
      error: "Invalid Parameter",
      message: "Messages must be a non-empty array of [{ role, content }] objects."
    });
  }

  next();
}
