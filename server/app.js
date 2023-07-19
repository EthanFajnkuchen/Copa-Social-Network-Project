const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const https = require('https'); 
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("client/public"))


app.get("/", function(req,res) {
    res.sendFile(path.join(__dirname,"..","client","public","index.html"));
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})
