const cnvs1 = document.getElementById('one')
const cnvs2 = document.getElementById('two')
const cnvs3 = document.getElementById('three')
const cnvs4 = document.getElementById('four')

const circuitX = 50
const circuitY = 100

const colors = {
    grey: '#606470',
    red: '#f73859',
    white: '#fff'
}

const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
}


function animateCanvas(canvas, cols, rows, diff, chartA, lightA, lightB){

const c = canvas.getContext('2d')

var cols = cols
var rows = rows
var diff = diff

var initColor;
var turnedOn;

var circuitWidth = canvas.id == 'four' ? 300 : 250
var circuitHeight = 200

var chartX = canvas.id == 'four' ? 450 : (canvas.width - (cols * diff)) - 30 //325
var chartY = 100
var chartWidth = 200
var chartHeight = 30
var boxPos = chartY

var chartA = chartA

var lightA = new Light(lightA[0], lightA[1], lightA[2], lightA[3])
var lightB = canvas.id == 'one' ? null : new Light(lightB[0], lightB[1], lightB[2], lightB[3])
var lightC = canvas.id == 'four' ? new Light(circuitX+225,circuitY+200,circuitX+275,circuitY+170) : null

canvas.addEventListener('mousemove', event => {
    mouse.x = event.offsetX
    mouse.y = event.offsetY

    lightA.mouseHover = ((mouse.x > lightA.startingX && mouse.x < lightA.openX) && (mouse.y > lightA.startingY - 40 && mouse.y < lightA.startingY + 10)) || false
    
    if(canvas.id != 'one'){
    lightB.mouseHover = ((mouse.x > lightB.startingX && mouse.x < lightB.openX) && (mouse.y > lightB.startingY - 40 && mouse.y < lightB.startingY + 10)) || false
    }
    if(canvas.id == 'four'){
    lightC.mouseHover = ((mouse.x > lightC.startingX && mouse.x < lightC.openX) && (mouse.y > lightC.startingY - 40 && mouse.y < lightC.startingY + 10)) || false
    }
})

canvas.addEventListener('click', () => {
    if ((mouse.x > lightA.startingX && mouse.x < lightA.openX) && (mouse.y > lightA.startingY - 40 && mouse.y < lightA.startingY + 10)) {
        animateSwitch(lightA)
    }

    if (lightB != null && ((mouse.x > lightB.startingX && mouse.x < lightB.openX) && (mouse.y > lightB.startingY - 40 && mouse.y < lightB.startingY + 10))) {
        animateSwitch(lightB)
    }


    if (lightC != null && ((mouse.x > lightC.startingX && mouse.x < lightC.openX) && (mouse.y > lightC.startingY - 40 && mouse.y < lightC.startingY + 10))) {
        animateSwitch(lightC)
    }

})

function Circle(x, y, dx, dy, velocity) {
    this.x = x
    this.y = y
    this.velocity = velocity
    this.dx = dx
    this.dy = -this.velocity
    
}

Circle.prototype.draw = function () {
    c.save()
    c.beginPath()
    c.shadowColor = colors.white
    c.shadowBlur = 9
    c.lineWidth = 20
    c.arc(this.x, this.y, 3, 0, 2 * Math.PI, false)
    c.fillStyle = colors.white
    c.fill()
    c.closePath()
    c.restore()
}

Circle.prototype.update = function () {

    if(this.y <= circuitY - 20){
        this.dx = this.velocity 
    }
    if(this.x >= circuitX + 134){
        this.dx = 0
    }
    if(this.y <= circuitY-25){
        this.dx = -this.velocity
    }
    if(this.x <= circuitX+115){
        this.dx = 0
    }
    if(this.y <= circuitY-32){
        this.dx = this.velocity
    }

    this.x += this.dx
    this.y += this.dy
    this.draw()
}


function animateSwitch(lightSwitch) {
   
    lightSwitch.isOn ? lightSwitch.openSwitch() : lightSwitch.closeSwitch()
    lightSwitch.isOn = !lightSwitch.isOn

    if(canvas.id == 'one'){
        animateBox([lightA.isOn], box1)
    }

    if(canvas.id == 'two'){
        animateBox([lightA.isOn, lightB.isOn], box2)
    }
    if(canvas.id == 'three'){
        animateBox([lightA.isOn, lightB.isOn], box3)
    }

    if(canvas.id == 'four'){
    animateBox([lightA.isOn, lightB.isOn, lightC.isOn], box4)
    }
}


function animateBox(lightArray, objArr) {

    const arra = objArr.find(function (element) {
        return element.combos.toString() == lightArray.toString()
    })
    turnedOn = arra.turnOn
    boxPos = arra.boxPos
}

function Light(startingX, startingY, openX, openY) {
    this.startingX = startingX
    this.startingY = startingY
    this.openX = openX
    this.openY = openY
    this.isOn = false
    this.mouseHover = false
}

Light.prototype.draw = function (color) {
    c.beginPath()
    c.save()
    c.strokeStyle = this.mouseHover ? colors.red : color
    c.moveTo(this.startingX, this.startingY)
    c.lineTo(this.openX, this.openY)
    c.stroke()
    c.restore()
}

Light.prototype.closeSwitch = function () {
    this.openY += 30
}

Light.prototype.openSwitch = function () {
    this.openY -= 30
    boxPos = chartY
}

function circuit(color) {
    c.strokeStyle = color, c.fillStyle = 'black', c.lineWidth = 2
    c.strokeRect(circuitX, circuitY, circuitWidth, circuitHeight)
    
    //secondary circuit box
    if(canvas.id != 'one' && canvas.id != 'two'){
        c.strokeRect(circuitX+50,circuitY+150, 150, 100)
    c.fillRect(circuitX+51, circuitY+155, 147, 50)
    }

    if(canvas.id == 'four'){
        c.fillRect(circuitX+225, circuitY+198, 50, 50)
    }
   
    if(canvas.id == 'one'){
        c.fillRect(circuitX + 100, circuitY+152, 50, 50)
    }
    if(canvas.id == 'two'){
        c.fillRect(circuitX + 50, circuitY+152, 50, 50)
        c.fillRect(circuitX + 150, circuitY+152, 50, 50)
    }

    c.fillRect(circuitX+100, circuitY+102, 50, 50), c.fillRect(circuitX+100, circuitY+202, 50, 50)
    
    //battery clear
    c.fillRect(circuitX -2, circuitY + 50, 10, 100)

    if(color == 'white'){
        c.shadowColor = 'white'
        c.shadowBlur = 50
        c.lineWidth = 3
    }

    // lightbulb arc
    c.beginPath(), c.moveTo(circuitX+115, circuitY), c.lineTo(circuitX+115, circuitY-18), c.stroke(), c.closePath()
    c.beginPath(), c.arc(circuitX+125, circuitY-35, 20, 0.65 * Math.PI, 2.35 * Math.PI, false)
    c.moveTo(circuitX+134, circuitY-18), c.lineTo(circuitX+134, circuitY), c.stroke(), c.closePath()

    // lightbulb wire
    c.beginPath(), c.moveTo(circuitX+124, circuitY), c.lineTo(circuitX+124, circuitY-20), c.lineTo(circuitX+130, circuitY-25)
    c.lineTo(circuitX+120, circuitY-30), c.lineTo(circuitX+130, circuitY-35), c.stroke(), c.closePath()

    // lightbulb base
    c.beginPath(), c.moveTo(circuitX+115, circuitY - 5), c.lineTo(circuitX+135,circuitY -5), c.stroke()
    c.restore()

    // BATTERY
    c.strokeStyle = colors.purple
    c.strokeRect(circuitX -10, circuitY + 50, 20, 100)

    c.strokeStyle = colors.white
    // + symbol
    c.beginPath(), c.moveTo(circuitX, circuitY + 60), c.lineTo(circuitX, circuitY + 70), c.stroke(), c.closePath()
    c.beginPath(), c.moveTo(circuitX + 5, circuitY + 65), c.lineTo(circuitX - 5, circuitY + 65), c.stroke(), c.closePath()

    // - symbol
    c.beginPath(), c.moveTo(circuitX -5, circuitY +135), c.lineTo(circuitX + 5, circuitY + 135), c.stroke()
}

function chart() {
    c.strokeStyle = colors.grey
    let cY = chartY;
    let diff = 50

    for (let i = 0; i < 8; i++) {
        c.strokeRect(chartX, cY, chartWidth, chartHeight)
        cY += 30
        if(i < 3){
            c.beginPath(), c.moveTo(chartX + diff, 100), c.lineTo(chartX + diff, 340), c.stroke() 
            diff += 50
        }
    }

    let letterX = chartX + 18
    diff = 50
    
    c.font = '20px Oswald', c.fillStyle = colors.white
    c.fillText('A', letterX, chartY -5), c.fillText('B', letterX + diff, chartY -5)
    c.fillText('C', letterX + (diff * 2), chartY -5), c.fillText('L', letterX + (diff * 3), chartY -5)
    
    c.fillText('A', lightA.startingX + 20, lightA.startingY - 50)  //200
    c.fillText('B', lightB.startingX + 20, lightB.startingY - 50) // 300
    c.fillText('C', lightC.startingX + 20, lightC.startingY - 50) // 250
    

    c.font = '18px Oswald'
    c.fillText('0', 468, 125), c.fillText('0', 518, 125), c.fillText('0', 568, 125), c.fillText('0', 618, 125)
    c.fillText('1', 468, 155), c.fillText('0', 518, 155), c.fillText('0', 568, 155), c.fillText('0', 618, 155)
    c.fillText('0', 468, 185), c.fillText('1', 518, 185), c.fillText('0', 568, 185), c.fillText('0', 618, 185)
    c.fillText('0', 468, 215), c.fillText('0', 518, 215), c.fillText('1', 568, 215), c.fillText('0', 618, 215)
    c.fillText('1', 468, 245), c.fillText('1', 518, 245), c.fillText('0', 568, 245), c.fillText('0', 618, 245)
    c.fillText('1', 468, 275), c.fillText('0', 518, 275), c.fillText('1', 568, 275), c.fillText('1', 618, 275)
    c.fillText('0', 468, 305), c.fillText('1', 518, 305), c.fillText('1', 568, 305), c.fillText('1', 618, 305)
    c.fillText('1', 468, 335), c.fillText('1', 518, 335), c.fillText('1', 568, 335), c.fillText('1', 618, 335)
}


function secondaryChart() {

    c.strokeStyle = colors.grey
    c.font = '25px Oswald', c.fillStyle = colors.white
    let cX = chartX
    let cY = chartY
    let letterX = chartX + 18
    let letterY = chartY -5
    chartWidth = diff * cols
    chartHeight = diff

    var result
    
    for(let i = 0; i < cols; i++){
        for (let j = 0; j < rows; j++) {
            c.strokeRect(cX, cY, diff, diff)
            cY += diff
        }
        cY = chartY
        cX += diff
    }

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j <= rows; j++) {
            result = Object.values(chartA)[i][j]
            c.fillText(result, letterX -5, letterY)
            letterY += diff
        }
        letterY = chartY -5
        letterX += diff
    }
    if(canvas.id != 'one'){
        c.fillText('B', lightB.startingX + 20, lightB.startingY - diff) // 300
    }
    c.fillText('A', lightA.startingX + 20, lightA.startingY - diff)  //200

}



function box(startY) {
    c.strokeStyle = 'red'
    c.strokeRect(chartX, startY, chartWidth, chartHeight)
}

let circle = new Circle(circuitX+124, circuitY, 0, 0, 0.7)

function init() {
    initColor = turnedOn ? colors.white : colors.grey
    
    circuit(initColor), lightA.draw(colors.grey)

    canvas.id != 'four' ? secondaryChart() : chart() 
    box(boxPos)


    if(canvas.id != 'one'){
    lightB.draw(colors.grey)
    }
    if(canvas.id == 'four'){
    lightC.draw(colors.grey)
    }

    if(circle.y <= circuitY -36){
       circle = new Circle(circuitX+124, circuitY, 0, 0, 0.7)
    }
    if(turnedOn){
    circle.update()
    }
}

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    init()
}

const box1 = [{
    combos: [false],
    turnOn: false,
    boxPos: chartY
},
{
    combos: [true],
    turnOn: true,
    boxPos: chartY + 50
}]
const box2 = [{
    combos: [false, false],
    turnOn: false,
    boxPos: chartY
},
{   combos: [true, false],
    turnOn: false,
    boxPos: chartY + diff

},
{
    combos: [false, true],
    turnOn: false,
    boxPos: chartY + (diff * 2)

},
{
    combos: [true, true],
    turnOn: true,
    boxPos: chartY + (diff * 3)
}]
const box3 = [{
    combos: [false, false],
    turnOn: false,
    boxPos: chartY
},
{   combos: [true, false],
    turnOn: true,
    boxPos: chartY + diff

},
{
    combos: [false, true],
    turnOn: true,
    boxPos: chartY + (diff * 2)

},
{
    combos: [true, true],
    turnOn: true,
    boxPos: chartY + (diff * 3)
}]

const box4 = [{
        combos: [true, true, true],
        turnOn: true,
        boxPos: 310
    },
    {
        combos: [true, false, false],
        turnOn: false,
        boxPos: 130
    },
    {
        combos: [false, true, false],
        turnOn: false,
        boxPos: 160
    },
    {
        combos: [false, false, true],
        turnOn: false,
        boxPos: 190
    },
    {
        combos: [true, true, false],
        turnOn: false,
        boxPos: 220
    },
    {
        combos: [true, false, true],
        turnOn: true,
        boxPos: 250
    },
    {
        combos: [false, true, true],
        turnOn: true,
        boxPos: 280
    },
    {
        combos: [false, false, false],
        turnOn: false,
        boxPos: 100
    }
]


animate()



}

var chart1 = {
    row1: ['A', '0', '1'],
    row2: ['L', '0', '1']
}
var chart2 = {
    row1: ['A', '0', '1', '0', '1'],
    row2: ['B', '0', '0', '1', '1'],
    row3: ['L', '0', '0', '0', '1']
}
var chart3 = {
    row1: ['A', '0', '1', '0', '1'],
    row2: ['B', '0', '0', '1', '1'],
    row3: ['L', '0', '1', '1', '1']
}


animateCanvas(cnvs1, 2, 2, 50, chart1, [circuitX+100,circuitY+200,circuitX+150,circuitY+170])
animateCanvas(cnvs2, 3, 4, 40, chart2, [circuitX+50, circuitY+200,circuitX+100,circuitY+170], [circuitX+150,circuitY+200,circuitX+200,circuitY+170])
animateCanvas(cnvs3, 3, 4, 40, chart3, [circuitX+100,circuitY+150,circuitX+150,circuitY+120], [circuitX+100,circuitY+250,circuitX+150,circuitY+220])
animateCanvas(cnvs4, 4, 8, 30, chart1, [circuitX+100,circuitY+150,circuitX+150,circuitY+120], [circuitX+100,circuitY+250,circuitX+150,circuitY+220])