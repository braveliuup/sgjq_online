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
    this.state = config.state.pick;
    this.isOnline = false;
}


var online_PeopleCount = 0; 
var socketManager = {};
var chessBoard = [];
var users = [];
var players = {};
var stepOrder = ['red', 'yellow', 'green', 'blue'];
var pieces =['司令','军长','师长','师长','旅长','旅长','团长','团长','营长','营长','炸弹','炸弹','连长','连长','连长','排长','排长', '排长','工兵','工兵','工兵','地雷','地雷','军旗','地雷'];
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
var Camp = function(){
    this.id;
    this.name;
    this.chess;
    this.setChess = function(chess){
        this.chess = chess;
        this.chess.camp = this;
    };
    this.clearChess = function(){
        this.chess = null;
    }
}
var Chess = function(){
    this.id;
    this.name;
    this.type;
    this.camp;
    this.setCamp = function(camp){
        this.camp = camp;
        this.camp.chess = this;
    }
}
var game = {
    chesses: {},
    camps: {},
    state: config.state.pick,
    init:  function(){
        var temp = ['6,7', '6,9',
         '7,6','7,7','7,8','7,9','7,10', 
         '8,7', '8,9',
         '9,6','9,7','9,8','9,9','9,10',
         '10,7', '10,9',
        ]; //中营的几个虚拟点
        //初始化营地
        for(var i= 0 ; i < 17; i++){
            chessBoard[i] = [];
            for(var j = 0 ; j < 17 ; j++){
                var camp = new Camp();
                if(homeCampIdxAry.indexOf(i+','+j) != -1){
                    camp.name = '大本营';
                }else if(moveCampIdxAry.indexOf(i+','+j) != -1){
                    camp.name = '行营';
                }else if((j < 6 && i < 6) || (j>10 && i < 6) || (j>10 && i > 10) || (j < 6 && i > 10)){
                    camp.name = '';                    
                }else if(temp.indexOf(i+","+j) != -1){
                    camp.name = '';
                }else{
                    camp.name = '兵站';
                }
                camp.id = 'camp'+i+'_'+j;
                chessBoard[i][j] = camp;
                this.camps[camp.id] = camp;
            }
        }
        // 初始化旗子
        //下方
        var idx =0;
        for(var i = 11; i < 17; i++){
            for(var j= 6; j < 11; j++){
                var camp = chessBoard[i][j];
                if(camp.type == '行营') continue;
                var chess = new Chess();
                chess.id = 'green'+idx;
                chess.type=  'green';
                chess.name = pieces.slice(idx, idx+1)[0];
                chess.camp = camp;
                idx++;
                this.chesses[chess.id] = chess;
                this.camps[camp.id].chess = chess;
            }
        }
        /// 上方  red
        idx =0;
        for(var i = 5; i >= 0; i--){
            for(var j= 6; j < 11; j++){
                var camp = chessBoard[i][j];
                if(camp.type == '行营') continue;
                var chess = new Chess();
                chess.id = 'red'+idx;
                chess.type=  'red';
                chess.name = pieces.slice(idx, idx+1)[0];
                chess.camp = camp;
                idx++;
                this.chesses[chess.id] = chess;
                this.camps[camp.id].chess = chess;
            }
        }
        //  左方 yellow
        idx =0;
        for(var j = 5; j >=0; j--){
            for(var i= 6; i < 11; i++){
                var camp = chessBoard[i][j];
                if(camp.type == '行营') continue;
                 var chess = new Chess();
                chess.id = 'yellow'+idx;
                chess.type=  'yellow';
                chess.name = pieces.slice(idx, idx+1)[0];
                chess.camp = camp;
                idx++;
                this.chesses[chess.id] = chess;
                this.camps[camp.id].chess = chess;
            }
        }
        // 右方 blue
        idx = 0;
        for(var j = 11; j <17; j++){
            for(var i= 6; i < 11; i++){
                var camp = chessBoard[i][j];
                if(camp.type == '行营') continue;
                 var chess = new Chess();
                chess.id = 'blue'+idx;
                chess.type=  'blue';
                chess.name = pieces.slice(idx, idx+1)[0];
                chess.camp = camp;
                idx++;
                this.chesses[chess.id] = chess;
                this.camps[camp.id].chess = chess;
            }
        }
    },
    swapChess: function(firstCampId, secondCampId){
        var camp1 = this.camps[firstCampId];
        var camp2 = this.camps[secondCampId];
        var temp = camp1.chess ;
        camp1.setChess(camp2.chess);
        camp2.setChess(temp);
    },
    occupyCamp:function(chessId, campId){
        var chess = this.chesses[chessId];
        chess.camp.clearChess();
        var camp = this.camps[campId];
        camp.setChess(chess);
    },
    attackChess:function(chessId, targetChessId){
        var myChess = this.chesses[chessId];
        var enemyChess = this.chesses[targetChessId];
        var result = this.judgment(myChess, enemyChess);
        switch(result){
            case config.judgment.win:
            myChess.camp.clearChess();
            this.removeChess(myChess.id);
            this.playerOver(enemyChess.type);
            break;
            case config.judgment.die:
            myChess.camp.clearChess();
            enemyChess.camp.clearChess();
            this.removeChess(myChess.id);
            this.removeChess(enemyChess.id);
            break;
            case config.judgment.success:
            myChess.camp.clearChess();
            enemyChess.camp.setChess(myChess);
            this.removeChess(enemyChess.id);
            break;
            case config.judgment.fail:
            myChess.camp.clearChess();
            this.removeChess(myChess.id);
            break;
        }   
    },
    judgment: function(myChess, enemyChess){
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
    },
    removeChess: function(id){
        delete this.chesses[id];
    },
    playerOver: function(type){
        kdebug.info(type+': over.....');
        var player = findPlayerByType(type);
        console.log(player)
        player.state = config.state.over;
        io.sockets.emit('event_player_over', type, player.name);
        // 清扫工作
        for(var id in this.chesses){
            if(id.startsWith(type)){
                this.chesses[id].camp.clearChess();
                delete this.chesses[id];
            }
        }
        stepOrder.splice(stepOrder.indexOf(type), 1); //over的类型 从走步序列中移除
        if(stepOrder.indexOf('red') == -1 && stepOrder.indexOf('green') == -1){
            kdebug.info('game over! red + green fail');
            this.gameOver();
        }
        if(stepOrder.indexOf('blue') == -1 && stepOrder.indexOf('yellow') == -1){
            kdebug.info('game over! yellow + blue fail');
            this.gameOver();
        }
    },
    gameOver: function(){
        io.sockets.emit('event_game_over');
        game.state = config.state.pick;
        game.camps = {};
        game.chesses = {};
        chessBoard = [];
        players={};
        stepOrder = ['red', 'yellow', 'green', 'blue'];
    }

};
//仅作测试用
// game.init();
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
            if(players.hasOwnProperty(empName)){
                players[empName].isOnline = true;
            }else{
                var player = new Player();
                player.name=  empName;
                player.isOnline = true;
                player.state = config.state.pick;
                players[empName] = player;
            }
            var pickedPlayers = [];
            for(var key in players){
                if(players[key].state != config.state.pick){
                    pickedPlayers.push(players[key]);
                }
            }
            var chessState = [];
            for(var key in game.chesses){
                var chess = game.chesses[key];
                chessState.push({id:chess.id, name:chess.name, type:chess.type, campId:chess.camp.id});
            }
            socket.emit('loginSuccess', empName, game.state, JSON.stringify(pickedPlayers), JSON.stringify(chessState));
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
        if(type != 'observer'){
            for(var key in players){
                if(players[key].type == type){
                    kdebug.info(type+'已经被'+players[key].name+'选择');
                    socket.emit('seatSelected', players[key].name, type);
                    return;
                }
            }
        }
        players[name].type = type;
        players[name].state = state;
        socket.emit('event_pick_success');
        socket.broadcast.emit('event_pick', name, type, state);
        var pickCount = 0;
        for(var key in  players){
            if(players[key].type =='observer') continue;
            if(players[key].state == config.state.preparing || players[key].state == config.state.prepared){
                pickCount++;
                kdebug.info('pickcount:'+pickCount);
                if(pickCount == 4){
                    game.state = config.state.preparing;
                    game.init();
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
                    game.state = config.state.started;
                    // 随机选一个先走
                    var idx = Math.round(Math.random()*3);
                    var type = stepOrder[idx];
                    var player = findPlayerByType(type);
                    io.sockets.emit('event_turnorder', stepOrder[idx], player.name);
                    kdebug.info('all prepared, 游戏开始...');
                }
            }
        }        
    });
    // 进营事件
    socket.on('event_occupy', function(type,chessId, campId){
        kdebug.info(type+':event_occupy...');
        socket.broadcast.emit('event_occupy', chessId, campId);   
        game.occupyCamp(chessId, campId);
        var nextType =turnToNext(type);
        var player = findPlayerByType(nextType);
        var nextPlayerName = player?player.name:'';
        io.sockets.emit('event_turnorder', nextType, nextPlayerName);
        kdebug.info('it is turn to '+ nextType);
    });
    socket.on('event_attack', function(type, chessId, targetChessId){
        kdebug.info(type+':event_attack...');
        socket.broadcast.emit('event_attack',  chessId, targetChessId);       
        game.attackChess(chessId, targetChessId);
        var nextType =turnToNext(type);
        var player = findPlayerByType(nextType);
        var nextPlayerName = player?player.name:'';
        io.sockets.emit('event_turnorder', nextType, nextPlayerName);
        kdebug.info('it is turn to '+ nextType);
    });
    socket.on('event_exchangeChess_prepare', function(firstCampId, secondCampId){
        kdebug.info('exchange chess on prepare');
        game.swapChess(firstCampId, secondCampId);
        socket.broadcast.emit('event_exchangeChess_prepare', firstCampId, secondCampId);
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
        if(players[key].type == type ){
            return players[key];
        }
    }
    return false;
}




