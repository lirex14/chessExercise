const request = require('request');
const fs = require('fs');
const express = require('express')
var Chess = require('chess.js').Chess;
var Fgets = require('qfgets');
var readline = require('linebyline'),
const app = express()
const port = 3000;
app.set('view engine', 'ejs');


app.get('/', function(req, res) {
    res.render('pages/index');
});

app.get('/game', function(req, res) {
    loadOneGame()
    res.status(200).json({message: "creating fen table"});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

/* Create your personal token on https://lichess.org/account/oauth/token */
const personalToken = 'c1y34MTOM1IGp3i9';
const lichessApi = 'https://lichess.org/api'

console.log(__filename)
console.log(__dirname)

function getAccountDetails(){
    request.get(lichessApi+'/account', function(err, res, body){ 
        obj = JSON.parse(body)
        console.log(obj.id + "\nclassical:"+obj.perfs.classical.rating + "\trapid:"+obj.perfs.rapid.rating)
    }).auth(null, null, true, personalToken);
}


function getAllMyGames(){
    request.get(lichessApi+'/games/user/a12233', function(err, res){
        console.log(res.body)
    }).auth(null, null, true, personalToken).pipe(fs.createWriteStream(__dirname+'/gameData/allgames.txt'));
}
//extract relevant data and write to another file, eventually write to DB 
function parsingAllGamesFiles(){
    var fp = new Fgets('gameData/allgames.txt');
    var content = "";
    return readlines();
    function readlines() {
        try {
            for (var i=0; i<20; i++) {
                var line = fp.fgets();
                contents += line;
                if (line.inclues("Site") ) console.log(line);
            }
            if (fp.feof()) return callback(null, contents);
            else setImmediate(readlines);
        }
        catch (err) {
            return callback(err);
        }
    }
    function callback(a, b){
        console.log(a+b)
    }

}

function loadOneGame(){
    fs.readFile('gameData/game.pgn', (err, data) => {
        if (err) throw err;
        // console.log(data.toString());
        var chess = new Chess(); 
        chess.load_pgn(data.toString());
        moves = chess.history()
        console.log(moves)
        var chess1 = new Chess();
        var stream = fs.createWriteStream("gameFen.txt", {flags:'a'});
        var iter = 0 
        for(var iter = 0; iter< moves.length; iter++){
            chess1.move(moves[iter]);
            fen = chess1.fen()
            stream.write(fen+"\n")
        }
        console.log(chess.fen()) //ending position 
      });
}
