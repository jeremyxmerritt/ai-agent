const Joi = require('joi');

const contextSchema = Joi.object({
  userId: Joi.string().required(),
  type: Joi.string().valid('qa', 'document').required(),
  data: Joi.when('type', {
    is: 'qa',
    then: Joi.object({
      question: Joi.string().required(),
      answer: Joi.string().required()
    }).required(),
    otherwise: Joi.object({
      title: Joi.string().required(),
      content: Joi.string().required()
    }).required()
  })
});

const taskSchema = Joi.object({
  userId: Joi.string().required(),
  taskType: Joi.string().valid('analysis', 'writing', 'research').required(),
  prompt: Joi.string().required(),
  options: Joi.object({
    includeContext: Joi.boolean().default(true),
    maxTokens: Joi.number().min(1).max(4000).default(1000)
  }).default({})
});

const userIdSchema = Joi.object({
  userId: Joi.string().required()
});

module.exports = {
  contextSchema,
  taskSchema,
  userIdSchema
};