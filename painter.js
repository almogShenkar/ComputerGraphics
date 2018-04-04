
var painter={};


painter.canvas;
painter.context
painter.selected;
painter.coordsArray=[];
painter.clicksCounter=0;

painter.ctor = function(){
 
    //get the Canvas element refrence
    painter.canvas = $('#drawArea')[0];
    painter.context = painter.canvas.getContext('2d');
    painter.context.strokeStyle = 'brown';
    painter.context.fillStyle = 'blue';
    painter.context.lineWidth = 5;
    painter.context.lineCap = 'round';
    painter.canvas.width = 900;
    painter.canvas.height = 500;
    painter.canvas.width = painter.canvas.offsetWidth;
    painter.canvas.height = painter.canvas.offsetHeight;

    painter.canvas.addEventListener('click', painter.draw);    
    //get buttons refrences
    $('#pixelBtn')[0].onclick = function(){
        painter.selected='pixel';
    };
    $('#lineBtn')[0].onclick = function(){
        painter.selected='line';
    };
    $('#circleBtn')[0].onclick = function(){
        painter.selected='circle';
    };
    $('#curveBtn')[0].onclick = function(){
        painter.selected='curve';
    };
    $('#polygonBtn')[0].onclick = function(){
        painter.selected='polygon';
    };
    $('#clearBtn')[0].onclick = painter.clearCanvas;
    $('#runBtn')[0].onclick = painter.clearCanvas;

}

//basic one pixel draw 
painter.myPixel = function(coords){
    painter.context.fillRect(coords['x'],coords['y'],1,1);
    
}

//draw line Bresenheim alg
painter.myLine = function(coordsFrom,coordsTo){
    console.log('draw line');
    //if coordTo.x < coordsFrom.x
    if(coordsTo['x'] < coordsFrom['x']) {
        var tempCoords = coordsTo;
        coordsTo = coordsFrom;
        coordsFrom= tempCoords;
    } 
    var dx = coordsTo['x'] - coordsFrom['x'];
    var dy = coordsTo['y'] - coordsFrom['y'];
    var err = 0;
    var diffErr = Math.abs(dy/dx);
   
    for(var coord = coordsFrom; coord['x'] < coordsTo['x']; coord['x']+=1){
        painter.myPixel(coord);
        err = err + diffErr;
        while(err >= 0.5) {
            painter.myPixel(coord);
            coord['y'] = coord['y'] + Math.sign(coordsTo['y'] - coordsFrom['y']);
            err = err - 1.0;
        }
    }
}

//draw circle
painter.myCircle = function(){

}

//draw curve
painter.myCurve = function(){

}

//draw curve
painter.myPolygon = function(){

}

painter.getCoords = function(e){
    var x = e.clientX - painter.canvas.getBoundingClientRect().left;
    var y = e.clientY - painter.canvas.getBoundingClientRect().top;
    return {'x':x,'y':y};
}

painter.draw = function(e){
    painter.clicksCounter++;
    var coords = painter.getCoords(e);
    painter.coordsArray.push(coords);
    switch (painter.selected){
        case 'pixel':
            painter.myPixel(coords);
            break;
        case 'line':
            if(painter.clicksCounter<2) return;
            painter.myLine(painter.coordsArray[0],painter.coordsArray[1]);
            break;
        case 'circle':
            if(painter.clicksCounter<2) return;
            painter.myCircle(x,y);
            break; 
        case 'line':
            if(painter.clicksCounter<4) return;
            painter.myCurve(x,y);
            break;
        case 'polygon':
            painter.myPolygon(x,y);
            break;
    }
    painter.coordsArray=[];
    painter.clicksCounter=0;
    console.log(painter.coordsArray);
}



painter.clearCanvas = function(){
    painter.context.clearRect(0, 0, painter.canvas.width, painter.canvas.height);
}

painter.toggleInputArea = function(){
    var inputArea = $('#inputArea')[0];
    console.log('display: '+inputArea.style.display);
    if (inputArea.style.display=='none' || inputArea.style.display==''){
        inputArea.style.display='block';
    }
    else{
        inputArea.style.display='none';
    }
}


