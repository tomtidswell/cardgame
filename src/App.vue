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

      <Piles player='p2' :piles="cards.p2.piles" />

      <div class="table">
        <Stack 
          :turn="turn"
          :animator="animator.stack"
          :cards="cards.stack" />
        <Discarded :cards="cards.discarded"/>
      </div>

      <Piles player='p1' :piles="cards.p1.piles" />

      <Player player='p1' 
        :cards="cards.p1.hand" 
        :active="this.player==='p1'"
        :turn="turn"
        :canEndTurn="canEndTurn"
        :mode="mode"
        :topDiscarded="this.cards.discarded[this.cards.discarded.length-1]"
        @turnEnd="handleTurnEnd"
        @handClick="this.handleHandClick"/>

    </main>
          
    <Message :message="message" v-if="message" @clear="this.clearPopup"/>

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
import Player from './components/Player.vue'
import Message from './components/Message.vue'
import Stack from './components/Stack.vue'
import Discarded from './components/Discarded.vue'
import Piles from './components/Piles.vue'

//helper functions
import is from './lib/is'

export default {
  name: 'app',
  components: { Player, Message, Discarded, Stack, Piles },
  data: function () {
    return {
      message: '',
      player: 'p1',
      mode: 'setup',
      url: './assets/img/cards',
      ranks: ['2','3','4','5','6','7','8','9','10','J','Q','K','ACE'],
      suits: ['H','C','D','S'],
      animator: {
        stack: { cardName: null, animation: null, timeout: null, flag: null }
      },
      turn: {
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
        this.moveCard(0, this.cards.stack, this.cards.p2.piles.facedown, 'p2-stack-pile0')
        this.moveCard(0, this.cards.stack, this.cards.p1.piles.facedown, 'p1-stack-pile0')
      }
      for (let index = 0; index < 3; index++) {
        this.moveCard(0, this.cards.stack, this.cards.p2.piles.faceup, 'p2-stack-pile0')
        this.moveCard(0, this.cards.stack, this.cards.p1.hand, 'p1-stack-hand')
      }
      for (let index = 0; index < 3; index++) {
        this.moveCard(0, this.cards.stack, this.cards.p2.hand, 'p2-stack-hand')
        this.moveCard(0, this.cards.stack, this.cards.p1.hand, 'p1-stack-hand')
      }
      this.moveCard(0, this.cards.stack, this.cards.discarded, '')

      // this.popup('Choose your best cards for your three piles')
    },
    popup(message){
      this.message = message
    },
    clearPopup(){
      this.message = ''
    },
    sortHumanHand(){
      this.cards.p1.hand.sort((a, b) => a.runValue - b.runValue )
    },
    moveCard(indexOfCard, from, to, specialClass = ''){
      const card = from[indexOfCard]
      //remove it from the old array
      from.splice(indexOfCard,1)
      //add the special class
      card.specialClass = specialClass
      //add the card to the new array      
      to.push(card)
    },
    handleTurnEnd(){
      //some aliases to make the code more readable
      const playerHand = this.cards[this.player].hand
      //deal any cards required
      for (let i = playerHand.length; i < 3; i++) {
        this.moveCard(0, this.cards.stack, playerHand, `${this.player}-stack-hand`)
      }
      
      //if no cards were played, and the player wasnt supposed to miss a turn, then move all cards from the discard pile to the players hand
      if(this.turn.series.length === 0 && !this.turn.penalty)
        while (this.cards.discarded.length) {
          this.moveCard(0, this.cards.discarded, playerHand, `${this.player}-discard-hand`)
        }

      //switch player
      this.player = this.player === 'p1' ? 'p2' : 'p1'

      //update the turn data
      this.turn.penalty = is.penaltyDue(this.cards.discarded, this.turn.penalty)
      this.turn.series = []

      //begin the computer player's turn
      setTimeout(() => this.handleComputerTurn(), 2000)
      // if(this.player === 'p2')
      //   setTimeout(() => this.handleTurnEnd(), 2000)
      
    },
    handleHandClick(cardPlayed, indexOfCard){
      //some aliases to make the code more readable
      const p1hand = this.cards.p1.hand
      const p1piles = this.cards.p1.piles

      //determine where to put the card based on the game mode
      switch (this.mode) {
        case 'setup':
          //add the card to the faceup pile and remove from the hand
          this.moveCard(indexOfCard, p1hand, p1piles.faceup, `p1-hand-pile${p1piles.faceup.length}`)
          //change the mode if there are now 3 cards in the faceup pile 
          if(p1piles.faceup.length === 3) this.mode = 'play'
          break
        case 'play':
          //add it to the series of cards which have been played
          this.turn.series.unshift(cardPlayed)
          //add the card to the discard pile and remove it from the hand
          this.moveCard(indexOfCard, p1hand, this.cards.discarded, 'p1-hand-discard')
          //check for a win
          if(!p1hand.length) console.log(this.player, 'wins')
          break
      }
    },
    handleComputerTurn(){
      //prevent automating the human's turn!
      if(this.player === 'p1') return

      const topDiscarded = this.cards.discarded[this.cards.discarded.length-1]
      const playableCards = this.cards[this.player].hand.filter(card=>is.validMove(card, this.turn, topDiscarded, this.mode))
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
      return this.mode !== 'setup'
    }
  },
  created: function () {
    this.dealRoutine()

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
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-image: linear-gradient(160deg, #13547a 0%, #80d0c7 100%);
  justify-content: space-evenly;
  overflow: hidden;
  perspective: 50em;
}
h2{
  text-align: center;
}
.table{
  transform: rotateX(30deg);
  display: flex;
  justify-content: center;
  align-items: center;
  transform-style: preserve-3d;
}



</style>
