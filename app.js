//--------Manue Bar-----------------------------------------
let manu = document.getElementById('manu');
let stop = document.getElementById('stop');
let items;
manu.addEventListener('click', (event) => {
  event.stopPropagation()
  items = document.querySelector('#manuItems>ul')
  items.style.display = 'block';
  let close = document.querySelector('#imgclose')
  close.addEventListener('click', () => {
    close.style.backgroundColor = 'white';
    items.style.display = 'none'
  })
})
//----------------- Game Elements and Bindings--------------------------------------
let game = document.getElementById('game');
let start = document.querySelector('#start')
let pauseResume = document.getElementById('pauseResume')
let homepage = document.getElementById('homepage');
let toHome = document.getElementById('linktohome');
let score = document.getElementById('score');
let level = document.getElementById('level');
let cover = document.getElementById('cover');
let again = document.getElementById('again');
let over = document.getElementById('gameOver');
let round = 1;
let scoreCount = 0
let ballons = {};
let heightData = [];
let animation;
let angle = Math.PI;
let allBallonList;
let upSpeed = 0.1;
let sideSpeed = 0.001;
let innerWidthBinding = innerWidth;
let maxLeft;
let left = 0;
let leftDataList = [];
let dividedWidth = innerWidthBinding / 12
let gameRunCount = 0;
let changeLeft;
let offsetWidthbinding;
over.style.left = (innerWidthBinding - over.offsetWidth)/2
toHome.addEventListener('click', event => {
  event.stopPropagation();
  gameRunCount = 0
  cancelAnimationFrame(animation);
  game.style.display = 'none';
  homepage.style.display = 'block';
  
  pauseResume.style.color = 'blue';
  pauseResume.style.fontSize = '1.3rem';
  if (pauseResume.textContent != 'Play') {
    pauseResume.textContent = 'Resume';
    pauseResume.style.background = 'yellow';
  }
  pauseResume.style.padding = '2px 1rem';
  cover.style.display = 'none';
  over.style.display = 'none'
})
//-----------------------Game Events------------------
start.addEventListener('click', event => {
  event.stopPropagation()
  gameplay(event)
});
pauseResume.addEventListener('click', event => {
  event.stopPropagation();
  if (gameRunCount == 0) {
    gameplay(event)
    cover.style.display = 'none';

  } else if (gameRunCount == 1) {
    gameRunCount = 0
    cancelAnimationFrame(animation);
    pauseResume.style.background = 'yellow';
    pauseResume.style.color = 'blue';
    pauseResume.style.fontSize = '1.3rem';
    pauseResume.textContent = 'Resume';
    pauseResume.style.padding = '2px 1rem';
    cover.style.display = 'block';
    cover.style.zIndex = 9
  }
  event.preventDefault();


})

//--------------Game Fucntions---------
function gameplay(event) {
  event.preventDefault()
  cover.style.display = 'none'
  over.style.display = 'none';
  homepage.style.display = 'none';
  pauseResume.style.background = 'blue';
  pauseResume.style.color = 'white';
  pauseResume.style.fontSize = '1.3rem';
  pauseResume.textContent = 'Pause';
  pauseResume.style.padding = '2px 1rem';
  game.style.display = 'block';
  game.style.height = innerHeight + 'px';
  gameRunCount += 1;
  innerWidthBinding = innerWidth;
  dividedWidth = innerWidthBinding / 12;
  offsetWidthbinding = allBallonList[0].offsetWidth;
  if (innerWidthBinding < 460) {
    maxLeft = innerWidthBinding - offsetWidthbinding + 10;
  }
  else {
    maxLeft = innerWidthBinding - offsetWidthbinding;
  }

  animation = requestAnimationFrame(move);
}

function move(time, lasttime) {
  let i = 0;
  changeLeft = 0;
  if (lasttime != null && innerWidthBinding > 460) {
    angle += (time - lasttime) * sideSpeed;
    changeLeft = Math.cos(angle) * 60;
  }
  for (let ballon of allBallonList) {
    if (lasttime != null) {
      heightData[i] = heightData[i] - (time - lasttime) * upSpeed;
    }
    if (leftDataList[i] > maxLeft) {
      leftDataList[i] = maxLeft / (1 + Math.random() * 10)
    }
    ballon.style.top = heightData[i] + 'px';
    ballon.style.left = leftDataList[i] + changeLeft + 'px';
    i += 1;
  }
  for (let i = 0; i < heightData.length; i++) {
    if (heightData[i] < -100) {
      heightData[i] = innerHeight;
      leftDataList[i] = innerWidthBinding / 12 * Math.random() * 10;
      if (allBallonList[i].textContent == '💥') {
        round += 1;
        allBallonList[i].textContent = '🎈';
        allBallonList[i].style.display = 'inline'
      }
    }
  }
  round += 1;
  if (round > 300) {
    round = 0;
    innerWidthBinding = innerWidth;
    maxLeft = innerWidthBinding - offsetWidthbinding;
  }
  animation = requestAnimationFrame(newtime => move(newtime, time))
}

function wait(time) {
  return new Promise((resolve, reject) => {
    let waiting = setTimeout(() => {
      resolve(null);
    }, time);
  })
}

window.addEventListener('load', event => {
  let createbinding = 'ballons';
  for (let i = 1; i <= 11; i++) {
    ballons[createbinding + i] = document.createElement('div');
    ballons[createbinding + i].setAttribute('id', createbinding + i);
    ballons[createbinding + i].className = 'bal'
    
    if (i == 6 || i == 10 || i == 3) {
      let bird = document.createElement('img');
      bird.setAttribute('src', "images/bird.png");
      ballons[createbinding + i].appendChild(bird);
    } else {
      ballons[createbinding + i].appendChild(document.createTextNode('🎈'))
    }

    game.appendChild(ballons[createbinding + i]);
  }
  allBallonList = Object.values(ballons);
  for (let i = 0; i <= 11; i++) {
    height = innerHeight - Math.random() * innerHeight;
    heightData.push(height);
    leftDataList.push(dividedWidth * Math.random() * 10);
  }
  over.style.left = (innerWidthBinding - over.offsetWidth)/2
  for (let value of allBallonList) {

    value.addEventListener('click', (event) => {
      if (value.textContent == '🎈') {
        value.textContent = '💥';
        scoreCount += 1
        score.textContent = 'Score: ' + scoreCount;
        if (scoreCount % 10 == 0) {
          level.textContent = 'Level: ' + Math.floor(scoreCount / 10)
          if (innerWidthBinding < 460) {
            upSpeed += 0.005;
            sideSpeed += 0.0001;
          } else {
            upSpeed += 0.005;
            sideSpeed += 0.0001;
          }
        }
        let hide = setTimeout(() => {
          value.style.display = 'none'
        }, 200);
      } else if(value.textContent == '💥') {
          setTimeout(() => {
            value.style.display = 'none'
          }, 50);
      } else {
        cancelAnimationFrame(animation);
        over.style.display = 'block';
        gameReset();
      }
      event.preventDefault();
    });
  }
});
function gameReset() {
  upSpeed = 0.1;
  sideSpeed = 0.001;
  scoreCount = 0;
  gameRunCount = 0;
  score.textContent = 'Score: ' + scoreCount;
  level.textContent = 'Level: 1';
  pauseResume.style.background = 'white';
  pauseResume.style.color = 'blue';
  pauseResume.style.fontSize = '1.3rem';
  pauseResume.textContent = 'Play';
  pauseResume.style.padding = '2px 1rem';
  cover.style.display = 'block';
  cover.style.zIndex = 9;
  over.style.left = (innerWidthBinding - over.offsetWidth)/2
}
window.addEventListener('mousedown', event => {
  event.preventDefault()
})
homepage.addEventListener('click', event => {
  items.style.display = 'none';
})
toHome.addEventListener('click', event => {
  event.stopPropagation();
  setTimeout(() => {
    items.style.display = 'none';
  }, 100);
})
again.addEventListener('click', gameplay)
