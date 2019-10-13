const url = './img/cards/'
var gameMessage = document.getElementById('game-message')


const cards = {
  p1: [],
  p2: [],
  stack: [],
  discarded: []
}

const ranks = [2,3,4,5,6,7,8,9,10,'J','Q','K','A']
const suits = ['H','C','D','S']
const deck = []

const cardElements = {
  p1: document.getElementById('p1-hand'),
  p2: document.getElementById('p2-hand'),
  stack: document.getElementById('stack'),
  discarded: document.getElementById('discarded')
}

function generateDeck(){
  suits.forEach((suit, indexSuit) => ranks.forEach((rank, indexRank) => {
    const card = {
      name: `${rank}${suit}`,
      source: `${url}${rank}${suit}.svg`,
      visible: false,
      value: rank,
      runValue: indexRank,
      sortValue: indexSuit * 20 + (indexRank + 1),
      suit,
      parentEl: cardElements.stack
    }
    deck.push(card)
  }))
  //give them a shuffle
  // shuffle(deck)
  //finally generate the cards on screen
  deck.forEach(card=>{
    card.el = createEl(card, card.parentEl)
  })
}


const shuffle = (collection) => {
  collection.forEach(item => item.shuffle = Math.random().toFixed(4))
  collection.forEach(item => item.mess = ((Math.random() - 0.5) * 90).toFixed(2))
  collection.sort((a, b) => a.shuffle - b.shuffle )
}

function resetBoard(){
  cards.p1 = []
  cards.p2 = []
  cards.discarded = []
  cards.stack = []
  cardElements.p1.innerHTML = ''
  cardElements.p2.innerHTML = ''
  cardElements.discarded.innerHTML = ''
  cardElements.stack.innerHTML = ''
  generateDeck()
  
  // deal()
  console.log('full deck', deck.map(card => card.name), deck)
}

function orchGame(){
  resetBoard()
  shthead.endTurn()
}

class Game {
  constructor(data){
    this.player = 'p2'
    this.series = []
    this.seriesType = null
    this.indicators = {
      p1: document.querySelector('.p1-indicator'),
      p2: document.querySelector('.p2-indicator')
    }
    console.log(data)
  }
  updateText(newText) {
    gameMessage.innerHTML = newText
    gameMessage.classList.add('show')
    setTimeout(() => gameMessage.classList.remove('show'), 2000)
  }
  endTurn(){
    //remove the play indicator
    this.indicators[this.player].classList.remove('active')
    //switch player
    this.player = this.player === 'p1' ? 'p2' : 'p1'
    //set the new player indicator
    this.indicators[this.player].classList.add('active')
    //clear the player's series
    this.series = []
    this.seriesType = null

    //TODO replace this with real computer logic
    if(this.player === 'p2') setTimeout(() => this.endTurn(), 2000)

  }
  handleClickStack(el) {    
    //check if it is the players turn
    if(this.player !== 'p1') return

    el.classList.add('deal-p1')

    setTimeout(() => {
      el.setAttribute('src', `${url}${el.dataset.card}.svg`)
    }, 200)

    setTimeout(() => {
      const card = cards.stack.pop()
      cards.p1.push(card)
      refreshDom('p1', { visible: true })
      refreshDom('stack')
    }, 2000)
  }
  handleClickHand(collection, cardName) {
    //check if it is the players turn
    if (this.player !== 'p1') return

    //fetch the card data 
    const cardData = cards[collection].filter(item => item.name === cardName)[0]
    
    //block play if card is not allowed
    if(!this.cardAllowed(cardData)) return

    this.series.unshift(cardData)

    //add the item which matches to the discard pile
    cards.discarded.push(cardData)
    
    //remove it from the hand
    cards[collection] = cards[collection].filter(item => item.name !== cardName)
    //update the DOM
    refreshDom(collection, { visible: true })
    refreshDom('discarded', { visible: true, shape: 'mess' })

    if(!cards[collection].length) console.log(collection, 'wins')
    

  }
  cardAllowed(card){
    //if there were no previous plays, only allow a valid move
    if(!this.series.length) return is.allowedFirst(cards, card)
    
    //logic for determining the start of a series
    if(!this.seriesType){
      //if the cards are the same value then type is 'set'
      if(is.set(this.series[0], card)) this.seriesType = 'set' 
      //if the cards are consecutive then the type is 'run'
      if(is.run(this.series[0], card)) this.seriesType = 'run'
      //if we succesfully set a seriesType then allow the card
      return this.seriesType ? true : false
    }

    //check to make sure the series is continuing as it should
    return is[this.seriesType](this.series[0], card) ? true : false
  }
}

//define the 'is' object which contains the assessor functions
const is = {
  //function to define a set
  set: function (a, b) {
    return a.value === b.value
  },
  //function to define a run
  run: function (a, b) {
    //not a run if they are not the same suit
    if (a.suit !== b.suit) return false
    //assess the index value of the rank, and see if they are consecutive
    if (a.runValue === b.runValue + 1) return true
    if (a.runValue === b.runValue - 1) return true
    //allow a run to travel from two to ace and vice versa
    if (a.runValue === 0 && b.runValue === 12) return true
    if (a.runValue === 12 && b.runValue === 0) return true
    return false
  },
  allowedFirst: function (a, b){
    return true
  }
}



const shthead = new Game('hello')

function refreshDom(collectionName, layoutRules = {}) {
  //interpret the rules and add the appropriate flags
  switch (layoutRules.shape) {
    case 'mess':
      layoutRules.mess = true
      break
  }
  //pre DOM update formatting rules
  switch (collectionName) {
    case 'p1':
      // sort the hand into suits
      cards[collectionName].sort((a, b) => a.sortValue - b.sortValue)
      // make sure the cards are visible
      cards[collectionName].forEach(card => card.visible = true)
      break
    case 'p2':
      // make sure the cards are not visible
      cards[collectionName].forEach(card => card.visible = false)
      break
    case 'discarded':
      // make sure the cards are visible
      cards[collectionName].forEach(card => card.visible = true)
      break
    case 'stack':
      // make sure the cards are not visible
      cards[collectionName].forEach(card => card.visible = false)
      break
  }

  //identify data array and dom parent elements
  cardElements[collectionName].innerHTML = ''
  cards[collectionName]
    .forEach(item => addElToParent(item, cardElements[collectionName], layoutRules))

  //post DOM update formatting rules
  switch(collectionName) {
    case 'stack':
      refreshStackClick() //adds an event listener to the top card
      break
    case 'p1':
      refreshHandClick('p1') //adds an event listener to the top card
      break
  }
}

function refreshStackClick(){
  const stackChildren = cardElements.stack.children
  if(!stackChildren.length) return null
  stackChildren[stackChildren.length - 1]
    .addEventListener('click', ()=>shthead.handleClickStack(stackChildren[stackChildren.length - 1]))
}

function refreshHandClick(elementName){
  // if (!cardElements[elementName].children.length) return null
  for (const el of cardElements[elementName].children) {
    el.addEventListener('click', () => shthead.handleClickHand(elementName, el.dataset.card))
  }  
}

function deal(){
  const tempDeck = deck.map(card => card)

  //update this with non-hardcoded values
  for (let index = 0; index < 7; index++) {
    cards.p1.push(tempDeck.shift())
    cards.p2.push(tempDeck.shift())
  }
  cards.discarded.push(tempDeck.shift())
  //add the rest of the cards to the stack
  while (tempDeck.length) {
    cards.stack.unshift(tempDeck.shift())
  }

  refreshDom('p1', { shape: 'fan', total: cards.p1.length })
  refreshDom('p2')
  refreshDom('discarded', { shape: 'mess' })
  refreshDom('stack')
  
}

document.addEventListener('DOMContentLoaded', orchGame)
document.getElementById('end-button').addEventListener('click', ()=>shthead.endTurn())
document.getElementById('reset-button').addEventListener('click', resetBoard)
document.getElementById('shuffle-button').addEventListener('click', ()=>{
  shuffle(cards.stack)
  refreshDom('stack')
})


function addElToParent(data, parentEl, layoutRules) {
  createEl(data, parentEl, layoutRules)
}

function createEl(data, parentEl, layoutRules = {}) {
  const el = document.createElement('img')
  el.classList.add('card')
  el.setAttribute('data-card', data.name)
  //additional layout options
  data.visible ? el.setAttribute('src', data.source) : el.setAttribute('src', `${url}BACK.svg`)
  if (layoutRules.mess) el.style.transform = `rotateX(50deg) rotate(${data.mess}deg)`
  //append the resulting element
  parentEl.appendChild(el)
  return el
}

function appendEl(el, parentEl) {
  //append (and moves if required) the resulting element
  parentEl.appendChild(el)
  return el
}


