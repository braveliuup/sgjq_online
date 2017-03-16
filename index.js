var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config');
var kdebug = require('./KDebug');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(8686, function(){
    console.log('server started on port 8686');
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
var stepOrder = ['red', 'yellow', 'green', 'blue'];
var game = {
    state: config.state.pick
};
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
            socket.emit('loginSuccess', empName, game.state);
            io.sockets.emit('system', empName, users.length, 'login');// 向所有连接到服务器的客户端发送当前登录用户的昵称
        }
    });
    socket.on('disconnect', function(){
        if(socket.empName == null)return;
        kdebug.info('disconnect...'+socket.empName);
        users.splice(users.indexOf(socket.nickName), 1);
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
        for(var key in players){
            if(players[key].type == type){
                kdebug.info(type+'已经被'+players[key].name+'选择');
                socket.emit('seatSelected', players[key].name, type);
                return;
            }
        }
        if(type == 'observer'){
            socket.emit('observer_event_pick_success', name, JSON.stringify(chessBoard));
        }else{
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
                        game.state = config.state.preparing;
                        kdebug.info('all picked, 游戏准备中...');
                    }
                }
            }   
            socket.emit('event_pick_success');
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
                    game.state = config.state.started;
                    // 随机选一个先走
                    var idx = Math.round(Math.random()*3);
                    io.sockets.emit('event_turnorder', stepOrder[idx]);
                    kdebug.info('all prepared, 游戏开始...');
                }
            }
        }        
    });
    socket.on('event_occupy', function(row1, col1, name, type, row2, col2){
        kdebug.info(type+':event_occupy...');
        var nextType =turnToNext(type);
        io.sockets.emit('event_turnorder', nextType);
        kdebug.info('it is turn to '+ nextType);
        socket.broadcast.emit('event_occupy', row1, col1, name, type, row2, col2);   
        moveChess(row1, col1, row2, col2);
    });
    socket.on('event_attack', function(row1, col1, name, type, row2, col2, overtype){
        kdebug.info(type+':event_attack...');
        console.log(overtype)
        console.log(stepOrder)
        if(overtype){
            stepOrder.splice(stepOrder.indexOf(overtype), 1);
        }
        console.log(stepOrder)
        
        var nextType =turnToNext(type);
        io.sockets.emit('event_turnorder', nextType);
        kdebug.info('it is turn to '+ nextType);
        socket.broadcast.emit('event_attack', row1, col1, name, type, row2, col2);       
        attackChess(row1, col1, row2, col2); 
    });
    socket.on('event_player_over', function(type){
        kdebug.info(type+': over.....');
        var player = findPlayerByType(type);
        player.state = config.state.over;
        io.sockets.emit('event_player_over', type);
        clearChessByType(type);
        if(stepOrder.indexOf('red') == -1 && stepOrder.indexOf('green') == -1){
            kdebug.info('game over! red + green fail');
            io.sockets.emit('event_game_over');
            game.state = config.state.over;
        }
        if(stepOrder.indexOf('blue') == -1 && stepOrder.indexOf('yellow') == -1){
            kdebug.info('game over! yellow + blue fail');
            io.sockets.emit('event_game_over');
            game.state = config.state.over;
        }

        
    });
    socket.on('event_exchangeChess_prepare', function(row1, col1, row2, col2){
        kdebug.info('exchange chess on prepare');
        socket.broadcast.emit('event_exchangeChess_prepare', row1, col1, row2, col2);
        swapChess(row1, col1, row2, col2);
    })

})

function turnToNext(type){
    var idx = stepOrder.indexOf(type);
    idx++;
    if(idx == stepOrder.length){
        idx = 0;
    }
    return stepOrder[idx];
}

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
function findPlayerByType(type){
    for(var key in players){
        if(players[key].type == type && players[key].state != config.state.over){
            return players[key];
        }
    }
    return false;
}

var pieces =['司令','军长','师长','师长','旅长','旅长','团长','团长','营长','营长','炸弹','炸弹','连长','连长','连长','排长','排长', '排长','工兵','工兵','工兵','地雷','地雷','军旗','地雷'];
var chessBoard = [];
var moveCampIdxAry = [
        '12,7','12,9','13,8','14,7','14,9', 
        '4,7','4,9','3,8','2,7','2,9',
        '7,4','9,4','8,3','7,2','9,2',
        '7,12','9,12','8,13','7,14','9,14',
        ]; //行营索引集
var homeCampIdxAry = [
        '16,7','16,9', 
        '0,7','0,9',
        '7,0','9,0',
        '7,16','9,16'
        ]; //大本营索引集

function initChessBoard(){
    for(var i= 0 ; i < 17; i++){
        chessBoard[i] = [];
        for(var j = 0 ; j < 17 ; j++){
            chessBoard[i][j] = {name: ''};
        }
    }
    //下方
    var downIdx = 0;
    var upIdx = 0;
    var leftIdx = 0;
    var rightIdx = 0;
    for(var i = 11; i < 17; i++){
        for(var j= 6; j < 11; j++){
            var chess = chessBoard[i][j];
            chess.type = 'green';
            if(moveCampIdxAry.indexOf(String.prototype.concat(i,',',j)) == -1){
                chess.name = pieces.slice(downIdx,downIdx+1)[0];
                downIdx++;
            }
        }
    }
    /// 上方  red
    for(var i = 5; i >= 0; i--){
        for(var j= 6; j < 11; j++){
            var chess = chessBoard[i][j];
            chess.type = 'red';
            if(moveCampIdxAry.indexOf(String.prototype.concat(i,',',j)) == -1){
                chess.name = pieces.slice(upIdx,upIdx+1)[0];
                upIdx++;
            }
        }
    }
    //  左方 yellow
    for(var j = 5; j >=0; j--){
        for(var i= 6; i < 11; i++){
            var chess = chessBoard[i][j];
            chess.type = 'yellow';
            if(moveCampIdxAry.indexOf(String.prototype.concat(i,',',j)) == -1){
                chess.name = pieces.slice(leftIdx,leftIdx+1)[0];
                leftIdx++;
            }
        }
    }
    // 右方 blue
    for(var j = 11; j <17; j++){
        for(var i= 6; i < 11; i++){
            var chess = chessBoard[i][j];
            chess.type = 'blue';
            if(moveCampIdxAry.indexOf(String.prototype.concat(i,',',j)) == -1){
                chess.name = pieces.slice(rightIdx,rightIdx+1)[0];
                rightIdx++;
            }
        }
    }
}
initChessBoard();

function swapChess(row1, col1, row2, col2){
    var temp  = chessBoard[row1][col1];
    chessBoard[row1][col1] = chessBoard[row2][col2];
    chessBoard[row2][col2] =temp ;
}
function clearChessByType(type){
    for(var i = 0 ; i < 17 ; i++){
        for (var j = 0  ;j < 17 ; j++){
            if(chessBoard[i][j].type == type ){
                chessBoard[i][j].name = '';
                chessBoard[i][j].type = '';
            }
        }
    }
}
function moveChess(row1, col1, row2, col2){
    chessBoard[row2][col2] =chessBoard[row1][col1] ;
    chessBoard[row1][col1].name = '';
    chessBoard[row1][col1].type = '';
}

function attackChess(row1, col1, row2, col2){
    var result = judgment(chessBoard[row1][col1], chessBoard[row2][col2]);
    switch(result){
        case config.judgment.win:
        chessBoard[row1][col1].name = '';
        chessBoard[row1][col1].type = '';
        clearChessByType(chessBoard[row2][col2].type);
        break;
        case config.judgment.die:
        chessBoard[row1][col1].name = '';
        chessBoard[row1][col1].type = '';
        chessBoard[row2][col2].name = '';
        chessBoard[row2][col2].type = '';
        break;
        case config.judgment.fail:
        chessBoard[row1][col1].name = '';
        chessBoard[row1][col1].type = '';
        break;
        case config.judgment.success:
        chessBoard[row2][col2] =chessBoard[row1][col1] ;
        chessBoard[row1][col1].name = '';
        chessBoard[row1][col1].type = '';
        break;
    }
}

function judgment(myChess, enemyChess){
        // 如果干过了对方，返回 success
        // 如果没干过，返回     fail
        // 如果一样大，返回     die
        // 如果扛了旗， 返回    win 
        //几个特殊的  炸弹 地雷 军旗
        if(enemyChess.name == '军旗')
        {
            console.log('厉害了我的哥，扛了军旗，你就赢了')
            return config.judgment.win;
        } 
        if(myChess.name == '炸弹' || enemyChess.name =='炸弹' || myChess.name == enemyChess.name){
            console.log('出来混，迟早要还的，双双阵亡')
            return config.judgment.die;
        }
        if(enemyChess.name== '地雷' && myChess.name != '工兵'){
            console.log('哇哦，你挂了')
            return config.judgment.fail;
        }
        var myIdx = pieces.indexOf(myChess.name); 
        var enemyIdx = pieces.indexOf(enemyChess.name);
        if(myIdx > enemyIdx){
            // 没干过
            console.log('哇哦，你挂了')
            return config.judgment.fail;
        }
        if(myIdx < enemyIdx){
            console.log('666，你赢了')
            return config.judgment.success;
        }
    }