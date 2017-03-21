
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

function beginSearch(originCamp, availCamps){
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
                var addSuccess = addChessOnRail(camp,availCamps );
                if(addSuccess){
                    beginSearch(camp,availCamps);
                }
            }else{
                if(Math.abs(camp.rowIdx - originCamp.rowIdx) <=1 && Math.abs(camp.colIdx - originCamp.colIdx)<=1){
                    addToAvailCamps(availCamps,camp);
                }
            }
        }else{
            if(camp.filledChess.type != firstCamp.filledChess.type && camp.type != '行营'){
                if(checkOnRailRoad(camp)){
                        addChessOnRail(camp,availCamps );
                }else{
                    if(Math.abs(camp.rowIdx - originCamp.rowIdx) <=1 && Math.abs(camp.colIdx - originCamp.colIdx)<=1){
                        addToAvailCamps(availCamps,camp);
                    }
                }
            }
        }
    }
}

function addToAvailCamps(availCamps,camp){
    if(availCamps.indexOf(camp) == -1 && camp.type != ''){
        availCamps.push(camp);
        return true;
    }
    return false;
}

function addChessOnRail(camp,availCamps, firstCamp ){
    var addSuccess = false;
    if(firstCamp.filledChess.name == '工兵'){
        addSuccess = addToAvailCamps(availCamps,camp);
    }else{
        if(firstCamp.rowIdx - camp.rowIdx == 0 || firstCamp.colIdx - camp.colIdx ==0 ){
            addSuccess =   addToAvailCamps(availCamps,camp);
        }
        /////////////
        if(firstCamp.rowIdx == 6 && camp.colIdx == 6 && firstCamp.colIdx < camp.colIdx && firstCamp.rowIdx > camp.rowIdx){
            addSuccess =    addToAvailCamps(availCamps,camp);
        }
        if(firstCamp.colIdx == 6 && camp.rowIdx == 6 && firstCamp.colIdx > camp.colIdx && firstCamp.rowIdx < camp.rowIdx){
            addSuccess =  addToAvailCamps(availCamps,camp);
        }
        //////////
        if(firstCamp.rowIdx == 6 && camp.colIdx == 10 && firstCamp.colIdx > camp.colIdx && firstCamp.rowIdx > camp.rowIdx){
            addSuccess =   addToAvailCamps(availCamps,camp);
        }
        if(firstCamp.colIdx == 10 && camp.rowIdx == 6 && firstCamp.colIdx < camp.colIdx && firstCamp.rowIdx < camp.rowIdx){
            addSuccess =   addToAvailCamps(availCamps,camp);
        }
        ////////////////    
        if(firstCamp.rowIdx == 10 && camp.colIdx == 6 && firstCamp.colIdx < camp.colIdx && firstCamp.rowIdx < camp.rowIdx){
            addSuccess =  addToAvailCamps(availCamps,camp);
        }
        if(firstCamp.colIdx == 6 && camp.rowIdx == 10 && firstCamp.colIdx > camp.colIdx && firstCamp.rowIdx > camp.rowIdx){
            addSuccess =   addToAvailCamps(availCamps,camp);
        }
        /////////////////
        if(firstCamp.rowIdx == 10 && camp.colIdx == 10 && firstCamp.colIdx > camp.colIdx && firstCamp.rowIdx < camp.rowIdx){
            addSuccess =   addToAvailCamps(availCamps,camp);
        }
        if(firstCamp.colIdx == 10 && camp.rowIdx == 10 && firstCamp.colIdx < camp.colIdx && firstCamp.rowIdx > camp.rowIdx){
            addSuccess =   addToAvailCamps(availCamps,camp);
        }
    }
    return addSuccess;
}

function canAttack(camp, originCamp){
    if(camp.filledChess.type == originCamp.filledChess.type){
        return false;
    }
    var teamType  = getTeamType(originCamp.filledChess.type);
    if(camp.filledChess.type == teamType){
        return false;
    }
    return true;
}
function computeAvailCamp(originCamp){
    var availCamps = [];
    var camp = originCamp;
    var teamType = getTeamType(originCamp.filledChess.type);
    
    if(!checkOnRailRoad(originCamp)){
        var temp = [];
        if(originCamp.type == '行营'){
            var campLT = chessBoard[camp.rowIdx -1][camp.colIdx-1];
            var campLB = chessBoard[camp.rowIdx -1][camp.colIdx+1];
            var campRB = chessBoard[camp.rowIdx +1][camp.colIdx+1];
            var campRT = chessBoard[camp.rowIdx +1][camp.colIdx-1];
            var campU = chessBoard[originCamp.rowIdx-1][originCamp.colIdx];
            var campB = chessBoard[originCamp.rowIdx+1][originCamp.colIdx];
            var campL = chessBoard[originCamp.rowIdx][originCamp.colIdx-1];
            var campR = chessBoard[originCamp.rowIdx][originCamp.colIdx+1];
            temp = [campU, campB, campL , campR,campLT,campLB, campRB, campRT];
        }
        if(originCamp.type == '兵站'){
            if(originCamp.rowIdx-1 >0){
                var campU = chessBoard[originCamp.rowIdx-1][originCamp.colIdx];
                temp.push(campU);
            }
            if(originCamp.rowIdx+1 < 17){
                var campB = chessBoard[originCamp.rowIdx+1][originCamp.colIdx];
                temp.push(campB);
            }
            if(originCamp.colIdx-1 > 0){
                var campL = chessBoard[originCamp.rowIdx][originCamp.colIdx-1];
                temp.push(campL);
            }
            if(originCamp.colIdx +1 <17){
                var campR = chessBoard[originCamp.rowIdx][originCamp.colIdx+1];
                temp.push(campR);
            }
        }
        temp.forEach(function(item){
            if(!item.filledChess){
                if(item.type != ''){
                    availCamps.push(item);
                }
            }else{
                if((item.type == '兵站' || item.type == '大本营') && canAttack(item, originCamp)) {
                    availCamps.push(item);
                }
            }
        });
        return availCamps;
    }

    if(checkOnRailRoad(originCamp)){
        function beginSearch(camp){
            var ary = [];
            var campLT = chessBoard[camp.rowIdx -1][camp.colIdx-1];
            var campLB = chessBoard[camp.rowIdx -1][camp.colIdx+1];
            var campRB = chessBoard[camp.rowIdx +1][camp.colIdx+1];
            var campRT = chessBoard[camp.rowIdx +1][camp.colIdx-1];

            [campLT, campLB, campRB, campRT].forEach(function(item, idx){
                if(item.type == '行营' && item.filledChess == null){
                    ary.push(item);
                }
                var teamType = getTeamType(originCamp.filledChess.type);
                if(item.filledChess ){
                    if(item.filledChess.type == originCamp.filledChess.type || item.filledChess.type == teamType){
                    }else{
                        ary.push(item);
                    }
                }else if(item.type == '兵站'){
                    ary.push(item);
                }
            });

            var campUp, campDown, campLeft, campRight;
            var campUpRowIdx = camp.rowIdx;
            var campDownRowIdx = camp.rowIdx;
            var campLeftColIdx = camp.colIdx;
            var campRightColIdx = camp.colIdx;
            while(campUpRowIdx > 0){
                campUpRowIdx--;
                campUp = chessBoard[campUpRowIdx][camp.colIdx];
                if(campUp.type != ''){
                    break;
                }
            }
            while(campDownRowIdx < 16){
                campDownRowIdx++;
                campDown = chessBoard[campDownRowIdx][camp.colIdx];
                if(campDown.type != ''){
                    break;
                }
            }
            while(campLeftColIdx > 0){
                campLeftColIdx--;
                campLeft = chessBoard[camp.rowIdx][campLeftColIdx];
                if(campLeft.type != ''){
                    break;
                }
            }
            while(campRightColIdx < 16){
                campRightColIdx++;
                campRight = chessBoard[camp.rowIdx][campRightColIdx];
                if(campRight.type != ''){
                    break;
                }
            }
            [campUp, campDown, campLeft, campRight].forEach(function(item, idx){
                if(item.filledChess){
                    var teamType = getTeamType(originCamp.filledChess.type);
                    if(item.filledChess.type == originCamp.filledChess.type || item.filledChess.type == teamType){
                        return false;
                    }
                } else{
                    if(item.type == ''){
                        return false;
                    }
                }
                ary.push(item);
            });

            console.log('对', camp.rowIdx, camp.colIdx,'进行递归，可用营地是');
            ary.forEach(function(item){
                console.log('行列:',item.rowIdx+","+item.colIdx);
            });
            for(var i = 0; i < ary.length; i++){
                var camp = ary[i];
                if(camp.type == '' ) continue;
                if(!camp.filledChess){
                    if(checkOnRailRoad(camp)){
                        var addSuccess = addChessOnRail(camp,availCamps ,originCamp );
                        if(addSuccess){
                            beginSearch(camp,availCamps);
                        }
                    }else{
                        if(Math.abs(camp.rowIdx - originCamp.rowIdx) <=1 && Math.abs(camp.colIdx - originCamp.colIdx)<=1){
                            addToAvailCamps(availCamps,camp);
                        }
                    }
                }else{
                    if(camp.filledChess.type != teamType && camp.filledChess.type != originCamp.filledChess.type && camp.type != '行营'){
                        if(checkOnRailRoad(camp)){
                                addChessOnRail(camp,availCamps ,originCamp);
                        }else{
                            if(Math.abs(camp.rowIdx - originCamp.rowIdx) <=1 && Math.abs(camp.colIdx - originCamp.colIdx)<=1){
                                addToAvailCamps(availCamps,camp);
                            }
                        }
                    }
                }
            }
        }
        beginSearch(originCamp);
        return availCamps;
    }
    return  availCamps;
}