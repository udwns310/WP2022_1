function leftClick(element, id) {
    if(isGameEnd==true) return;
    console.log("left mouse button clicked");
    const i = parseInt(id / width);
    const j = id % width;
    let ii, jj;
    if (isStarted == false) {
        for (k = 0; k < nBombs; k++) {
            ii = i; jj = j;
            while ((ii - i) * (ii - i) < 2 && (jj-j) * (jj-j) <2 && cells[ii * width +jj] ==0) {
                ii = Math.floor((Math.random() * height));
                jj = Math.floor((Math.random() * width));
            }
            document.getElementById(String(ii * width + jj)).style.backgroundColor = 'black'; //폭탄 위치 보여주기
            cells[ii * width + jj] = 1;
        }
        myInterval = setInterval(timeCount, 1000);
        isStarted = true;
    }
    openCells(i, j);
}//

function rightClick(element, id){
    if(isGameEnd==true) return;
    console.log("right mouse button clicked");
    if(remainBombs==0 && checked[id]==0) return;
    const i = parseInt(id / width);
    const j = id % width;
    if(checked[id]==1){
        checked[id] = 0;
        remainBombs++;
        document.getElementById(String(i * width + j)).style.backgroundColor = 'lightgray';
    } else {
        checked[id]=1;
        remainBombs--;
        document.getElementById(String(i * width + j)).style.backgroundColor = 'orange';
    }
    document.getElementById('bomb').innerHTML = leadingZeros(remainBombs, 3);
}//

function bothClick(element, id){
    if(isGameEnd==true) return;
    console.log("both mouse button clicked");
}//

function openCell(i, j) {
    let id = i * width + j;
    bombs = bombCount(i,j);
    extBombCount = "<span class='count cnt" + bombs + "'>" + (bombs?bombs:"") + "</span>";

    document.getElementById(String(id)).className = 'cellOpen';
    document.getElementById(String(id)).innerHTML = extBombCount;
}//

function openCells(p,q){
    let visited = Array(arraySize);
    visited.fill(0);
    let queue = Array(arraySize);
    queue.fill(0);
    front =0;
    rear = 0;
    function deq(){
        return queue[front++];
    }
    function enq(id){
        queue[rear++] = id;
    }
    let i = p;
    let j = q;
    let ii;
    let jj;

    let id = i * width + j;
    if(cells[id] ==2) return;
        if(checked[id]==1) return;
    if(cells[id] ==1){
        document.getElementById(String(id)).style.backgroundColor = 'red';
        gameOver();
        return;
    }
    openCell(i, j);
    if (visited[id] == 0 && bombCount(i, j) ==0){
        enq(i * width +j);
    }
    visited[i * width + j] = 1;
    while(front != rear) {
        id = deq();
        i = parseInt(id/width);
        j = id % width;
        openCell(i,j);
        for(let k =0; k<8; k++){
            ii = i + neighbor[k][0];
            jj = j + neighbor[k][1];
            if( ii<0 || 16 <= ii) continue;
            if(jj<0 || 30 <= jj) continue;
            openCell(ii,jj);
            iidd= ii * width + jj;
            if(visited[iidd] ==0 && bombCount(ii, jj) ==0){
                enq(iidd);
            }
            visited[iidd] = 1;

        }
    }
    for(let i =0; i<height; i++){
        for(let j = 0; j<width; j++){
            id = i * width + j;
            if(cells[id] ==1 )return;

        }
    }
    gameOver();
}//

function gameOver(){
    isGameEnd = true;
    clearInterval(myInterval);
    for(let i =0; i < height; i++){
        for(let j =0; j < width; j++){
            id = i * width + j;
            if(cells[id] = 1){
                document.getElementById(String(id)).innerHTML = "<span class='bomb'>◎</span>";
            }
            if(cells[id] == 0 && checked[id]==1){
                document.getElementById(String(id)).style.backgroundColor= 'red';
                document.getElementById(String(id)).innerHTML="<span class='bomb cnt7'>●</span>";
            }
        }
    }
}//

function timeCount() {
    curTime++;
    document.getElementById('time').innerHTML = leadingZeros(curTime, 3)
    if(curTime == 999){
        gameOver();
    }
}//

function leadingZeros(n, digits) {
    var zero = '';
    n = n.toString();
    if (n.length < digits) {
        for (var i = 0; i < digits - n.length; i++) {
            zero += 0;
        }
    }
    return zero + n;

}//

function bombCount(i, j) {
    let bombCount = 0;
    let ii;
    let jj;
    for (let k = 0; k < 8; k++) {
        ii = i + neighbor[k][0];
        jj = j + neighbor[k][1];
        if (ii < 0 || ii >= height) continue;
        if (jj < 0 || jj >= width) continue;
        if (cells[ii * width + jj] == 1) bombCount++;
    }
    return bombCount;
}//

function mouseDown(e, element, id){
    console.log("Down " + e.button + " " + leftMB + " " + rightMB);
    if(e.button ==0) leftMB =true;
    else if (e.button ==2) rightMB = true;
}//

function mouseUp(e, element, id){
    console.log("Up " + e.button + " " + leftMB + " " + rightMB);
    if(bothMB == true) {
        leftMB : false;
        rightMB: false;
        bothMB: false;
        return;
    }
    if(e.button == 0) {
        if(rightMB == false) leftClick(element, id);
        else{
            bothMB = true;
            bothClick(element, id);
        }
        leftMB =false;
    }
    else if(e.button == 2){
        if(leftMB == false) rightClick(element, id);
        else{
            bothMB = true;
            bothClick(element, id);
        }
        rightMB = false;
    }
}//

function doNothing(e){
    e.preventDefault();
}//