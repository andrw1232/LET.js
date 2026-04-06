import Interpreter from './Interpreter.js';

import express from 'express';



const hostname = '127.0.0.1';
const port = 8000;

const app = express();

app.use(express.static('public'));
app.set('views','./views');
app.set('view engine', 'pug');

// makes the form data available in req.body
app.use(express.urlencoded({extended: true }));


// handle the initial get request
app.get("/", (req,res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');    
    
    res.render('index', {body: "Write your LET program here", answer: ""});
});


// handle the post request that involve parsing 
app.post("/" , (req,res) => {

    var result;
    try {
        result = Interpreter.parse(req.body.in);
    } catch (error) {
        result = "An Error was encountered: "+error.message
    }
    
    res.statusCode = 200;
    res.setHeader('Content-Type', "text/html");

    res.render('index', {body: req.body.in, answer: result}); // render the site with the answer
});


app.listen(port, hostname, () => {
    console.log(`server is running at http://${hostname}:${port}`);
});