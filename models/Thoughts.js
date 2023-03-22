const { Schema, model } = require('mongoose')
const date = require('../utils/date')

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            max_length: 280,
        },
        createdAt: {

        }
    }
)