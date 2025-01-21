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
let backbirddiv = document.getElementById('birddiv');
let reset = 'not';
let resetrun = 0;
let round = 1;
let scoreCount = 0
let ballons = {};
let backgroundbirds= {};
let allBallonList;
let allBirdsList
let heightData = [];
let birdHeightData = [];
let animation;
let angle = Math.PI;
let upSpeed = 0.1;
let sideSpeed = 0.001;
let innerWidthBinding = innerWidth;
let maxLeft;
let left = 0;
let leftDataList = [];
let gameRunCount = 0;
let changeLeft;
let offsetWidthbinding;
over.style.left = (innerWidthBinding - over.offsetWidth) / 2
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
  event.stopPropagation();
  if (resetrun == 1) {
    for (let i = 0; i <= 11; i++) {
      height = innerHeight - Math.random() * innerHeight;
      heightData[i] = height
      leftDataList[i] = (Math.floor(Math.random()*innerWidthBinding));
    }
  }
  reset = 'yes';
  resetrun = 1;
  gameplay(event);
  
});
pauseResume.addEventListener('click', event => {
  event.stopPropagation();
  if (gameRunCount == 0) {
    reset = 'not';
    gameplay(event);
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
  offsetWidthbinding = allBallonList[0].offsetWidth;
  maxLeft = innerWidthBinding - offsetWidthbinding - 40
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
    if (lasttime != null && reset == 'not') {
      heightData[i] = heightData[i] - (time - lasttime) * upSpeed;
    }
    if (leftDataList[i] > maxLeft) {
      leftDataList[i] = Math.floor(Math.random() * maxLeft)
    }
    ballon.style.top = heightData[i] + 'px';
    ballon.style.left = leftDataList[i] + changeLeft + 'px';
    i += 1;
  }
  for (let i = 0; i < heightData.length; i++) {
    if (heightData[i] < -50) {
      let random = Math.random()
      if (allBallonList[i].textContent != '💥' || allBallonList[i].textContent != '🎈' ) {
        heightData[i] = innerHeight + random * 150
      } else {
        heightData[i] = innerHeight
      }
      leftDataList[i] = Math.floor(random * maxLeft)
      console.log(offsetWidthbinding, maxLeft, leftDataList[i])
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
    maxLeft = innerWidthBinding - offsetWidthbinding -40;
  };
  reset = 'not';
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
  let birdbinding = 'backbird';
  for (let i = 1; i <= 11; i++) {
    ballons[createbinding + i] = document.createElement('div');
    ballons[createbinding + i].setAttribute('id', createbinding + i);
    ballons[createbinding + i].className = 'bal'

    if (i == 10 || i == 11 || i == 6 || i == 5) {
      let bird = document.createElement('img');
      bird.setAttribute('src', "images/bird.png");
      ballons[createbinding + i].appendChild(bird);
    } else {
      ballons[createbinding + i].appendChild(document.createTextNode('🎈'))
    }
    game.appendChild(ballons[createbinding + i]);

    backgroundbirds[birdbinding + i] = document.createElement('div');
    backgroundbirds[birdbinding + i].setAttribute('id', birdbinding + i);
    backgroundbirds[birdbinding + i].className = 'backbirds';
    backgroundbirds[birdbinding + i].appendChild(document.createTextNode('🕊️'));
    backbirddiv.appendChild(backgroundbirds[birdbinding + [i]]);
  }
  allBallonList = Object.values(ballons);
  for (let i = 0; i <= 11; i++) {
    height = innerHeight - Math.random() * innerHeight;
    heightData.push(height);
    leftDataList.push(Math.floor(Math.random()*innerWidthBinding));
  }
  over.style.left = (innerWidthBinding - over.offsetWidth) / 2
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
      } else if (value.textContent == '💥') {
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
    //For mobile devices
    value.addEventListener('touchstart', (event) => {
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
      } else if (value.textContent == '💥') {
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
  over.style.left = (innerWidthBinding - over.offsetWidth) / 2
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
  for (let i = 0; i <= 11; i++) {
    height = innerHeight - Math.random() * innerHeight;
    heightData[i] = height
    leftDataList[i] = (Math.floor(Math.random()*innerWidthBinding));
  }
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
again.addEventListener('click', gameplay);
game.addEventListener('touchmove', event => {
  event.preventDefault();
})
game.addEventListener('touchstart', event => {
  event.preventDefault()
})

