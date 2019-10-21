<template>
  <div class="piles" :class="`${owner}-piles`">
    <div class="facedown">
      <PlayingCard v-for="(card, index) in piles.facedown" :key="card.name"
        :card="card"
        :style="{ transform: `rotateX(30deg) rotate(${card.mess / 5}deg)`}"
        :index="index"
        @cardClick="emitFacedownClick"
        :canBePlayed="owner==='p1' && active"
        :interactive="active && !piles.faceup.length"
          />
    </div>
    <span class="absolute faceup">
      <PlayingCard v-for="(card, index) in piles.faceup" :key="card.name"
        :card="card"
        :style="{ transform: `rotateX(30deg) rotate(${card.mess / 5}deg)`}"
        :index="index"
        @cardClick="emitFaceupClick"
        :canBePlayed="owner==='p1' && active ? canBePlayed(card) : null"
        :interactive="active"
        face />
    </span>
  </div>
</template>
 
<script>
import PlayingCard from './PlayingCard.vue'
import is from '../lib/is'

export default {
  name: 'Piles',
  components: { PlayingCard },
  props: {
    piles: Object,
    owner: String,
    active: Boolean,
    canBePlayed: Function,
    turn: Object
  },
  methods: {
    emitFaceupClick(cardData, indexOfCard){
      console.log('Clicked up pile:', cardData.name, cardData, indexOfCard)
      //signal the end of the turn to the app
      this.$emit('cardClick', cardData, indexOfCard, 'pile-faceup')
    },
    emitFacedownClick(cardData, indexOfCard){
      console.log('Clicked down pile:', cardData.name, cardData, indexOfCard)
      //signal the end of the turn to the app
      this.$emit('cardClick', cardData, indexOfCard, 'pile-facedown')
    },
    // canBePlayed(card){
    //   //cant be played if it's not the players turn!
    //   if(!this.active) return false

    //   console.log('can be played logic', this.turn.series.length)

    //   //if there were no previous plays, only allow a valid move
    //   if(!this.turn.series.length) return is.allowedFirst(this.topDiscarded, card, this.turn.penalty, this.mode)

    //   return is.set(this.turn.series[0], card)
    // }
  }
  // data: function () {
  //   return {
  //     className: `${this.player}-indicator`
  //   }
  // },
  // computed: {
  //   className: function () {
  //     return `${this.player}-indicator`
  //   }
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.p1-piles .faceup{
  position: absolute;
  min-width: 300px;
}
.p1-piles .facedown{
  min-width: 300px;
}
.p2-piles .faceup{
  position: absolute;
  min-width: 265px;
}
.p2-piles .facedown{
  min-width: 265px;
}
.piles{
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.p1-piles{
  transform: rotateX(30deg);
  min-height: 116px;
}
.p2-piles{
  transform: rotateX(30deg);
}
.p1-piles .card{
  margin: 0 10px;
  height: 110px;
  z-index: 1;
}
.p2-piles .card{
  margin: 0 10px;
  height: 90px;
}
</style>
