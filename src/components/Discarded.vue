<template>
  <div class="discarded">
    <img v-for="(card, index) in cards" 
      :key="index" 
      :src="card.source" 
      :style="{ transform: `rotateX(30deg) rotate(${card.mess}deg)`}"
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
.discarded{
  display: flex;
  flex-direction: column-reverse;
  position: relative;
}
.discarded .card{
  margin: -60px -29px;
}

</style>
