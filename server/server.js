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


//MIDDLEWARE

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
})

//CREATE VIA REGISTER
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
        "following": []
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

// Check if a pseudo already exists

app.get("/check-pseudo/:pseudo", (req, res) => {
    const { pseudo } = req.params;
    const existingPseudo = users.some(user => user.pseudo === pseudo);
    res.json({ exists: existingPseudo });
});

// Check if an email already exists
app.get("/check-email/:email", (req, res) => {
    const { email } = req.params;
    const existingEmail = users.some(user => user.email === email);
    res.json({ exists: existingEmail });
});



//FOLLOW OTHER USERS

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

// Endpoint to follow a user using PATCH
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

//UNFOLLOW OTHER USERS

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

// Endpoint to unfollow a user using PATCH
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

//DELETE USER

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

// Endpoint to delete a user using DELETE
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

// Login User

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
    console.log(tokenExpiration);

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: tokenExpiration });

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



//LISTEN VIA PORT 5000
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
