var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var dateTime = require('node-datetime');

var hotStocksList;
var searchesStocksJsonObject;
var finalList = [];

app.use(bodyParser.text({type: '*/*'}));
app.use('/static', express.static('public'));

fs.readFile('./stocksArrayController.json', (err, data) =>{
    if(err){
        availableStocks = [];
    } else {
        availableStocks = JSON.parse(data);
    }
});


//run python hot stocks 
let spawn = require('child_process').spawn;
let firstPythonProcess = spawn('python',["/Users/nybgwrn/Desktop/AlphaSecWebsite/hotstocks.py"]);
        
firstPythonProcess.stdout.on('data', (data) => {
    let messegeFromPython = JSON.stringify(data.toString('utf8')).replace("\\n", "");
    //console.log("messege from python: " + messegeFromPython);

    fs.readFile('./hotStocks.json', (err, data) =>{
        if(err){
            hotStocksList = [];
        } else {
            hotStocksList = JSON.parse(data);
            for(var i = 0; i < hotStocksList.length; i++){
                finalList.push(hotStocksList[i]);
            }
            finalList = finalList.filter(function(elem, pos) {
                return finalList.indexOf(elem) == pos;
            })
        }

        fs.readFile('./searches.json', (err, data) =>{
            if(err){
                searchesStocksJsonObject = [];
                startPythonScraping();
            } else {
                searchesStocksJsonObject = JSON.parse(data);
                for(var i = 0; i < searchesStocksJsonObject.length; i++){
                    finalList.push(searchesStocksJsonObject[i]);
                }
                finalList = finalList.filter(function(elem, pos) {
                    return finalList.indexOf(elem) == pos;
                })
                console.log(finalList);
                startPythonScraping();
            }
        });
    });

});

function startPythonScraping(){
    console.log("final list in index 0 is " + finalList[0])
    var lengthOfList = finalList.length;
    if(0 < lengthOfList - 1){
        runFourProccesses(finalList[0]);
    } else {
        return;
    }
    if(1 < lengthOfList - 1){
        runFourProccesses(finalList[1]);
    } else {
        return;
    }
    if(2 < lengthOfList - 1){
        runFourProccesses(finalList[3]);
    } else {
        return;
    }
    if(3 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[3]);
        }, 60*1000);
    } else {
        return;
    }
    if(4 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[4]);
        }, 60*1000);
    } else {
        return;
    }
    if(5 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[5]);
        }, 60*1000);
    } else {
        return;
    }
    if(6 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[6]);
        }, 2*60*1000);
    } else {
        return;
    }
    if(7 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[7]);
        }, 2*60*1000);
    } else {
        return;
    }
    if(8 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[8]);
        }, 2*60*1000);
    } else {
        return;
    }
    if(9 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[9]);
        }, 3*60*1000);
    } else {
        return;
    }
    if(10 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[10]);
        }, 3*60*1000);
    } else {
        return;
    }
    if(11 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[11]);
        }, 3*60*1000);
    } else {
        return;
    }
    if(12 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[12]);
        }, 4*60*1000);
    } else {
        return;
    }
    if(13 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[13]);
        }, 4*60*1000);
    } else {
        return;
    }
    if(14 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[14]);
        }, 4*60*1000);
    } else {
        return;
    }
    if(15 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[15]);
        }, 5*60*1000);
    } else {
        return;
    }
    if(16 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[16]);
        }, 5*60*1000);
    } else {
        return;
    }
    if(17 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[17]);
        }, 5*60*1000);
    } else {
        return;
    }
    if(18 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[18]);
        }, 6*60*1000);
    } else {
        return;
    }
    if(19 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[19]);
        }, 6*60*1000);
    } else {
        return;
    }
    if(20 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[20]);
        }, 6*60*1000);
    } else {
        return;
    }
    if(21 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[21]);
        }, 7*60*1000);
    } else {
        return;
    }
    if(22 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[22]);
        }, 7*60*1000);
    } else {
        return;
    }
    if(23 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[23]);
        }, 7*60*1000);
    } else {
        return;
    }
    if(24 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[24]);
        }, 8*60*1000);
    } else {
        return;
    }
    if(25 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[25]);
        }, 8*60*1000);
    } else {
        return;
    }
    if(26 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[26]);
        }, 8*60*1000);
    } else {
        return;
    }
    if(27 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[27]);
        }, 9*60*1000);
    } else {
        return;
    }
    if(28 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[28]);
        }, 9*60*1000);
    } else {
        return;
    }
    if(29 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[29]);
        }, 9*60*1000);
    } else {
        return;
    }
    if(30 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[30]);
        }, 10*60*1000);
    } else {
        return;
    }
    if(31 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[31]);
        }, 10*60*1000);
    } else {
        return;
    }
    if(32 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[32]);
        }, 10*60*1000);
    } else {
        return;
    }
    if(33 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[33]);
        }, 11*60*1000);
    } else {
        return;
    }
    if(34 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[34]);
        }, 11*60*1000);
    } else {
        return;
    }
    if(35 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[35]);
        }, 11*60*1000);
    } else {
        return;
    }
    if(36 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[36]);
        }, 12*60*1000);
    } else {
        return;
    }
    if(37 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[37]);
        }, 12*60*1000);
    } else {
        return;
    }
    if(38 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[38]);
        }, 12*60*1000);
    } else {
        return;
    }
    if(39 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[39]);
        }, 13*60*1000);
    } else {
        return;
    }
    if(40 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[40]);
        }, 13*60*1000);
    } else {
        return;
    }
    if(41 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[41]);
        }, 13*60*1000);
    } else {
        return;
    }
    if(42 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[42]);
        }, 14*60*1000);
    } else {
        return;
    }
    if(43 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[43]);
        }, 14*60*1000);
    } else {
        return;
    }
    if(44 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[44]);
        }, 14*60*1000);
    } else {
        return;
    }
    if(45 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[45]);
        }, 15*60*1000);
    } else {
        return;
    }
    if(46 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[46]);
        }, 15*60*1000);
    } else {
        return;
    }
    if(47 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[47]);
        }, 15*60*1000);
    } else {
        return;
    }
    if(48 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[48]);
        }, 16*60*1000);
    } else {
        return;
    }
    if(49 < lengthOfList - 1){
        setTimeout(function(){
            runFourProccesses(finalList[49]);
        }, 16*60*1000);
    } else {
        return;
    }
    
    
}

function runFourProccesses(stockSymbol){
    console.log("working on " + stockSymbol);
    for(var j = 0; j < 4; j++){
        if(j == 0){
            trueOrFalse = "y"
        } else {
            trueOrFalse = "n"
        }
        let secondPythonProcess = spawn('python',["/Users/nybgwrn/Desktop/AlphaSecWebsite/getAllData.py", stockSymbol, (j*10).toString(), "10", trueOrFalse]);
        secondPythonProcess.stdout.on('data', (data) => {
            console.log("im inside python");
            let messegeFromPython = JSON.stringify(data.toString('utf8')).replace("\\n", "");
            console.log(messegeFromPython + " with stock " + stockSymbol);



            if(messegeFromPython != "something went wrong"){
                //console.log("created file for " + symbol);
            } else {
                //console.log("couldn't create file for " + symbol + "_" + (j*10).toString() + "-" + (j*10 + 10).toString());
            }
        });
    }  
}





 





