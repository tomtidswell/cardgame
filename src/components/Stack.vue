<template>
  <div class="stack">
    <template v-for="(card, index) in cards">
      <PlayingCard
        :key="card.name" 
        :card="card"
        :face="flip"
        :style="{ transform: `translateZ(${index}px) rotateZ(${index/5}deg)` }"
        :index="index" />
    </template>
  </div>
</template>
<!-- :animator="animator.name === card.name ? animator : null" -->

<script>
import PlayingCard from './PlayingCard.vue'

export default {
  name: 'Stack',
  components: { PlayingCard },
  props: {
    cards: Array,
    turn: Object,
    animator: Object
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
.stack{
  display: flex;
  flex-direction: column-reverse;
  position: relative;
  transform: rotateZ(80deg);
  transform-style: preserve-3d;
  min-height: 100px;
  min-width: 100px;
}
.stack .card{
  height:100px;
  position: absolute;
}

</style>
