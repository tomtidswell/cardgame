<template>
  <div id="app">

    <header>
      <h1>Sh*thead</h1>
      <div class="score-table">
        <button id="reset-button">Reset</button>
        <button id="shuffle-button">Shuffle</button>
        Score: <span id="game-score">0</span>
        Best: <span id="game-best-score">0</span>
      </div>
    </header>

    <main>
      <Player player='p2' :cards="cards.p2"/>
      <div id="table">
        <Stack :cards="cards.stack" @stackClick="this.handleStackClick"/>
        <Discarded :cards="cards.discarded"/>
      </div>
      <Player player='p1' :cards="cards.p1"/>
    </main>
          
    <Message :msg="msg"/>

    <footer>
      <p class="copyright">Copyright &copy; 2019</p>
      <p class="message">Created with &hearts; by <span class="name">Tom Tidswell</span></p>
    </footer>

  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Player from './components/Player.vue'
import Message from './components/Message.vue'
import Stack from './components/Stack.vue'
import Discarded from './components/Discarded.vue'

export default {
  name: 'app',
  components: { HelloWorld, Player, Message, Discarded, Stack },
  data: function () {
    return {
      msg: 'Hello',
      url: './img/cards/',
      // deck: [],
      // cards: ['2','3','4','5'],
      ranks: [2,3,4,5,6,7,8,9,10,'J','Q','K','A'],
      suits: ['H','C','D','S'],
      cards: {
        p1: [],
        p2: [],
        stack: [],
        discarded: []
      }
      // deck: ['2H','3H','4H','5H','6H','7H','8H','9H','10H','JH','QH','KH','AH','2C','3C','4C','5C','6C','7C','8C','9C','10C','JC','QC','KC','AC','2D','3D','4D','5D','6D','7D','8D','9D','10D','JD','QD','KD','AD','2S','3S','4S','5S','6S','7S','8S','9S','10S','JS','QS','KS','AS']
    }
  },
  methods: {
    greet: function (greeting) {
      console.log('hello', this.deck)
    },
    buildDeck: function () {
      const all = []
      this.suits.forEach((suit, indexSuit) => this.ranks.forEach((rank, indexRank) => {
        const card = {
          name: `${rank}${suit}`,
          source: `./${this.url}${rank}${suit}.svg`,
          sourceBack: `./${this.url}BACK.svg`,
          visible: false,
          value: rank,
          runValue: indexRank,
          sortValue: indexSuit * 20 + (indexRank + 1),
          suit
        }
        all.push(card)
      }))
      return this.shuffle(all)
    },
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
      for (let index = 0; index < 7; index++) {
        this.cards.p1.push(tempDeck.shift())
        this.cards.p2.push(tempDeck.shift())
      }
      this.cards.discarded.push(tempDeck.shift())
      //add the rest of the cards to the stack
      while (tempDeck.length) {
        this.cards.stack.unshift(tempDeck.shift())
      }
    },
    handleStackClick(){
      console.log('stack clicked')
      setTimeout(()=> this.cards.p1.push(this.cards.stack.pop()), 2000)
    }
  },
  computed: {
    deck: function () {
      const all = []
      this.suits.forEach((suit, indexSuit) => this.ranks.forEach((rank, indexRank) => {
        const card = {
          name: `${rank}${suit}`,
          source: `./${this.url}${rank}${suit}.svg`,
          sourceBack: `./${this.url}BACK.svg`,
          visible: false,
          value: rank,
          runValue: indexRank,
          sortValue: indexSuit * 20 + (indexRank + 1),
          suit
        }
        all.push(card)
      }))
      
      return this.shuffle(all)
    }
  },
  created: function () {
    this.deal()

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
#table{
  display: flex;
  justify-content: space-around;
  min-height: 160px;
}
</style>
