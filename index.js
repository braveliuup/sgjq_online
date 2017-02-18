var express = require('express');
var bodyParser = require('body-parser');
var game = require('./game');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(666, function(){
    console.log('server started on port 80');
});
// 使用router中间件
var router = express.Router();

// 使用中间件 app.use
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
//让express托管静态文件 使用express.static中间件
app.use(express.static('public'));

router.get('/start', function(req, res){
    console.log(game.kcharf_emp_db.kdr20151005)
    res.send('asdf');
});

router.post('/player', function(req, res){
    if(game.kcharf_emp_db.hasOwnProperty(req.body.id.toLowerCase())){
        var name = game.kcharf_emp_db[req.body.id.toLowerCase()];
        console.log(name);
        res.send(name);
    }
});

router.get('/', function(req, res){
    res.sendFile(__dirname +'/start.html');
})

app.use(router);


io.on('connection', function(socket){
    socket.emit('news', {hello: 'world'});
    socket.on('my other event', function(data){
        console.log(data);
    })
})