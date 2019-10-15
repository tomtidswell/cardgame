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
      <Piles player='p2' 
        :piles="cards.p2.piles" />
      <div class="table">
        <Stack 
          :turn="turn"
          :animator="animator.stack"
          :cards="cards.stack" />
        <Discarded :cards="cards.discarded"/>
      </div>
      <Piles player='p1' 
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
      animator: {
        stack: { cardName: null, animation: null, timeout: null, flag: null }
      },
      turn: {
        pickCount: 0,
        penalty: null,
        series: [],
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
    dealRoutine(){
      this.cards.stack = this.deck.map(card => card)
      console.log('Dealing:',this.cards.stack.map(card=>card.name))
      //update this with non-hardcoded values
      for (let index = 0; index < 3; index++) {
        this.cards.p1.piles.facedown.push(this.cards.stack.pop())
        this.cards.p2.piles.facedown.push(this.cards.stack.pop())
      }
      for (let index = 0; index < 3; index++) {
        this.cards.p2.piles.faceup.push(this.cards.stack.pop())
        this.dealCard('p1')
      }
      for (let index = 0; index < 3; index++) {
        // this.cards.p1.hand.push(this.cards.stack.pop())
        // this.cards.p2.hand.push(this.cards.stack.pop())
        this.dealCard('p1')
        this.dealCard('p2')
      }

      

      this.cards.discarded.push(this.cards.stack.pop())

      //understand if the card results in a penalty on the first turn
      // this.turn.penalty = is.penaltyDue(this.cards.discarded)
      // console.log('Dealt:',this.cards.discarded[this.cards.discarded.length-1].name, 'penalty:', this.turn.penalty)
    },
    dealCard(player){
      const animationData = {
        name: this.cards.stack[this.cards.stack.length-1].name,
        animation: `deal-${player}`,
        timeout: 200,
        flag: player === 'p1' ? 'flip' : null
      }
      this.animator.stack = animationData
      console.log(animationData.name, player)
      setTimeout(()=>{
        this.cards[player].hand.push(this.cards.stack.pop())
        if(player === 'p1') this.cards[player].hand.sort((a, b) => a.runValue - b.runValue )
      }, 1000)
    },
    handleTurnEnd(){
      const topDiscarded = this.cards.discarded[this.cards.discarded.length-1]
      
      //deal any cards required
      for (let i = this.cards[this.player].hand.length; i < 3; i++) {
        this.dealCard(this.player) 
      }

      //switch player
      this.player = this.player === 'p1' ? 'p2' : 'p1'

      //update the turn data
      this.turn.penalty = is.penaltyDue(this.cards.discarded, this.turn.penalty)
      this.turn.series = []

      console.log('Played:', topDiscarded.name, 'penalty:', this.turn.penalty)

      //begin the computer player's turn
      // setTimeout(() => this.handleComputerTurn(), 1000)
      if(this.player === 'p2')
        setTimeout(() => this.handleTurnEnd(), 2000)
      
    },
    handleHandClick(cardPlayed, indexOfCard){
      //add it to the series of cards which have been played
      this.turn.series.unshift(cardPlayed)
      
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
    this.dealRoutine()
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
  /* transform-style: preserve-3d; */
}
h2{
  text-align: center;
}
.table{
  transform: rotateX(30deg) scale(0.9);
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  transform-style: preserve-3d;
}
.card{
  height:120px;
}
</style>
