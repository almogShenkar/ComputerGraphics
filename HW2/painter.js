/*
----------------------------------------------------------------------------------------
Computer Graphic course Shenkar/Semester B/2018
Lecturer: Dr. Eyal Sheffer
Students: Adam Shwartz(200743052) and Almog Asulin(200377489)
H.W 1 - 2D painter app

-----------------------------------------------------------------------------------------
*/


//Painter "class" 
var Painter={};



//Painter properties
var canvas;
var context;
var selected;
var coordsArray=[];
var clicksCounter=0;
var curveParam;
var isHelpOpen = false;



//Painter Constructor
Painter.ctor = function(){
 
    //get the Canvas element refrence
    canvas = $('#drawArea')[0];

    //get canvas 2d context
    context = canvas.getContext('2d');

    //set canvas properties
    context.strokeStyle = 'brown';
    context.fillStyle = 'blue';
    context.lineWidth = 5;
    context.lineCap = 'round';
    canvas.width = 900;
    canvas.height = 500;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    //set method painter.draw() as an onclick canvas event
    canvas.addEventListener('click', Painter.draw);    

    //----------------------------Buttons events-------------------------------------------
    //get buttons refrences 
        //1. set the selected string as the user selected
        //2. ReColor the buttons states (Pressed / Unpressed)
        //3. hide param field if unnecessary 
    $('#lineBtn')[0].onclick = function(){
        selected='line';
        Painter.reColorBtns();
        $('#param')[0].style.display = 'none';
        $('#paramH4')[0].style.display = 'none';
    };
    $('#circleBtn')[0].onclick = function(){
        selected='circle';
        Painter.reColorBtns();
        $('#param')[0].style.display = 'none';
        $('#paramH4')[0].style.display = 'none';

    };
    $('#curveBtn')[0].onclick = function(){
        selected='curve';
        $('#param')[0].style.display = 'inline-block';
        $('#paramH4')[0].style.display = 'inline-block';

        Painter.reColorBtns();
    };
    $('#helpBtn')[0].onclick = Painter.toggleHelpCanvas;
    $('#clearBtn')[0].onclick = Painter.clearCanvas;
}

//Method - draw one pixel given x,y 
Painter.myPixel = function(x,y){
    context.fillRect(x,y,1,1);
    
}

//Method - draw line by Bresenheim line 
Painter.myLine = function(x0,y0,x1,y1){
    //create local vars
    var deltaX , deltaY , stepX , stepY , err;
    //round values so we will handle integers - by Bresenheim alg
    x0 = Math.round(x0);
    y0 = Math.round(y0);
    x1 = Math.round(x1);
    y1 = Math.round(y1);
    //deltaX and deltaY calculation abs(distance)
    deltaX = Math.abs(x1- x0);
    deltaY = Math.abs(y1-y0);

    //set x axis direction step
    if(x0<x1) stepX = 1;
    else stepX = -1;
    //set y axis direction step
    if(y0<y1) stepY = 1;
    else stepY = -1;

    //calc err
    err = deltaX-deltaY;
    
    //while we still hava pixel to fill - not reached yet to the end of the path
    while(!(x0==x1 && y0==y1)){
        
        //draw one pixel x,y
        Painter.myPixel(x0,y0);

        //track the error
        var e2 = 2*err;
        //if the err between the real line (by line equation) and the pixels is  greater then the Delata , so we should fix the other axis value
        if (e2 > -deltaY){
             err -= deltaY; 
             x0  += stepX; 
            }
        if (e2 <  deltaX){
             err += deltaX; 
             y0  += stepY; 
            }
    }
}

//Method - draw circle by Bresenheim circle
Painter.myCircle = function(x0,y0,radius){
    var x = radius;
    var y = 0;
    var radiusError = 1 - x;
    while (x >= y) {
        //paint 8 parts simetric each iteration
        Painter.myPixel(x + x0, y + y0);
        Painter.myPixel(y + x0, x + y0);
        Painter.myPixel(-x + x0, y + y0);
        Painter.myPixel(-y + x0, x + y0);
        Painter.myPixel(-x + x0, -y + y0);
        Painter.myPixel(-y + x0, -x + y0);
        Painter.myPixel(x + x0, -y + y0);
        Painter.myPixel(y + x0, -x + y0);
        y++;    

        //track the error
        //update x,y according to err 
        if (radiusError < 0) {
            radiusError += 2 * y + 1;
        }
        else {
            x--;
            radiusError+= 2 * (y - x + 1);
        }
    }
}

//Method - draw curve by Bezier alg
Painter.myCurve = function(t,p0,p1,p2,p3){
  
    //init vars to calc equations
    var Ax,Bx,Cx,Dx;
    var Ay,By,Cy,Dy;
  
    //X values calcuation
    Dx = p0.x;
    Cx = 3*(p1.x - Dx);
    Bx = 3*(p2.x -p1.x) - Cx;
    Ax = p3.x -p0.x -Cx -Bx;
    //Y values calcuation
    Dy=p0.y;
    Cy=3*(p1.y-Dy);
    By=3*(p2.y-p1.y)-Cy;
    Ay=p3.y-Dy-Cy-By;
  
    //get final x,y from polynom functions
    var x = (Ax * Math.pow(t, 3)) + (Bx * Math.pow(t, 2)) + (Cx * t) + Dx;
    var y = (Ay * Math.pow(t, 3)) + (By * Math.pow(t, 2)) + (Cy * t) + Dy;
    return {x:x, y:y};
}



//Method - return the x,y coordinates from the mouse click over the canvas
Painter.getCalculatedPoints = function(e){
    var x = e.clientX - canvas.getBoundingClientRect().left;
    var y = e.clientY - canvas.getBoundingClientRect().top;
    return {x:x,y:y};
}

//Method - handles user request and figure what to draw
Painter.draw = function(e){

    //count the number of clicks
    clicksCounter++;
    var p = Painter.getCalculatedPoints(e);

    //store the coord that was clicked - future calculation
    coordsArray.push(p);
    
    //line and circle drawing (needs 2 points , e.g two clicks from the user)
    if(selected=='line' || selected=='circle') {
        
        //store first point and wait for the second point
        if (clicksCounter<2) return;
        
            if(selected=='line'){
                //painter.myLine(x0,y0,x1,y1);
                Painter.myLine(coordsArray[0].x,coordsArray[0].y,coordsArray[1].x,coordsArray[1].y);
            }
            else if (selected=='circle'){
                //R = sqrt((x1-x0)^2+(y1-y0)^2)
                var r = Math.sqrt(Math.pow(coordsArray[1].x-coordsArray[0].x,2) + Math.pow(coordsArray[1].y-coordsArray[0].y,2));
                Painter.myCircle(coordsArray[0].x,coordsArray[0].y,r);
            }       
    }
    //curve draw was selected
    else if(selected=='curve')
    {
        //need to wait for 4 points from the user
        if(clicksCounter<4) return;

        //convert "number of lines" to t paramater by Bezier alg
        curveParam = 1/Number($('#param')[0].value);
        var t=0;
        //init the starting point to the first point the user clicked
        prevP=coordsArray[0];

        //
        while(t<1){
            
            //calc the point we should draw by Bezier alg
            var p = Painter.myCurve(t,coordsArray[0],coordsArray[1],coordsArray[2],coordsArray[3]);

            //draw line from last point(start point on first iteration) to the point we calc
            Painter.myLine(prevP.x,prevP.y,p.x,p.y);

            //set last point to the last point we draw to continue drawing 
            prevP=p;
            //increment i
            t+=curveParam;
        }
    }

    //finished drawing 

    //empty clicks array and set counter=0
    coordsArray=[];
    clicksCounter=0;
}



//---------------------------------------------------------------utils & UI methods----------------------------------------------------------------------

//Method - open/close help paragraph
Painter.toggleHelpCanvas = function(){
    isHelpOpen=!isHelpOpen;
    $('#helpPar').toggle();
    if(isHelpOpen){
        $('#helpBtn')[0].innerHTML = "CloseHelp";
        $('#helpBtn').css("background-color","#00471B");
    }
    else{
        $('#helpBtn')[0].innerHTML = "Help";
        $('#helpBtn').css("background-color","#006BB7");
    }
}

//Method - clear the canvas drawings
Painter.clearCanvas = function(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    $('#param')[0].value = "4";
}


//Method - util ui method - set pressed buttons color , and unpressed buttons colors.
Painter.reColorBtns = function(){
    $('button').css("background-color","#006BB7");
    $('#'+selected+'Btn')[0].style.backgroundColor = "#F7C936";
}

//--------------------------------------------------------------------END----------------------------------------------------------------------------------------