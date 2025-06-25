let knight = document.querySelector('.knight');
let zone = document.getElementById('zone_id');
let status = null;


let high = 200 + 'px';
let normal = 110 + 'px';
let knightPos = 0;
let knightPosY = 0;
let knightIsRunning = false; // по умолчанию стоит
let knightIsFlying = false;
let knightIsDown = false;
let isFlying = false;
let jumpKeyDown = false;
let hasWon = false;

let checkImgStatus = () => {
    if (knight.style.bottom == high) {
    knight.style.backgroundImage = 'url("img/knight_jump.png")';
} else if (knight.style.bottom == normal) {
    knight.style.backgroundImage = 'url("img/knight_idle.png")';
} else {
    knight.style.backgroundImage = 'url("img/knight_sit.png")';
}
}
// проверка победы:
function checkWin() {
    if (hasWon === false && knight.getBoundingClientRect().right >= 700) {
        hasWon = true;
        const winMenu = document.createElement('div');
        winMenu.className = 'winny';
        zone.appendChild(winMenu);
        const winTitle = document.createElement('span');
        winTitle.textContent = 'ТЫ ВЫИГРАЛ!';
        winTitle.className = 'winny_title'
        winMenu.appendChild(winTitle)
    }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function jump() {
  if (isFlying) return;
  isFlying = true;
  knightPosY = parseInt(high);
  knight.style.bottom = knightPosY + 'px';
  checkImgStatus();
  await delay(500); // ждем 300 мс
  down(); // вызываем down после задержки
}

function down() {
    isFlying = false;
    knightPosY = parseInt(normal);
    knight.style.bottom = knightPosY + 'px';
    checkImgStatus();
}

function sit() {
    isFlying = false;
    knight.style.bottom = knightPosY + 'px';
    checkImgStatus();
}

function knightStay() {
    knightIsRunning = false;
    knight.style.backgroundImage = 'url("img/knight_idle.png")';
    knight.style.transform = 'scaleX(1)';

}
function runRight(callback) {
    if (knight.getBoundingClientRect().right >= zone.getBoundingClientRect().right) { 
        return 
    }
    knightIsRunning = true;
    knight.style.backgroundImage = 'url("img/knight_run.png")';
    knightPos = knightPos + 15;
    knight.style.left = knightPos + 'px';
    setTimeout(callback, 100)
}

function runLeft(callback) {
    if (knightPos < 0) { 
        return 
    }
    knightIsRunning = true;
    knight.style.backgroundImage = 'url("img/knight_run.png")';
    knight.style.transform = 'scaleX(-1)';
    knightPos = knightPos - 15;
    knight.style.left = knightPos +'px';
    setTimeout(callback, 100)
}


//стрела:
function createArrow(callback) {
  let arrow = document.createElement("div");
  arrow.setAttribute("class", "arrow");
  zone.insertBefore(arrow, knight);
  callback(arrow);

}

function pushArrow(arrow) {
  let arrowPosX = 0;

  const interval = setInterval(() => {
    arrowPosX += 1;
    arrow.style.right = arrowPosX + 'px';

    const arrowRect = arrow.getBoundingClientRect();
    const knightRect = knight.getBoundingClientRect();

    // границы
    if (
      arrowRect.left < knightRect.right &&
      arrowRect.right > knightRect.left &&
      arrowRect.top < knightRect.bottom &&
      arrowRect.bottom > knightRect.top
    ) {
      alert("YOU DIED");
      clearInterval(interval);
      arrow.remove();
    } else if (arrowRect.left == zone.getBoundingClientRect().left) {
      arrow.remove();
    }

  }, 1);
}

function launchArrowLoop() {
  const delay = Math.random() * (5000 - 2000) + 2000; // 

  setTimeout(() => {
    checkWin();
    if (hasWon === true) {
      console.log('winner winner chicken dinner')
    } else {
      createArrow(pushArrow);   
      launchArrowLoop();  
    }
    
  }, delay);
}

launchArrowLoop();


// листенеры:

// прыжок
document.addEventListener('keydown', (e) => {
  if ((e.code === 'Space' || e.code === 'KeyW') && !jumpKeyDown) {
    jumpKeyDown = true;
    jump();
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'Space' || e.code === 'KeyW') {
    jumpKeyDown = false;
  }
});

// сидеть
document.addEventListener('keydown', (event) => {
  if ((event.code === 'KeyS')) {
    knight.style.backgroundImage = 'url("img/knight_sit.png")';
    knight.style.bottom = normal;
    isFlying = false;
  }
});

// направо
document.addEventListener('keydown', (event) => {
  if (event.code === 'KeyD' && knight.getBoundingClientRect().right < zone.getBoundingClientRect().right) {
    if (knight.getBoundingClientRect().right < zone.getBoundingClientRect().right) { 
    runRight();
    checkWin();
    // console.log(knight.getBoundingClientRect());
  }}
});
document.addEventListener('keyup', (event) => {
  if (event.code === 'KeyD') {
    knightStay();
  }
});

// налево
document.addEventListener('keydown', (event) => {
  if (event.code === 'KeyA') {
    runLeft(); 
  }
});
document.addEventListener('keyup', (event) => {
  if (event.code === 'KeyA') {
    knightStay(); 
  }
});

