/**
 * HVRC.AI Global Internal Event Bus
 * Pure event-driven architecture connecting UI, Commands, Workspace, AI, and Storage.
 */

class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  /**
   * Subscribe to a specific event.
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  /**
   * Unsubscribe from a specific event.
   */
  off(event, callback) {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event).delete(callback);
  }

  /**
   * Emit an event asynchronously to all subscribers.
   */
  emit(event, payload = {}) {
    if (!this.listeners.has(event)) return;
    const subscribers = Array.from(this.listeners.get(event));
    
    subscribers.forEach((cb) => {
      try {
        cb(payload);
      } catch (err) {
        console.error(`[HVRC EventBus Error on event "${event}"]:`, err);
      }
    });
  }

  /**
   * Emit an event once.
   */
  once(event, callback) {
    const unsubscribe = this.on(event, (payload) => {
      unsubscribe();
      callback(payload);
    });
  }
}

export const globalEventBus = new EventBus();

export const HVRC_EVENTS = {
  // UI & Command Events
  COMMAND_EXECUTE: "command:execute",
  UI_TAB_CHANGE: "ui:tab_change",
  NOTIFY_TOAST: "notify:toast",

  // Workspace & Virtual File Events
  FILE_SELECT: "file:select",
  FILE_CHANGE: "file:change",
  FILE_SAVE: "file:save",
  FILE_CREATE: "file:create",
  FILE_DELETE: "file:delete",

  // AI & Context Events
  AI_PROMPT_SEND: "ai:prompt_send",
  AI_CONTEXT_BUILD: "ai:context_build",
  AI_RESPONSE_CHUNK: "ai:response_chunk",
  AI_COMPLETION_DONE: "ai:completion_done",

  // Model & Router Events
  MODEL_SWITCH: "model:switch",
  KEY_UPDATE: "key:update",

  // Storage & Sync Events
  DRIVE_SYNC_START: "drive:sync_start",
  DRIVE_SYNC_SUCCESS: "drive:sync_success",
  DRIVE_SYNC_ERROR: "drive:sync_error",

  // Terminal & Execution Events
  TERMINAL_CMD: "terminal:cmd",
  TERMINAL_LOG: "terminal:log"
};
