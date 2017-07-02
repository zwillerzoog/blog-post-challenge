const express = require('express');
// const router = express.Router();
// const morgan = require('morgan');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');
const app = express();

BlogPosts.create('Travels in India', 'Once upon a time I went to India and I had a very good time. The End.', 'James Madison', '1867');
BlogPosts.create('Todd is a Dog', 'I always wanted a dog so when I grew up, I got one. His name is Todd. He is a dog.', 'Me, Heidi!', 'July 2017');

app.get('/blogposts', (req, res) => {
  res.json(BlogPosts.get());
//   const query = res.json({
//     "title": req.title,
//     "content": req.content,
//     "publishDate": req.publishDate
//   });
//  console.log();
});

app.post('/blogposts', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author', 'publishDate'];
  for (let i=0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing ${field} in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
  console.log(item);
  res.status(201).json(item);
});


app.delete('/blogposts/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog post ${req.params.id}`);
  res.status(204).end();
});

app.put('/blogposts/:id', jsonParser, (req, res) => {
  const requiredFields = ['id', 'title', 'content', 'author', 'publishDate'];
  for (let i=0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing ${field} in request body`;
      console.error(message);
      return res.status(400).send(message);  
    }
  }
  if (req.params.id !== req.body.id) {
    const message = `Request path ID ${req.params.id} and request body ID ${req.body.id} must match.`
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog post ${req.params.id}`);
  BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    npmpublishDate: req.body.publishDate
  });
  res.status(204).end();
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});

