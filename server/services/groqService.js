const axios = require('axios');
const { GROQ_API_KEY, GROQ_MODEL } = require('../config/env');
const logger = require('../utils/logger');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const PRIMARY_MODEL = GROQ_MODEL || 'openai/gpt-oss-120b';
const FALLBACK_MODEL = 'openai/gpt-oss-20b';

class GroqService {
  constructor() {
    this.apiKey = GROQ_API_KEY;
    this.primaryModel = PRIMARY_MODEL;
    this.fallbackModel = FALLBACK_MODEL;
  }

  isConfigured() {
    return Boolean(this.apiKey && this.apiKey.startsWith('gsk_'));
  }

  /**
   * Internal helper to execute chat completions with model fallback
   */
  async executeChatCompletion(messages, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('Groq API Key is not configured in environment.');
    }

    const {
      temperature = 0.2,
      max_tokens = 1024,
      jsonMode = true,
      model = this.primaryModel
    } = options;

    const payload = {
      model,
      messages,
      temperature,
      max_tokens
    };

    if (jsonMode) {
      payload.response_format = { type: 'json_object' };
    }

    try {
      const response = await axios.post(GROQ_API_URL, payload, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 20000
      });

      const content = response.data?.choices?.[0]?.message?.content?.trim();
      return content;
    } catch (err) {
      // If primary model failed and not already using fallback, try fallback model
      if (model !== this.fallbackModel) {
        logger.warn(`[Groq Primary Model Error]: ${err.message}. Retrying with fallback model ${this.fallbackModel}...`);
        return this.executeChatCompletion(messages, { ...options, model: this.fallbackModel });
      }
      logger.error(`[Groq API Fatal Error]: ${err.response ? JSON.stringify(err.response.data) : err.message}`);
      throw err;
    }
  }

  /**
   * Disinformation & Propaganda Analysis for OSINT Media Feeds
   */
  async analyzeDisinformation(text, sourceUrl = '') {
    if (!this.isConfigured()) return null;

    const messages = [
      {
        role: 'system',
        content: `You are the Lead OSINT Disinformation Intelligence Analyst for PeaceKeeper AI.
Analyze the provided news headline, narrative, and source domain for deliberate disinformation, propaganda, unverified war rumors, psychological warfare, or sensationalized distortion.
Return ONLY valid JSON matching this schema:
{
  "fakeNewsScore": <integer 0 to 100, where 0 is fully verified and 100 is fabricated disinformation>,
  "credibilityRating": <"Verified" | "Questionable" | "High Propaganda Risk" | "Fabricated">,
  "confidenceScore": <integer 0 to 100>,
  "reasoning": <concise 1-2 sentence explanation of why this rating was assigned>,
  "detectedIndicators": [<array of specific keywords, bias traits, or propaganda techniques detected>]
}`
      },
      {
        role: 'user',
        content: `Source Domain / URL: "${sourceUrl || 'Unknown'}"\nNews Content:\n"""${text.substring(0, 2000)}"""`
      }
    ];

    try {
      const rawJson = await this.executeChatCompletion(messages, { jsonMode: true, temperature: 0.1 });
      const parsed = JSON.parse(rawJson);
      return {
        fakeNewsScore: Math.min(100, Math.max(0, parseInt(parsed.fakeNewsScore, 10) || 50)),
        credibilityRating: parsed.credibilityRating || 'Questionable',
        confidenceScore: parsed.confidenceScore || 85,
        reasoning: parsed.reasoning || 'Evaluated via Groq LLM Intelligence Engine.',
        detectedIndicators: Array.isArray(parsed.detectedIndicators) ? parsed.detectedIndicators : []
      };
    } catch (err) {
      logger.warn(`[Groq Disinformation Fallback]: ${err.message}`);
      return null;
    }
  }

  /**
   * Geopolitical Sentiment & Conflict Escalation Tone Analysis (-1.0 to +1.0)
   */
  async analyzeGeopoliticalSentiment(text) {
    if (!this.isConfigured()) return null;

    const messages = [
      {
        role: 'system',
        content: `You are PeaceKeeper AI's Geopolitical Threat Sentiment Analyzer.
Analyze the emotional and strategic tone of the text regarding international armed conflict, escalation, ceasefire, or peace accords.
Return ONLY valid JSON matching this schema:
{
  "sentimentScore": <float between -1.0 and +1.0, where -1.0 represents severe hostility/bloodshed/missile strikes and +1.0 represents peaceful accord/truce/humanitarian de-escalation>,
  "escalationCategory": <"Critical Hostility" | "Elevated Tensions" | "Neutral Observation" | "De-escalation / Truce">,
  "summary": <concise 1-sentence synopsis>
}`
      },
      {
        role: 'user',
        content: `Text for Analysis:\n"""${text.substring(0, 2000)}"""`
      }
    ];

    try {
      const rawJson = await this.executeChatCompletion(messages, { jsonMode: true, temperature: 0.1 });
      const parsed = JSON.parse(rawJson);
      const score = parseFloat(parsed.sentimentScore);
      return {
        sentimentScore: isNaN(score) ? -0.15 : Math.max(-1.0, Math.min(1.0, parseFloat(score.toFixed(2)))),
        escalationCategory: parsed.escalationCategory || 'Neutral Observation',
        summary: parsed.summary || 'Evaluated via Groq Geopolitical Sentiment Model.'
      };
    } catch (err) {
      logger.warn(`[Groq Sentiment Fallback]: ${err.message}`);
      return null;
    }
  }

  /**
   * Tactical Country Intelligence Assessment & UN Peacekeeper Directives
   */
  async synthesizeCountryIntelligenceBrief(countryName, contextData) {
    if (!this.isConfigured()) return null;

    const messages = [
      {
        role: 'system',
        content: `You are the Supreme Tactical Advisor for the UN Peacekeeping Swarm Defense Command.
You receive synthesized multi-source intelligence (ground incident logs, orbital radar SAR detections, OSINT disinformation news feeds, and treaty compliance stats) for a sovereign territory.
Synthesize an authoritative, professional, high-level defense brief with actionable operational directives.
Return ONLY valid JSON matching this schema:
{
  "strategicAssessment": <string 2-3 sentences providing an executive summary of current theater dynamics>,
  "threatTrajectory": <"Rapidly Escalating" | "Elevated & Volatile" | "Static / Frozen Conflict" | "De-escalating / Stabilizing">,
  "peacekeeperDirective": <string stating concrete operational deployment rules, demilitarized buffer enforcement, or diplomatic intervention>,
  "keyVulnerabilities": [<array of 2-3 strategic vulnerabilities or conflict flashpoints>]
}`
      },
      {
        role: 'user',
        content: `Country: ${countryName}
Operational Status: ${contextData.activeConflictStatus}
Risk Index: ${contextData.riskPercentage}% (${contextData.riskLevel})
Ground Incident Reports Count: ${contextData.reportsCount}
Orbital Radar Asset Detections Count: ${contextData.satellitesCount}
OSINT Media Feeds Count: ${contextData.newsCount}
Treaties Tracked: ${contextData.treaties?.map(t => `${t.name} (${t.status}, ${t.violationCount} violations)`).join('; ') || 'Standard Accords'}
Recent Report Highlights: ${contextData.reports?.slice(0, 3).map(r => `[${r.conflictType}] ${r.description}`).join(' | ') || 'None'}`
      }
    ];

    try {
      const rawJson = await this.executeChatCompletion(messages, { jsonMode: true, temperature: 0.2 });
      const parsed = JSON.parse(rawJson);
      return parsed;
    } catch (err) {
      logger.warn(`[Groq Country Brief Fallback]: ${err.message}`);
      return null;
    }
  }

  /**
   * Direct Strategic Query / Freeform Intelligence Prompt
   */
  async runIntelligencePrompt(prompt, context = '') {
    if (!this.isConfigured()) {
      throw new Error('Groq API Key is not configured in environment.');
    }

    const messages = [
      {
        role: 'system',
        content: 'You are the PeaceKeeper AI Autonomous Command Engine. Provide concise, expert defense intelligence insights, strategic treaty verification counsel, and threat mitigation tactics.'
      }
    ];

    if (context) {
      messages.push({ role: 'system', content: `Current Operational Context:\n${context}` });
    }

    messages.push({ role: 'user', content: prompt });

    return this.executeChatCompletion(messages, { jsonMode: false, temperature: 0.3 });
  }
}

module.exports = new GroqService();
