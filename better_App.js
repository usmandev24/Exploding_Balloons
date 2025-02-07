class ManueBar {
  constructor () {
    this.manu = document.getElementById('manu');
  }
  addEvent () {
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
  constructor (list, topValues, leftValues) {
    this.list = list;
    this.topValues = topValues;
    this.leftValues = leftValues;
  }
  static create(count) {
    let ballonsList = [];
    let topData = [];
    let leftData = [];
    for (let i = 0; i < count; i++) {
      if ([5,6,10,11].includes(i)) {
        let bird = document.createElement('img');
        bird.setAttribute('src', "images/bird.png");
        ballonsList.push(elt('div', {"class": 'bal'}, bird));
      } else {
        ballonsList.push(elt('div', {"class": 'bal'}, document.createTextNode('🎈')))
      }
      topData.push(innerHeightBinding - Math.random() * innerHeightBinding);
      leftData.push(Math.floor(Math.random() * innerWidthBinding))
    }
    return new Ballons(ballonsList, topData, leftData);
  }
}

class Backbirds {
  constructor (list , topValues, leftValues) {
    this.list = list;
    this.topValues = topValues;
    this.leftValues = leftValues;
  }
  static create (count) {
    let birdsList = [];
    let topData = [];
    let leftData = [];
    let oneBirdtop = (innerHeightBinding / 10) * 8;
    let oneBirdleft = (innerWidthBinding / 10);
    for (let i = 0; i < count; i++) {
      birdsList.push(elt('div', {"class": "backbirds"}, document.createTextNode('🕊️')));
      if (i < 6) {
        oneBirdleft += 20;
        oneBirdtop -= 5;
      } else {
        oneBirdtop += 5
        oneBirdleft += 23
      }
      topData.push(oneBirdtop);
      leftData.push(oneBirdleft);
    }
    return new Backbirds(birdsList, topData, leftData);
  }
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