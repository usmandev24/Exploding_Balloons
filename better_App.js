class ManueBar {
  constructor() {
    this.manu = document.getElementById('manu');
  }
  addEvent() {
    let items;
    this.manu.addEventListener('click', (event) => {
      event.stopPropagation()
      items = document.querySelector('#manuItems>ul')
      items.style.display = 'block';
      let close = document.querySelector('#imgclose')
      close.addEventListener('click', () => {
        close.style.backgroundColor = 'white';
        items.style.display = 'none'
      })
    })
  }
}

let innerHeightBinding = innerHeight;
let innerWidthBinding = innerWidth;

class Ballons {
  constructor(list, topValues, leftValues, upSpeed, sideSpeed) {
    this.list = list;
    this.topValues = topValues;
    this.leftValues = leftValues;
    this.upSpeed = upSpeed;
    this.sideSpeed = sideSpeed;
    this.angle = Math.PI
  }
  static create(count, upSpeed, sideSpeed) {
    let list = [];
    let topValues = [];
    let leftValues = [];
    let div;
    for (let i = 0; i < count; i++) {
      if ([5, 6, 10, 11].includes(i)) {
        let bird = document.createElement('img');
        bird.setAttribute('src', "images/bird.png");
        div = elt('div', { "class": 'bal' }, bird)
        list.push(div);
      } else {
        div = elt('div', { "class": 'bal' }, document.createTextNode('🎈'));
        list.push(div);
      }
      DOM.gameDiv.appendChild(div)
      topValues.push(innerHeightBinding - Math.random() * innerHeightBinding);
      leftValues.push(Math.floor(Math.random() * innerWidthBinding))
    }
    return new Ballons(list, topValues, leftValues, upSpeed, sideSpeed);
  }
}

class Backbirds {
  constructor(list, topValues, leftValues) {
    this.list = list;
    this.topValues = topValues;
    this.leftValues = leftValues;
    this.show = [-0.25, -0.2, -0.15, -0.1, -0.05, 0, -0.05, -0.1, -0.15, -0.2, -0.25];
    this.hide = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  }
  static create(count) {
    let birdsList = [];
    let topValues = [];
    let leftValues = [];
    let oneBirdtop = (innerHeightBinding / 10) * 8;
    let oneBirdleft = (innerWidthBinding / 10);
    let div;
    for (let i = 0; i < count; i++) {
      div = elt('div', { "class": "backbirds" }, document.createTextNode('🕊️'))
      birdsList.push(div);
      DOM.backbirdDiv.appendChild(div)
      if (i < 6) {
        oneBirdleft += 20;
        oneBirdtop -= 5;
      } else {
        oneBirdtop += 5
        oneBirdleft += 23
      }
      topValues.push(oneBirdtop);
      leftValues.push(oneBirdleft);
    }
    return new Backbirds(birdsList, topValues, leftValues);
  }
}

class Sun {
  constructor(sunDiv) {
    this.sunDiv = sunDiv;
    this.status = {
      width: 100,
      height: 100,
      top: innerHeightBinding * 0.65,
      left: innerWidthBinding * 0.1,
      backgroundcolor: [[255, 217, 0], [255, 165, 0]],
      shadow: [255, 217, 0, 0.6],
      background: 'radial-gradient(circle, rgb(255, 217, 0), rgb(255, 165, 0))',
      boxShadow: '0px 0px 50px 20px rgba(255, 223, 0, 0.8)'
    };
    this.change = {
      top: innerHeightBinding * 0.8 / 10000,
      left: innerWidthBinding * 0.7 / 10000,
      Blue: 240 / 1000,
      Green1: 38 / 1000,
      green2: 90 / 1000,
      sGreen: 32 / 1000,
      width: 45 / 2000,
      height: 45 / 2000,
    }
  }
  update() {
    let green1s;
    let green2;
    let blue;
    this.status.top -= this.change.top;
    this.status.left += this.change.left;
    this.status.width -= this.change.width;
    this.status.height -= this.change.height;
    this.status.shadow[1] += this.change.sGreen;
    this.status.shadow[2] += this.change.Blue;
    this.status.backgroundcolor[1][1] += this.change.green2;
    green1s = this.status.shadow[1];
    green2 = this.status.backgroundcolor[1][1];
    blue = this.status.shadow[2];
    this.sunDiv.style.top = this.status.top + 'px';
    this.sunDiv.style.left = this.status.left + 'px';
    if (this.status.width > 55) {
      this.sunDiv.style.width = this.status.width + 'px';
      this.sunDiv.style.height = this.status.height + 'px';
    }
    if (green1s <= 255 && blue <= 240) {
      this.sunDiv.style.background = `radial-gradient(circle, rgb(255,${green1s} ,${blue}), rgb(255, ${green2}, ${blue}))`;
      this.sunDiv.style.boxShadow = `0 0 50px 20px rgba(250, ${green1s}, ${blue}, 0.8)`;
    }
  }
}
const DOM = {
  gameDiv: document.getElementById("game"),
  startGame: document.querySelector('#start'), // For home page play button
  pauseResume: document.getElementById('pauseResume'),
  homepage: document.getElementById('homepage'),
  manueItems: document.querySelector("#manuItems>ul"),
  toHome: document.getElementById('linktohome'),
  scoreDiv: document.getElementById('score'),
  levelDiv: document.getElementById('level'),
  cover: document.getElementById('cover'),
  again: document.getElementById('again'),
  over: document.getElementById('gameOver'),
  backbirdDiv: document.getElementById('birddiv'),
  sunDiv: document.getElementById('sun'),
  tScoreDiv: document.getElementById('tscore'),
  backSound: document.getElementById("backsound"),
  shoot : document.getElementById("shootsound"),
}

let preStatus = {
  reset: "not",
  resetrun: 0,
  round: 1,
  scoreCount: 0,
  level: 1,
  gameOut: false,
  angle: Math.PI,
  upSpeed: 0.1,         //for ballon
  sideSpeed: 0.001,
  birdsizechange: 0.001,
  gameRunCount: 0,
}

class GameState {
  constructor(dom, status, ballons, backBirds, sun) {
    this.dom = dom;
    this.status = status;
    this.ballons = ballons
    this.backBirds = backBirds
    this.sun = sun;
  }
  resetStatus() {
    let status = this.status;
    let dom = this.dom;
    dom.tScoreDiv.textContent = "Your Score : " + status.scoreCount;
    status.upSpeed = 0.1;
    status.sideSpeed = 0.001;
    status.scoreCount = 0;
    status.gameRunCount = 0;
    dom.scoreDiv.textContent = 'Score: ' + status.scoreCount;
    dom.levelDiv.textContent = 'Level: 1';
    dom.pauseResume.style.background = 'white';
    dom.pauseResume.style.color = 'blue';
    dom.pauseResume.style.fontSize = '1.3rem';
    dom.pauseResume.textContent = 'Play';
    dom.pauseResume.style.padding = '2px 1rem';
    dom.cover.style.display = 'block';
    dom.cover.style.zIndex = 9;
    for (let i = 0; i <= this.ballons.list.length; i++) {
      this.ballons.topValues[i] = innerHeightBinding - Math.random() * innerHeightBinding;
      this.ballons.leftValues[i] = (Math.floor(Math.random() * innerWidthBinding));
    }
    setTimeout(() => {
      dom.over.style.display = 'block';
      dom.over.style.left = (innerWidth - dom.over.offsetWidth) / 2;
    }, 200);
  }
}
function setEvents(gameState) {
  let status = gameState.status;
  let dom = gameState.dom;
  let ballons = gameState.ballons;
  let list = gameState.ballons.list;
  dom.toHome.addEventListener('click', event => {
    event.stopPropagation();
    status.gameRunCount = 0;
    dom.backSound.pause();
    cancelAnimationFrame(status.animation);
    dom.gameDiv.style.display = 'none';
    dom.homepage.style.display = 'block';
  
    dom.pauseResume.style.color = 'blue';
    dom.pauseResume.style.fontSize = '1.3rem';
    if (dom.pauseResume.textContent != 'Play') {
      dom.pauseResume.textContent = 'Resume';
      dom.pauseResume.style.background = 'yellow';
    }
    dom.pauseResume.style.padding = '2px 1rem';
    dom.cover.style.display = 'none';
    dom.over.style.display = 'none'
  })
  dom.startGame.addEventListener('click', event => {
    event.stopPropagation();
    if (status.resetrun == 1) {
      innerHeightBinding = innerHeight;
      for (let i = 0; i <= list.length; i++) {
        ballons.topValues[i] = innerHeightBinding - Math.random() * innerHeightBinding;
        ballons.leftValues[i] = (Math.floor(Math.random() * innerWidthBinding));
      }
    }
    status.reset = 'yes';
    status.resetrun = 1;
    runGame(gameState, event);
  });
  dom.pauseResume.addEventListener('click', event => {
    event.stopPropagation();
    if (status.gameRunCount == 0) {
      status.reset = 'not';
      runGame(gameState, event);
      dom.cover.style.display = 'none';
    } else if (status.gameRunCount == 1) {
      status.gameRunCount = 0;
      dom.backSound.pause();
      cancelAnimationFrame(status.animation);
      dom.pauseResume.style.background = 'yellow';
      dom.pauseResume.style.color = 'blue';
      dom.pauseResume.style.fontSize = '1.3rem';
      dom.pauseResume.textContent = 'Resume';
      dom.pauseResume.style.padding = '2px 1rem';
      dom.cover.style.display = 'block';
      dom.cover.style.zIndex = 9
    }
    event.preventDefault();
  });
  dom.homepage.addEventListener('click', event => {
    dom.manueItems.style.display = 'none';
  })
  dom.toHome.addEventListener('click', event => {
    event.stopPropagation();
    setTimeout(() => {
      dom.manueItems.style.display = 'none';
    }, 100);
  })
  dom.again.addEventListener('click', event => runGame(gameState, event));

  for (let value of ballons.list) {
    value.addEventListener('click', (event) => {
      if (value.textContent == '🎈') {
        value.textContent = '💥';
        dom.shoot.pause(); dom.shoot.currentTime = 0;   dom.shoot.play();
        status.scoreCount += 1
        dom.scoreDiv.textContent = 'Score: ' + status.scoreCount;
        if (status.scoreCount % 10 == 0) {
          dom.levelDiv.textContent = 'Level: ' + Math.floor(status.scoreCount / 10)
          if (innerWidthBinding < 460) {
            status.upSpeed += 0.005;
            status.sideSpeed += 0.0001;
          } else {
            status.upSpeed += 0.005;
            status.sideSpeed += 0.0001;
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
        cancelAnimationFrame(status.animation);
        value.style.transform = 'rotate(180deg)';
        gameState.resetStatus();
        status.gameOut = true;
        status.falled = value;
        status.cancelFani = setTimeout(() => {
          cancelAnimationFrame(status.fanimation);
        }, 7000);
        status.fanimation = requestAnimationFrame(newtime => fall(value, status, newtime, null));
      }
      event.preventDefault();
    });
    //For mobile devices
    value.addEventListener('touchstart', (event) => {
      if (value.textContent == '🎈') {
        value.textContent = '💥';
        dom.shoot.pause(); dom.shoot.currentTime = 0;   dom.shoot.play();
        status.scoreCount += 1
        dom.scoreDiv.textContent = 'Score: ' + status.scoreCount;
        if (status.scoreCount % 10 == 0) {
          dom.levelDiv.textContent = 'Level: ' + Math.floor(status.scoreCount / 10)
          if (innerWidthBinding < 460) {
            status.upSpeed += 0.005;
            status.sideSpeed += 0.0001;
          } else {
            status.upSpeed += 0.005;
            status.sideSpeed += 0.0001;
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
        cancelAnimationFrame(status.animation);
        value.style.transform = 'rotate(180deg)';
        gameState.resetStatus();
        status.gameOut = true;
        status.falled = value;
        status.cancelFani = setTimeout(() => {
          cancelAnimationFrame(status.fanimation);
        }, 8000);
        status.fanimation = requestAnimationFrame(newtime => fall(value, status, newtime, null));
      }
      event.preventDefault();
    });
  }
}
Ballons.prototype.update = function (reset, maxLeft, time, lasttime) {
  let index = 0;
  let changeLeft = 0;
  if (innerWidthBinding > 460 && lasttime != null) {
    this.angle += (time - lasttime) * this.sideSpeed;
    changeLeft = Math.cos(this.angle) * 60;
  }
  for (let ballon of this.list) {
    if (lasttime != null && reset == 'not') {
      this.topValues[index] = this.topValues[index] - (time - lasttime) * this.upSpeed;
    }
    if (this.leftValues[index] > maxLeft) {
      this.leftValues[index] = Math.floor(Math.random() * maxLeft);
    }
    ballon.style.top = this.topValues[index] + 'px';
    ballon.style.left = this.leftValues[index] + changeLeft + 'px';
    index += 1;
  }
}

Ballons.prototype.resetPosition = function (maxLeft) {
  let list = this.list;
  for (let i = 0; i <= list.length; i++) {
    if (this.topValues[i] < -75) {
      if (list[i].textContent != '💥' || list[i].textContent != '🎈') {
        this.topValues[i] = innerHeightBinding + Math.random() * 150;
      } else {
        this.topValues[i] = innerHeightBinding;
      }
      this.leftValues[i] = Math.floor(Math.random() * maxLeft)
      if (list[i].textContent == '💥') {
        list[i].textContent = '🎈';
        list[i].style.display = 'inline';
      }
    }

  }
}

Backbirds.prototype.update = function (birdsizechange) {
  let i = 0;
  let show = this.show;
  let hide = this.hide;
  for (let bird of this.list) {
    if (this.topValues[i] > -50) {
      this.topValues[i] -= 0.2;
      this.leftValues[i] += 0.02;
      bird.style.top = this.topValues[i] + 'px';
      bird.style.left = this.leftValues[i] + 'px';
      if (show[i] < 1) {
        show[i] += birdsizechange
        bird.style.transform = `scale(${show[i]})`
      }
      else if (hide[i] > 0) {
        hide[i] -= birdsizechange;
        bird.style.transform = `scale(${hide[i]})`;
      }
    }
    i += 1;
  }
}
Backbirds.prototype.resetPosition = function () {
  let oneBirdtop = (innerHeightBinding / 10) * 8;
  let oneBirdleft = (innerWidthBinding / 10)
  for (let i = 0; i <= 11; i++) {
    if (i < 6) {
      oneBirdleft += 50;
      oneBirdtop -= 5;
    } else {
      oneBirdtop += 5
      oneBirdleft += 60
    }
    this.topValues[i] = oneBirdtop;
    this.leftValues[i] = oneBirdleft;
  }
}
function fall(value, status, time, lasttime) {
  topf = value.style.top
  topf = Number(topf.replace(/px/ig, ''))
  if (lasttime != null) {
    topf += (time - lasttime) * status.upSpeed;
  }
  value.style.top = topf + 'px';
  status.fanimation = requestAnimationFrame(newtime => fall(value, status, newtime, time))
}
function elt(name, attrs, ...childern) {
  let element = document.createElement(name);
  for (let attr of Object.keys(attrs)) {
    element.setAttribute(attr, attrs[attr]);
  }
  for (let child of childern) {
    element.appendChild(child);
  }
  return element;
}
function runGame(gameState, event) {
  let status = gameState.status;
  let dom = gameState.dom;
  if (status.gameOut) {
    cancelAnimationFrame(status.fanimation);
    clearTimeout(status.cancelFani);
    status.falled.style.transform = 'rotate(360deg)';
    status.gameOut = false
  }
  event.preventDefault()
  dom.backSound.play();
  dom.cover.style.display = 'none'
  dom.over.style.display = 'none';
  dom.homepage.style.display = 'none';
  dom.pauseResume.style.background = 'blue';
  dom.pauseResume.style.color = 'white';
  dom.pauseResume.style.fontSize = '1.3rem';
  dom.pauseResume.textContent = 'Pause';
  dom.pauseResume.style.padding = '2px 1rem';
  dom.gameDiv.style.display = 'block';console.log(dom.gameDiv);
  dom.gameDiv.style.height = innerHeight + 'px';
  status.gameRunCount += 1;
  innerWidthBinding = innerWidth;
  let offsetWidthbinding = gameState.ballons.list[0].offsetWidth;
  status.maxLeft = innerWidthBinding - offsetWidthbinding - 40;
  if (innerWidthBinding > 460) {
    dom.backbirdDiv.style.display = 'block';
  }
  status.animation = requestAnimationFrame(move);

  function move(time, lasttime) {
    innerWidthBinding = innerWidth;
    innerHeightBinding = innerHeight;
    status.maxLeft = innerWidthBinding - offsetWidthbinding - 60;
    if (innerWidthBinding > 460) {
      gameState.backBirds.update(status.birdsizechange)
    }
    let sun = gameState.sun;
    if (sun.status.top > -50) {
      sun.update()
    }
    gameState.ballons.update(status.reset, status.maxLeft,
                             time, lasttime)
    gameState.ballons.resetPosition(status.maxLeft);
    status.reset = "not";
    status.animation = requestAnimationFrame(newTime => move(newTime, time))
  }
}
function stopDefaults(dom) {
  window.addEventListener('mousedown', event => {
    event.preventDefault()
  })
  dom.gameDiv.addEventListener('touchmove', event => {
    event.preventDefault();
  })
  dom.gameDiv.addEventListener('touchstart', event => {
    event.preventDefault()
  })
  window.addEventListener("dblclick", event => {
    event.preventDefault()
  })
}
function main() {
  let manu = new ManueBar();
  manu.addEvent();
  let ballons = Ballons.create(12, preStatus.upSpeed, preStatus.sideSpeed);
  let backbirds = Backbirds.create(12);
  let sun = new Sun(DOM.sunDiv)
  let gameState = new GameState(DOM, preStatus, ballons, backbirds, sun);
  setEvents(gameState);
  stopDefaults(DOM);
}
window.addEventListener("load", () => {
  main();
})
