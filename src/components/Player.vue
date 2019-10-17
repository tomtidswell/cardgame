<template>
  <div class="hand-holder">
    <div :class="{ active: active }" class="play-indicator">
      <p>{{message}}</p>
      <button v-if="player==='p1'" v-on:click="emitTurnEnd()" :disabled="!canEndTurn">
        {{buttonMessage}}
      </button>
    </div>
    <div class="hand p1-hand" v-if="player==='p1'">
      <div class="card-holder" v-for="(card, index) in cards" :key="card.name">
        <PlayingCard 
          :card="card"
          :index="index"
          :canBePlayed="canBePlayed(card)"
          @cardClick="emitHandClick" 
          face
          interactive />
      </div>
    </div>
    <div class="hand p2-hand" v-if="player==='p2'">
      <div class="card-holder" v-for="(card, index) in cards" :key="card.name">
        <PlayingCard 
          :card="card"
          :index="index" />
      </div>
    </div>
  </div>
</template>

<script>
import PlayingCard from './PlayingCard.vue'
import is from '../lib/is'

export default {
  name: 'Player',
  components: { PlayingCard },
  props: {
    player: String,
    active: Boolean,
    cards: Array,
    topDiscarded: Object,
    canEndTurn: Boolean,
    turn: Object,
    mode: String
  },
  // data: function () {
  //   return {
  //     allowedDraw: 1
  //   }
  // },
  computed: {
    message: function () {
      if(this.player === 'p2') return 'Computer Thinking'
      if(this.mode === 'setup') return 'Choose your three best cards for your three piles'
      if(this.turn.penalty) return this.turn.penalty.missTurn ? 
        `Miss a turn or counter it with an ${this.turn.penalty.counterValue} card` : ''
      if(!this.turn.series.length && !this.topDiscarded) return 'Play another card'
      return this.turn.series.length ? 
        'Done everything?' : 'Play a card or take all discarded cards'
    },
    buttonMessage: function () {
      if(this.mode === 'setup') return 'Confirm'
      if(this.turn.penalty) if(this.turn.penalty.missTurn) return `Miss turn`
      if(!this.turn.series.length && !this.topDiscarded) return 'End turn'
      return this.turn.series.length ? 'End turn' : 'Take discarded'
    }
  },
  methods: {
    emitTurnEnd(){
      //signal the end of the turn to the app
      this.$emit('turnEnd')
    },
    emitHandClick(cardData, indexOfCard){        
      //emit the click and card back to the app
      // setTimeout(()=> this.$emit('handClick', cardData, index), 1300)
      this.$emit('handClick', cardData, indexOfCard)
    },
    canBePlayed(card){
      //cant be played if it's not the players turn!
      if(!this.active) return false

      //if there were no previous plays, only allow a valid move
      if(!this.turn.series.length) return is.allowedFirst(this.topDiscarded, card, this.turn.penalty, this.mode)

      return is.set(this.turn.series[0], card)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.hand{
  z-index: 2;
  min-width: 100px;
  padding: 0 20px;
  display: flex; 
}
.p1-hand .card, .p1-hand .card-holder, .p1-hand{
  height:120px;
}
.p2-hand .card, .p2-hand .card-holder, .p2-hand{
  height:80px;
}
.hand-holder{
  display: flex;
  justify-content: center;
  align-items: center;
}
.hand .card-holder{
  width: 15px;
  transition: transform 0.3s;
  z-index: 2;
  position: relative;
}
.play-indicator{
  opacity: 0;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
}
.play-indicator p{
  max-width: 160px;
  text-align: right;
  margin: 5px 0;
}
.play-indicator.active{
  opacity: 1;
}


</style>
