<template>
  <div class="hand-holder">
    <div :class="{ active: active }" class="play-indicator">
      <div><span :class="{ active: active }">{{message}}</span></div>
      <button v-if="player==='p1' && !canEndTurn" disabled>End Turn</button>
      <button v-if="player==='p1' && canEndTurn" v-on:click="emitTurnEnd()">End Turn</button>
    </div>
    <div class="hand" v-if="player==='p1'" id="p1-hand">
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
    <div class="hand" v-if="player==='p2'" id="p2-hand">
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
  data: function () {
    return {
      allowedDraw: 1
    }
  },
  computed: {
    message: function () {
      if(this.player === 'p2') return 'Computer Thinking'
      if(this.turn.penalty){
        return this.turn.penalty.pick ? `Pick ${this.turn.penalty.pick} or counter it` : 'Miss a turn or counter it'
      } else {
        return this.turn.pickCount ? 'All done' : 'Play or pick a card'
      }
    }
  },
  methods: {
    emitTurnEnd(){
      //signal the end of the turn to the app
      this.$emit('turnEnd')
    },
    emitHandClick(cardData, index){        
      //emit the click and card back to the app
      setTimeout(()=> this.$emit('handClick', cardData, index), 1300)
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
#p1-hand .card, #p1-hand .card-holder{
  height:120px;
}
#p2-hand .card{
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
  transition: all 1s;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
}
.play-indicator.active{
  opacity: 1;
}


</style>
