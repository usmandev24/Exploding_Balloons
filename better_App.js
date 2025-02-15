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

const innerHeightBinding = innerHeight;
const innerWidthBinding = innerWidth;

class Ballons {
  constructor(list, topValues, leftValues, upSpeed, sideSpeed) {
    this.list = list;
    this.topValues = topValues;
    this.leftValues = leftValues;
    this.upSpeed = upSpeed;
    this.sideSpeed = sideSpeed;
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
      
      topValues.push(innerHeightBinding - Math.random() * innerHeightBinding);
      leftValues.push(Math.floor(Math.random() * innerWidthBinding))
    }
    return new Ballons(list, topValues, leftValues, upSpeed, sideSpeed);
  }
  update(time, lasttime, maxLeft, reset) {
    let index = 0;
    let angle;
    let changeLeft = 0;
    if (innerWidthBinding > 460 && lasttime != null) {
      angle += (time - lasttime) * sideSpeed;
      changeLeft = Math.cos(angle) * 60;
    }
    for (let ballon of this.list) {
      if (lasttime != null && reset == 'not') {
        this.topValues[index] = this.topValues[index] - (time - lasttime) * this.upSpeed;
      }
      if (this.leftValues[index] > maxLeft) {
        this.leftValues[index] = Math.floor(Math.random() * maxLeft)
      }
      ballon.style.top = this.topValues[index] + 'px';
      ballon.style.left = this.leftValues[index] + changeLeft + 'px';
      index += 1;
    }
  }
  resetPosition() {
    for (let i = 0; i <= this.list.length; i++) {
      if (this.list[i].textContent != '💥' || this.list[i].textContent != '🎈') {
        this.topValues[i] = innerHeightBinding + random * 150;
      } else {
        this.topValues[i] = innerHeightBinding;
      }
      this.leftValues[i] = Math.floor(random * maxLeft)
      if (this.list[i].textContent == '💥') {
        round += 1;
        this.list[i].textContent = '🎈';
        this.list[i].style.display = 'inline';
      }
    }
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
  static create(count, upSpeed, sideSpeed) {
    let birdsList = [];
    let topValues = [];
    let leftValues = [];
    let oneBirdtop = (innerHeightBinding / 10) * 8;
    let oneBirdleft = (innerWidthBinding / 10);
    for (let i = 0; i < count; i++) {
      birdsList.push(elt('div', { "class": "backbirds" }, document.createTextNode('🕊️')));
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
    return new Backbirds(birdsList, topValues, leftValues, upSpeed, sideSpeed);
  }
  update() {
    let i = 0;
    for (let bird of this.list) {
      if (this.topValues[i] > -50) {
        this.topValues[i] -= 0.2;
        this.leftValues[i] += 0.02;
        bird.style.top = this.topValues[i] + 'px';
        bird.style.left = this.leftValues[i] + 'px';
        if (birdshow[i] < 1) {
          birdshow[i] += birdsizechange
          bird.style.transform = `scale(${birdshow[i]})`
        }
        else if (birdhide[i] > 0) {
          birdhide[i] -= birdsizechange;
          bird.style.transform = `scale(${birdhide[i]})`;
        }
      }
      i += 1;
    }
  }
  resetPosition() {
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
}

class Sun {
  constructor (sunDiv) {
    this.sunDiv = sunDiv;
    this.Data = {
      width: 100,
      height: 100,
      top: innerHeightBinding * 0.65,
      left: innerWidthBinding * 0.1,
      backgroundcolor: [[255, 217, 0], [255, 165, 0]],
      shadow: [255, 217, 0, 0.6],
      background: 'radial-gradient(circle, rgb(255, 217, 0), rgb(255, 165, 0))',
      boxShadow: '0px 0px 50px 20px rgba(255, 223, 0, 0.8)'
    };
    this.change  =  {
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
  update () {
  let green1s;
  let green2;
  let blue;
    this.Data.top -= this.change.top;
    this.Data.left += this.change.left;
    this.Data.width -= this.change.width;
    this.Data.height -= this.change.height;
    this.Data.shadow[1] += this.change.sGreen;
    this.Data.shadow[2] += this.change.Blue;
    this.Data.backgroundcolor[1][1] += this.change.green2;
    green1s = this.Data.shadow[1];
    green2 = this.Data.backgroundcolor[1][1];
    blue = this.Data.shadow[2];
    this.sunDiv.style.top = this.Data.top + 'px';
    this.sunDiv.style.left = this.Data.left + 'px';
    if (this.Data.width > 55) {
      this.sunDiv.style.width = this.Data.width + 'px';
      this.sunDiv.style.height = this.Data.height + 'px';
    }
    if (green1s <= 255 && blue <= 240) {
      this.sunDiv.style.background = `radial-gradient(circle, rgb(255,${green1s} ,${blue}), rgb(255, ${green2}, ${blue}))`;
      this.sunDiv.style.boxShadow = `0 0 50px 20px rgba(250, ${green1s}, ${blue}, 0.8)`;
    }
  }
}
const DOM = {
  gameDiv : document.getElementById("game"),
  startGame : document.querySelector('#start') , // For home page play button
  pauseResume : document.getElementById('pauseResume'),
  homepage : document.getElementById('homepage'),
  toHome : document.getElementById('linktohome'),  
  scoreDiv : document.getElementById('score'),
  levelDiv : document.getElementById('level'),
  cover : document.getElementById('cover'),
  again : document.getElementById('again'),
  over : document.getElementById('gameOver'),
  backbirdDiv : document.getElementById('birddiv'),
  sunDiv : document.getElementById('sun'),
  tScoreDiv : document.getElementById('tscore'),
}

let preState = {
  reset: "not", 
  resetrun : 0,
  round : 1, 
  scoreCount: 0, 

}
Object.values(pr)
class GameState {
  constructor(dom, status) {
    this.dom = dom;
    this.status = status;
  }
  static create (dom, status) {
    return new GameState(dom, status)
  }
}
GameState.prototype.setEvents = function() {

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