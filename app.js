const selected = document.getElementsByClassName("selected")[0];
const options = document.getElementsByClassName("options")[0];
const option = Array.from(options.getElementsByTagName("div"))  ;

selected.addEventListener("click", ()=>{
    options.classList.toggle("active");

});

let level;
option.forEach((value)=>{
    value.addEventListener("click", ()=>{
        selected.innerHTML = value.getElementsByTagName("label")[0].innerHTML;
        options.classList.toggle("active",false);
        if(selected.innerHTML == "Easy"){
            level = 30;
        }else if(selected.innerHTML == "Medium"){
            level = 20;
        }else if(selected.innerHTML == "Difficult"){
            level = 10;
        }
    });
})



// setup canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const canvasLen = 600;
canvas.width = canvasLen;
canvas.height = canvasLen;


// calculate index of cell inside the cells array based on location in the matrix
function index(i,j){
    if ( i<0 || i>=rows || j<0 || j>=columns)
    {
        return -1;
    }
    return i*rows + j;
}

// setup cell class
class Cell{
    constructor(i, j){
        this.i = i;
        this.j = j;
        this.walls = {
            top: true,
            right: true,
            bottom: true,
            left: true
        };
        this.visited = false;
        this.neighbours = {
            top: index(i-1, j),
            right: index(i, j+1),
            bottom: index(i+1, j),
            left: index(i, j-1)
        };
        this.highlight = false;
    };
};

// setup nesseccary functions for drawing
let drawWallColor = '#dfebed';
let removeWallColor = '#2b4450';
let lineWidth = 1;

function drawWall(startX, startY,endX, endY){
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = drawWallColor;
    ctx.stroke();
};

function removeWall(startX, startY,width, height){
    ctx.clearRect(startX, startY, width, height);
    ctx.fillStyle = removeWallColor;
    ctx.fillRect(startX, startY, width, height);
};

function drawVisited(positionX, positionY, color){
    ctx.fillStyle = color;
    ctx.fillRect(positionX+1, positionY+1, cellLen-2, cellLen-2);
    
}

function drawCell(cell){
    // console.log(cell)
    let position = {
        x: cell.j*cellLen,
        y: cell.i*cellLen,
        dx: function () {return this.x + cellLen},
        dy: function () {return this.y + cellLen}
    }
    // console.log(position)
    
    if (cell.walls.top){
        drawWall(position.x, position.y, position.dx(), position.y);
    }else{
        removeWall(position.x+lineWidth, position.y-lineWidth, cellLen-2*lineWidth, 2*lineWidth);   
    }
    if (cell.walls.right){
        drawWall(position.dx(), position.y, position.dx(), position.dy());
    }
    else{
        removeWall(position.dx()-lineWidth, position.y+lineWidth, 2*lineWidth, cellLen-2*lineWidth);
    }
    if (cell.walls.bottom){
        drawWall(position.x, position.dy(), position.dx(), position.dy());
    }
    else{
        removeWall(position.x+lineWidth, position.dy()-lineWidth, cellLen-2*lineWidth, 2*lineWidth);
    }
    if (cell.walls.left){
        drawWall(position.x, position.y, position.x, position.dy());
    }
    else{
        removeWall(position.x-lineWidth, position.y+lineWidth, 2*lineWidth, cellLen-2*lineWidth);
    }

    if (cell.highlight){
        drawVisited(position.x, position.y,'#a52f57');
    }

    if (cell.visited){
        drawVisited(position.x, position.y, removeWallColor);
    };   
};

function checkNeighbours(neighbours){
    let neighboursList = [];
    if(neighbours.top >= 0 && cells[neighbours.top].visited == false){
        neighboursList.push(cells[neighbours.top]);
    }
    if(neighbours.right >= 0 && cells[neighbours.right].visited == false){
        neighboursList.push(cells[neighbours.right]);
    }
    if(neighbours.bottom >= 0 && cells[neighbours.bottom].visited == false){
        neighboursList.push(cells[neighbours.bottom]);
    }
    if(neighbours.left >= 0 && cells[neighbours.left].visited == false){
        neighboursList.push(cells[neighbours.left]);
    }
    
    return neighboursList;
};


// Depth First Search

function loopThroughCells(){
    neighboursList = checkNeighbours(cells[currentIndex].neighbours);
    let nextCell = neighboursList[Math.floor(Math.random()*neighboursList.length)];
    if (nextCell){
        if (neighboursList.length > 1){
            historyList.push(currentIndex);

        };

        let nextIndex = index(nextCell.i,nextCell.j);
        cells[currentIndex].highlight = false;
        cells[nextIndex].highlight = true;

        if (cells[currentIndex].i < cells[nextIndex].i){
            cells[currentIndex].walls.bottom = false;
            cells[nextIndex].walls.top = false;
        };
        if (cells[currentIndex].i > cells[nextIndex].i){
            cells[currentIndex].walls.top = false;
            cells[nextIndex].walls.bottom = false;
        };
        if (cells[currentIndex].j < cells[nextIndex].j){
            cells[currentIndex].walls.right = false;
            cells[nextIndex].walls.left = false;
        };
        if (cells[currentIndex].j > cells[nextIndex].j){
            cells[currentIndex].walls.left = false;
            cells[nextIndex].walls.right = false;
        };
        drawCell(cells[currentIndex]);
        drawCell(cells[nextIndex]);

        cells[nextIndex].visited = true;
        currentIndex = nextIndex;
        current = cells[currentIndex];
        setTimeout(loopThroughCells, speed);

    } else if (historyList.length > 0) {

        drawCell(cells[currentIndex]);
        // console.log(historyList);
        currentIndex = historyList.pop();
        current = cells[currentIndex];
        cells[currentIndex].highlight = true;
        cells[currentIndex].visited = false;
        drawCell(cells[currentIndex]);
        cells[currentIndex].visited = true;


        setTimeout(loopThroughCells, speed);

    } else{
        mazeProcess = true;
    }
};
 
let Gen = document.getElementById('Gen');

Gen.addEventListener('click', ()=>{
    if(true){
        // number of columns and rows
        window.cellLen = level;
        window.columns = Math.floor(canvasLen/cellLen);
        window.rows = columns;

        // determine speed of frames
        window.speed = 10;

        // console.clearRect();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        window.mazeProcess = false;
        // initialize cells array
        window.cells = [];
        // setup cell objects and inserted in cells array
        for (let i=0; i< rows; i++){
        for (let j=0; j< columns; j++){
            let cell = new Cell(i,j);
            cells.push(cell);
        };
        };
        // setup all cells
        for (let k=0; k<cells.length; k++){
        drawCell(cells[k]);
        };

        window.currentIndex = 0;
        window.current = cells[currentIndex];
        cells[0].visited = true;
        window.historyList = [];
        loopThroughCells();
    }
});

// ------------------------------------------------------------

function connectedNeighbours(ind){
    let connectedNeighboursList = [];
    let temp;
    if(cells[ind].walls.top == false){
        temp = index(cells[ind].i-1,cells[ind].j);
        if(cells[temp].visited == false){
            connectedNeighboursList.push(cells[temp]);
        }
        
    }
    if(cells[ind].walls.right == false){
        temp = index(cells[ind].i,cells[ind].j+1);
        if(cells[temp].visited == false){
            connectedNeighboursList.push(cells[temp]);
        }
    }
    if(cells[ind].walls.bottom == false){
        temp = index(cells[ind].i+1,cells[ind].j);
        if(cells[temp].visited == false){
            connectedNeighboursList.push(cells[temp]);
        }
    }
    if(cells[ind].walls.left == false){
        temp = index(cells[ind].i,cells[ind].j-1);
        if(cells[temp].visited == false){
            connectedNeighboursList.push(cells[temp]);
        }
    }
    
    return connectedNeighboursList;

};

function ManhattanDistance(x1,y1,x2,y2){
    return Math.abs(x1-x2) + Math.abs(y1-y2);
};

function bestNeighbour(){
    let optimalDistance = Infinity;
    let optimalIndex = 0;
    // console.log('here')
    for(let k=0; k<connectedNeighboursList.length; k++){
        temp = ManhattanDistance(connectedNeighboursList[k].i, connectedNeighboursList[k].j, target.i, target.j);
        // console.log(temp,optimalDistance);
        if(temp < optimalDistance){
            optimalDistance = temp;
            optimalIndex = k;
        }
    }
    return optimalIndex;
};

function drawRout(i, j, color){
    ctx.fillStyle = color;
    let percentage =0.4;
    let positionX = j*cellLen;
    let positionY = i*cellLen;
    ctx.fillRect(positionX+cellLen*percentage, positionY+cellLen*percentage, cellLen*(1-percentage*2), cellLen*(1-percentage*2));
};

function MazeRouting(){
    connectedNeighboursList = connectedNeighbours(index(currentNode.i, currentNode.j));
    
    // while(connectedNeighboursList.length > 0){
    drawRout(currentNode.i, currentNode.j, '#f78536');
        
    let chosenNeighbourInd = bestNeighbour();
    let nextNode = connectedNeighboursList[chosenNeighbourInd];
    cells[chosenNeighbourInd].visited = true;
        // console.log(nextNode);
    let tempDistance = ManhattanDistance(nextNode.i, nextNode.j, target.i, target.j);
        // console.log(tempDistance, bestDistance)
    if (tempDistance == 0){
        console.log('Solution found');
        // break;
    }
    else{ 
        HistoryMaze.push(index(currentNode.i, currentNode.j))
        currentNode = nextNode;
        
        cells[index(currentNode.i, currentNode.j)].visited = true;
        connectedNeighboursList = connectedNeighbours(index(currentNode.i, currentNode.j));
        if(connectedNeighboursList.length == 0){
            while(HistoryMaze.length > 0 && connectedNeighboursList == 0){
            currentNode = cells[HistoryMaze.pop()];
            // console.log(currentNode, typeof currentNode);
            drawRout(currentNode.i, currentNode.j, '#2b4450');

            connectedNeighboursList = connectedNeighbours(index(currentNode.i, currentNode.j));
            // console.log('connectedNeighboursList', connectedNeighboursList);
            };

        };
        setTimeout(MazeRouting, speed*3);    

    };
    
};

let solve = document.getElementById('solve');

solve.addEventListener('click', ()=>{
    if (!mazeProcess){
        console.log('wait')
    }else{
        for (let k=0; k<cells.length; k++){
            cells[k].visited = false;
        };

        window.source = cells[0];
        cells[0].visited = true;
        window.target = cells[cells.length-1];
        window.currentNode = source;
        window.HistoryMaze = [];
        drawRout(source.i, source.j, 'green');
        drawVisited(target.i*cellLen, target.j*cellLen,'teal');

        MazeRouting()

    };
    
});