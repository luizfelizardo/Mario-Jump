const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const clouds = document.querySelectorAll('.cloud');
const scoreDisplay = document.querySelector('.score');
let score = 0;
let gameOver = false;

const jump = () => {
    if (!gameOver) {
        mario.classList.add('jump');

        setTimeout(() => {
            mario.classList.remove('jump');
        }, 500);
    }
}

const loop = setInterval(() => {
    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

    if (pipePosition < 0 && marioPosition >= 0 && !gameOver) {
        score++;
        scoreDisplay.textContent = score;
    }

    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
        gameOver = true;

        pipe.style.animation = 'none';
        pipe.style.left = `${pipePosition}px`;

        mario.style.animation = 'none';
        mario.style.bottom = `${marioPosition}px`;

        mario.src = './game-over.png';
        mario.style.width = '75px';
        mario.style.marginLeft = '50px';

        clearInterval(loop);
        document.removeEventListener('keydown', jump);

        clouds.forEach(cloud => {
            cloud.style.animation = 'none';
            const cloudPosition = cloud.offsetLeft;
            cloud.style.left = `${cloudPosition}px`;
        });

        document.getElementById("finalScore").textContent = score;
        document.getElementById("gameOverModal").style.display = "block";
    }
}, 10);

document.addEventListener('keydown', jump);

function restartGame() {
    location.reload();
}