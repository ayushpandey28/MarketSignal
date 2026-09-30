const crypto = require('crypto');
const { GoogleGenAI } = require('@google/genai');
const { getGeminiConfig, isGeminiConfigured } = require('../config/gemini');
const AIReport = require('../models/AIReport');

function getSafeErrorMessage(message, apiKey) {
  if (!message) return 'Gemini request failed.';
  if (!apiKey) return String(message);
  const escapedKey = apiKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return String(message).replace(new RegExp(escapedKey, 'gi'), '[redacted]');
}

function isAuthError(message) {
  return /api key|authentication|invalid api|invalid key|unauthorized|forbidden/i.test(message);
}

function shouldTryNextModel(message) {
  return /429|rate limit|quota|timeout|timed out|service unavailable|internal error|503|model.*(unavailable|not found|access)|overloaded|temporar/i.test(message);
}

function hashPayload(payload) {
  return crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}

function fallbackTrend(data) {
  return {
    trendSummary: `${data.productName} currently shows a ${data.trend} trend based on platform demand signals, not predicted sales.`,
    mainDemandSignals: [
      `Demand score ${data.demandScore} with ${data.growthPercent}% period growth.`,
      `Observed counts — search ${data.counts.search}, view ${data.counts.view}, wishlist ${data.counts.wishlist}, price alerts ${data.counts.price_alert}, interest ${data.counts.interest}.`,
    ],
    regionalObservations: data.regions?.length
      ? data.regions.map((r) => `${r.region}: score ${r.currentScore}, growth ${r.growthPercent}%`)
      : ['Regional splits are limited in the current sample.'],
    competitionObservation: `Listed competition level is ${data.competition}. Competition is a catalog label, not a market forecast.`,
    risks: [
      'Observed signals can reverse quickly.',
      'Demand on this platform does not guarantee future sales.',
    ],
    areasWorthInvestigating: [
      'Compare inventory against rising interest, not just current score.',
      'Review price-alert volume before changing list price.',
    ],
    disclaimer:
      'This is an explanation of observed MarketSignal data. It is not a sales prediction.',
  };
}

function fallbackMarket(data) {
  return {
    marketSummary:
      'Sample platform demand is concentrated in a few rising catalog items. Treat this as internal signal intelligence, not guaranteed demand.',
    topRisingProducts: (data.topRising || []).slice(0, 5).map((p) => ({
      name: p.name,
      growthPercent: p.growthPercent,
      demandScore: p.demandScore,
    })),
    strongestRegions: data.regions || [],
    demandChanges: 'Period-over-period growth is computed from weighted consumer signals on this platform.',
    competitionObservations: 'High-competition items can still attract interest; they are not automatic wins.',
    risks: ['Synthetic/demo catalogs can overstate niche spikes.', 'Signals are platform-specific.'],
    opportunitiesToInvestigate: (data.opportunities || []).slice(0, 5).map((o) => o.insight || o.name),
    disclaimer: 'AI output interprets backend metrics. It does not forecast sales.',
  };
}

function fallbackChat(structured) {
  return {
    answer: structured.summary,
    keyPoints: (structured.items || []).slice(0, 5).map((item) =>
      `${item.productName || item.product?.name}: demand ${item.demandScore}, growth ${item.growthPercent}%, ${item.insight}`
    ),
    disclaimer: 'Based only on available MarketSignal platform data, which may include synthetic demo records. Not live external market data.',
  };
}

function extractTextFromResponse(response) {
  if (!response) return '';

  if (typeof response.text === 'string' && response.text.trim()) {
    return response.text;
  }

  if (Array.isArray(response.candidates)) {
    return response.candidates
      .map((candidate) => {
        const parts = candidate?.content?.parts || [];
        return parts
          .filter((part) => typeof part?.text === 'string')
          .map((part) => part.text)
          .join('');
      })
      .join('\n');
  }

  return '';
}

async function callGemini(messages) {
  const { apiKey, models } = getGeminiConfig();

  if (!isGeminiConfigured() || !apiKey) {
    const error = new Error('Gemini API key is missing or invalid. Set GEMINI_API_KEY in backend/.env to enable AI analysis.');
    error.statusCode = 503;
    throw error;
  }

  const configuredModels = models.length ? models : ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-3.5-flash-lite'];
  const client = new GoogleGenAI({ apiKey });
  const systemInstruction = messages
    .filter((message) => message.role === 'system')
    .map((message) => (Array.isArray(message.parts) ? message.parts.map((part) => part.text || '').join('\n') : ''))
    .join('\n')
    .trim();
  const contentMessages = messages.filter((message) => message.role !== 'system');

  let lastError = null;

  for (const model of configuredModels) {
    console.log(`[Gemini] Trying model: ${model}`);

    try {
      const response = await client.models.generateContent({
        model,
        contents: contentMessages,
        config: {
          temperature: 0.3,
          ...(systemInstruction ? { systemInstruction } : {}),
        },
      });

      const text = extractTextFromResponse(response);
      if (!text) {
        throw new Error('Gemini returned an empty response.');
      }

      console.log(`[Gemini] Request successful using ${model}`);
      return text;
    } catch (cause) {
      const message = getSafeErrorMessage(cause?.message || 'Gemini request failed.', apiKey);
      lastError = cause || new Error(message);

      console.error('[Gemini] Model failed:', {
        model,
        status: cause?.status || 502,
        code: cause?.code || null,
        message,
      });

      if (isAuthError(message)) {
        const error = new Error('Gemini API key is missing or invalid.');
        error.statusCode = 401;
        throw error;
      }

      if (shouldTryNextModel(message)) {
        console.log(`[Gemini] Trying fallback model: ${configuredModels[configuredModels.indexOf(model) + 1] || 'none'}`);
        continue;
      }

      console.log(`[Gemini] Trying fallback model: ${configuredModels[configuredModels.indexOf(model) + 1] || 'none'}`);
      continue;
    }
  }

  const finalMessage = lastError
    ? `Gemini request failed across all configured models. ${getSafeErrorMessage(lastError.message || 'All Gemini models failed.', apiKey)}`
    : 'Gemini request failed across all configured models.';

  const error = new Error(finalMessage);
  error.statusCode = 502;
  throw error;
}

function parseJsonContent(text, fallback) {
  if (!text) return fallback;
  try {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) return fallback;
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return fallback;
  }
}

async function explainTrend(data, meta) {
  const promptHash = hashPayload({ type: 'trend', productId: meta.productId, data });
  const cached = await AIReport.findOne({ type: 'trend', productId: meta.productId, promptHash });
  if (cached) return cached.content;

  const fallback = fallbackTrend(data);
  const raw = await callGemini([
    {
      role: 'system',
      parts: [{ text: 'You analyze consumer demand signals. Return JSON only. Never claim that demand guarantees sales. Distinguish observed signals from predictions.' }],
    },
    {
      role: 'user',
      parts: [{
        text: `Explain this product trend using only the provided metrics:\n${JSON.stringify(data)}\nReturn JSON with keys: trendSummary, mainDemandSignals, regionalObservations, competitionObservation, risks, areasWorthInvestigating, disclaimer.`,
      }],
    },
  ]);

  const content = parseJsonContent(raw, fallback);
  await AIReport.create({
    type: 'trend',
    productId: meta.productId,
    userId: meta.userId,
    promptHash,
    inputSnapshot: data,
    content,
  });
  return content;
}

async function generateMarketReport(data, meta) {
  const promptHash = hashPayload({ type: 'market', promptVersion: 2, sellerId: meta.sellerId, data });
  const cached = await AIReport.findOne({
    type: 'market',
    sellerId: meta.sellerId || null,
    promptHash,
  }).sort({ createdAt: -1 });
  if (cached && Date.now() - cached.createdAt.getTime() < 6 * 60 * 60 * 1000) {
    return cached.content;
  }

  const fallback = fallbackMarket(data);
  const raw = await callGemini([
    {
      role: 'system',
      parts: [{ text: 'Write concise insights using only the provided MarketSignal platform records. Treat catalog and signal data as possibly synthetic demo data; do not make real-world market claims. JSON only. Do not guarantee sales.' }],
    },
    {
      role: 'user',
      parts: [{
        text: `Write a market report from:\n${JSON.stringify(data)}\nReturn JSON with keys: marketSummary, topRisingProducts, strongestRegions, demandChanges, competitionObservations, risks, opportunitiesToInvestigate, disclaimer.`,
      }],
    },
  ]);

  const content = parseJsonContent(raw, fallback);
  await AIReport.create({
    type: 'market',
    sellerId: meta.sellerId,
    userId: meta.userId,
    promptHash,
    inputSnapshot: data,
    content,
  });
  return content;
}

async function chatAboutMarket(question, structured, meta) {
  const fallback = fallbackChat(structured);
  const raw = await callGemini([
    {
      role: 'system',
      parts: [{ text: 'Answer using only the provided MarketSignal records. They may be synthetic demo data, so do not claim real-world market facts. JSON only with keys answer, keyPoints (array), and disclaimer. No sales guarantees.' }],
    },
    {
      role: 'user',
      parts: [{ text: `Question: ${question}\nData: ${JSON.stringify(structured)}` }],
    },
  ]);
  const content = parseJsonContent(raw, fallback);
  await AIReport.create({
    type: 'chat',
    userId: meta.userId,
    sellerId: meta.sellerId,
    promptHash: hashPayload({ question, structured }),
    inputSnapshot: { question, structured },
    content,
  });
  return content;
}

module.exports = { explainTrend, generateMarketReport, chatAboutMarket, isGeminiConfigured };
