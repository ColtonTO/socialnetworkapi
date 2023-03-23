const { Schema, model, Types } = require('mongoose')
const date = require('../utils/date')

const ReactionSchema = new Schema(
    {
      reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
      },
      reactionBody: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 280,
      },
      username: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => date(createdAtVal),
      },
    },
    {
      toJSON: {
        getters: true,
      },
    }
  );
  
  const ThoughtSchema = new Schema(
    {
      thoughtText: {
        type: String,
        required: true,
        maxLength: 280,
      },
      username: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => date(createdAtVal),
      },
      reactions: [ReactionSchema], 
    },
    {
      toJSON: {
        virtuals: true,
        getters: true,
      },
    }
  );

ThoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
  });

const Thoughts = model('Thought', ThoughtSchema)

module.exports = Thoughts;
