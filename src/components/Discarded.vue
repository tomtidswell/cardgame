<template>
  <div class="pile" id="discarded">
    <img v-for="(card, index) in cards" 
      :key="index" 
      :src="card.source" 
      :style="{ transform: `rotateX(50deg) rotate(${card.mess}deg)`}"
      class="card" />
  </div>
</template>



<script>

export default {
  name: 'Discarded',
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
<style >
.card{
  height:140px;
}
.pile{
  display: flex;
  flex-direction: column-reverse;
  perspective: 29em;
}
.pile .card{
  margin-right: -45px;
  margin-left: -45px;
  margin-top: -139px;
  transform: rotateX(50deg) rotateY(180deg) rotateZ(-70deg);
}
</style>
