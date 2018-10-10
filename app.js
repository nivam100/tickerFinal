var {PythonShell} = require('python-shell');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var dateTime = require('node-datetime');

var availableStocks = [];
var searches;
var emails;

updateArrays();

app.use(bodyParser.text({type: '*/*'}));

//replace if in AWS
var server = app.listen(8082, function () {
    var host = server.address().address
    var port = server.address().port
    //console.log("App listening at http://%s:%s", host, port);
});

/* this is for AWS
var server = app.listen(80, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("App listening at http://%s:%s", host, port);
});
*/

app.use('/assets', express.static('assets'));


//replace if in AWS
app.get('/', function(req, res) {
    fs.readFile('./index.html', null, function(error, data){
        if(error){
            res.writeHead(404);
            res.write('File not found');
        } else {
            res.write(data);
        }
        res.end();
    });
});

/* This is for AWS
app.get('/', function(req, res) {
        var xfp = req.headers["X-Forwarded-Proto"] || req.headers["x-forwarded-proto"];
        if(xfp == "https"){
        res.setHeader('Transfer-Encoding', 'chunked');
        fs.readFile('./index.html', null, function(error, data){
        if(error){
            res.writeHead(404);
            res.write('File not found');
        } else {
            res.write(data);
        }
        res.end();
    });
    } else {
            res.redirect('https://www.tickerstories.com');
    }

});
*/

/* This is for AWS
app.get('/health', function(req, res){
    res.sendStatus(200);
});
*/


app.get('/search/:stockSymbol/:start/:end', function(req, res){
    let stockSymbol = req.params.stockSymbol;
    let start = req.params.start;
    let end = req.params.end;
    //console.log("got a request for: " + stockSymbol);
    searches.push(stockSymbol);
    createSearchesArrayFile();
    //check if symbol is available
    var realEnd = parseInt(start) + parseInt(end);
    if(availableStocks.indexOf(stockSymbol + "_" + start + "-" + realEnd) != -1 && availableStocks.indexOf(stockSymbol + "_0-10") != -1){
        readStockFile(stockSymbol, res, start, end);
        //console.log("read " + stockSymbol + " from cache");
    } else {
        //console.log("couldn't find " + stockSymbol + "_" + start + "-" + (parseInt(start) + parseInt(end)))
        res.status(200).send('null');
    }
    
})



app.get('/subscribe/:email', function(req, res){
    var email = req.params.email;
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(email)){
        fs.readFile('./emails.json', (err, data) =>{
            //no file found
            if(err){
                emails = [];
                emails.push(email);
                emailsJson = JSON.stringify(emails);
                fs.writeFile("./emails.json", emailsJson, (err) => {
                    if(err){
                        //console.log(err);
                    } else {
                        //console.log("backed up searches of stocks");
                    }
                });
            } else {
                emails = JSON.parse(data);
                emails.push(email);
                emailsJson = JSON.stringify(emails);
                fs.writeFile("./emails.json", emailsJson, (err) => {
                    if(err){
                        //console.log(err);
                    } else {
                        //console.log("backed up searches of stocks");
                    }
                });
            }
        });

    
    res.status(200).send("200");
    } else {
        res.status(200).send("badEmail");
    }

})

app.get('/news/:companyName/:symbol', function(req, res){
    let companyName = req.params.companyName;
    let symbol = req.params.symbol;

    let options = {
        mode: 'text',
        pythonPath: '/anaconda3/bin/python',
        pythonOptions: ['-u'],
        scriptPath: '/Users/nybgwrn/desktop/AWS/tickbytick',
        args: [companyName, symbol]
    };

    /*This is for AWS:

    let options = {
        mode: 'text',
        pythonPath: '/usr/bin/python',
        pythonOptions: ['-u'], // get print results in real-time
        scriptPath: '/home/ubuntu/tickerStories/tickbytick/',
        args: [companyName, symbol]
    };
    */

    PythonShell.run('newsGetter.py', options, function(err, results){
        if(err) throw err;
        fs.readFile(results[0], (err, data) => {
            obj = JSON.parse(data);
            res.status(200).send(JSON.stringify(obj));
        });
    });
    
    
});

function readStockFile(symbol, res, start, end){
    var realEnd = parseInt(start) + parseInt(end);
    ///home/ubuntu/stocks/
    fs.readFile("./stocks/" + symbol + "_" + start + "-" + realEnd + ".json", (err, data) =>{
        if(err){
            //console.log("couldn't read " + symbol + "_" + start + "-" + realEnd + ".json");
            res.status(200).send('null');
        } else {
            obj = JSON.parse(data);
            res.status(200).send(JSON.stringify(obj));
        }
    });
}

function createSearchesArrayFile(){
    var data = JSON.stringify(searches);
    fs.writeFile("./searches.json", data, (err) => {
        if(err){
            //console.log(err);
        } else {
            //console.log("backed up searches of stocks");
        }
    });
}

function updateArrays(){
    fs.readFile('./searches.json', (err, data) =>{
        if(err){
            searches = [];
        } else {
            searches = JSON.parse(data);
            searches = searches.filter(function(elem, pos) {
                return searches.indexOf(elem) == pos;
            })
        }
    });
    //home/ubuntu/stocks
    var folderOfStocks = './stocks/';
    var files = fs.readdirSync(folderOfStocks);
    files.forEach(file => {
        if(file != ".DS_Store"){
            availableStocks.push(file.split(".")[0]);
        }
    });
}

setInterval(updateArrays, 30*1000);


 





