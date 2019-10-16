<template>
  <div class="piles" :class="`${player}-piles`">
    <div class="facedown">
      <PlayingCard v-for="(card, index) in piles.facedown" :key="card.name"
        :card="card"
        :style="{ transform: `rotateX(30deg) rotate(${card.mess / 5}deg)`}"
        :index="index"
          />
    </div>
    <span class="absolute faceup">
      <PlayingCard v-for="(card, index) in piles.faceup" :key="card.name"
        :card="card"
        :style="{ transform: `rotateX(30deg) rotate(${card.mess / 5}deg)`}"
        :index="index"
        face />
    </span>
  </div>
</template>

<script>
import PlayingCard from './PlayingCard.vue'

export default {
  name: 'Piles',
  components: { PlayingCard },
  props: {
    piles: Object,
    player: String
  },
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
.p2-piles .faceup{
  position: absolute;
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
}
.p2-piles{
  transform: rotateX(30deg);
}
.p1-piles .card{
  margin: 0 10px;
  height: 110px;
}
.p2-piles .card{
  margin: 0 10px;
  height: 90px;
}
</style>
