const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const https = require('https'); 
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("client/public"))
const path = require('path');


app.get("/", function(req,res) {
    res.sendFile(path.join(__dirname,"..","client","public","index.html"));
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})
