<template>
  <div id="app">

    <header>
      <h1>Sh*thead</h1>
    </header>

    <main>
      <Player player='p2' 
        :cards="cards.p2.hand" 
        :active="this.player==='p2'"
        :topDiscarded="this.cards.discarded[this.cards.discarded.length-1]" />
      <Piles
        :piles="cards.p2.piles" />
      <div id="table">
        <Stack 
          @stackClick="this.handleStackClick"
          :turn="turn"
          :cards="cards.stack" />
        <h2>{{msg}}</h2>
        <Discarded :cards="cards.discarded"/>
      </div>
      <Piles
        :piles="cards.p1.piles" />
      <Player player='p1' 
        :cards="cards.p1.hand" 
        :active="this.player==='p1'"
        :turn="turn"
        :canEndTurn="canEndTurn"
        :topDiscarded="this.cards.discarded[this.cards.discarded.length-1]"
        @turnEnd="handleTurnEnd"
        @handClick="this.handleHandClick"/>
    </main>
          
    <Message :msg="msg"/>

    <footer>
      <p class="copyright"><span class="name">Tom Tidswell</span> &copy; 2019 &hearts;</p>
      <div class="score-table">
        <button id="reset-button">Reset</button>
        <button id="shuffle-button">Shuffle</button>
      </div>
    </footer>

  </div>
</template>

<script>
//components
import HelloWorld from './components/HelloWorld.vue'
import Player from './components/Player.vue'
import Message from './components/Message.vue'
import Stack from './components/Stack.vue'
import Discarded from './components/Discarded.vue'
import Piles from './components/Piles.vue'

//helper functions
import is from './lib/is'

export default {
  name: 'app',
  components: { HelloWorld, Player, Message, Discarded, Stack, Piles },
  data: function () {
    return {
      msg: 'Hello',
      player: 'p1',
      url: './assets/img/cards',
      ranks: ['2','3','4','5','6','7','8','9','10','J','Q','K','ACE'],
      suits: ['H','C','D','S'],
      turn: {
        pickCount: 0,
        penalty: null,
        series: [],
        seriesType: null
      },
      cards: {
        p1: { hand: [], piles: { facedown: [], faceup: [] } },
        p2: { hand: [], piles: { facedown: [], faceup: [] } },
        stack: [],
        discarded: []
      }
      // deck: ['2H','3H','4H','5H','6H','7H','8H','9H','10H','JH','QH','KH','AH','2C','3C','4C','5C','6C','7C','8C','9C','10C','JC','QC','KC','AC','2D','3D','4D','5D','6D','7D','8D','9D','10D','JD','QD','KD','AD','2S','3S','4S','5S','6S','7S','8S','9S','10S','JS','QS','KS','AS']
    }
  },
  methods: {
    shuffle: (collection) => {
      collection.forEach(item => item.shuffle = Math.random().toFixed(4))
      collection.forEach(item => item.mess = ((Math.random() - 0.5) * 90).toFixed(2))
      collection.sort((a, b) => a.shuffle - b.shuffle )
      return collection
    },
    deal(){
      const tempDeck = this.deck.map(card => card)
      console.log('Dealing:',tempDeck.map(card=>card.name))
      //update this with non-hardcoded values
      for (let index = 0; index < 3; index++) {
        this.cards.p1.piles.facedown.push(tempDeck.shift())
        this.cards.p2.piles.facedown.push(tempDeck.shift())
      }
      for (let index = 0; index < 3; index++) {
        this.cards.p1.piles.faceup.push(tempDeck.shift())
        this.cards.p2.piles.faceup.push(tempDeck.shift())
      }
      for (let index = 0; index < 10; index++) {
        this.cards.p1.hand.push(tempDeck.shift())
        this.cards.p2.hand.push(tempDeck.shift())
      }
      this.cards.discarded.push(tempDeck.shift())
      //add the rest of the cards to the stack
      while (tempDeck.length) {
        this.cards.stack.unshift(tempDeck.shift())
      }
      //understand if the card results in a penalty on the first turn
      this.turn.penalty = is.penaltyDue(this.cards.discarded)
      console.log('Dealt:',this.cards.discarded[this.cards.discarded.length-1].name, 'penalty:', this.turn.penalty)
    },
    handleTurnEnd(){
      const topDiscarded = this.cards.discarded[this.cards.discarded.length-1]
      
      //switch player
      this.player = this.player === 'p1' ? 'p2' : 'p1'

      //update the turn data
      this.turn.penalty = is.penaltyDue(this.cards.discarded, this.turn.penalty)
      this.turn.pickCount = 0
      this.turn.series = []
      this.turn.seriesType = null

      console.log('Played:', topDiscarded.name, 'penalty:', this.turn.penalty)

      //begin the computer player's turn
      setTimeout(() => this.handleComputerTurn(), 1000)
      
    },
    handleStackClick(){
      this.turn.pickCount++
      console.log('picked:', this.turn.pickCount)
      this.cards.p1.hand.push(this.cards.stack.pop())
      this.cards.p1.hand.sort((a, b) => a.sortValue - b.sortValue)
    },
    handleHandClick(cardPlayed, indexOfCard){
      //add it to the series of cards which have been played
      this.turn.series.unshift(cardPlayed)

      //set the start of a series (if no series type is set yet, and this is the second card)
      if(!this.turn.seriesType && this.turn.series.length === 2){
        //if the cards are the same value then type is 'set'
        if(is.set(this.turn.series[1], cardPlayed)) this.turn.seriesType = 'set' 
        //if the cards are consecutive then the type is 'run'
        if(is.run(this.turn.series[1], cardPlayed)) this.turn.seriesType = 'run'
      }
      // console.log('playing', cardData, this.hand)
      
      //add the card to the discard pile
      this.cards.discarded.push(cardPlayed)
      //remove it from the hand
      this.cards.p1.hand.splice(indexOfCard,1)
      //check for a win
      if(!this.cards.p1.hand.length) console.log(this.player, 'wins')
    },
    handleComputerTurn(){
      //prevent automating the human's turn!
      if(this.player === 'p1') return

      const topDiscarded = this.cards.discarded[this.cards.discarded.length-1]
      const playableCards = this.cards[this.player].hand.filter(card=>is.validMove(card, this.turn, topDiscarded))
      const firstIndexPlayable = this.cards[this.player].hand.indexOf(playableCards[0])
      // const firstPlayable = playableCards[0]
      //output the comp cards
      console.log('Cards', this.cards[this.player].hand.map(card=>card.name), playableCards, firstIndexPlayable)
      console.log('Playable cards:', playableCards, firstIndexPlayable)
      console.log('Penalty and pick', this.turn.penalty)
      

      //if there are no playable cards, and no penalty, pick up a card
      if(playableCards.length === 0 && !this.turn.penalty) {
        console.log('attempting to pick single card')
        this.cards[this.player].hand.push(this.cards.stack.pop())
      }
      
      //if there are no playable cards and a penalty, pick the number of cards from the penalty
      else if (playableCards.length === 0 && this.turn.penalty){
        console.log('attempting to pick up cards')
        while (this.turn.penalty.pick) {
          this.cards[this.player].hand.push(this.cards.stack.pop())
          this.turn.penalty.pick--
        }
      }
      
      //choose the first card the computer can play, and play it
      else {
        console.log('attempting to play a card')
        //add the card to the discard pile
        this.cards.discarded.push(this.cards[this.player].hand[firstIndexPlayable])
        //remove it from the hand
        this.cards[this.player].hand.splice(firstIndexPlayable,1)
      } 

      console.log('results in:', this.cards.discarded, this.cards[this.player].hand )
      
      this.handleTurnEnd()
    }
  },
  computed: {
    deck: function () {
      const all = []
      this.suits.forEach((suit, indexSuit) => this.ranks.forEach((rank, indexRank) => all.push({
          name: `${rank}${suit}`,
          source: require(`${this.url}/${rank}${suit}.svg`),
          sourceBack: require(`${this.url}/BACK.svg`),
          visible: false,
          value: rank,
          runValue: indexRank,
          sortValue: indexSuit * 20 + (indexRank + 1),
          suit
        })))
      return this.shuffle(all)
    },
    canEndTurn: function () {
      if(!this.turn.penalty && this.turn.pickCount === 0 && this.turn.series.length === 0) return false
      return true
    }
  },
  created: function () {
    this.deal()
    this.cards.p1.hand.sort((a, b) => a.sortValue - b.sortValue)
  }
  
}

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
main{
  perspective: 50em;
}
h2{
  min-height: 100px;
}
#table{
  transform: rotateX(30deg) rotateY(0deg) rotateZ(0deg);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
.card{
  height:120px;
}
</style>
