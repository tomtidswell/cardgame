<template>
  <div class="hand-holder">
    <div :class="{ active: turn }" class="play-indicator">
      <span :class="{ active: turn }">{{message}}</span>
      <button v-if="player==='p1'" v-on:click="emitTurnEnd()">End</button>
    </div>
    <div class="hand" v-if="player==='p1'" id="p1-hand">
      <PlayingCard v-for="(card, index) in cards" 
        :key="index"
        :index="index"
        :card="card"
        :canBePlayed="canBePlayed(card)"
        @cardClick="emitHandClick" />
    </div>
    <div class="hand" v-if="player==='p2'" id="p2-hand">
      <img v-for="(card, index) in cards" 
        :key="index" 
        :src="card.sourceBack" 
        class="card" />
    </div>
  </div>
</template>

<script>
import PlayingCard from './PlayingCard.vue'

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
    //logic to determine if we are reacting to the other players special card
    return true
  }
}

export default {
  name: 'Player',
  components: { PlayingCard },
  props: {
    player: String,
    turn: Boolean,
    cards: Array,
    topDiscarded: Object
  },
  data: function () {
    return {
      series: [],
      seriesType: null
    }
  },
  computed: {
    message: function () {
      return this.player === 'p1' ? 'Your Turn' : 'Computer Thinking'
    }
  },
  methods: {
    emitTurnEnd(){
      //TODO: logic to check that they have either picked up a card or played a card
      //clear the series data
      this.series = []
      this.seriesType = null
      //signal the end of the turn to the app
      this.$emit('turnEnd')
    },
    emitHandClick(cardData, index){  
      //add it to the series of cards which have been played
      this.series.unshift(cardData)

      //set the start of a series (if no series type is set yet, and this is the second card)
      if(!this.seriesType && this.series.length === 1){
        //if the cards are the same value then type is 'set'
        if(is.set(this.series[0], cardData)) this.seriesType = 'set' 
        //if the cards are consecutive then the type is 'run'
        if(is.run(this.series[0], cardData)) this.seriesType = 'run'
      }
      // console.log('playing', cardData, this.hand)
      
      //emit the click and card back to the app
      setTimeout(()=> this.$emit('handClick', cardData, index), 2000)
    },
    canBePlayed(card){
      //cant be played if it's not the players turn!
      if(!this.turn) return false

      //if there were no previous plays, only allow a valid move
      if(!this.series.length) return is.allowedFirst(this.topDiscarded, card)
      
      //when there is only one previous card played
      if(this.series.length === 1){
        //if the card would be a valid second card in a run or set, allow it
        return is.set(this.series[0], card) || is.run(this.series[0], card)
      }
      console.log(this.seriesType)
      
      //check to make sure the series is continuing as it should
      return is[this.seriesType](this.series[0], card) ? true : false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#p1-hand{
  min-height: 144px;
  z-index: 2;
  perspective: 29em;
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
  align-items: center;
  justify-content: center;
  padding: 10px;
}
.play-indicator.active{
  opacity: 1;
}
.hand{
  padding-right: 40px;
  padding-left: 40px;
  display: flex;
  
}
.hand .card{
  margin-right: -40px;
  margin-left: -40px;
  transition: transform 0.3s;
  z-index: 2;
}
#p1-hand.hand .card:hover{
  transform: translateY(-15px);
}

</style>
