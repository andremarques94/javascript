var wfconfig = {

    active: function() {
        console.log("font loaded");
        init();
    },

    google: {
        families: ['Open+Sans:400,700,400italic,700italic']
    }
};

WebFont.load(wfconfig);
var game;

var init = function() {
    var textToDisplay = 'Rui F.';

    var mask;
    var memoryDiagram;
    var busNames = [];
    var CPU;
    var cbusCircle;
    var pointer;
    var pointerPos;
    var controlState = 1;
    var slot;

    game = new Phaser.Game(800, 400, Phaser.AUTO, 'cpu-diagram', {
        preload: preload,
        create: create
    },true);

    function preload() {
        game.load.image('arrow', '/interactive/intro/img/arrow.png');
    }

    function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        createMemory();
        createCPU();
        createBuses();
        busAnimations();
        createMask();
        game.input.addMoveCallback(move, this);
        game.world.bringToTop(CPU);
        game.world.bringToTop(memoryDiagram);
        game.world.bringToTop(mask);

    }

    function move(pointer, x, y) {
        mask.x = x;
        mask.y = y;
    }

    function createMemory() {
        var memoryMaker = MemoryMaker(0, 'modeMartelo');
        memoryDiagram = memoryMaker.makeCells(asciibin(textToDisplay, 'ascii'), ["10110101", "11011101", "10111110"]);
        memoryDiagram.x = 200;
        memoryDiagram.y = 50;
    }

    function createCPU() {
        var textFactory = TextFactory();
        var boxFactory = BoxFactory();
        CPU = boxFactory.makeBox(650, memoryDiagram.y + memoryDiagram.height / 2, 250, 250);
        var CU = boxFactory.makeBox(-CPU.width / 4, 0, 80, 80);
        CPU.addChild(CU);
        var ALU = boxFactory.makeBox(CPU.width / 4, 0, 80, 80);
        CPU.addChild(ALU);
        slot = boxFactory.makeBox(-CPU.width / 2 + 80, CPU.height / 2 - 25, 128, 32);
        CPU.addChild(slot);

        textFactory.insertTextOnObject(CPU, 'CPU', 'top');
        textFactory.insertTextOnObject(CU, 'CU', 'center');
        textFactory.insertTextOnObject(ALU, 'ALU', 'center');
    }

    function createBuses() {
        var style = {
            font: "20px Open Sans",
            fill: '#FFFFFF',
            strokeThickness: 9
        };
        var textFactory = TextFactory();
        textFactory.setStyle(style);
        var x = memoryDiagram.x;
        var y = memoryDiagram.y + memoryDiagram.height / 2;

        var lineFactory = LineFactory();
        lineFactory.setColor(0xFFFFFF);
        var addressBus = lineFactory.makeLine(x, y, CPU.x, y);
        addressBus = lineFactory.multiply(addressBus, 'up', 16);
        var abusString = textFactory.makeText('Address Bus\n     (16 bit)', 190, -25);
        abusString.lineSpacing = -15;
        busNames.push(abusString);
        abusString.inputEnabled = true;
        abusString.events.onInputDown.add(abusAnim, this);
        addressBus.addChild(abusString);
        addressBus.sendToBack();

        y += memoryDiagram.height / 4;
        var dataBus = lineFactory.makeLine(x, y, CPU.x, y);
        dataBus = lineFactory.multiply(dataBus, 'down', 8);
        var dbusString = textFactory.makeText('Data Bus (8 bit)', 200, 17);
        busNames.push(dbusString);
        dbusString.inputEnabled = true;
        dbusString.events.onInputDown.add(dbusAnim, this);
        dataBus.addChild(dbusString);
        dataBus.sendToBack();

        y = memoryDiagram.y + memoryDiagram.height / 6;
        var controlBus = lineFactory.makeLine(x, y, CPU.x, y);
        controlBus = lineFactory.multiply(controlBus, 'down', 2);
        var cbusString = textFactory.makeText('Control Bus (2 bit)', 195, 5);
        busNames.push(cbusString);
        cbusString.inputEnabled = true;
        cbusString.events.onInputDown.add(cbusAnim, this);
        controlBus.addChild(cbusString);
        controlBus.sendToBack();
    }

    function busAnimations() {
        var x = memoryDiagram.x;
        var y = memoryDiagram.y + memoryDiagram.height / 5.7;
        var circleFactory = CircleFactory();
        circleFactory.setFillColor(0xFFFFFF);
        cbusCircle = circleFactory.makeCircle(x, y, 20);
        cbusCircle.sendToBack();
    }

    function createMask() {
        //  A mask is a Graphics object
        mask = game.add.group();
        var maskLayer = game.add.graphics(0, 0);
        maskLayer.beginFill(0xffffff);
        maskLayer.drawCircle(0, 0, 100);
        memoryDiagram.getTop().mask = maskLayer;
        mask.add(maskLayer);

        var maskBorder = game.add.graphics(0, 0);
        maskBorder.lineStyle(4, 0xFF0000, 0.5);
        maskBorder.drawCircle(0, 0, 100);
        mask.add(maskBorder);

        var style = {
            font: "22px Open Sans",
            fill: '#FFFFFF'
        };
        var maskText = game.add.text(0, maskBorder.y + 40, 'INSTRUCTIONS X-RAY', style);
        maskText.anchor.set(0.5);
        maskText.alpha = 0.8;
        mask.add(maskText);
    }

    function cbusAnim() {
        console.log("cbusANIM");
        var textFactory = TextFactory();

        if (pointerPos != undefined) {
            var tweenFactory = TweenFactory();
            cbusCircle.x = CPU.x;
            var tween = tweenFactory.moveTo(cbusCircle, memoryDiagram.x, cbusCircle.y, 500);
            if (controlState == 0) {
                busNames[2].text = "Write";
                controlState = 1;
                tween.onComplete.add(backToDefaults, this);
            } else if (controlState == 1) {
                busNames[2].text = "Read";
                controlState = 0;
                tween.onComplete.add(backToDefaults, this);
            }

            function backToDefaults() {
                busNames[2].text = "Control Bus (2 bit)";
            }
        }
    }

    function dbusAnim() {

        if (controlState == 0) {
            read();
        } else {
            write();
        }
    }

    function read() {
        var style = {
            font: "20px Open Sans",
            fill: '#FFFFFF',
            strokeThickness: 9
        };
        var textFactory = TextFactory();
        textFactory.setStyle(style);
        var tweenFactory = TweenFactory();

        var data = memoryDiagram.children[0].children[pointerPos].children[1].text;
        busNames[1].text = '';
        var datastring = textFactory.makeText(data, memoryDiagram.x, 330);
        game.world.bringToTop(memoryDiagram);
        game.world.bringToTop(pointer)
        game.world.bringToTop(mask);
        tween = tweenFactory.moveTo(datastring, CPU.x + slot.x, CPU.y + slot.y);

        tween.onComplete.add(function() {
            if (slot.children[0]) {
                slot.removeChildAt(0);
            }
            datastring.x = 0;
            datastring.y = 0;
            slot.addChild(datastring);
            busNames[1].text = 'Data Bus (8 bit)'
        });
    }

    function write() {
        var cellToWrite = memoryDiagram.children[0].children[pointerPos];
        var style = {
            font: "20px Open Sans",
            fill: '#FFFFFF',
            strokeThickness: 9
        };
        var textFactory = TextFactory();
        textFactory.setStyle(style);
        var tweenFactory = TweenFactory();
        game.world.bringToTop(memoryDiagram);
        game.world.bringToTop(pointer)
        game.world.bringToTop(mask);
        busNames[1].text = '';
        if (slot.children[0]) {
            var datastring = slot.children[0];
            tween = tweenFactory.moveTo(datastring, -350, 0);

            tween.onComplete.add(function() {
                textFactory.insertTextOnObject(cellToWrite, datastring.text, 'center');
                datastring.style = textFactory.getDefaultStyle();
                datastring.fontSize = 16;
                busNames[1].text = 'Data Bus (8 bit)'
            });
        }
    }

    function abusAnim() {
        console.log("abusAnim");
        var textFactory = TextFactory();
        var tweenFactory = TweenFactory();
        var tween;
        var style = {
            font: "20px Open Sans",
            fill: '#FFFFFF',
            strokeThickness: 9
        };
        textFactory.setStyle(style);
        var textY = memoryDiagram.y + memoryDiagram.height / 2 - 25;
        var pointerText = textFactory.makeText('Point to:\n 0x0002', CPU.x, textY);

        if (pointerPos == undefined) {
            var pointerY = memoryDiagram.y + memoryDiagram.children[0].children[0].y;
            var destY = memoryDiagram.y + memoryDiagram.children[0].children[2].y;
            pointer = game.add.sprite(270, pointerY, 'arrow');
            pointerPos = 2;
        } else if (pointerPos == 0) {
            pointerText.text = 'Point to:\n 0x0002';
            var destY = memoryDiagram.y + memoryDiagram.children[0].children[2].y;
            pointerPos = 2;
        } else if (pointerPos == 2) {
            pointerText.text = 'Point to:\n 0x0000';
            var destY = memoryDiagram.y + memoryDiagram.children[0].children[0].y;
            pointerPos = 0;
        }

        textFactory.setStyle(style);
        pointerText.lineSpacing = -15;
        game.world.bringToTop(CPU);
        game.world.bringToTop(memoryDiagram);
        pointer.bringToTop();
        game.world.bringToTop(mask);
        pointer.anchor.set(0.5);

        busNames[0].text = '';
        tween = tweenFactory.moveTo(pointerText, 400, pointerText.y, 500);
        tween.onComplete.add(changeAddress, this);

        function changeAddress() {
            tween = tweenFactory.moveTo(pointer, pointer.x, destY, 2000);
            tween.onComplete.add(backToDefaults, this);

            function backToDefaults() {
                tween = tweenFactory.moveTo(pointerText, memoryDiagram.x, pointerText.y, 500);

                tween.onComplete.add(function() {
                    pointerText.destroy();
                    busNames[0].text = 'Address Bus\n     (16 bit)';
                });
            }
        }
    }
}