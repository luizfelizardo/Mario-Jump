const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const clouds = document.querySelectorAll('.cloud');
const scoreDisplay = document.querySelector('.score');
const musicaFundo = document.getElementById('musica-fundo');
const musicaGameOver = document.getElementById('musica-game-over');
musicaFundo.play();
let score = 0;
let gameOver = false;



// Adapta as dimensões do jogo para diferentes proporções de tela
const gameContainer = document.querySelector('.game-container'); // Certifique-se de ter um elemento com essa classe no seu HTML
gameContainer.style.width = '800px';
gameContainer.style.height = '600px';
gameContainer.style.position = 'relative'; // Importante para posicionar os elementos do jogo corretamente


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
        
        musicaFundo.pause(); // Pause a música de fundo
        
        musicaGameOver.addEventListener('loadeddata', () => { // Ou 'canplaythrough'
            musicaGameOver.play();
        }, { once: true }); // Ouve o evento apenas uma vez

        // Se o evento 'loadeddata' não for acionado rapidamente (problema de carregamento),
        // você pode adicionar um fallback com setTimeout (menos confiável):
        setTimeout(() => {
            if (musicaGameOver.paused) { // Verifica se ainda está pausado (não tocou)
                musicaGameOver.play();
            }
        }, 500); // Tenta tocar após 1 segundo (ajuste este tempo se necessário)
       
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
            const cloudPosition = cloud.offsetLeft;
            cloud.style.left = `${cloudPosition}px`;
        });

        document.getElementById("finalScore").textContent = score;
        document.getElementById("gameOverModal").style.display = "block";
    }
}, 10);



document.addEventListener('keydown', jump);
document.addEventListener('touchstart', jump);

function restartGame() {
    location.reload();
    musicaFundo.pause(); // Pause a música
    musicaFundo.currentTime = 0; // Reinicie a posição da música para o início
    musicaFundo.play(); // Toque a música novamente
}