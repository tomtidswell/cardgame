<template>
  <div class="stack-wrapper">
    <h2>{{message}}</h2>
    <div class="pile" id="stack">
      <template v-for="(card, index) in cards">
        <!-- event listener for the final item -->
        <img 
          class="card"
          :class="{ 'deal-p1': animate, 'deal-p2': card.deal === 'p2' }"
          v-if="index===cards.length-1" 
          :key="card.name" 
          :src="flip ? card.source : card.sourceBack"
          v-on:click="emitStackClick"
          :data-card="card.name" />

        <img :key="index" v-else :src="card.sourceBack" :data-card="card.name" class="card" />
        <!-- <p>{{card.name}}</p>
        <p>{{index}}</p> -->
      </template>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Stack',
  props: {
    cards: Array,
    stackClick: Function,
    turn: Object,
  },
  data: function () {
    return {
      flip: false,
      animate: false
    }
  },
  computed: {
    message: function () {
      let msg = ''
      if (this.turn.penalty && this.turn.pickCount && this.turn.penalty.pick - this.turn.pickCount){
        msg = `Pick ${this.turn.penalty.pick - this.turn.pickCount} more`
      }
      return msg
    }
  },
  methods: {
    emitStackClick(){
      //prevent pickup if the penalty is to miss a go (penalty.pick = 0)
      if(this.turn.penalty && this.turn.penalty.pick === 0) return false  
      //prevent pickup if the player is trying to take a second card
      if(!this.turn.penalty && this.turn.pickCount > 0) return false  
      //prevent pickup if the player is trying to take more than their penalty
      if(this.turn.penalty && this.turn.pickCount >= this.turn.penalty.pick) return false  
      //apply the animation class
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
h2{
  position: absolute;
  text-align: center;
}
.stack-wrapper{
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}
.pile{
  display: flex;
  flex-direction: column-reverse;
  perspective: 29em;
  position: relative;
  margin-top: 100px;
}
.pile .card{
  margin-right: -44px;
  margin-left: -44px;
  margin-top: -119px;
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
