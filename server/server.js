const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const https = require('https');
const app = express();
const jwt = require('jsonwebtoken');
app.use(express.static("client/public"))
const users = require("./users.json");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
const cryptoJS = require('crypto-js');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
const cors = require('cors');
app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
const KEY = "ASECRET";
const SECRET_KEY = "TOKEN_SECRET_AUTH";



/****************************************************
 *                                                  *
 *                     USER API                     *
 *                                                  *
 ****************************************************/

app.get("*", (req,res,next) => {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, SECRET_KEY, (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                res.cookie('token',"", {maxAge: 1});
                next();
            } else {
                const user = users.find(user => user.id === decodedToken.userId);
                res.locals.user = user;
                next(); 
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
});

app.get("/jwtid", (req,res,next) => {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, SECRET_KEY, (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.send(200).json('no token')
            } else {
                console.log(decodedToken.userId);
                //next();
                res.status(200).send(res.locals.user.id)

                //res.status(200).send(res.locals.user.id);
            }
        });
    } else {
        console.log("No token");
        res.status(200).send(false);
    }
});

app.post("/register", (req, res) => {
    const { firstName, lastName, email, pseudo, password } = req.body;
    console.log(firstName, lastName, email, pseudo, password);

    const encrypted_password = cryptoJS.AES.encrypt(password, KEY).toString();

    const existingEmail = users.find(user => user.email === email);
    const existingPseudo = users.find(user => user.pseudo === pseudo);

    if (existingEmail && existingPseudo) {
        return res.status(400).send("User already exists.");
    }
    if (existingEmail) {
        return res.status(400).send("Email already taken.");
    }
    if (existingPseudo) {
        return res.status(400).send("Pseudo already taken.")
    }

    const user = {
        "id": uuidv4(),
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "pseudo": pseudo,
        "password": encrypted_password,
        "followers": [],
        "following": [],
        "avatar": "",
        "last_login": null
    }

    users.push(user);
    fs.writeFile("users.json", JSON.stringify(users), err => {
        if (err) throw err;
        console.log("Done writing");

        const sanitizedUser = { ...user };
        delete sanitizedUser.password;
        res.send(sanitizedUser);
    });

});

app.get("/check-pseudo/:pseudo", (req, res) => {
    const { pseudo } = req.params;
    const existingPseudo = users.some(user => user.pseudo === pseudo);
    res.json({ exists: existingPseudo });
});

app.get("/check-email/:email", (req, res) => {
    const { email } = req.params;
    const existingEmail = users.some(user => user.email === email);
    res.json({ exists: existingEmail });
});

function followUser(followerId, userId) {
    const follower = users.find(user => user.id === followerId);
    const userToFollow = users.find(user => user.id === userId);

    if (!follower || !userToFollow) {
        return false; // User not found
    }

    if (follower.following.includes(userId) || userToFollow.followers.includes(followerId)) {
        return false; // Already following
    }

    follower.following.push(userId);
    userToFollow.followers.push(followerId);
    return true;
}
app.patch("/api/follow/:followerId/:userId", (req, res) => {
    const { followerId, userId } = req.params;


    if (!followerId || !userId) {
        return res.status(400).send("Missing followerId or userId.");
    }

    if (followerId == userId) {
        return res.status(400).send("You cannot follow yourself.");
    }

    const isFollowed = followUser(followerId, userId);

    if (isFollowed) {
        fs.writeFile("users.json", JSON.stringify(users), err => {
            if (err) throw err;
            console.log("Done writing");
            res.send("User followed successfully.");
        });
    } else {
        res.status(400).send("Unable to follow user.");
    }
});

function unfollowUser(followerId, userId) {
    const follower = users.find(user => user.id === followerId);
    const userToUnfollow = users.find(user => user.id === userId);

    if (!follower || !userToUnfollow) {
        return false; // User not found
    }

    const followerIndex = follower.following.indexOf(userId);
    const userToUnfollowIndex = userToUnfollow.followers.indexOf(followerId);

    if (followerIndex === -1 || userToUnfollowIndex === -1) {
        return false; // Not following
    }

    follower.following.splice(followerIndex, 1);
    userToUnfollow.followers.splice(userToUnfollowIndex, 1);
    return true;
}

app.patch("/api/unfollow/:followerId/:userId", (req, res) => {
    const { followerId, userId } = req.params;

    if (!followerId || !userId) {
        return res.status(400).send("Missing followerId or userId.");
    }

    const isUnfollowed = unfollowUser(followerId, userId);

    if (isUnfollowed) {
        fs.writeFile("users.json", JSON.stringify(users), err => {
            if (err) throw err;
            console.log("Done writing");
            res.send("User unfollowed successfully.");
        });
    } else {
        res.status(400).send("Unable to unfollow user.");
    }
});


function deleteUser(userId) {
    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
        return false; // User not found
    }

    // Remove the deleted user from the "followers" list of other users
    users.forEach(user => {
        const followerIndex = user.following.indexOf(userId);
        if (followerIndex !== -1) {
            user.following.splice(followerIndex, 1);
        }
    });

    users.splice(userIndex, 1);
    return true;
}

app.delete("/api/delete/:userId", (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).send("Missing userId.");
    }

    const isDeleted = deleteUser(userId);

    if (isDeleted) {
        fs.writeFile("users.json", JSON.stringify(users), err => {
            if (err) throw err;
            console.log("Done writing");
            res.send("User deleted successfully.");
        });
    } else {
        res.status(400).send("Unable to delete user.");
    }
});


app.post("/api/user/login", (req, res) => {
    console.log("Came in");
    const { pseudo, password, rememberMe } = req.body;

    const user = users.find(user => user.pseudo === pseudo);

    if (!user) {
        return res.status(401).send("Invalid credentials.");
    }

    const decryptedPassword = cryptoJS.AES.decrypt(user.password, KEY).toString(cryptoJS.enc.Utf8);
    if (decryptedPassword !== password) {
        return res.status(401).send("Invalid credentials.");
    }

    const tokenExpiration = (rememberMe === "true") ? "10d" : "30m";

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: tokenExpiration });

    user.last_login = new Date().toISOString();

    // Save the updated user data to the JSON file
    const usersWithoutUpdatedUser = users.filter(u => u.id !== user.id);
    const updatedUsers = [...usersWithoutUpdatedUser, user];

    fs.writeFile("users.json", JSON.stringify(updatedUsers, null, 2), err => {
    if (err) {
        console.error("Error writing to user.json:", err);
        return res.status(500).send("Internal Server Error");
    }
    });
  


    const cookieOptions = {
        httpOnly: true,
        //secure: false, // Use 'false' if not using HTTPS in development
        maxAge: (rememberMe === "true") ? 10 * 24 * 60 * 60 * 1000 : 30 * 60 * 1000, // 10 days or 30 minutes

    };
    res.cookie("token", token, cookieOptions);
    res.status(200).json({ message: "Login successful.", user: user.id});
});


app.get("/api/user/logout", (req,res) => {
    const { pseudo, password } = req.body;
    res.cookie("token","",{maxAge: 1});
    res.status(200).json({ message: "Logout successful." });
})

app.get("/api/user/:userId", (req, res) => {
    const { userId } = req.params;
    const user = users.find(user => user.id === userId);
    
    if (user) {
        res.status(200).json({ user });
    } else {
        res.status(404).json({ message: "User not found." });
    }
});

app.get('/users', (req, res) => {
    res.json(users);
});


/****************************************************
 *                                                  *
 *                     POSTS API                    *
 *                                                  *
 ****************************************************/

app.post('/api/post/createpost', (req, res) => {
    const { description, username_id, images } = req.body;
  
    const newPost = {
      post_id: uuidv4(), // Generating a unique ID using 'uuid'
      username_id: username_id,
      likes: [],
      description: description,
      comments: [],
      time_of_creation: new Date().toISOString(),
      images: images || [], // Including the images array from request body; default to an empty array
      hidden: "False"
    };
  
    // Read current posts from the JSON file
    const rawData = fs.readFileSync('./post.json');
    const db = JSON.parse(rawData);
    db.posts.push(newPost);
  
    // Write the updated posts back to the JSON file
    fs.writeFileSync('./post.json', JSON.stringify(db, null, 2));
  
    res.json({ message: "Post created successfully!", post: newPost });
});

app.post('/api/post/createcomment', (req, res) => {
    const { post_id, username_id, description } = req.body;

    const newComment = {
        comment_id: uuidv4(),
        username_id: username_id,
        likes: [],
        description: description,
        comments: [],
        time_of_creation: new Date().toISOString(),
        hidden: "False"
    };

    // Load current posts from the JSON file
    let rawData;
    let db;
    try {
        rawData = fs.readFileSync('./post.json');
        db = JSON.parse(rawData);
    } catch (error) {
        return res.status(500).json({ message: "Error reading posts data", error: error.message });
    }

    // Find the post by its ID
    const postIndex = db.posts.findIndex(post => post.post_id === post_id);

    if (postIndex === -1) {
        return res.status(404).json({ message: "Post not found" });
    }

    // Add the new comment to the post's comments array
    db.posts[postIndex].comments.push(newComment);

    // Save the updated posts back to the JSON file
    try {
        fs.writeFileSync('./post.json', JSON.stringify(db, null, 2));
    } catch (error) {
        return res.status(500).json({ message: "Error writing to posts data", error: error.message });
    }

    res.json({ message: "Comment added successfully!", comment: newComment });
});

app.delete('/api/post/deletepost', (req, res) => {
    const { post_id } = req.body;
    console.log(req.query);
    console.log(post_id);

    // Read current posts from the JSON file
    let rawData;
    let db;
    try {
        rawData = fs.readFileSync('./post.json');
        db = JSON.parse(rawData);
    } catch (error) {
        return res.status(500).json({ message: "Error reading posts data", error: error.message });
    }

    // Check if the posts property exists on the db object
    if (!db.posts) {
        return res.status(404).json({ message: "Post not found 1" });
    }
    console.log(db.posts);
    // Find the index of the post with the given post_id
    const postIndex = db.posts.findIndex(post => post.post_id === post_id );

    // If the post isn't found, return an error
    if (postIndex === -1) {
        return res.status(404).json({ message: "Post not found 2" });
    }

    // Remove the post from the posts array
    const deletedPost = db.posts.splice(postIndex, 1);

    // Write the updated posts back to the JSON file
    try {
        fs.writeFileSync('./post.json', JSON.stringify(db, null, 2));
    } catch (error) {
        return res.status(500).json({ message: "Error writing to posts data", error: error.message });
    }

    res.json({ message: "Post deleted successfully!", post: deletedPost[0] });
});

app.delete('/api/post/deletecomment', (req, res) => {
    const { post_id, comment_id } = req.body;

    // Read current posts from the JSON file
    let rawData;
    let db;
    try {
        rawData = fs.readFileSync('./post.json');
        db = JSON.parse(rawData);
    } catch (error) {
        return res.status(500).json({ message: "Error reading posts data", error: error.message });
    }

    // Find the post by its ID
    const postIndex = db.posts.findIndex(post => post.post_id === post_id);
    if (postIndex === -1) {
        return res.status(404).json({ message: "Post not found" });
    }

    // Find the comment by its ID within the post
    const commentIndex = db.posts[postIndex].comments.findIndex(comment => comment.comment_id === comment_id);
    if (commentIndex === -1) {
        return res.status(404).json({ message: "Comment not found" });
    }

    // Remove the comment from the comments array
    const deletedComment = db.posts[postIndex].comments.splice(commentIndex, 1);

    // Save the updated posts back to the JSON file
    try {
        fs.writeFileSync('./post.json', JSON.stringify(db, null, 2));
    } catch (error) {
        return res.status(500).json({ message: "Error writing to posts data", error: error.message });
    }

    res.json({ message: "Comment deleted successfully!", comment: deletedComment[0] });
});

app.patch('/api/post/handlelikepost', (req,res) => {
    const { post_id, username_id } = req.body;

    // Load current posts from the JSON file
    let rawData;
    let db;
    let add_remove=0;
    try {
        rawData = fs.readFileSync('./post.json');
        db = JSON.parse(rawData);
    } catch (error) {
        return res.status(500).json({ message: "Error reading posts data", error: error.message });
    }

    // Find the post by its ID
    const postIndex = db.posts.findIndex(post => post.post_id === post_id);
    if (postIndex === -1) {
        return res.status(404).json({ message: "Post not found" });
    }

    // Update the post's like
    const usernameIndex = db.posts[postIndex].likes.findIndex(username => username === username_id); // Corrected this line
    if (usernameIndex === -1) {
        db.posts[postIndex].likes.push(username_id);
    }
    else {
        db.posts[postIndex].likes.splice(usernameIndex, 1);
        add_remove=1;
    }

    // Save the updated posts back to the JSON file
    try {
        fs.writeFileSync('./post.json', JSON.stringify(db, null, 2));
    } catch (error) {
        return res.status(500).json({ message: "Error writing to posts data", error: error.message });
    }
    if (add_remove===0){
        res.json({ message: "like added", post: db.posts[postIndex] });
    }
    else{
        res.json({ message: "like removed", post: db.posts[postIndex] });
    }
});

app.patch('/api/post/handlelikecomment', (req, res) => {
    const { post_id, username_id, comment_id } = req.body;

    let rawData;
    let db;
    try {
        rawData = fs.readFileSync('./post.json');
        db = JSON.parse(rawData);
    } catch (error) {
        return res.status(500).json({ message: "Error reading posts data", error: error.message });
    }

    // Find the post by its ID
    const postIndex = db.posts.findIndex(post => post.post_id === post_id);
    if (postIndex === -1) {
        return res.status(404).json({ message: "Post not found" });
    }

    // Find the comment by its ID within the post
    const commentIndex = db.posts[postIndex].comments.findIndex(comment => comment.comment_id === comment_id);
    if (commentIndex === -1) {
        return res.status(404).json({ message: "Comment not found" });
    }

    // Update the comment's likes
    const usernameIndex = db.posts[postIndex].comments[commentIndex].likes.findIndex(username => username === username_id);
    if (usernameIndex === -1) {
        db.posts[postIndex].comments[commentIndex].likes.push(username_id);
    } else {
        db.posts[postIndex].comments[commentIndex].likes.splice(usernameIndex, 1);
    }

    // Save the updated posts back to the JSON file
    try {
        fs.writeFileSync('./post.json', JSON.stringify(db, null, 2));
    } catch (error) {
        return res.status(500).json({ message: "Error writing to posts data", error: error.message });
    }

    res.json({ message: "Comment edited successfully!", comment: db.posts[postIndex].comments[commentIndex] });
});

app.patch('/api/post/editpost', (req,res) => {
    const { post_id, description } = req.body;  // Use req.body instead of req.query if you're sending data in the request body

    // Load current posts from the JSON file
    let rawData;
    let db;
    try {
        rawData = fs.readFileSync('./post.json');
        db = JSON.parse(rawData);
    } catch (error) {
        return res.status(500).json({ message: "Error reading posts data", error: error.message });
    }

    // Find the post by its ID
    const postIndex = db.posts.findIndex(post => post.post_id === post_id);
    if (postIndex === -1) {
        return res.status(404).json({ message: "Post not found" });
    }

    // Update the post's description
    db.posts[postIndex].description = description;

    // Optionally, you can also update other post details here as needed.

    // Save the updated posts back to the JSON file
    try {
        fs.writeFileSync('./post.json', JSON.stringify(db, null, 2));
    } catch (error) {
        return res.status(500).json({ message: "Error writing to posts data", error: error.message });
    }

    res.json({ message: "Post edited successfully!", post: db.posts[postIndex] });
});

app.patch('/api/post/editcomment', (req, res) => {
    const { post_id, comment_id, description } = req.body;

    // Load current posts from the JSON file
    let rawData;
    let db;
    try {
        rawData = fs.readFileSync('./post.json');
        db = JSON.parse(rawData);
    } catch (error) {
        return res.status(500).json({ message: "Error reading posts data", error: error.message });
    }

    // Find the post by its ID
    const postIndex = db.posts.findIndex(post => post.post_id === post_id);
    if (postIndex === -1) {
        return res.status(404).json({ message: "Post not found" });
    }

    // Find the comment by its ID within the post
    const commentIndex = db.posts[postIndex].comments.findIndex(comment => comment.comment_id === comment_id);
    if (commentIndex === -1) {
        return res.status(404).json({ message: "Comment not found" });
    }

    // Update the comment's description
    db.posts[postIndex].comments[commentIndex].description = description;

    // Optionally update other fields, such as last edited timestamp, if required.

    // Save the updated posts back to the JSON file
    try {
        fs.writeFileSync('./post.json', JSON.stringify(db, null, 2));
    } catch (error) {
        return res.status(500).json({ message: "Error writing to posts data", error: error.message });
    }

    res.json({ message: "Comment edited successfully!", comment: db.posts[postIndex].comments[commentIndex] });
});

app.get("/api/postbyid/:userId", (req, res) => {
const { userId } = req.params;

// Read current posts from the JSON file
const rawData = fs.readFileSync('./post.json');
const db = JSON.parse(rawData);

// Filter posts based on the given userId
const userPosts = db.posts.filter(post => post.username_id === userId);

res.json({ userPosts });
});

app.get("/api/post/feed/:userId", (req, res) => {
    const { userId } = req.params;

    // Read users and posts data from JSON files
    const usersRawData = fs.readFileSync('./users.json');
    const postsRawData = fs.readFileSync('./post.json');
    const usersDB = JSON.parse(usersRawData);
    const postsDB = JSON.parse(postsRawData);

    // Find the user based on the given userId
    const user = usersDB.find(user => user.id === userId);

    if (!user) {
        res.status(404).json({ error: "User not found." });
        return;
    }

    const followingIds = user.following;

    // Filter posts based on whether the post's username_id is in the following list
    const userFeed = postsDB.posts.filter(post => followingIds.includes(post.username_id));

    res.json({ userFeed });
});

app.get("/api/post/allposts", (req, res) => {
    const rawData = fs.readFileSync('./post.json');
    const db = JSON.parse(rawData);

    const allPosts = db.posts;

    res.json({ allPosts });
});

/****************************************************
 *                                                  *
 *                    LISTEN API                    *
 *                                                  *
 ****************************************************/


//LISTEN VIA PORT 5000
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
