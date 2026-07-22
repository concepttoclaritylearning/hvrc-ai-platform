/**
 * HVRC.AI Universal Command System
 * VS Code-style command registry for keyboard shortcuts, palette execution, and AI actions.
 */

import { globalEventBus, HVRC_EVENTS } from "./EventBus";

class CommandRegistry {
  constructor() {
    this.commands = new Map();
  }

  /**
   * Register a new command.
   */
  register(id, title, handler, category = "General") {
    this.commands.set(id, { id, title, handler, category });
    return () => this.unregister(id);
  }

  /**
   * Unregister a command.
   */
  unregister(id) {
    this.commands.delete(id);
  }

  /**
   * Execute a command by ID.
   */
  async execute(id, ...args) {
    const cmd = this.commands.get(id);
    if (!cmd) {
      console.warn(`[HVRC CommandRegistry]: Command \`${id}\` not found.`);
      return null;
    }

    try {
      globalEventBus.emit(HVRC_EVENTS.COMMAND_EXECUTE, { commandId: id, args });
      return await cmd.handler(...args);
    } catch (err) {
      console.error(`[HVRC CommandRegistry Error on \`${id}\`]:`, err);
      throw err;
    }
  }

  /**
   * Get all registered commands for Command Palette search.
   */
  list() {
    return Array.from(this.commands.values());
  }
}

export const globalCommandRegistry = new CommandRegistry();

// Pre-register Core System Commands
globalCommandRegistry.register("workspace.saveFile", "Workspace: Save File", () => {
  globalEventBus.emit(HVRC_EVENTS.FILE_SAVE);
}, "Workspace");

globalCommandRegistry.register("model.openHub", "Models: Open BYOK Model Hub", () => {
  window.location.href = "/models";
}, "Models");

globalCommandRegistry.register("terminal.clear", "Terminal: Clear Logs", () => {
  globalEventBus.emit(HVRC_EVENTS.TERMINAL_LOG, { clear: true });
}, "Terminal");
