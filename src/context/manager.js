class ContextManager {
  constructor() {
    this.userContexts = new Map();
    this.maxContextLength = 8000;
  }

  storeContext(userId, contextData) {
    if (!this.userContexts.has(userId)) {
      this.userContexts.set(userId, {
        qa: [],
        documents: [],
        createdAt: new Date()
      });
    }

    const userContext = this.userContexts.get(userId);
    
    if (contextData.type === 'qa') {
      userContext.qa.push({
        id: Date.now().toString(),
        question: contextData.data.question,
        answer: contextData.data.answer,
        timestamp: new Date()
      });
    } else if (contextData.type === 'document') {
      userContext.documents.push({
        id: Date.now().toString(),
        title: contextData.data.title,
        content: contextData.data.content,
        timestamp: new Date()
      });
    }

    return { success: true, contextId: Date.now().toString() };
  }

  getContext(userId) {
    return this.userContexts.get(userId) || { qa: [], documents: [] };
  }

  formatContextForPrompt(userId) {
    const context = this.getContext(userId);
    let formattedContext = '';

    if (context.qa.length > 0) {
      formattedContext += '=== Q&A Context ===\n';
      context.qa.forEach(item => {
        formattedContext += `Q: ${item.question}\nA: ${item.answer}\n\n`;
      });
    }

    if (context.documents.length > 0) {
      formattedContext += '=== Document Context ===\n';
      context.documents.forEach(doc => {
        formattedContext += `Title: ${doc.title}\nContent: ${doc.content}\n\n`;
      });
    }

    return this.truncateContext(formattedContext);
  }

  truncateContext(context) {
    if (context.length <= this.maxContextLength) {
      return context;
    }

    const truncated = context.substring(0, this.maxContextLength);
    const lastNewline = truncated.lastIndexOf('\n');
    
    return lastNewline > 0 ? truncated.substring(0, lastNewline) + '\n[Context truncated...]' : truncated;
  }

  getAllUsers() {
    return Array.from(this.userContexts.keys());
  }

  clearContext(userId) {
    this.userContexts.delete(userId);
    return { success: true };
  }
}

module.exports = ContextManager;