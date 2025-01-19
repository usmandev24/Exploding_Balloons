//--------Manue Bar-----------------------------------------
let manu = document.getElementById('manu');
let stop = document.getElementById('stop')
manu.addEventListener('click', () => {
  let items = document.querySelector('#manuItems>ul')
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
let round = 1;
let scoreCount = 0
let ballons = {};
let heightData = [];
let animation;
let angle = Math.PI;
let allBallonList;
let upSpeed = 0.1;
let sideSpeed = 0.001;
let innerWidthb = innerWidth;
let maxLeft;
let left =0;
let dividedWidth;
let gameRunCount = 0;
let changeLeft;
let offsetWidthbinding;

toHome.addEventListener('click', event => {
  gameRunCount = 0
  cancelAnimationFrame(animation);
  game.style.display = 'none';
  homepage.style.display = 'block';
  pauseResume.style.background = 'yellow';
  pauseResume.style.color = 'blue';
  pauseResume.style.fontSize = '1.3rem';
  pauseResume.textContent = 'Resume';
  pauseResume.style.padding = '2px 1rem';
})
//-----------------------Game Events------------------
start.addEventListener('click', event => gameplay(event));
pauseResume.addEventListener('click', event => {
  if (gameRunCount == 0) {
    gameplay(event)
  } else if (gameRunCount == 1) {
    gameRunCount = 0
    cancelAnimationFrame(animation);
    pauseResume.style.background = 'yellow';
    pauseResume.style.color = 'blue';
    pauseResume.style.fontSize = '1.3rem';
    pauseResume.textContent = 'Resume';
    pauseResume.style.padding = '2px 1rem';
  }
  event.preventDefault();

})

//--------------Game Fucntions---------
function gameplay(event) {
  event.preventDefault()
  homepage.style.display = 'none';
  pauseResume.style.background = 'blue';
  pauseResume.style.color = 'white';
  pauseResume.style.fontSize = '1.3rem';
  pauseResume.textContent = 'Pause';
  pauseResume.style.padding = '2px 1rem';
  game.style.display = 'block';
  game.style.height = innerHeight + 'px';
  gameRunCount += 1;
  innerWidthb = innerWidth;
  dividedWidth = innerWidthb / 12;
  offsetWidthbinding = allBallonList[0].offsetWidth;
  if (innerWidthb < 460) {
    maxLeft = innerWidthb - offsetWidthbinding + 10;
  }
  else {
    maxLeft = innerWidthb - offsetWidthbinding;
  }

  animation = requestAnimationFrame(move);
}

function move(time, lasttime) {
  left =0
  let i = 0;
  changeLeft = 0;
  if (lasttime != null && innerWidthb > 460) {
    angle += (time - lasttime) * sideSpeed;
    changeLeft = Math.cos(angle) * 60;
  }
  for (let ballon of allBallonList) {
    if (lasttime != null) {
      heightData[i] = heightData[i] - (time - lasttime) * upSpeed
    }
    if (left > maxLeft) {
      left = dividedWidth;
    }
    ballon.style.top = heightData[i] + 'px';
    ballon.style.left = left + changeLeft + 'px';
    left += dividedWidth;
    i += 1;
  }
  if (left > maxLeft) {
    left = dividedWidth
  }
  for (let i = 0; i < heightData.length; i++) {
    if (heightData[i] < -100) {
      heightData[i] = innerHeight;
      if (allBallonList[i].textContent == '💥') {
        round += 1;
        allBallonList[i].textContent = '🎈';
        allBallonList[i].style.display = 'inline'
      }
    }
  }
  round += 1;
  if (round > 600) {
    round = 0;
    innerWidthb = innerWidth;
    maxLeft = innerWidthb - offsetWidthbinding - 10;
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
    ballons[createbinding + i].appendChild(document.createTextNode('🎈'))
    game.appendChild(ballons[createbinding + i]);
  }
  allBallonList = Object.values(ballons);
  for (let i = 0; i <= 11; i++) {
    height = innerHeight - Math.random() * innerHeight;
    heightData.push(height)
  }
  for (let value of allBallonList) {
    value.addEventListener('click', (event) => {
      value.textContent = '💥';
      scoreCount += 1
      score.textContent = 'Score: ' + scoreCount;
      if (scoreCount % 10 == 0) {
        level.textContent = 'Level: ' + Math.floor(scoreCount / 10)
        upSpeed += 0.03;
        sideSpeed += 0.0003;
      }
      event.preventDefault();
      let hide = setTimeout(() => {
        value.style.display = 'none'
      }, 200);
    });
  }
})
window.addEventListener('mousedown', event => {
  event.preventDefault()
})