fetch('games.json')
  .then(response => response.json())
  .then(games => displayGames(games))
  .catch(error => console.error('Error loading game list:', error));

function displayGames(games) {
  const container = document.getElementById('game-list');
  container.innerHTML = '';

  games.forEach(game => {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
      <span class="category">${game.category}</span>
      <h3>${game.title}</h3>
      <p>${game.description}</p>
      <button onclick="launchGame('${game.id}')">Play Now</button>
    `;
    container.appendChild(card);
  });
}

// Game State Variables
let launchPower = 0;
let distance = 0;
let isCharging = false;
let runScore = 0;
let runnerInterval = null;

function launchGame(gameId) {
  const gameArea = document.getElementById('game-area');
  const title = document.getElementById('active-game-title');
  const content = document.getElementById('game-content');

  gameArea.style.display = 'block';

  if (gameId === 'bison-launch') {
    title.innerText = 'Bison Bounce Launcher';
    launchPower = 0;
    distance = 0;

    content.innerHTML = `
      <p>Hold the <strong>Launch</strong> button to charge your power, then release to launch!</p>
      <div style="width: 100%; background: #eee; height: 20px; border-radius: 10px; overflow: hidden;">
        <div id="power-bar" style="width: 0%; height: 100%; background: #e74c3c;"></div>
      </div>
      <br>
      <button onmousedown="startCharge()" onmouseup="releaseLaunch()" onmouseleave="releaseLaunch()">Hold to Charge</button>
      <p id="launch-result"></p>
    `;
  } else if (gameId === 'runner-3d') {
    title.innerText = 'Tunnel Runner';
    runScore = 0;

    content.innerHTML = `
      <p>Dodge the gap by switching lanes! Press <strong>A</strong> (Left) or <strong>D</strong> (Right).</p>
      <div id="runner-canvas" style="font-family: monospace; font-size: 20px; white-space: pre; background: #222; color: #fff; padding: 10px; border-radius: 5px;"></div>
      <p>Score: <span id="runner-score">0</span></p>
    `;

    startRunnerGame();
  }
}

// Launcher Game Mechanics
function startCharge() {
  isCharging = true;
  launchPower = 0;
  const bar = document.getElementById('power-bar');
  const interval = setInterval(() => {
    if (!isCharging) {
      clearInterval(interval);
      return;
    }
    launchPower = (launchPower + 5) % 105;
    if (bar) bar.style.width = launchPower + '%';
  }, 50);
}

function releaseLaunch() {
  if (!isCharging) return;
  isCharging = false;
  
  // Calculate final distance based on launch power
  distance = Math.floor(launchPower * 15.5);
  document.getElementById('launch-result').innerText = `You flew ${distance} meters!`;
}

// Tunnel Runner Mechanics
let playerPos = 1; // 0: Left, 1: Center, 2: Right

function startRunnerGame() {
  playerPos = 1;
  runScore = 0;

  document.removeEventListener('keydown', handleRunnerInput);
  document.addEventListener('keydown', handleRunnerInput);

  if (runnerInterval) clearInterval(runnerInterval);
  runnerInterval = setInterval(updateRunner, 200);
}

function handleRunnerInput(e) {
  if (e.key === 'a' || e.key === 'A') {
    if (playerPos > 0) playerPos--;
  } else if (e.key === 'd' || e.key === 'D') {
    if (playerPos < 2) playerPos++;
  }
}

function updateRunner() {
  const canvas = document.getElementById('runner-canvas');
  const scoreElem = document.getElementById('runner-score');
  
  if (!canvas) {
    clearInterval(runnerInterval);
    return;
  }

  runScore += 10;
  if (scoreElem) scoreElem.innerText = runScore;

  let laneStr = ["  |  ", "  |  ", "  |  "];
  laneStr[playerPos] = " [O] "; // Player icon

  canvas.innerText = `
  ==========
  ${laneStr[0]}
  ${laneStr[1]}
  ${laneStr[2]}
  ==========
  `;
}

function closeGame() {
  if (runnerInterval) clearInterval(runnerInterval);
  document.removeEventListener('keydown', handleRunnerInput);
  document.getElementById('game-area').style.display = 'none';
}