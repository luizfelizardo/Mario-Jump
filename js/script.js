const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const clouds = document.querySelectorAll('.cloud');
const scoreDisplay = document.querySelector('.score');
const musicaFundo = document.getElementById('musica-fundo');
const musicaGameOver = document.getElementById('musica-game-over');
let somPulo = document.getElementById('som-pulo'); // Mantém a referência inicial

musicaFundo.play();
let score = 0;
let gameOver = false;
let playerName = prompt("Digite seu nome:") || "Jogador";
const gameContainer = document.querySelector('.game-container');
gameContainer.style.width = '800px';
gameContainer.style.height = '600px';
gameContainer.style.position = 'relative';

// Função para ajustar e tocar o som do pulo
function playJumpSound() {
    if (!somPulo) {
        somPulo = new Audio('./mario-jump.mp3'); // Cria um novo elemento se não existir
        somPulo.id = 'som-pulo';
        somPulo.volume = 0.3; // Define o volume
        somPulo.addEventListener('loadeddata', () => {
            console.log('Som de pulo carregado.');
        });
        somPulo.addEventListener('error', (error) => {
            console.error('Erro ao carregar som de pulo:', error);
        });
    }

    if (somPulo.readyState >= 4) { // Verifica se o áudio está pronto
        somPulo.currentTime = 0;
        somPulo.play();
    } else {
        console.log('Som de pulo não está pronto.');
    }
}

const jump = () => {
    if (!gameOver) {
        mario.classList.add('jump');
        playJumpSound(); // Usa a função para tocar o som
        setTimeout(() => {
            mario.classList.remove('jump');
        }, 500);
    }
}

let marioAnimationId;
let pipeSpeed = 1.8; // Velocidade inicial do cano (1.5 segundos)

function updatePipeAnimation() {
    pipe.style.animation = `pipe-animation ${pipeSpeed}s infinite linear`;
}

const loop = setInterval(() => {
    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

    if (pipePosition < 0 && marioPosition >= 0 && !gameOver) {
        score++;
        scoreDisplay.textContent = score;
    }

    // Verifica a pontuação e atualiza a velocidade do cano
    if (score >= 100 && pipeSpeed > 1) {
        pipeSpeed = 1.5;
        updatePipeAnimation();
        document.getElementById('levelDisplay').textContent = "Nível 2";
       
    }
    if (score >= 200 && pipeSpeed > 1) {
        pipeSpeed = 1.2;
        updatePipeAnimation();
        document.getElementById('levelDisplay').textContent = "Nível 3";
    }

    if (score >= 300 && pipeSpeed > 1) {
        pipeSpeed = 1.0;
        updatePipeAnimation();
        document.getElementById('levelDisplay').textContent = "Nível 4";
    }

    if (score >= 400 && pipeSpeed > 1) {
        pipeSpeed = 0.8;
        updatePipeAnimation();
        document.getElementById('levelDisplay').textContent = "Nível 5";
    

    if (score >= 500 && pipeSpeed > 1) {
            pipeSpeed = 0.4;
            updatePipeAnimation();
            document.getElementById('levelDisplay').textContent = "Nível 6";
        }

    }

    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
        gameOver = true;
        musicaFundo.pause();

        pipe.style.animation = 'none';
        pipe.style.left = `${pipePosition}px`;

        mario.style.animation = 'none';
        mario.style.bottom = `${marioPosition}px`;

        mario.src = './game-over.png';
        mario.style.width = '75px';
        mario.style.marginLeft = '50px';

        clearInterval(loop);
        document.removeEventListener('keydown', jump);
        document.removeEventListener('touchstart', jump);

        clouds.forEach(cloud => {
            cloud.style.animation = 'none';
            cloud.style.left = `${cloud.offsetLeft}px`;
        });

        document.getElementById("finalScore").textContent = score;
        document.getElementById("gameOverModal").style.display = "block";

        updateRanking(score);
        displayRanking();
    }
}, 10);

document.addEventListener('keydown', jump);
document.addEventListener('touchstart', jump);

function restartGame() {
    location.reload();
    musicaFundo.pause();
    musicaFundo.currentTime = 0;
    musicaFundo.play();
}

function closeModal() {
    document.getElementById("gameOverModal").style.display = "none";
}

const highScoresKey = 'highScores';
let highScores = JSON.parse(localStorage.getItem(highScoresKey)) || [];

function updateRanking(score) {
    const newScore = { name: playerName, score: score };
    highScores.push(newScore);
    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, 10);
    musicaGameOver.play();
    localStorage.setItem(highScoresKey, JSON.stringify(highScores));
}

function displayRanking() {
    const rankingList = document.getElementById('rankingList');
    rankingList.innerHTML = '';
    highScores.forEach((score, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${score.name}: ${score.score}`;
        rankingList.appendChild(listItem);
    });
}

function resetRanking() {
    highScores = [];
    localStorage.removeItem(highScoresKey);
    displayRanking();
}

const resetRankingButton = document.getElementById('resetRankingButton');
resetRankingButton.addEventListener('click', resetRanking);

displayRanking();