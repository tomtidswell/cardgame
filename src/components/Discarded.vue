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
<style>


</style>
