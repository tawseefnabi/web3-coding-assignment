const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ArticleSchema = new Schema({
    user_id: {
        type: String,
        required: [true, 'User ID field is required'],
    },
    article_id: {
        type: String,
        required: [true, 'Article ID field is required'],
        unique: true
    },
    title: {
        type: String,
        required: [true, 'Title field is required']
    },
    content: {
      type: String
  },
    visibility: {
        type: String,
        enum: ['public', 'private', 'logged_in'],
        default: 'public'
    }

},
{
  timestamps: true
}
);


const Article = mongoose.model('article',ArticleSchema);

module.exports = Article;
