const AnthropicProvider = require('../providers/anthropic');
const ContextManager = require('../context/manager');

class AgentOrchestrator {
  constructor() {
    this.provider = new AnthropicProvider();
    this.contextManager = new ContextManager();
    this.usageStats = new Map();
  }

  async executeTask(userId, taskType, prompt, options = {}) {
    const { includeContext = true, maxTokens = 1000 } = options;
    
    this.validateTaskType(taskType);
    
    let fullPrompt = '';
    
    if (includeContext) {
      const contextData = this.contextManager.formatContextForPrompt(userId);
      if (contextData) {
        fullPrompt = `${contextData}\n=== Task ===\nTask Type: ${taskType}\nPrompt: ${prompt}`;
      } else {
        fullPrompt = `Task Type: ${taskType}\nPrompt: ${prompt}`;
      }
    } else {
      fullPrompt = `Task Type: ${taskType}\nPrompt: ${prompt}`;
    }

    const taskPrompt = this.enhancePromptForTaskType(taskType, fullPrompt);
    
    try {
      const response = await this.provider.generateResponse(taskPrompt, { maxTokens });
      
      this.updateUsageStats(userId, response.usage, response.cost);
      
      return {
        success: true,
        response: response.content,
        usage: response.usage,
        cost: response.cost,
        taskType,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        taskType,
        timestamp: new Date()
      };
    }
  }

  enhancePromptForTaskType(taskType, prompt) {
    const taskEnhancements = {
      analysis: 'You are an expert analyst. Analyze the following information thoroughly and provide detailed insights:',
      writing: 'You are a skilled writer. Create well-structured, engaging content based on the following:',
      research: 'You are a research assistant. Provide comprehensive research findings and recommendations based on:'
    };

    const enhancement = taskEnhancements[taskType] || 'Please respond to the following:';
    return `${enhancement}\n\n${prompt}`;
  }

  validateTaskType(taskType) {
    const validTypes = ['analysis', 'writing', 'research'];
    if (!validTypes.includes(taskType)) {
      throw new Error(`Invalid task type: ${taskType}. Valid types are: ${validTypes.join(', ')}`);
    }
  }

  updateUsageStats(userId, usage, cost) {
    if (!this.usageStats.has(userId)) {
      this.usageStats.set(userId, {
        totalRequests: 0,
        totalTokens: 0,
        totalCost: 0,
        requestHistory: []
      });
    }

    const userStats = this.usageStats.get(userId);
    userStats.totalRequests += 1;
    userStats.totalTokens += usage.totalTokens;
    userStats.totalCost += cost.totalCost;
    userStats.requestHistory.push({
      timestamp: new Date(),
      tokens: usage.totalTokens,
      cost: cost.totalCost
    });

    if (userStats.requestHistory.length > 100) {
      userStats.requestHistory = userStats.requestHistory.slice(-100);
    }
  }

  getUserStats(userId) {
    return this.usageStats.get(userId) || {
      totalRequests: 0,
      totalTokens: 0,
      totalCost: 0,
      requestHistory: []
    };
  }

  storeContext(userId, contextData) {
    return this.contextManager.storeContext(userId, contextData);
  }

  getContext(userId) {
    return this.contextManager.getContext(userId);
  }
}

module.exports = AgentOrchestrator;