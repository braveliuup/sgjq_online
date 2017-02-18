// 兵站
var BaseCamp = function(x, y,w, h){
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.draw = function(container){
        this.canvas =  document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.position = "absolute";
        this.canvas.style.left = this.x+container.getBoundingClientRect().left;
        this.canvas.style.top = this.y+container.getBoundingClientRect().top;
        var cxt = this.canvas.getContext('2d');
        cxt.beginPath();
        cxt.strokeStyle = "#000";
        cxt.fillStyle = '#FFC107';
        cxt.lineWidth = 1;
        cxt.fillRect(2, 2, this.width-5, this.height-5);
        cxt.strokeRect(2, 2, this.width-5, this.height-5);
        cxt.closePath();
        cxt.font = "14px 微软雅黑";
        cxt.fillStyle = "black";
        cxt.textBaseline = 'middle';
        cxt.textAlign = 'center';
        cxt.fillText("兵站", this.width/2, this.height/2);
        container.appendChild(this.canvas);
        return this.canvas;
    }
    this.rotate = function(){
        var cxt = this.canvas.getContext('2d');
        cxt.rotate(Math.PI/2);
    }
}

// middleCamp 中间兵营
var MiddleCamp = function(x, y,w, h){
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.draw = function(container){
        this.canvas =  document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.position = "absolute";
        this.canvas.style.left = this.x+container.getBoundingClientRect().left;
        this.canvas.style.top = this.y+container.getBoundingClientRect().top;
        var cxt = this.canvas.getContext('2d');
        cxt.beginPath();
        cxt.strokeStyle = "#000";
        cxt.fillStyle = '#FFC107';
        // cxt.globalAlpha = 1;
        cxt.lineWidth = 1;
        cxt.fillRect(2, 2, this.width-5, this.height-5);
        cxt.strokeRect(2, 2, this.width-5, this.height-5);
        cxt.closePath();
        cxt.font = "14px 微软雅黑";
        cxt.fillStyle = "black";
        cxt.textBaseline = 'middle';
        cxt.textAlign = 'center';
        cxt.fillText("兵站", this.width/2, this.height/2);
        container.appendChild(this.canvas);
        return this.canvas;
    }
    this.rotate = function(){
        var cxt = this.canvas.getContext('2d');
        cxt.rotate(Math.PI/2);
    }
}
// 行营
var MoveCamp = function(x, y, w, h){
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.draw = function(container){
        this.canvas =  document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.position = "absolute";
        this.canvas.style.left = this.x+container.getBoundingClientRect().left;
        this.canvas.style.top = this.y+container.getBoundingClientRect().top;
        var cxt = this.canvas.getContext('2d');
        cxt.beginPath();
        cxt.fillStyle = '#FFC107';
        cxt.strokeStyle = "#000";
        cxt.lineWidth = 1;
        cxt.arc( this.width/2, this.height/2, this.height/2-2, 0, 2*Math.PI);
        cxt.stroke();
        cxt.fill();
        cxt.closePath();
        cxt.font = "14px 微软雅黑";
        cxt.fillStyle = "black";
        cxt.textBaseline = 'middle';
        cxt.textAlign = 'center';
        cxt.fillText("行营", this.width/2, this.height/2);
        container.appendChild(this.canvas);
        return this.canvas;
    }
    
}

// 大本营
var SupremeCamp = function(x, y, w, h){
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.draw = function(container){
        this.canvas =  document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height+30;
        this.canvas.style.position = "absolute";
        this.canvas.style.left =  this.x+container.getBoundingClientRect().left;
        this.canvas.style.top = this.y-30+container.getBoundingClientRect().top;
        var cxt = this.canvas.getContext('2d');
        cxt.beginPath();
        cxt.fillStyle = "#000";
        cxt.strokeStyle = "#000";
        cxt.lineWidth = 2;
        cxt.fillRect(2, 30, this.width, this.height);
        cxt.arc(this.width/2, 32, 20, Math.PI, 2*Math.PI);
        cxt.stroke();
        cxt.fill();
        cxt.closePath();
        cxt.font = "16px 微软雅黑";
        cxt.fillStyle = "white";
        cxt.textBaseline = 'top';
        cxt.textAlign = 'center';
        cxt.fillText("大本营", this.width/2, this.height);
        container.appendChild(this.canvas);
        return this.canvas;
    }
}

// 旗子
var ArmyPiece = function(name){
    this.width = 70;
    this.height = 30;
    this.name = name;
    this.b_textShow = false;
    this.show = function(flag){
        this.textShow = flag;
    }
    
    this.setColor = function(color){
        this.color = color;
    }
    this.setLocation = function(x,y){
        this.x = x;
        this.y = y;
    }
    this.draw = function(container){
        this.canvas =  document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.position = "absolute";
        this.canvas.style.left = this.x+container.getBoundingClientRect().left;
        this.canvas.style.top = this.y+container.getBoundingClientRect().top;
        var cxt = this.canvas.getContext('2d');
        cxt.beginPath();
        cxt.strokeStyle = "#000";
        cxt.fillStyle = this.color;
        cxt.lineWidth = 2;
        cxt.fillRect(2, 2, this.width-5, this.height-5);
        cxt.strokeRect(2, 2, this.width-5, this.height-5);
        cxt.closePath();
        if(this.b_textShow){
            cxt.font = "bold 17px 微软雅黑";
            cxt.fillStyle = "black";
            cxt.textBaseline = 'middle';
            cxt.textAlign = 'center';
            cxt.fillText(name, this.width/2, this.height/2);
        }
        container.appendChild(this.canvas);
        return this.canvas;
    }
    this.rotate = function(){
        var cxt = this.canvas.getContext('2d');
        cxt.rotate(Math.PI/2);
    }
}

var pieces =['军旗','司令','军长','师长','师长','旅长','旅长','团长','团长','营长','营长','炸弹','炸弹','连长','连长','连长','排长','排长', '排长','工兵','工兵','工兵','地雷','地雷','地雷'];
var redPieces = [];
var yellowPieces = [];
var bluePieces = [];
var greenPieces = [];
var init4Player = function (){
    for(var i = 0 ; i < pieces.length; i++){
        var piece = new ArmyPiece(pieces[i]);
        piece.setColor('#FF3030');
        redPieces.push(piece);
        piece = new ArmyPiece(pieces[i]);
        piece.setColor('#eec900');
        yellowPieces.push(piece);
        piece = new ArmyPiece(pieces[i]);
        piece.setColor('#5CACEE');
        bluePieces.push(piece);
        piece = new ArmyPiece(pieces[i]);
        piece.setColor('#66cd00');
        greenPieces.push(piece);
    }
}
// 初始化四个选手
init4Player();
const baseCampWidth = 70;
const baseCampHeight = 25;
const moveCampWidth = 70;
const moveCampHeight = 60;
const supremeCampWidth = 90;
const supremeCampHeight = 25;
const marginLeft = 100;
const marginTop = 10;
const hGap = 20;
const vGap = 20;

var createSeat = function(redSeat, pieces){
    var bgCanvas =  document.createElement('canvas');
   bgCanvas.width = 600;
   bgCanvas.height = 280;
   redSeat.appendChild(bgCanvas);
   var bgCxt = bgCanvas.getContext('2d');
   bgCxt.strokeStyle = "#000";
   bgCxt.lineWidth  = 2;
   //横向路径
   for(var row = 0 ; row < 6; row++){
       if(row === 0 || row === 4){
          bgCxt.lineWidth = 10;
       }else{
          bgCxt.lineWidth = 2;
       }
        bgCxt.beginPath();
        bgCxt.moveTo(marginLeft, row * (30+vGap)+marginTop);
        for(var col = 1; col < 5; col++){
            bgCxt.lineTo(col*(baseCampWidth + hGap)+marginLeft, row * (30 + vGap)+marginTop);
        }
        bgCxt.stroke();
        bgCxt.closePath();
    }
    
    //纵向路径
    for(var col = 0 ; col < 5; col++){
        if(col === 0 || col === 4){
           bgCxt.lineWidth = 10;
        }else{
           bgCxt.lineWidth = 2;
        }
        bgCxt.beginPath();
        bgCxt.moveTo(col*(baseCampWidth + hGap) +marginLeft, marginTop);
        for(var row = 1; row < 6; row++){
            bgCxt.lineTo(col*(baseCampWidth + hGap)+marginLeft, row * (30 + vGap)+marginTop);
            
            if(row===4){
                bgCxt.stroke();
                bgCxt.closePath();
                bgCxt.lineWidth = 2;    
            }
            bgCxt.stroke();
        }
        
    }
    //交叉路径
    bgCxt.lineWidth  = 2;
    bgCxt.moveTo(marginLeft, marginTop);
    bgCxt.lineTo(marginLeft+ 4*(baseCampWidth+hGap), marginTop+ 4*(vGap+30));
    bgCxt.stroke();
    bgCxt.moveTo(marginLeft + 4*(baseCampWidth+hGap), marginTop);
    bgCxt.lineTo(marginLeft, marginTop+ 4*(vGap+30));
    bgCxt.stroke();
    bgCxt.moveTo(marginLeft ,marginTop + 2*(vGap+30));
    bgCxt.lineTo(marginLeft+ 2*(baseCampWidth+hGap), marginTop);
    bgCxt.lineTo(marginLeft+ 4*(baseCampWidth+hGap), marginTop+2*(vGap+30));
    bgCxt.lineTo(marginLeft+ 2*(baseCampWidth+hGap), marginTop+4*(vGap+30));
    bgCxt.lineTo(marginLeft , marginTop + 2*(vGap+30));
    bgCxt.stroke();

    var pieceIdx = 0;    
    for(var row = 0 ; row < 6; row++){
        for(var col = 0; col < 5; col++){
            if((row == 1 && col == 1) || (row == 1 && col == 3) || (row ==2 && col==2) || (row ==3 && col==1) || (row ==3 && col==3)) {
               var moveCamp = new MoveCamp(col*(moveCampWidth+hGap) + marginLeft - baseCampWidth/2+4, row * (vGap+30)+marginTop-moveCampHeight/2+4, moveCampWidth, moveCampHeight);
               moveCamp.draw(redSeat);
            }else if((row == 5 && col == 1) || (row == 5 && col == 3)){
                var x = col*(supremeCampWidth+hGap-20) + marginLeft - supremeCampWidth/2+4;
                var y = row * (vGap+30)+marginTop-supremeCampHeight/2+4;
                var supremeCamp = new SupremeCamp(x, y, supremeCampWidth, supremeCampHeight);
                supremeCamp.draw(redSeat);
                var armyPiece = pieces[pieceIdx++];
                armyPiece.setLocation(x+10, y-2 );
                armyPiece.draw(redSeat);
            }else{
                var x = col * (baseCampWidth + hGap ) + marginLeft -baseCampWidth/2+4;
                var y = row * (vGap+30)+marginTop-baseCampHeight/2+4;
                var camp =  new BaseCamp(x, y , baseCampWidth, baseCampHeight);
                camp.draw(redSeat);
               var armyPiece = pieces[pieceIdx++];
               armyPiece.setLocation(x, y );
               armyPiece.draw(redSeat);

            }
        }
    }
}
var createMiddleGround = function(){
 var canvas = document.createElement('canvas');
   canvas.style.position = "absolute";
   canvas.style.left = 0;
   canvas.style.top =0 ;
   canvas.width = 1400;
   canvas.height = 925;
   var c = canvas.getContext('2d');
   document.body.appendChild(canvas);
   c.lineWidth = 6;
   // 横1
   c.moveTo(446, 298);
   c.lineTo(1318,298);
   // 横2
   c.moveTo(446, 474);
   c.lineTo(1318,474);
   // 横3
   c.moveTo(446, 652);
   c.lineTo(1318,652);
   // 纵1
   c.moveTo(705, 276);
   c.lineTo(705, 672);
   // 纵2
   c.moveTo(882, 276);
   c.lineTo(882, 672);
   // 纵3
   c.moveTo(1061, 276);
   c.lineTo(1061, 672);
   //####################################
   // 左上
   c.moveTo(446,298)
   c.bezierCurveTo(446,298, 705,300, 705,276);
   // 左下
   c.moveTo(446,652)
   c.bezierCurveTo(446,652, 705,650, 705,672);
   // 右下
   c.moveTo(1318,652)
   c.bezierCurveTo(1318,652, 1061,650, 1061,672);
   // 右上
   c.moveTo(1318,298)
   c.bezierCurveTo(1318,298, 1061,300, 1061,276);
   c.stroke();

   var midCamp1 = new MiddleCamp(700 - 30, 294-2, 60,60);
   midCamp1.draw(document.body)
   var midCamp2 = new MiddleCamp(874 - 30, 294-2, 60,60);
   midCamp2.draw(document.body)
   var midCamp3 = new MiddleCamp(1055 - 30, 294-2, 60,60);
   midCamp3.draw(document.body)
   var midCamp4 = new MiddleCamp(700 - 30, 470-30, 60,60);
   midCamp4.draw(document.body)
   var midCamp5 = new MiddleCamp(874 - 30, 470-30, 60,60);
   midCamp5.draw(document.body)
   var midCamp6 = new MiddleCamp(1055 - 30, 470-30, 60,60);
   midCamp6.draw(document.body)
   var midCamp7 = new MiddleCamp(700 - 30, 650-50, 60,60);
   midCamp7.draw(document.body)
   var midCamp8 = new MiddleCamp(874 - 30, 650-50, 60,60);
   midCamp8.draw(document.body)
   var midCamp9 = new MiddleCamp(1055 - 30, 650-50, 60,60);
   midCamp9.draw(document.body)
}

window.onload = function(){
   var redSeat = document.getElementById('redSeat');
   var yellowSeat = document.getElementById('yellowSeat');
   var blueSeat = document.getElementById('blueSeat');
   var greenSeat = document.getElementById('greenSeat');


   createMiddleGround();
  

   createSeat(redSeat, redPieces);
   redSeat.style.transform = 'rotate(180deg)';
   redSeat.style.marginRight= 750;
   createSeat(yellowSeat,yellowPieces);
   yellowSeat.style.transform = 'rotate(90deg)';
   for(var i = 1 ; i < yellowSeat.children.length; i++){
      yellowSeat.children[i].style.top =   yellowSeat.children[i].offsetTop - 306.5 +16;
    };
   yellowSeat.style.marginTop = 70;
   createSeat(blueSeat, bluePieces);
   createSeat(greenSeat, greenPieces);
   greenSeat.style.transform = 'rotate(270deg)';
    for(var i = 1 ; i < greenSeat.children.length; i++){
      greenSeat.children[i].style.top =   greenSeat.children[i].offsetTop - 306.5 +14;
      greenSeat.children[i].style.left =   greenSeat.children[i].offsetLeft -670 - 600 +60 ;
    };
}

