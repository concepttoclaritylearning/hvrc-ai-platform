import http from "http";

// Reads user API Key from environment or tests with configured key
const API_KEY = process.env.NVIDIA_API_KEY || "nvapi-demo";

// Verification Matrix for 6 Major AI Companies on NVIDIA NIM API
const COMPANY_MODELS = [
  { company: "Meta", model: "meta/llama-3.3-70b-instruct", prompt: "Write 1 line describing Llama 3.3." },
  { company: "NVIDIA", model: "nvidia/llama-3.1-nemotron-70b-instruct", prompt: "Write 1 line describing Nemotron." },
  { company: "Mistral AI", model: "mistralai/mistral-large-2-instruct", prompt: "Write 1 line describing Mistral." },
  { company: "DeepSeek", model: "deepseek-ai/deepseek-r1", prompt: "Write 1 line describing DeepSeek R1." },
  { company: "Google", model: "google/gemma-2-27b-it", prompt: "Write 1 line describing Gemma 2." },
  { company: "Alibaba Qwen", model: "qwen/qwen2.5-72b-instruct", prompt: "Write 1 line describing Qwen 2.5." }
];

async function testModel(item) {
  const startTime = Date.now();
  console.log(`--------------------------------------------------`);
  console.log(`🏢 AI Company: ${item.company}`);
  console.log(`📌 Model ID:   ${item.model}`);

  const payload = JSON.stringify({
    name: "NVIDIA NIM",
    baseUrl: "https://integrate.api.nvidia.com/v1",
    apiKey: API_KEY,
    model: item.model,
    messages: [{ role: "user", content: item.prompt }]
  });

  return new Promise((resolve) => {
    const req = http.request(
      "http://localhost:3001/api/providers/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload)
        }
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          const latency = Date.now() - startTime;
          try {
            const json = JSON.parse(body);
            if (json.choices && json.choices[0]) {
              const text = json.choices[0].message.content;
              console.log(`✅ VERIFIED SUCCESS (HTTP ${res.statusCode}) - Latency: ${latency}ms`);
              console.log(`💬 Output: ${text.slice(0, 120)}...`);
            } else {
              const msg = json.message || body;
              console.log(`ℹ️ STATUS: HTTP ${res.statusCode} - Latency: ${latency}ms`);
              console.log(`📄 Response: ${msg.slice(0, 120)}`);
            }
          } catch (e) {
            console.log(`ℹ️ STATUS: HTTP ${res.statusCode} - ${body.slice(0, 100)}`);
          }
          resolve();
        });
      }
    );

    req.on("error", (err) => {
      console.log(`❌ Network Error: ${err.message}`);
      resolve();
    });

    req.write(payload);
    req.end();
  });
}

async function runAllTests() {
  console.log("\n==================================================");
  console.log("🚀 HVRC.AI Live Multi-Company AI Model Test Matrix");
  console.log("==================================================\n");
  for (const item of COMPANY_MODELS) {
    await testModel(item);
  }
  console.log("\n==================================================");
  console.log("🏁 AI Company Model Verification Matrix Completed!");
  console.log("==================================================\n");
}

runAllTests();
