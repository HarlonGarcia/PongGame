let canvas = document.getElementById('canvas')
let context = canvas.getContext('2d')

let firstPlayer = {
    px: 80,
    py: 180,
    tx: 26,
    ty: 160,
    dir: 0
}

let secondPlayer = {
    px: 884,
    py: 180,
    tx: 26,
    ty: 160,
    dir: 0
}

let squareBall = {
    px: 990/2 - 10,
    py: 520/2 - 10,
    tx: 20,
    ty: 20,
    dirX: 10,
    dirY: 2
}

let canvasDimensions = {
    width: 990,
    height: 520
}

let myFont = new FontFace('myFont', 'url(assets/fonts/playerfont.ttf)');

myFont.load().then(font => document.fonts.add(font))
.then(() => context.font = '20px myFont')

let hasWinner = false;
let play = false;
let firstPlayerPoints = 0;
let secondPlayerPoints = 0;

const colision = () => {
    if (squareBall.py + squareBall.ty >= secondPlayer.py &&
        squareBall.py <= secondPlayer.py + secondPlayer.ty
        && squareBall.px <= secondPlayer.px + secondPlayer.tx
        && squareBall.px >= secondPlayer.px - secondPlayer.tx) {
        squareBall.dirX *= -1
      }
      else if (squareBall.py + squareBall.ty >= firstPlayer.py
        && squareBall.py <= firstPlayer.py + firstPlayer.ty
        && squareBall.px <= firstPlayer.px + firstPlayer.tx
        && squareBall.px >= firstPlayer.px - firstPlayer.tx) {
        squareBall.dirX *= -1
        }
}

const addToScoreboard = () => {
    if (squareBall.px < -100) {
        squareBall.px = 990/2 - 10;
        squareBall.py = 520/2 - 10
        squareBall.dirX *= -1;
        secondPlayerPoints += 1
    } else if (squareBall.px > 1090) {
        squareBall.px = 990/2 - 10;
        squareBall.py = 520/2 - 10
        squareBall.dirX *= -1;
        firstPlayerPoints += 1
    }
}

const moveBall = () => {
    squareBall.px += squareBall.dirX
    squareBall.py += squareBall.dirY

    if (squareBall.py < 0) {
        squareBall.dirY *= -1
    } else if (squareBall.py > 500) {
        squareBall.dirY *= -1
    }
}  

document.addEventListener("keydown", ({key}) => {
    if (key === 'ArrowUp') {
        secondPlayer.dir = -5
    } else if (key === 'ArrowDown') {
        secondPlayer.dir = 5
    }

    if (key === 'w') {
        firstPlayer.dir = -5
    } else if (key === 's') {
        firstPlayer.dir = 5
    }
})

document.addEventListener("keyup", ({key}) => {
    if (key === 'ArrowUp' || key === 'ArrowDown') {
        secondPlayer.dir = 0
    } else if (key === 'w' || key === 's') {
        firstPlayer.dir = 0
    }
})

const moveFirstPlayer = () => {
    if (firstPlayer.py <= 0) {
        firstPlayer.py = 0
    } else if (firstPlayer.py >= 360) {
        firstPlayer.py = 360
    }

    firstPlayer.py += firstPlayer.dir
}

const moveSecondPlayer = () => {
    if (secondPlayer.py <= 0) {
        secondPlayer.py = 0
    } else if (secondPlayer.py >= 360) {
        secondPlayer.py = 360
    }

    secondPlayer.py += secondPlayer.dir
}

const gameOver = () => {
    if (firstPlayerPoints >= 5 || secondPlayerPoints >= 5) {
        play = false
        hasWinner = true
        firstPlayerPoints = 0
        secondPlayerPoints = 0
    }
}

const handleClick = () => {
    document.addEventListener("click", () => {
        play = true
        hasWinner = false
    })
}

const showWinner = () => {
    const scoreText = `Player 1 - ${firstPlayerPoints} X ${secondPlayerPoints} - Player 2`
    const textWidth = context.measureText(scoreText).width;

    context.fillText(scoreText, (canvasDimensions.width/2) - (textWidth/2), 60);
    
    let winner = 0

    if (firstPlayerPoints > secondPlayerPoints) {
        winner = 1
    } else {
        winner = 2
    }

    const winnerText = `PLAYER ${winner} WINS`
    const winnerTextWidth = context.measureText(winnerText).width;
    context.fillText(winnerText, (canvasDimensions.width/2) - (winnerTextWidth/2), 260);


    const restartText = 'CLICK TO RESTART'
    restartTextWidth = context.measureText(restartText).width;
    context.fillText(restartText,  (canvasDimensions.width/2) - (restartTextWidth/2), 480);

    handleClick()
}

const drawStart = () => {
    const startText = 'CLICK TO START'
    const textWidth = context.measureText(startText).width;

    const controlsText = `[W][S] Player 1     Player 2 [↑][↓]`;
    const controlsTextWidth  = context.measureText(controlsText).width

    context.fillText(startText,  (canvasDimensions.width/2) - (textWidth/2), 200);
    context.fillText(controlsText,  (canvasDimensions.width/2) - (controlsTextWidth/2), 350)

    handleClick()
}

const draw = () => {
    context.fillRect(firstPlayer.px, firstPlayer.py, firstPlayer.tx, firstPlayer.ty);
    context.fillRect(secondPlayer.px, secondPlayer.py, secondPlayer.tx, secondPlayer.ty);
    context.fillRect(squareBall.px, squareBall.py, squareBall.tx, squareBall.ty);

    const scoreText = `Player 1 - ${firstPlayerPoints} X ${secondPlayerPoints} - Player 2`
    const textWidth = context.measureText(scoreText).width;
    context.fillText(scoreText, (canvasDimensions.width/2) - (textWidth/2), 60);
}

const main = () => {
    context.clearRect(0, 0, 990, 520)

    if (!hasWinner && !play) {
        drawStart()
    } else if (play && !hasWinner) {
        draw()
        moveBall()
        moveFirstPlayer()
        moveSecondPlayer()
        colision()
        addToScoreboard()
        gameOver()
    } else {
        showWinner()
    }
}

setInterval(main, 10)