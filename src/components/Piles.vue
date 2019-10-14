<template>
  <div class="pile">
    <div class="">
      <PlayingCard v-for="(card, index) in piles.facedown" :key="card.name"
        :card="card"
        :style="{ transform: `rotateX(30deg) rotate(${card.mess / 10}deg)`}"
        :index="index"
          />
    </div>
    <span class="absolute">
      <PlayingCard v-for="(card, index) in piles.faceup" :key="card.name"
        :card="card"
        :style="{ transform: `rotateX(30deg) rotate(${card.mess / 10}deg)`}"
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
.pile{
  transform: rotateX(30deg) rotateY(0deg) rotateZ(0deg);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pile .card{
  margin: 0 10px;
}
</style>
