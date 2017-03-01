var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config');
var kdebug = require('./KDebug');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(666, function(){
    console.log('server started on port 666');
});
// 使用router中间件
var router = express.Router();

// 使用中间件 app.use
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
//让express托管静态文件 使用express.static中间件
app.use(express.static('public'));
app.set('view engine', 'ejs');

router.get('/start', function(req, res){
    console.log(config.kcharf_emp_db.kdr20151005)
    res.send('asdf');
    res.render('index', {title: 'hello ejs'});
});

router.post('/player', function(req, res){
    if(config.kcharf_emp_db.hasOwnProperty(req.body.id.toLowerCase())){
        var name = game.kcharf_emp_db[req.body.id.toLowerCase()];
        console.log(name);
        res.send(name);
    }
});

router.get('/game', function(req, res){
    res.sendFile(__dirname + '/views/game.html');
})

router.get('/', function(req, res){
     res.sendFile(__dirname +'/views/start.html');
    // res.render('index', {title: 'hello ejs'});
})
router.get('/chat', function(req, res){
    res.sendFile(__dirname + '/views/chat.html');
})

app.use(router);

var Player = function(){
    this.name = '';
    this.type = '';
    this.state = '';
    this.isOnline = false;
}


var online_PeopleCount = 0; 
var socketManager = {};
var users = [];
var players = {};
io.on('connection', function(socket){
    socket.on('login', function(nickName){
        var empName = searchEmp(nickName);
        if(!empName){
            socket.emit('EmpIdNotFound');
        }else if(users.indexOf(nickName) > -1){
            socket.emit('nickExisted');
        }else{
            kdebug.info('login...'+empName);
            socket.userIndex = users.length;
            socket.nickName = nickName;
            socket.empName = empName;
            users.push(nickName);
            var player = new Player();
            player.name=  empName;
            player.isOnline = true;
            players[empName] = player;
            socket.emit('loginSuccess', empName);
            io.sockets.emit('system', empName, users.length, 'login');// 向所有连接到服务器的客户端发送当前登录用户的昵称
        }
    });
    socket.on('disconnect', function(){
        if(socket.empName == null)return;
        kdebug.info('disconnect...'+socket.empName);
        users.splice(socket.userIndex, 1);
        if(players.hasOwnProperty(socket.empName)){
            players[socket.empName].isOnline = false;
        }
        socket.broadcast.emit('system', socket.empName, users.length, 'logout');
    });
    
    socket.on('postMsg', function(msg){
        socket.broadcast.emit('newMsg', socket.empName, msg); // 将消息发送到除自己外的所有用户
    });

    // 游戏模块
    socket.on('event_pick', function(name, type, state){
        kdebug.info('event_pick...'+name+','+type+','+state);
        players[name].type = type;
        players[name].state = state;
        socket.broadcast.emit('event_pick', name, type, state);
        var pickCount = 0;
        for(var key in  players){
            if(players[key].state == config.state.preparing || players[key].state == config.state.prepared){
                pickCount++;
                kdebug.info('pickcount:'+pickCount);
                if(pickCount == 4){
                    io.sockets.emit('game_prepare');
                    kdebug.info('all picked, 游戏准备中...');
                }
            }
        }   
    });
    socket.on('event_prepare', function(name, state){
        kdebug.info('event_preprare...'+name+","+state);
        players[name].state = state;
        socket.broadcast.emit('event_prepare', name, state);
        var prepareCount = 0;
        for(var key in  players){
            if(players[key].state == config.state.prepared){
                prepareCount++;
                if(prepareCount == 4){
                    io.sockets.emit('game_start');
                    kdebug.info('all prepared, 游戏开始...');
                }
            }
        }        
    })

})

function forEach(ary, callback){
    
}

//db util
function searchEmp(empId){
     if(config.kcharf_emp_db.hasOwnProperty(empId.toLowerCase())){
        var name = config.kcharf_emp_db[empId.toLowerCase()];
        return name;
    }
    return false;
}