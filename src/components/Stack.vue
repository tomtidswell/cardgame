<template>
  <div class="pile" id="stack">
    <template v-for="(card, index) in cards">
      <!-- event listener for the final item -->
      <img 
        class="card"
        :class="{ 'deal-p1': animate }"
        v-if="index===cards.length-1" 
        :key="index" 
        :src="flip ? card.source : card.sourceBack"
        v-on:click="emitStackClick"
        :data-card="card.name" />

      <img :key="index" v-else :src="card.sourceBack" :data-card="card.name" class="card" />
      <!-- <p>{{card.name}}</p>
      <p>{{index}}</p> -->
    </template>
  </div>
</template>

<script>

export default {
  name: 'Stack',
  props: {
    cards: Array,
    stackClick: Function
  },
  data: function () {
    return {
      flip: false,
      animate: false
    }
  },
  // computed: {
  //   className: function () {
  //     return `${this.player}-indicator`
  //   }
  // }
  methods: {
    emitStackClick(){
      this.animate = true
      setTimeout(()=> this.flip=true, 200)
      setTimeout(()=> {
        this.flip=false
        this.animate=false
        this.$emit('stackClick')
      }, 2000)
    }
  }
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
.pile .card.deal-p1{
  animation: deal-p1 3s 1;
}
@keyframes deal-p1 {
  0% {  
    transform: rotateX(50deg) rotateY(180deg) rotateZ(-70deg);
  }
  30%{  
    transform: rotateX(180deg) rotateY(180deg) rotateZ(-0deg) translateX(-25vw) translateY(-10vh);
  }
  45%{  
    transform: rotateX(180deg) rotateY(180deg) rotateZ(0deg) translateX(-25vw) translateY(-18vh);
    opacity: 1; 
  }
  100%{ 
    transform: rotateX(180deg) rotateY(180deg) rotateZ(0deg) translateX(-25vw) translateY(-30vh);
    opacity: 0;
  }
}
</style>
