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
let start = document.querySelector('#start')  // For home page play button
let pauseResume = document.getElementById('pauseResume')
let homepage = document.getElementById('homepage');
let toHome = document.getElementById('linktohome');
let score = document.getElementById('score');
let level = document.getElementById('level');
let cover = document.getElementById('cover');
let again = document.getElementById('again');
let over = document.getElementById('gameOver');
let backbirddiv = document.getElementById('birddiv');
let sun = document.getElementById('sun');
let totalScore = document.getElementById('tscore');
let reset = 'not';
let resetrun = 0;       //For reseting position of ballons 
let round = 1;            //This is for how many times request frame is called;
let scoreCount = 0
let ballons = {};
let backgroundbirds = {};
let allBallonList;     // these are the array we got fom Object.values(ballons).
let allBirdsList;      // Similary this.
let birdshow = [-0.25, -0.2, -0.15, -0.1, -0.05, 0, -0.05, -0.1, -0.15, -0.2, -0.25]; // For changing bird sizes
let birdhide = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
let birdresetInterval;
let birdsizechange = 0.001
let heightData = [];        // Each ballon top positon in px;
let leftDataList = [];      //Each ballon left position in px.
let birdHeightData = [];
let birdleftdata = [];
let animation;
let angle = Math.PI;
let upSpeed = 0.1;          //for ballon
let sideSpeed = 0.001;      //for ballon
let innerWidthBinding = innerWidth;
let innerHeightBinding = innerHeight;
let offsetWidthbinding;
let maxLeft;                 // maximum left postion in px;
let gameRunCount = 0;    //for pause and resume functionallity;
let changeLeft;          // For zig zag motion of ballons;
let height;            // variable for changing ballon top positon used only in initial setup;
let sunData = {
  width: 100,
  height: 100,
  top: innerHeightBinding * 0.65,
  left: innerWidthBinding * 0.1,
  backgroundcolor: [[255, 217, 0], [255, 165, 0]],
  shadow: [255, 217, 0, 0.6],
  background: 'radial-gradient(circle, rgb(255, 217, 0), rgb(255, 165, 0))',
  boxShadow: '0px 0px 50px 20px rgba(255, 223, 0, 0.8)'
};
let sundatachage = {
  topChange: innerHeightBinding * 0.8 / 60000,
  leftChange: innerWidthBinding * 0.7 / 60000,
  BlueChange: 255 / 4000,
  Green1Change: 38 / 4000,
  green2Change: 90 / 4000,
  sGreenChange: 32 / 4000,
  widthChange: 45 / 8000,
  heightChage: 45 / 8000,
}
over.style.left = (innerWidthBinding - over.offsetWidth) / 2 // For game over popup.
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
    innerHeightBinding = innerHeight;
    for (let i = 0; i <= 11; i++) {
      height = innerHeightBinding - Math.random() * innerHeightBinding;
      heightData[i] = height
      leftDataList[i] = (Math.floor(Math.random() * innerWidthBinding));
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
  maxLeft = innerWidthBinding - offsetWidthbinding - 40;
  if (innerWidthBinding > 460) {
    backbirddiv.style.display = 'block';
  } else {
    clearInterval(birdresetInterval)
  }

  animation = requestAnimationFrame(move);
}

function move(time, lasttime) {
  let i = 0;
  changeLeft = 0;
  let green1s;
  let green2;
  let blue;
  if (innerWidthBinding > 460 && lasttime != null) {
    angle += (time - lasttime) * sideSpeed;
    changeLeft = Math.cos(angle) * 60;
  }
  for (let ballon of allBallonList) {
    if (innerWidthBinding > 460 && birdHeightData[i] > -50) {
      birdHeightData[i] -= 0.2;
      birdleftdata[i] += 0.02;
      allBirdsList[i].style.top = birdHeightData[i] + 'px';
      allBirdsList[i].style.left = birdleftdata[i] + 'px';
      if (birdshow[i] < 1) {
        birdshow[i] += birdsizechange
        allBirdsList[i].style.transform = `scale(${birdshow[i]})`
      }
      else if (birdhide[i] > 0) {
        birdhide[i] -= birdsizechange;
        allBirdsList[i].style.transform = `scale(${birdhide[i]})`;
      }
    }
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
    if (heightData[i] < -75) {
      let random = Math.random()
      if (allBallonList[i].textContent != '💥' || allBallonList[i].textContent != '🎈') {
        heightData[i] = innerHeightBinding + random * 150
      } else {
        heightData[i] = innerHeightBinding
      }
      leftDataList[i] = Math.floor(random * maxLeft)
      if (allBallonList[i].textContent == '💥') {
        round += 1;
        allBallonList[i].textContent = '🎈';
        allBallonList[i].style.display = 'inline'
      }
    }
  }
  if (sunData.top > -50) {
    sunData.top -= sundatachage.topChange;
    sunData.left += sundatachage.leftChange;
    sunData.width -= sundatachage.widthChange;
    sunData.height -= sundatachage.heightChage;
    sunData.shadow[1] += sundatachage.sGreenChange;
    sunData.shadow[2] += sundatachage.BlueChange;
    sunData.backgroundcolor[1][1] += sundatachage.green2Change;
    green1s = sunData.shadow[1];
    green2 = sunData.backgroundcolor[1][1];
    blue = sunData.shadow[2];
    sun.style.top = sunData.top + 'px';
    sun.style.left = sunData.left + 'px';
    if (sunData.width > 55) {
      sun.style.width = sunData.width + 'px';
      sun.style.height = sunData.height + 'px';
    }
    if (green1s <= 255 && blue <= 255) {
      sun.style.background = `radial-gradient(circle, rgb(255,${green1s} ,${blue}), rgb(255, ${green2}, ${blue}))`;
      sun.style.boxShadow = `0 0 50px 20px rgba(250, ${green1s}, ${blue}, 0.8)`;
    }
  }
  round += 1;
  if (round > 300) {
    round = 0;
    innerWidthBinding = innerWidth;
    innerHeightBinding = innerHeight;
    maxLeft = innerWidthBinding - offsetWidthbinding - 40;
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
// For all preprations -----------------------------------------------------------------------------------------

window.addEventListener('load', event => {
  let createbinding = 'ballons';
  let birdbinding = 'backbird';
  for (let i = 1; i <= 11; i++) {
    ballons[createbinding + i] = document.createElement('div');
    ballons[createbinding + i].setAttribute('id', createbinding + i);
    ballons[createbinding + i].className = 'bal';
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
  };

  allBirdsList = Object.values(backgroundbirds);
  allBallonList = Object.values(ballons);

  let oneBirdHight = (innerHeightBinding / 10) * 8;
  let oneBirdleft = (innerWidthBinding / 10)
  for (let i = 0; i <= 11; i++) {
    height = innerHeightBinding - Math.random() * innerHeightBinding;
    heightData.push(height);
    leftDataList.push(Math.floor(Math.random() * innerWidthBinding));
    if (i < 6) {
      oneBirdleft += 20;
      oneBirdHight -= 5;
    } else {
      oneBirdHight += 5
      oneBirdleft += 23
    }
    birdHeightData.push(oneBirdHight);
    birdleftdata.push(oneBirdleft);
  }

  // This intervel is for ressetting background birds positions
  if (innerWidthBinding > 460) {
    birdresetInterval = setInterval(() => {
      birdshow = [-0.25, -0.2, -0.15, -0.1, -0.05, 0, -0.05, -0.1, -0.15, -0.2, -0.25]
      birdhide = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
      oneBirdHight = (innerHeightBinding / 10) * 8;
      oneBirdleft = (innerWidthBinding / 10)
      for (let i = 0; i <= 11; i++) {
        if (i < 6) {
          oneBirdleft += 50;
          oneBirdHight -= 5;
        } else {
          oneBirdHight += 5
          oneBirdleft += 60
        }
        birdHeightData[i] = (oneBirdHight);
        birdleftdata[i] = (oneBirdleft);
      }
    }, 90000);
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
// ---------------------------End of initial prepareation----------------------------
function gameReset() {
  totalScore.textContent = "Your Score : " + scoreCount;
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
    heightData[i] = innerHeightBinding - Math.random() * innerHeightBinding;
    leftDataList[i] = (Math.floor(Math.random() * innerWidthBinding));
  }
}
//----------------Defuault behavior of mouse clicks and touches remmoved form here----------------------
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

