const Anthropic = require('@anthropic-ai/sdk');
const config = require('../config');

class AnthropicProvider {
  constructor() {
    this.client = new Anthropic({
      apiKey: config.anthropic.apiKey,
    });
    this.model = 'claude-sonnet-4-20250514';
    this.maxTokens = 4000;
  }

  async generateResponse(prompt, options = {}) {
    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: options.maxTokens || this.maxTokens,
        messages: [{ role: 'user', content: prompt }],
      });

      return {
        content: response.content[0].text,
        usage: {
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
          totalTokens: response.usage.input_tokens + response.usage.output_tokens
        },
        cost: this.calculateCost(response.usage)
      };
    } catch (error) {
      throw new Error(`Anthropic API error: ${error.message}`);
    }
  }

  calculateCost(usage) {
    const inputCostPer1K = 0.003;
    const outputCostPer1K = 0.015;
    
    const inputCost = (usage.input_tokens / 1000) * inputCostPer1K;
    const outputCost = (usage.output_tokens / 1000) * outputCostPer1K;
    
    return {
      inputCost: parseFloat(inputCost.toFixed(6)),
      outputCost: parseFloat(outputCost.toFixed(6)),
      totalCost: parseFloat((inputCost + outputCost).toFixed(6))
    };
  }
}

module.exports = AnthropicProvider;