<template>
  <div class="hand-holder">
    <div :class="{ active: active }" class="play-indicator">
      <p v-if="owner==='p1'">{{message}}</p>
      <p v-else>Computer Thinking</p>
      <button v-if="owner==='p1'" v-on:click="emitTurnEnd()" :disabled="!canEndTurn">
        {{buttonMessage}}
      </button>
    </div>
    <div class="hand" :class="`${owner}-hand`">
      <div class="card-holder" v-for="(card, index) in cards" :key="card.name">
        <PlayingCard 
          :card="card"
          :index="index"
          :canBePlayed="owner==='p1' && active ? canBePlayed(card) : null"
          @cardClick="emitHandClick" 
          :face="owner==='p1'"
          :interactive="active" />
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
    message: String,
    buttonMessage: String,
    owner: String,
    active: Boolean,
    cards: Array,
    canBePlayed: Function,
    canEndTurn: Boolean
  },
  // data: function () {
  //   return {
  //     allowedDraw: 1
  //   }
  // },
  // computed: {
  //   buttonMessage: function () {
  //     return this.turn.series.length ? 'End turn' : 'Take discarded'
  //   }
  // },
  methods: {
    emitTurnEnd(){
      //signal the end of the turn to the app
      this.$emit('turnEnd')
    },
    emitHandClick(cardData, indexOfCard){      
      console.log('Clicked hand:', cardData.name, cardData, indexOfCard)
      //emit the click and card back to the app
      this.$emit('cardClick', cardData, indexOfCard, 'hand')
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
