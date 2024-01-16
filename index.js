import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

////////////////////////////

const app = express();
const port = 3000;

////////////////////////////

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

////////////////////////////

let posts = JSON.parse(fs.readFileSync("posts.json", "utf8"));

////////////////////////////

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.get("/research", (req, res) => {
  res.render("research.ejs");
});

app.get("/blog", (req, res) => {
  res.render("blog.ejs", {data: posts});
});

app.post("/blog", (req, res) => {
  let post = {
    "author" : req.body["author"],
    "published" : new Date().toDateString(),
    "title" : req.body["title"],
    "body" : [req.body["body"]]
  }
  posts.unshift(post);
  fs.writeFile("posts.json", JSON.stringify(posts), err => {
    if (err) {
        console.error(err);
        return res.sendStatus(500);
    }
    res.redirect("/blog");
  });
});

app.post("/delete-post", (req, res) => {
  const postId = req.body.postId;
  posts = posts.filter((post, index) => index != postId);
  fs.writeFile("posts.json", JSON.stringify(posts), err => {
      if (err) {
          console.error(err);
          return res.sendStatus(500);
      }
      res.redirect("/blog");
  });
});

app.get("/edit-post/:id", (req, res) => {
  const postId = req.params.id;
  const post = posts[postId];
  if (post) {
    res.render("edit-post.ejs", { post: post, postId: postId });
  } else {
    res.status(404).send("Post not found");
  }
});

app.post("/update-post/:id", (req, res) => {
  const postId = req.params.id;
  const updatedPost = {
    author: req.body.author,
    title: req.body.title,
    body: req.body.body.split('\n'), // Assuming body is submitted as text with newlines
    published: posts[postId].published // Keep original publish date
  };

  posts[postId] = updatedPost;
  fs.writeFile("posts.json", JSON.stringify(posts), err => {
      if (err) {
          console.error(err);
          return res.sendStatus(500);
      }
      res.redirect("/blog");
  });
});


app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

////////////////////////////

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

////////////////////////////