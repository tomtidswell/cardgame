
const url = './img/cards/'
var cardsInPlay = []
var cardsMatched = []
var randomisedCards = []
var gameBoard = document.getElementById('game-board')
var gameMessage = document.getElementById('game-message')
var gameScore = document.getElementById('game-score')
var gameBestScore = document.getElementById('game-best-score')
var totalFlips = 0
var bestScore = 100

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

suits.forEach((suit, indexSuit) => ranks.forEach((rank, indexRank) => deck.push({
  name: `${rank}${suit}`,
  source: `${url}${rank}${suit}.svg`,
  value: rank,
  sortValue: indexSuit * 20 + (indexRank + 1),
  suit
})))

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
  shuffle(deck)
  deal()
  console.log('full deck', deck.map(card => card.name))
}



function addElToParent(data, parentEl, layoutRules) {
  const el = document.createElement('img')
  el.classList.add('card')
  el.setAttribute('data-card', data.name)
  
  //additional layout options
  layoutRules.visible ? el.setAttribute('src', data.source) : el.setAttribute('src', `${url}BACK.svg`)
  if (layoutRules.mess) el.style.transform = `rotateX(50deg) rotate(${data.mess}deg)`

  //append the resulting element
  parentEl.appendChild(el)
}

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
      refreshHandClick('p1') //adds an event listener to the top card
      cards[collectionName].sort((a, b) => a.sortValue - b.sortValue)
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
  if(!cardElements.stack.children.length) return null
  cardElements.stack.children[cardElements.stack.children.length - 1]
    .addEventListener('click',handleClickStack)
}

function refreshHandClick(elementName){
  // if (!cardElements[elementName].children.length) return null
  for (const el of cardElements[elementName].children) {
    el.addEventListener('click', () => 
      handleClickHand(elementName, el.attributes['data-card'].value))
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
    cards.stack.push(tempDeck.shift())
  }

  refreshDom('p1', { visible: true, shape: 'fan', total: cards.p1.length })
  refreshDom('p2')
  refreshDom('discarded', { visible: true, shape: 'mess' })
  refreshDom('stack')
  
}

function handleClickStack(){
  console.log('stack clicked')
  cards.p1.push(cards.stack.shift())
  refreshDom('p1', { visible: true })
  refreshDom('stack')
}

function handleClickHand(collection, card){
  //add the item which matches to the discard pile
  cards.discarded.push(cards[collection].filter(item => item.name === card)[0])
  //remove it from the hand
  cards[collection] = cards[collection].filter(item => item.name !== card)
  //update the DOM
  refreshDom(collection, { visible: true })
  refreshDom('discarded', { visible: true, shape: 'mess' })
}

function updateText(newText){
  gameMessage.innerHTML = newText
  gameMessage.classList.add('show')
  setTimeout(()=>gameMessage.classList.remove('show'), 2000)
}

document.addEventListener('DOMContentLoaded', resetBoard)
document.getElementById('reset-button').addEventListener('click', resetBoard)
document.getElementById('shuffle-button').addEventListener('click', ()=>{
  shuffle(cards.stack)
  refreshDom('stack')
})
