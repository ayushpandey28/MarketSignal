function getGeminiModels() {
  return [
    process.env.GEMINI_MODEL_1,
    process.env.GEMINI_MODEL_2,
    process.env.GEMINI_MODEL_3,
  ].filter(Boolean);
}

function getGeminiConfig() {
  return {
    apiKey: process.env.GEMINI_API_KEY || '',
    models: getGeminiModels(),
  };
}

function isGeminiConfigured() {
  return Boolean(process.env.GEMINI_API_KEY);
}

module.exports = { getGeminiConfig, getGeminiModels, isGeminiConfigured };
