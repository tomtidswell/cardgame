<template>
  <div class="pile" :class="`${player}-piles`">
    <div class="">
      <PlayingCard v-for="(card, index) in piles.facedown" :key="card.name"
        :card="card"
        :style="{ transform: `rotateX(30deg) rotate(${card.mess / 5}deg)`}"
        :index="index"
          />
    </div>
    <span class="absolute">
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
<style >
.absolute{
  position: absolute;
}
.p1-piles{
  transform: rotateX(30deg);
}
.p2-piles{
  transform: rotateX(30deg) scale(0.8);
}
.pile{
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pile .card{
  margin: 0 10px;
}
</style>
