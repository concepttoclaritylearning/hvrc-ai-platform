/**
 * HVRC.AI Context Engine
 * Builds multi-layered prompt context combining Workspace, Active File, Knowledge RAG, and Memory.
 */

export class ContextEngine {
  /**
   * Build complete context array for LLM completions.
   */
  static buildPromptContext({
    systemPrompt = "You are HVRC.AI, an expert AI development assistant.",
    workspaceSlug = "default",
    activeFileName = null,
    activeFileContent = "",
    chatHistory = [],
    userPrompt = ""
  }) {
    const formatted = [];

    // Layer 1: Base System Prompt & Environment Specs
    let systemContext = systemPrompt + `\nWorkspace: "${workspaceSlug}". Platform: HVRC.AI Zero-Server Architecture.`;

    // Layer 2: Active File Context
    if (activeFileName && activeFileContent) {
      systemContext += `\n\nActive Opened File: \`${activeFileName}\`\n\`\`\`\n${activeFileContent}\n\`\`\``;
    }

    formatted.push({ role: "system", content: systemContext });

    // Layer 3: Conversation History
    chatHistory.forEach((msg) => {
      if (msg.role && msg.text) {
        formatted.push({
          role: msg.role === "assistant" ? "assistant" : "user",
          content: msg.text
        });
      }
    });

    // Layer 4: Current User Input
    formatted.push({ role: "user", content: userPrompt });

    return formatted;
  }
}
