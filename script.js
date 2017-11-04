/*
 * 1.2 Visualização Interativa das Primeiras Derivadas
 *     de uma curva de Bézier.
 * 
 *     O sistema desenha a curva correspondente.
 *     Em seguida o sistema oferece um botão que
 *     permite que o usuário navegue sobre a curva,
 *     mostrando os vetores da primeira e da segunda
 *     derivadas. 
 */


/*
 * A classe "Point" será utilizada
 * para representar um ponto de 
 * controle.
 * 
 * Atributos: x e y, que representam as coordenadas do ponto.
 */
class Point {
  constructor(x,y){
    this.x = x;
    this.y = y;
  }

  /*
   * A função distance calcula a distância entre dois pontos.
   */
  distance(point){
    return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2));
  }
}

/*
 * O Array "cPoints" armazenará os pontos
 * de controle necessários à construção
 * da curva de Bézier.
 * 
 * A variável "radius" indica o tamanho do raio
 * da representação de um ponto de controle no canvas.
 * 
 * O Array "bezierCurve" irá armazenar todos os pontos
 * curva de bezier gerada a partir dos pontos
 * de controle.
 * 
 * A variável "move" indicará se um ponto
 * pode ser movido no canvas.
 * 
 * A variável "index" será utilizada para
 * armazenar a posição de um determinado
 * ponto de controle no array.
 * 
 * A variável "t" determina o grau a ser
 * utilizado no algorítmo de de Casteljau.
 * 
 * respectivamente:
 */

var cPoints = [];
var radius = 6;
var bezierCurve = [];
var move = false;
var index = -1;
var t = Number(prompt("Selecione o Valor de T: ", ""));
var maxSizeSlider = 1/t - 1;

/*
 * Inicialização do canvas e instanciação
 * de elementos HTML relevantes:
 */
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var slider = document.getElementById("slider");
slider.min = 0;
slider.max = maxSizeSlider;
slider.value = 0;
// slider.setAttribute("min","0");
// slider.setAttribute("max", toString(maxSizeSlider));
// slider.setAttribute("value","0");

/*
 * As funções seePoints, seePolig
 * e seeCurve servem para mostrar ou
 * não elementos no canvas:
 */

var seePoints = true;
function blindPoints(checkbox){
  if(!checkbox.checked) seePoints = false;
  else seePoints =true;
  draw();
}

var seePolig = true;
function blindPolig(checkbox){
  if(!checkbox.checked) seePolig = false;
  else seePolig = true;
  draw();
}

var seeCurve = true;
function blindCurve(checkbox){
  if(!checkbox.checked) seeCurve = false;
  else seeCurve = true;
  draw();
}

/*
 * CÁLCULOS MATEMÁRICOS:
 */


/*
 * A função "derivativePoints" calcula os vetores
 * de controle da derivada de uma curva de Bézier
 * a partir de pontos de controle fornecidos.
 */
function derivativePoints(points, degree){
  var dPoints = [];

  for(var i = 0; i < degree; i++){
    var x = points[i+1].x - points[i].x;
    var y = points[i+1].y - points[i].y;
    dPoints.push(new Point(x,y));
  } 
  return dPoints;
}

/*
 * A função "derivativeCurve" calcula a
 * todos os vetores da curva derivada a
 * partir de um conjunto de pontos de controle.
 */

function derivativeCurve(points){
  var degree = points.length - 1;
  var dPoints = [];
  var dCurve = [];
  
  dPoints = derivativePoints(points, degree);

  dCurve = deCasteljau(dPoints);

  for(var i = 0; i < dCurve.length; i++){
    dCurve[i].x = dCurve[i].x  * degree;
    dCurve[i].y = dCurve[i].y  * degree;
  }

  return dCurve;
}

/*
 * A função "pointInCurve" cria, recursivamente
 * e através de interpolações lineares
 * um ponto na curva de Bézier.
 */

function pointInCurve(points, t){
  var nextPoints = [];
  for(var i = 0; i < points.length - 1; i++){
    var x = (1 - t) * points[i].x + t * points[i + 1].x;
    var y = (1 - t) * points[i].y + t * points[i + 1].y;
    nextPoints.push(new Point(x,y)); 
  }
  if(nextPoints.length === 1) return nextPoints[0];
  else return pointInCurve(nextPoints, t);
}

/*
 * A função "deCasteljau" computa o
 * algorítmo de Casteljau e armazena
 * os pontos da curva de Bézier gerada
 * no Array "bezierCurve".
 */
function deCasteljau(points){
  var curve = [];
  if(points.length > 1){
    for(var i = 0; i <= 1; i += t){
      curve.push(pointInCurve(points, i));
    }
  }else{
    for(var i = 0; i <= 1; i += t){
      curve.push(points[0]);
    }
  }
  return curve;
}

/*
 * MANIPULAÇÃO DO CANVAS:
 */

/*
 * A função "superscript" verifica se uma determinada
 * coordenada está localizada dentro da área 
 * (representção no canvas) de um ponto de controle.
 */
function superscript(point){
  for(var i in cPoints){
    if(cPoints[i].distance(point) <= 2 * radius) return i;
  }
  return -1;
}

/*
 * A função clear canvas limpa o canvas.
 */

function clearCanvas(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/*
 * A função "drawPolig" desenha o
 * poligono de controle.
 */
function drawPolig(points, lineColor, lineWidth){
  for (var i = 0; i < points.length - 1; i++) {
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.moveTo(points[i].x, points[i].y);
    ctx.lineTo(points[i + 1].x, points[i + 1].y);
    ctx.stroke();
    ctx.closePath();
  }
}

/*
 * A função "drawPoints" desenha os pontos 
 * de controle no canvas.
 */
function drawPoints(){
  for(var i in cPoints){
    ctx.beginPath();
    ctx.arc(cPoints[i].x, cPoints[i].y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#148325';
    ctx.fill();
    ctx.closePath();
  }
}

/*
 * A função "draw" desenha a curva de 
 * Bézier, o polígono de controle e os
 * e os pontos de controle.
 */
function draw(){
  clearCanvas();
  bezierCurve = deCasteljau(cPoints);
  if(seeCurve) drawPolig(bezierCurve, 'blue', 1);
  if(seePolig) drawPolig(cPoints, '#148325', 2);
  if(seePoints) drawPoints();
}

/*
 * A função "drawDerivativeVect" desenha 
 * o vetor da derivada (primeira ou segunda)
 * em um ponto da curva de Bézier.
 */

function drawDerivativeVect(sliderPos, dCurve, lineColor){
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = lineColor;
  ctx.moveTo(bezierCurve[sliderPos].x, bezierCurve[sliderPos].y);
  ctx.lineTo(bezierCurve[sliderPos].x + dCurve[sliderPos].x, bezierCurve[sliderPos].y + dCurve[sliderPos].y);
  ctx.stroke();
  ctx.closePath();
}

/*
 * EVENTOS:
 */

canvas.addEventListener('mousedown', e => {
  var point = new Point(e.offsetX, e.offsetY);
  index = superscript(point);
  if(index === -1){
    cPoints.push(point);
    draw();
  } else {
    move = true;
  }
});

canvas.addEventListener('mouseup', e => {move = false});

canvas.addEventListener('mousemove', e => {
  if(move){
    cPoints[index].x = e.offsetX;
    cPoints[index].y = e.offsetY;
    draw();
  }
});

canvas.addEventListener('dblclick', e => {
  var point = new Point(e.offsetX, e.offsetY);
  index = superscript(point);
  if(index !== -1){
    cPoints.splice(index, 1);
    draw();
  }
});

var sliderClicked = false;

slider.addEventListener('mousedown', e =>{sliderClicked = true});

slider.addEventListener('mousemove', e => {
  
  if(cPoints.length > 1){
    var sliderPos = slider.value;
    
    if(sliderClicked && (sliderPos <= maxSizeSlider)){
      draw();
      
      var d1Curve = derivativeCurve(cPoints);
      drawDerivativeVect(sliderPos, d1Curve, 'red');

      var d1Points = derivativePoints(cPoints, cPoints.length-1);
      
      if(d1Points.length > 1){
        var d2Curve = derivativeCurve(d1Points);
        drawDerivativeVect(sliderPos, d2Curve, 'black'); 
      }
    }
  }

});

slider.addEventListener('mouseup', e =>{sliderClicked = false});