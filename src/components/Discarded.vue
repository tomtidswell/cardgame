<template>
  <div class="discarded">
    <PlayingCard v-for="(card, index) in cards"
      :key="index" 
      :card="card"
      :class="{ burn: burn }"
      :style="{ transform: `rotate(${card.mess}deg)`}"
      face />
    <div class="flames" v-if="burn">
      <img src="../assets/img/flame.gif" class="flame flame1"/>
      <img src="../assets/img/flame.gif" class="flame flame3"/>
      <img src="../assets/img/flame2.gif" class="flame flame2"/>
    </div>
  </div>
</template>



<script>
import PlayingCard from './PlayingCard.vue'

export default {
  name: 'Discarded',
  components: { PlayingCard },
  props: {
    cards: Array,
    burn: Boolean
  },
  // data: function () {
  //   return {
  //     className: `${this.player}-indicator`
  //   }
  // },
  computed: {
    flame: function () {
      return cards.some(card=>card.value==='10')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.discarded{
  display: flex;
  flex-direction: column-reverse;
  position: relative;
  margin-left: 60px;
  min-height: 100px;
  min-width: 100px;
}
.discarded .card{
  height:100px;
  z-index: 100;
  position: absolute;
}
.flames{
  width: 80px;
  height: 100px;
  position: relative;
}
.flame{
  position: absolute;
  height: 100px;
  width: auto;
  z-index: 100;
  transform-origin: 50% 85%;
  opacity: 0;
  left: 10px;
  bottom: 20px;
}
.flame1{
  animation: flame 1s 2 alternate 1s;
  bottom: 50px;
}
.flame2{
  animation: flame 2s 2 alternate 0.5s;
  left: -20px;
}
.flame3{
  animation: flame-flip 0.5s 2 alternate 0.5s;
  height: 120px;
  left: 30px;
}

@keyframes flame {
  from { transform: scale(0.1); opacity: 0.9; }
  to { transform: scale(1); opacity: 0.9;}
}
@keyframes flame-flip {
  from { transform: scale(0.1) scaleX(-1); opacity: 0.9; }
  to { transform: scale(1) scaleX(-1); opacity: 0.9;}
}
</style>
