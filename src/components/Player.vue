<template>
  <div class="hand-holder">
    <div :class="{ active: active }" class="play-indicator">
      <div><span :class="{ active: active }">{{message}}</span></div>
      <button v-if="player==='p1' && !canEndTurn" disabled>End Turn</button>
      <button v-if="player==='p1' && canEndTurn" v-on:click="emitTurnEnd()">End Turn</button>
    </div>
    <div class="hand" v-if="player==='p1'" id="p1-hand">
      <PlayingCard v-for="(card, index) in cards" 
        :key="card.name"
        :card="card"
        :index="index"
        :canBePlayed="canBePlayed(card)"
        @cardClick="emitHandClick" />
    </div>
    <div class="hand" v-if="player==='p2'" id="p2-hand">
      <PlayingCard v-for="(card, index) in cards" 
        :key="card.name" 
        :card="card"
        :index="index"
        computer />
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
    turn: Object
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
      if(!this.turn.series.length) return is.allowedFirst(this.topDiscarded, card, this.turn.penalty)
      
      //when there is only one previous card played
      if(this.turn.series.length === 1){
        //if the card would be a valid second card in a run or set, allow it
        return is.set(this.turn.series[0], card) || is.run(this.turn.series[0], card)
      }
      
      //check to make sure the series is continuing as it should
      return is[this.turn.seriesType](this.turn.series[0], card) ? true : false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#p1-hand{
  min-height: 100px;
  z-index: 2;
}
#p2-hand{
  min-height: 144px;
  transform: scale(0.7);
}

.hand-holder{
  display: flex;
  justify-content: center;
}
.play-indicator{
  opacity: 0;
  transition: all 1s;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  padding: 10px;
}
.play-indicator.active{
  opacity: 1;
}
.hand{
  padding-right: 40px;
  padding-left: 50px;
  display: flex; 
}

</style>
