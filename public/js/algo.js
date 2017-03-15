
function checkOnRailRoad(firstCamp){
    var onRailFlag = true;
    if(firstCamp.colIdx ==0 || firstCamp.rowIdx ==0 || firstCamp.colIdx ==16|| firstCamp.rowIdx == 16){
        console.log('不在铁道上')
        onRailFlag = false;
    }
    railRoadBound.forEach(function(item, key){
        if(firstCamp.colIdx > item.lt.x && firstCamp.colIdx < item.rb.x && firstCamp.rowIdx > item.lt.y && firstCamp.rowIdx < item.rb.y){
            console.log('不在铁道上');
            onRailFlag = false;
            return false;
        }
    });
    if(firstCamp.type == ''){
        console.log('不在铁道上')
        onRailFlag = false;
    }
    return onRailFlag;
}


function beginSearch(originCamp, availableCamps){
    var campLT = chessBoard[originCamp.rowIdx -1][originCamp.colIdx-1];
    var campLB = chessBoard[originCamp.rowIdx -1][originCamp.colIdx+1];
    var campRB = chessBoard[originCamp.rowIdx +1][originCamp.colIdx+1];
    var campRT = chessBoard[originCamp.rowIdx +1][originCamp.colIdx-1];
    var camp2 = chessBoard[originCamp.rowIdx +1][originCamp.colIdx];
    var camp3 = chessBoard[originCamp.rowIdx][originCamp.colIdx-1];
    var camp4 = chessBoard[originCamp.rowIdx][originCamp.colIdx+1];

    var ary = [];
    [campLT, campLB, campRB, campRT].forEach(function(item, idx){
        if(item.type == '行营'){
            ary.push(item);
        }
    });
    var camp1, camp2, camp3, camp4;
    var camp1RowIdx = originCamp.rowIdx;
    var camp2RowIdx = originCamp.rowIdx;
    var camp3ColIdx = originCamp.colIdx;
    var camp4ColIdx = originCamp.colIdx;
    while(camp1RowIdx > 0){
        camp1RowIdx--;
        camp1 = chessBoard[camp1RowIdx][originCamp.colIdx];
        if(camp1.type != ''){
            break;
        }
    }
     while(camp2RowIdx > 0){
        camp2RowIdx++;
        camp2 = chessBoard[camp2RowIdx][originCamp.colIdx];
        if(camp2.type != ''){
            break;
        }
    }
     while(camp3ColIdx > 0){
        camp3ColIdx--;
        camp3 = chessBoard[originCamp.rowIdx][camp3ColIdx];
        if(camp3.type != ''){
            break;
        }
    }
     while(camp4ColIdx > 0){
        camp4ColIdx++;
        camp4 = chessBoard[originCamp.rowIdx][camp4ColIdx];
        if(camp4.type != ''){
            break;
        }
    }
    [camp1, camp2, camp3, camp4].forEach(function(item, idx){
        if(item){
            ary.push(item);          
        }
    });


    for(var i = 0; i < ary.length; i++){
        var camp = ary[i];
        if(camp.type == '' ) continue;
        if(!camp.filledChess){
            if(checkOnRailRoad(camp)){
                var addSuccess = false;
                if(firstCamp.filledChess.name == '工兵'){
                    addSuccess = addToAvailCamps(availableCamps,camp);
                }else{
                    if(firstCamp.rowIdx - camp.rowIdx == 0 || firstCamp.colIdx - camp.colIdx ==0 ){
                        addSuccess =    addToAvailCamps(availableCamps,camp);
                    }
                    /////////////
                    if(firstCamp.rowIdx == 6 && camp.colIdx == 6 && firstCamp.colIdx < camp.colIdx && firstCamp.rowIdx > camp.rowIdx){
                        addSuccess =    addToAvailCamps(availableCamps,camp);
                    }
                    if(firstCamp.colIdx == 6 && camp.rowIdx == 6 && firstCamp.colIdx > camp.colIdx && firstCamp.rowIdx < camp.rowIdx){
                        addSuccess =  addToAvailCamps(availableCamps,camp);
                    }
                    //////////
                     if(firstCamp.rowIdx == 6 && camp.colIdx == 11 && firstCamp.colIdx > camp.colIdx && firstCamp.rowIdx > camp.rowIdx){
                        addSuccess =   addToAvailCamps(availableCamps,camp);
                    }
                    if(firstCamp.colIdx == 11 && camp.rowIdx == 6 && firstCamp.colIdx < camp.colIdx && firstCamp.rowIdx < camp.rowIdx){
                        addSuccess =   addToAvailCamps(availableCamps,camp);
                    }
                    ////////////////    
                     if(firstCamp.rowIdx == 11 && camp.colIdx == 6 && firstCamp.colIdx < camp.colIdx && firstCamp.rowIdx < camp.rowIdx){
                        addSuccess =  addToAvailCamps(availableCamps,camp);
                    }
                    if(firstCamp.colIdx == 6 && camp.rowIdx == 11 && firstCamp.colIdx > camp.colIdx && firstCamp.rowIdx > camp.rowIdx){
                        addSuccess =   addToAvailCamps(availableCamps,camp);
                    }
                    /////////////////
                    if(firstCamp.rowIdx == 11 && camp.colIdx == 11 && firstCamp.colIdx > camp.colIdx && firstCamp.rowIdx < camp.rowIdx){
                        addSuccess =   addToAvailCamps(availableCamps,camp);
                    }
                    if(firstCamp.colIdx == 11 && camp.rowIdx == 11 && firstCamp.colIdx < camp.colIdx && firstCamp.rowIdx > camp.rowIdx){
                        addSuccess =   addToAvailCamps(availableCamps,camp);
                    }
                    
                }
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
                   var addSuccess = false;
                    if(firstCamp.filledChess.name == '工兵'){
                        addSuccess = addToAvailCamps(availableCamps,camp);
                    }else{
                        if(firstCamp.rowIdx - camp.rowIdx == 0 || firstCamp.colIdx - camp.colIdx ==0 ){
                            addSuccess =    addToAvailCamps(availableCamps,camp);
                        }
                        /////////////
                        if(firstCamp.rowIdx == 6 && camp.colIdx == 6 && firstCamp.colIdx < camp.colIdx && firstCamp.rowIdx > camp.rowIdx){
                            addSuccess =    addToAvailCamps(availableCamps,camp);
                        }
                        if(firstCamp.colIdx == 6 && camp.rowIdx == 6 && firstCamp.colIdx > camp.colIdx && firstCamp.rowIdx < camp.rowIdx){
                            addSuccess =  addToAvailCamps(availableCamps,camp);
                        }
                        //////////
                        if(firstCamp.rowIdx == 6 && camp.colIdx == 11 && firstCamp.colIdx > camp.colIdx && firstCamp.rowIdx > camp.rowIdx){
                            addSuccess =   addToAvailCamps(availableCamps,camp);
                        }
                        if(firstCamp.colIdx == 11 && camp.rowIdx == 6 && firstCamp.colIdx < camp.colIdx && firstCamp.rowIdx < camp.rowIdx){
                            addSuccess =   addToAvailCamps(availableCamps,camp);
                        }
                        ////////////////    
                        if(firstCamp.rowIdx == 11 && camp.colIdx == 6 && firstCamp.colIdx < camp.colIdx && firstCamp.rowIdx < camp.rowIdx){
                            addSuccess =  addToAvailCamps(availableCamps,camp);
                        }
                        if(firstCamp.colIdx == 6 && camp.rowIdx == 11 && firstCamp.colIdx > camp.colIdx && firstCamp.rowIdx > camp.rowIdx){
                            addSuccess =   addToAvailCamps(availableCamps,camp);
                        }
                        /////////////////
                        if(firstCamp.rowIdx == 11 && camp.colIdx == 11 && firstCamp.colIdx > camp.colIdx && firstCamp.rowIdx < camp.rowIdx){
                            addSuccess =   addToAvailCamps(availableCamps,camp);
                        }
                        if(firstCamp.colIdx == 11 && camp.rowIdx == 11 && firstCamp.colIdx < camp.colIdx && firstCamp.rowIdx > camp.rowIdx){
                            addSuccess =   addToAvailCamps(availableCamps,camp);
                        }
                    }
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

