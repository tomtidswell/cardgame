<template>
  <div class="discarded">
    <PlayingCard v-for="(card, index) in cards" 
      :key="index" 
      :card="card"
      :style="{ transform: `rotate(${card.mess}deg)`}"
      face />
  </div>
</template>



<script>
import PlayingCard from './PlayingCard.vue'

export default {
  name: 'Discarded',
  components: { PlayingCard },
  props: {
    cards: Array,
  },
  // data: function () {
  //   return {
  //     className: `${this.player}-indicator`
  //   }
  // },
  // computed: {
  //   styles: function () {
  //     return `rotateX(50deg) rotate(${card.mess}deg)`
  //   }
  // }
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
</style>
