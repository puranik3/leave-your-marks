const mongoose = require( 'mongoose' );

const StorySchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    title: {
        type: String,
        unique: true
    },
    imageUrl: String,
    summary: String,
    body: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    slug: String,
    comments: [
        {
            body: {
                type: String,
                required: true
            },
            createdDate: {
                type: Date,
                default: Date.now
            },
            author: {
                type: String,
                required: true
            }
        }
    ]
});

const Story = mongoose.model( 'Story', StorySchema );

module.exports = {
    StorySchema,
    Story
};