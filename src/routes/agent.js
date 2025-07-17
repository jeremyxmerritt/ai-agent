const express = require('express');
const router = express.Router();
const AgentOrchestrator = require('../agents/orchestrator');
const { contextSchema, taskSchema, userIdSchema } = require('../utils/validation');

const agent = new AgentOrchestrator();

router.post('/context', async (req, res) => {
  try {
    const { error, value } = contextSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false, 
        error: error.details[0].message 
      });
    }

    const result = agent.storeContext(value.userId, {
      type: value.type,
      data: value.data
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

router.post('/task', async (req, res) => {
  try {
    const { error, value } = taskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false, 
        error: error.details[0].message 
      });
    }

    const result = await agent.executeTask(
      value.userId,
      value.taskType,
      value.prompt,
      value.options
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message || 'Internal server error' 
    });
  }
});

router.get('/context/:userId', (req, res) => {
  try {
    const { error, value } = userIdSchema.validate({ userId: req.params.userId });
    if (error) {
      return res.status(400).json({ 
        success: false, 
        error: error.details[0].message 
      });
    }

    const context = agent.getContext(value.userId);
    res.json({ 
      success: true, 
      context 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

router.get('/usage/:userId', (req, res) => {
  try {
    const { error, value } = userIdSchema.validate({ userId: req.params.userId });
    if (error) {
      return res.status(400).json({ 
        success: false, 
        error: error.details[0].message 
      });
    }

    const stats = agent.getUserStats(value.userId);
    res.json({ 
      success: true, 
      usage: stats 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

module.exports = router;