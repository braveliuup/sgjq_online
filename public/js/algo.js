
function checkOnRailRoad(firstCamp){
    var onRailFlag = true;
    if(firstCamp.colIdx ==0 || firstCamp.rowIdx ==0 || firstCamp.colIdx ==16|| firstCamp.rowIdx == 16){
        onRailFlag = false;
    }
    railRoadBound.forEach(function(item, key){
        if(firstCamp.colIdx > item.lt.x && firstCamp.colIdx < item.rb.x && firstCamp.rowIdx > item.lt.y && firstCamp.rowIdx < item.rb.y){
            onRailFlag = false;
            return false;
        }
    });
    if(firstCamp.type == ''){
        onRailFlag = false;
    }
    return onRailFlag;
}
function  getTeamType(type){
    var teamType = '';
    switch(type)
    {
        case "red":
        teamType = 'green';
        break;
        case "yellow":
        teamType = 'blue';
        break;
        case "green":
        teamType = 'red';
        break;
        case "blue":
        teamType = 'yellow';
        break;
    }
    return teamType;
}

function beginSearch(originCamp, availableCamps){
    var campLT = chessBoard[originCamp.rowIdx -1][originCamp.colIdx-1];
    var campLB = chessBoard[originCamp.rowIdx -1][originCamp.colIdx+1];
    var campRB = chessBoard[originCamp.rowIdx +1][originCamp.colIdx+1];
    var campRT = chessBoard[originCamp.rowIdx +1][originCamp.colIdx-1];

    var ary = [];
    [campLT, campLB, campRB, campRT].forEach(function(item, idx){
        if(item.type == '行营' && item.filledChess == null){
            ary.push(item);
        }
        var teamType = getTeamType(firstCamp.filledChess.type);
        if(item.filledChess ){
            if(item.filledChess.type == firstCamp.filledChess.type || item.filledChess.type == teamType){
            }else{
                ary.push(item);
            }
        }else if(item.type == '兵站'){
            ary.push(item);
        }
    });
    var campUp, campDown, campLeft, campRight;
    var campUpRowIdx = originCamp.rowIdx;
    var campDownRowIdx = originCamp.rowIdx;
    var campLeftColIdx = originCamp.colIdx;
    var campRightColIdx = originCamp.colIdx;
    while(campUpRowIdx > 0){
        campUpRowIdx--;
        campUp = chessBoard[campUpRowIdx][originCamp.colIdx];
        if(campUp.type != ''){
            break;
        }
    }
     while(campDownRowIdx < 16){
        campDownRowIdx++;
        campDown = chessBoard[campDownRowIdx][originCamp.colIdx];
        if(campDown.type != ''){
            break;
        }
    }
     while(campLeftColIdx > 0){
        campLeftColIdx--;
        campLeft = chessBoard[originCamp.rowIdx][campLeftColIdx];
        if(campLeft.type != ''){
            break;
        }
    }
     while(campRightColIdx < 16){
        campRightColIdx++;
        campRight = chessBoard[originCamp.rowIdx][campRightColIdx];
        if(campRight.type != ''){
            break;
        }
    }
    [campUp, campDown, campLeft, campRight].forEach(function(item, idx){
        if(item.filledChess){
            var teamType = getTeamType(firstCamp.filledChess.type);
            if(item.filledChess.type == firstCamp.filledChess.type || item.filledChess.type == teamType){
                return false;
            }
        } else{
            if(item.type == ''){
                return false;
            }
        }
        ary.push(item);
    });

    console.log('对', originCamp.rowIdx, originCamp.colIdx,'进行递归，可用营地是');
    ary.forEach(function(item){
        console.log('行列:',item.rowIdx+","+item.colIdx);
    });
    for(var i = 0; i < ary.length; i++){
        var camp = ary[i];
        if(camp.type == '' ) continue;
        if(!camp.filledChess){
            if(checkOnRailRoad(camp)){
                var addSuccess = addChessOnRail(camp,availableCamps );
                if(addSuccess){
                    beginSearch(camp,availableCamps);
                }
            }else{
                if(Math.abs(camp.rowIdx - originCamp.rowIdx) <=1 && Math.abs(camp.colIdx - originCamp.colIdx)<=1){
                    addToAvailCamps(availableCamps,camp);
                }
            }
        }else{
            if(camp.filledChess.type != firstCamp.filledChess.type && camp.type != '行营'){
                if(checkOnRailRoad(camp)){
                        addChessOnRail(camp,availableCamps );
                }else{
                    if(Math.abs(camp.rowIdx - originCamp.rowIdx) <=1 && Math.abs(camp.colIdx - originCamp.colIdx)<=1){
                        addToAvailCamps(availableCamps,camp);
                    }
                }
            }
        }
    }
}

function addToAvailCamps(availableCamps,camp){
    if(availableCamps.indexOf(camp) == -1 && camp.type != ''){
        availableCamps.push(camp);
        return true;
    }
    return false;
}

function addChessOnRail(camp,availableCamps ){
    var addSuccess = false;
    if(firstCamp.filledChess.name == '工兵'){
        addSuccess = addToAvailCamps(availableCamps,camp);
    }else{
        if(firstCamp.rowIdx - camp.rowIdx == 0 || firstCamp.colIdx - camp.colIdx ==0 ){
            addSuccess =   addToAvailCamps(availableCamps,camp);
        }
        /////////////
        if(firstCamp.rowIdx == 6 && camp.colIdx == 6 && firstCamp.colIdx < camp.colIdx && firstCamp.rowIdx > camp.rowIdx){
            addSuccess =    addToAvailCamps(availableCamps,camp);
        }
        if(firstCamp.colIdx == 6 && camp.rowIdx == 6 && firstCamp.colIdx > camp.colIdx && firstCamp.rowIdx < camp.rowIdx){
            addSuccess =  addToAvailCamps(availableCamps,camp);
        }
        //////////
        if(firstCamp.rowIdx == 6 && camp.colIdx == 10 && firstCamp.colIdx > camp.colIdx && firstCamp.rowIdx > camp.rowIdx){
            addSuccess =   addToAvailCamps(availableCamps,camp);
        }
        if(firstCamp.colIdx == 10 && camp.rowIdx == 6 && firstCamp.colIdx < camp.colIdx && firstCamp.rowIdx < camp.rowIdx){
            addSuccess =   addToAvailCamps(availableCamps,camp);
        }
        ////////////////    
        if(firstCamp.rowIdx == 10 && camp.colIdx == 6 && firstCamp.colIdx < camp.colIdx && firstCamp.rowIdx < camp.rowIdx){
            addSuccess =  addToAvailCamps(availableCamps,camp);
        }
        if(firstCamp.colIdx == 6 && camp.rowIdx == 10 && firstCamp.colIdx > camp.colIdx && firstCamp.rowIdx > camp.rowIdx){
            addSuccess =   addToAvailCamps(availableCamps,camp);
        }
        /////////////////
        if(firstCamp.rowIdx == 10 && camp.colIdx == 10 && firstCamp.colIdx > camp.colIdx && firstCamp.rowIdx < camp.rowIdx){
            addSuccess =   addToAvailCamps(availableCamps,camp);
        }
        if(firstCamp.colIdx == 10 && camp.rowIdx == 10 && firstCamp.colIdx < camp.colIdx && firstCamp.rowIdx > camp.rowIdx){
            addSuccess =   addToAvailCamps(availableCamps,camp);
        }
    }
    return addSuccess;
}
