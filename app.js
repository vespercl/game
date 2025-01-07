// DOM要素の取得
let playerElement = document.getElementById('player');
const scoreElement = document.getElementById('score');
const gameContainer = document.querySelector('.game-container');
const finalScoreElement = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');
const gameOverScreen = document.querySelector('.game-over');

let playerPosition = 175; // プレイヤーの初期X座標（中央に配置）
let score = 0;
let gameInterval;
let obstacleInterval;
let isGameOver = false;
let obstacleSpeed = 5; // 初期の障害物の落下速度

// プレイヤーの移動
function movePlayer(event) {
    if (isGameOver) return;

    if (event.key === 'ArrowLeft' && playerPosition > 0) {
        playerPosition -= 10; // 左に移動
    }
    if (event.key === 'ArrowRight' && playerPosition < gameContainer.clientWidth - playerElement.offsetWidth) {
        playerPosition += 10; // 右に移動
    }
    playerElement.style.left = `${playerPosition}px`;
}

// 障害物の生成
function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.width = '30px';
    obstacle.style.height = '30px';
    obstacle.style.backgroundColor = '#333';
    obstacle.style.position = 'absolute';
    obstacle.style.left = `${Math.random() * (gameContainer.clientWidth - 30)}px`;
    obstacle.style.top = '0px'; // 上から出現
    gameContainer.appendChild(obstacle);

    // 障害物を落下させる
    let obstacleTop = 0;
    const obstacleInterval = setInterval(() => {
        if (isGameOver) {
            clearInterval(obstacleInterval);
            return;
        }

        obstacleTop += obstacleSpeed; // 障害物の落下速度

        obstacle.style.top = `${obstacleTop}px`;

        // プレイヤーと衝突したかチェック
        if (checkCollision(obstacle)) {
            gameOver();
            clearInterval(obstacleInterval);
        }

        // 画面外に出た場合、障害物を削除
        if (obstacleTop > gameContainer.clientHeight) {
            gameContainer.removeChild(obstacle);
            clearInterval(obstacleInterval);
            score++;
            scoreElement.textContent = `スコア: ${score}`;

            // スコアが10増えたごとに障害物のスピードを上げる
            if (score % 10 === 0) {
                obstacleSpeed += 1; // 障害物の落下速度を増加
            }
        }
    }, 20);
}

// 衝突判定
function checkCollision(obstacle) {
    const playerRect = playerElement.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    return !(playerRect.right < obstacleRect.left ||
             playerRect.left > obstacleRect.right ||
             playerRect.bottom < obstacleRect.top ||
             playerRect.top > obstacleRect.bottom);
}

// ゲームオーバー処理
function gameOver() {
    isGameOver = true;
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);
    finalScoreElement.textContent = `最終スコア: ${score}`;
    gameOverScreen.style.display = 'block'; // ゲームオーバー画面を表示
}

// 再スタート機能
restartButton.addEventListener('click', function() {
    // ゲームの初期化
    score = 0; // スコアをリセット
    scoreElement.textContent = `スコア: ${score}`; // スコア表示を更新
    obstacleSpeed = 5; // 障害物のスピードを初期化
    isGameOver = false;
    gameOverScreen.style.display = 'none'; // ゲームオーバー画面を非表示

    // ゲームコンテナ内の障害物と最終スコアをリセット
    const obstacles = document.querySelectorAll('.obstacle');
    obstacles.forEach(obstacle => obstacle.remove()); // 障害物を削除

    // ゲームコンテナ内の最終スコアを非表示にする
    finalScoreElement.textContent = ''; 

    // プレイヤーを再描画
    if (playerElement) {
        gameContainer.removeChild(playerElement); // 古いプレイヤーを削除
    }
    
    playerElement = document.createElement('div'); // 新しいプレイヤー要素を新規作成
    playerElement.classList.add('player');
    playerElement.style.position = 'absolute';
    playerElement.style.left = `${gameContainer.clientWidth / 2 - 15}px`; // 中央に配置
    playerElement.style.bottom = '20px'; // プレイヤーの位置を底部に配置
    gameContainer.appendChild(playerElement);
    playerPosition = gameContainer.clientWidth / 2 - 15; // プレイヤー位置を中央に設定

    // 新たにゲームを開始
    startGame();
});

// ゲームの開始
function startGame() {
    gameInterval = setInterval(createObstacle, 1500); // 1.5秒ごとに障害物を生成
    document.addEventListener('keydown
