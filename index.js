import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import fs from 'fs/promises';


const app = express();
const port = 3000;

// Simulating a database with an in-memory array
let posts = [];

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images'); // Make sure this directory exists
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Append the date to the original filename
    }
});

const upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set('view engine', 'ejs');
app.set('views', './views');

// Modify this route to pass the posts to the blog.ejs template
app.get("/", (req, res) => {
    res.render("blog", { posts }); // Pass the posts variable to the blog.ejs template
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/contact", (req, res) => {
    res.render("contact");
});

app.get("/post", (req, res) => {
    res.render("post");
});

app.get("/delete", (req, res) => {
    res.render("delete");
});

app.post('/create-post', upload.single('image'), (req, res) => {
    const { title, content, passcode } = req.body;
    
    if (passcode === "ILoveCoding") {
      // The image path should be relative to the 'public' directory
      const imagePath = `/images/${req.file.filename}`;
  
      // Create a new post object
      const newPost = {
        id: posts.length + 1, // Simple incrementing ID for example purposes
        title,
        content,
        imagePath,
        lastUpdated: new Date()
      };

      // Add the new post to the array
      posts.push(newPost);
  
      // Redirect to the blog page to see the new post
      res.redirect('/');
    } else {
      // Inform the user of an incorrect passcode
      res.send('Incorrect passcode.');
    }
});

// Delete post route
app.post('/delete-post/:id', async (req, res) => {
    const { passcode } = req.body;
    const { id } = req.params; // Get the ID from the URL

    if (passcode === "ILoveCoding") {
        // Find the index of the post with the given ID
        const postIndex = posts.findIndex(post => post.id == id);

        if (postIndex > -1) {
            // Remove the post from the array
            posts.splice(postIndex, 1);
            // Optionally delete the image file associated with the post
            // await fs.unlink(path.join(__dirname, 'public', posts[postIndex].imagePath));
        }

        // Redirect to the blog page
        res.redirect('/');
    } else {
        // Inform the user of an incorrect passcode
        res.send('Incorrect passcode.');
    }
});



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
