let gameService = new GameService();
let isPaused = false;
let isGameover = false;
let isTouchActive = screen.orientation.type === 'portrait-primary' ? true : false;
let isModalActive = false;

let fountain;

let touchgui;
let pauseButton;
let modalButton;
let restartButton;
let touchControlCheck;
let thrustButton;
let turnLeftButton;
let turnRightButton;
let fireButton;
let fullScreenButton;

function setup() {
    touchgui = createGui();
    touchgui.setFont('Silkscreen');

    modalButton = createButton("!", WIDTH - 60, 20, 40, 40);
    modalButton.setStyle("fillBg", color("#FFFFFF90"));
    pauseButton = createButton("||", 20, 20, 50, 50);
    pauseButton.setStyle("fillBg", color("#FFFFFF90"));
    restartButton = createButton("↻", 90, 20, 50, 50);
    restartButton.setStyle('textSize', 30);
    restartButton.setStyle("fillBg", color("#FFFFFF90"));
    turnLeftButton = createButton("👈🏼", 20, HEIGHT - 100, 80, 80);
    turnLeftButton.setStyle('textSize', 60);
    turnLeftButton.setStyle("fillBg", color("#FFFFFF90"));
    thrustButton = createButton("☝🏼", 120, HEIGHT - 100, 80, 80);
    thrustButton.setStyle('textSize', 60);
    thrustButton.setStyle("fillBg", color("#FFFFFF90"));
    turnRightButton = createButton("👉🏼", 220, HEIGHT - 100, 80, 80);
    turnRightButton.setStyle('textSize', 60);
    turnRightButton.setStyle("fillBg", color("#FFFFFF90"));
    fireButton = createButton("🔫", WIDTH - 100, HEIGHT - 100, 80, 80);
    fireButton.setStyle("textSize", 60);
    fireButton.setStyle("fillBg", color("#FFFFFF90"));
    fullScreenButton = createButton("Full Screen", WIDTH - 280, 20, 200, 40);
    fullScreenButton.setStyle("fillBg", color("#FFFFFF90"));

    touchControlCheck = createCheckbox("Checkbox", 160, 20, 40, 40);
    touchControlCheck.setStyle("fillBg", color("#FFFFFF90"));
    touchControlCheck.val = isTouchActive

    toggleTouchMode();
    gameService.init();
}

function draw() {
    // if (screen.orientation.type === 'portrait-primary') {
    //     document.querySelector('body').innerHTML = '<button onclick = "return goFullscreen()">Go Fullscreen</button>';
    // }

    checkForGuiInputs();

    if (!gameService.isGameover) {
        if (isPaused)
        pauseTheGame();
        else 
        gameService.gameLoop();
    } else {
        showGameOver();
    }
    drawGui();
    drawTouchOnOffMessage();
    toggleTouchMode();
}

function goFullscreen() {
    document.querySelector('html').requestFullscreen();
    screen.orientation.lock('landscape-primary');
}


function pauseTheGame() {
    push();
    // rectMode(RADIUS);
    textSize(40);
    fill(color('white'));
    rect(WIDTH / 2, HEIGHT / 2, 100, 40);
    fill(0, 102, 153);
    textAlign(CENTER);
    textStyle(BOLD);
    text("PAUSED", WIDTH / 2, HEIGHT / 2);
    pop();
}

function startTheGameAgain(event) {
    document.getElementById('modalCloseBtn').click();
    isGameover = false;
    isPaused = false;
    gameService.init();
}

function showGameOver() {
    push();
    // rectMode(RADIUS);
    textSize(40);
    fill(color('white'));
    rect(WIDTH / 2, HEIGHT / 2, 140, 40);
    fill(color('red'));
    textAlign(CENTER);
    textStyle(BOLD);
    text("GAME OVER", WIDTH / 2, HEIGHT / 2);
    pop();
}

function checkForGuiInputs() {
    if (modalButton.isPressed) {
        // document.querySelector('canvas').style = {"display": "none"}
        if (!isPaused) isPaused = true;
        document.getElementById('modalBtn').click();
    }

    if (pauseButton.isPressed) {
        if (isPaused) isPaused = false;
        else isPaused = true;
    }
    if (restartButton.isPressed)
        startTheGameAgain();

    if (touchControlCheck.isPressed)
        isTouchActive = touchControlCheck.val;

    if (thrustButton.isHeld)
        gameService.ship.thrust();

    if (turnLeftButton.isHeld)
        gameService.ship.turn(Ship.LEFT);

    if (turnRightButton.isHeld)
        gameService.ship.turn(Ship.RIGHT);

    if (fireButton.isPressed) {
        if (!isPaused)
            gameService.ship.fire()
    }

    if (fullScreenButton.isPressed) {
        document.querySelector('html').requestFullscreen();
        screen.orientation.lock('landscape-primary');
    }
}

function drawTouchOnOffMessage() {
    push();
    textSize(20);
    fill(color('white'));
    textFont('Silkscreen');
    text('Touchmode', 210, 45);
    pop();
}

function toggleTouchMode() {
    turnLeftButton.visible = isTouchActive;
    turnRightButton.visible = isTouchActive;
    thrustButton.visible = isTouchActive;
    fireButton.visible = isTouchActive;
}

function keyPressed() {
    if (keyCode === 87) {
        // 87 -> w
        document.getElementById('modalBtn').click();
    }
    if (keyCode === 32) {
        // 32 -> Space
        if (!isPaused)
            gameService.ship.fire();
    }
    if (keyCode === 27) {
        // 27 -> Esc
        if (isPaused) isPaused = false;
        else isPaused = true;
    }
}