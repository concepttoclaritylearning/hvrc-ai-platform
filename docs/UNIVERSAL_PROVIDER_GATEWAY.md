# HVRC.AI Universal OpenAI-Compatible Provider Gateway Architecture

## Overview

The **HVRC.AI Universal OpenAI-Compatible Provider Gateway** is an enterprise-grade, stateless backend gateway and frontend management framework. It completely decouples the frontend user interface from specific provider implementations (NVIDIA NIM, OpenRouter, Groq, OpenAI, Ollama, LM Studio, LiteLLM, vLLM, LocalAI, Azure OpenAI, Custom).

---

## Key Principles & Design Philosophy

1. **Zero Provider Hardcoding**: The frontend contains NO provider-specific model arrays or URLs. All model catalogs are fetched dynamically via `GET {baseUrl}/models` over the backend gateway.
2. **Stateless Security**: The backend server stores NO API keys, NO prompts, and NO chat completion records. All requests forward headers directly in-memory and strip logs of sensitive credentials.
3. **Client-side Web Crypto API Encryption**: API Keys are encrypted locally in the browser using AES-GCM 256-bit encryption before saving in `localStorage`.
4. **Universal OpenAI Spec**: Every provider implementation derives from `BaseProvider` and communicates with OpenAI-compliant endpoints (`/v1/models`, `/v1/chat/completions`).

---

## Architecture Diagram

```
+-------------------------------------------------------------------+
|                        HVRC.AI Frontend                           |
|                                                                   |
|   +-----------------------------------------------------------+   |
|   |                   ProviderManager UI                      |   |
|   |  - Template Grid (NVIDIA, OpenRouter, Groq, OpenAI...)    |   |
|   |  - Connection Modal (Base URL + API Key Validation)       |   |
|   |  - Connected Provider Health Cards                        |   |
|   |  - Universal Searchable Model Selector                    |   |
|   +-----------------------------+-----------------------------+   |
|                                 |                                 |
|                                 v                                 |
|   +-----------------------------------------------------------+   |
|   |             ProviderContext & Web Crypto AES-GCM            |   |
|   +-----------------------------+-----------------------------+   |
+---------------------------------|---------------------------------+
                                  | HTTP REST / SSE Stream
                                  v
+-------------------------------------------------------------------+
|                    HVRC.AI Express Gateway                        |
|                                                                   |
|   +-----------------------------------------------------------+   |
|   |                 /api/providers Routes                     |   |
|   |  - POST /connect  - POST /chat   - POST /stream            |   |
|   |  - POST /models   - POST /health - POST /disconnect        |   |
|   +-----------------------------+-----------------------------+   |
|                                 |                                 |
|                                 v                                 |
|   +-----------------------------------------------------------+   |
|   |                 ProviderGatewayService                    |   |
|   +-----------------------------+-----------------------------+   |
|                                 |                                 |
|         +-----------------------+-----------------------+         |
|         |                                               |         |
|         v                                               v         |
|   OpenAiCompatibleProvider                     AzureOpenAiProvider |
|   (NVIDIA, OpenRouter, Groq,                   (Azure Deployments) |
|    Ollama, LM Studio, vLLM...)                                    |
+---------+-----------------------------------------------+---------+
          |                                               |
          v                                               v
    Remote AI Endpoints                            Local AI Engines
  (NVIDIA, OpenRouter, Groq)                   (Ollama, LM Studio, vLLM)
```

---

## API Reference

### 1. `POST /api/providers/connect`
Validates Base URL and API Key credentials, calls `GET {baseUrl}/models`, and returns live discovered models.

**Request Body**:
```json
{
  "name": "NVIDIA NIM",
  "baseUrl": "https://integrate.api.nvidia.com/v1",
  "apiKey": "nvapi-..."
}
```

**Response**:
```json
{
  "connected": true,
  "name": "NVIDIA NIM",
  "baseUrl": "https://integrate.api.nvidia.com/v1",
  "modelCount": 118,
  "models": [
    {
      "id": "meta/llama-3.3-70b-instruct",
      "name": "llama-3.3-70b-instruct",
      "context": "128k",
      "supportsVision": false,
      "supportsReasoning": false,
      "supportsStreaming": true,
      "supportsTools": true,
      "ownedBy": "meta"
    }
  ],
  "connectedAt": "2026-07-22T19:30:00.000Z"
}
```

---

### 2. `POST /api/providers/chat`
Executes a standard non-streaming chat completion.

**Request Body**:
```json
{
  "baseUrl": "https://api.groq.com/openai/v1",
  "apiKey": "gsk_...",
  "model": "llama-3.1-70b-versatile",
  "messages": [
    { "role": "user", "content": "Build a React component" }
  ],
  "temperature": 0.7
}
```

---

### 3. `POST /api/providers/stream`
Executes token-by-token Server-Sent Events (SSE) streaming completion.

---

### 4. `POST /api/providers/health`
Probes endpoint reachability, latency, and status.

**Response**:
```json
{
  "status": "healthy",
  "latencyMs": 42,
  "modelCount": 24,
  "reachable": true
}
```

---

## Security & Encryption Model

- **Client-Side AES-GCM Web Crypto**: API Keys are encrypted locally using a 256-bit AES-GCM master key generated in browser `localStorage`.
- **Zero Log Exposure**: Express middleware sanitizes all log outputs by stripping `Authorization` headers, `apiKey` values, and prompt text.

---

## Adding Future Provider Adapters

To add a new provider adapter (e.g. AWS Bedrock or Vertex AI adapter):
1. Create a class extending `BaseProvider` in `backend/src/providers/`.
2. Implement `validate()`, `getModels()`, `chat()`, `stream()`, and `health()`.
3. Register the adapter in `ProviderGatewayService.getProviderInstance()`.
