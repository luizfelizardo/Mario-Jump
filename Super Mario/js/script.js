const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const clouds = document.querySelector('.clouds');
const scoreDisplay = document.querySelector('.score');
const musicaFundo = document.getElementById('musica-fundo');
const musicaGameOver = document.getElementById('musica-game-over');

musicaFundo.play();
let score = 0;
let gameOver = false;
let playerName = "Jogador"; // Valor padrão

const gameContainer = document.querySelector('.game-container');

// Modal para coletar o nome do jogador
const nomeJogadorModal = document.getElementById('nomeJogadorModal');
const nomeJogadorInput = document.getElementById('nomeJogadorInput');
const nomeJogadorButton = document.getElementById('nomeJogadorButton');

function exibirNomeJogadorModal() {
    nomeJogadorModal.style.display = "block";
}

function coletarNomeJogador() {
    playerName = nomeJogadorInput.value || "Jogador";
    nomeJogadorModal.style.display = "none";
    iniciarJogo();
}

nomeJogadorButton.addEventListener('click', coletarNomeJogador);

function iniciarJogo() {
    const jump = () => {
        if (!gameOver) {
            mario.classList.add('jump');
            setTimeout(() => {
                mario.classList.remove('jump');
            }, 500);
        }
    }

    let marioAnimationId;
    let pipeSpeed = 1.8;
    let currentLevel = 1;

    function updatePipeAnimation() {
        pipe.style.animation = `pipe-animation ${pipeSpeed}s infinite linear`;
    }

    setTimeout(() => {
        updatePipeAnimation();
    }, 2000);

    const loop = setInterval(() => {
        const pipePosition = pipe.offsetLeft;
        const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

        if (pipePosition < 0 && marioPosition >= 0 && !gameOver) {
            score++;
            scoreDisplay.textContent = score;
        }

        if (score >= 100 && pipeSpeed > 1.5 && currentLevel < 2) {
            pipeSpeed = 1.5;
            updatePipeAnimation();
            currentLevel = 2;
            document.getElementById('levelDisplay').textContent = "Nível 2";
        }
        if (score >= 200 && pipeSpeed > 1.2 && currentLevel < 3) {
            pipeSpeed = 1.2;
            updatePipeAnimation();
            currentLevel = 3;
            document.getElementById('levelDisplay').textContent = "Nível 3";
        }

        if (score >= 300 && pipeSpeed > 1.0 && currentLevel < 4) {
            pipeSpeed = 1.0;
            updatePipeAnimation();
            currentLevel = 4;
            document.getElementById('levelDisplay').textContent = "Nível 4";
        }

        if (score >= 400 && pipeSpeed > 0.8 && currentLevel < 5) {
            pipeSpeed = 0.8;
            updatePipeAnimation();
            currentLevel = 5;
            document.getElementById('levelDisplay').textContent = "Nível 5";
        }

        if (score >= 500 && pipeSpeed > 0.4 && currentLevel < 6) {
            pipeSpeed = 0.4;
            updatePipeAnimation();
            currentLevel = 6;
            document.getElementById('levelDisplay').textContent = "Nível 6";
        }

        // Condição de colisão ajustada (ajuste os valores conforme necessário)
        if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 100 && !gameOver) { 
            gameOver = true;
            musicaFundo.pause();

            // Para as animações
            pipe.style.animation = 'none';
            mario.style.animation = 'none';
            clouds.style.animation = 'none';

            // Define as posições finais
            pipe.style.left = `${pipePosition}px`;
            mario.style.bottom = `${marioPosition}px`;
            clouds.style.left = `${clouds.offsetLeft}px`;

            // Altera a imagem do Mario
            mario.src = './game-over.png';
            mario.style.width = '75px';
            mario.style.marginLeft = '50px';

            // Limpa o intervalo e remove os ouvintes de eventos
            clearInterval(loop);
            document.removeEventListener('keydown', jump);
            document.removeEventListener('touchstart', jump);

            // Exibe o modal de Game Over
            document.getElementById("finalScore").textContent = score;
            document.getElementById("gameOverModal").style.display = "block";

            updateRanking(score);
            displayRanking();
        }
    }, 10);

    document.addEventListener('keydown', jump);
    document.addEventListener('touchstart', jump);
}

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

// Exibe o modal para coletar o nome do jogador no início
exibirNomeJogadorModal();