<template>
  <img v-if="interactive"
    v-on:click="emitCardClick(index)"
    class="card"
    :data-card="card.name"
    :src="face ? card.source : card.sourceBack"
    :class="{ throw: animate, allowed: canBePlayed }" />
  <img v-else
    class="card"
    :data-card="card.name"
    :class="{ [animationName()]: animator }"
    :src="face || flip ? card.source : card.sourceBack" />
</template>

// :class="{ [animator.animation]: animator.animation }"
<script>

export default {
  name: 'PlayingCard',
  props: {
    index: Number,
    card: Object,
    canBePlayed: Boolean,
    interactive: Boolean,
    face: Boolean,
    animator: Object
  },
  data: function () {
    return {
      animate: false,
      flip: false
    }
  },
  // computed: {
  //   className: function () {
  //     return `${this.player}-indicator`
  //   }
  // }
  methods: {
    emitCardClick(index){  
      //block play if card is not allowed
      if (!this.canBePlayed) return
      //set the animation
      this.animate = true
      //emit the event
      this.$emit('cardClick', this.card, index)
    },
    animationName(){
      if(this.animator){
        if(this.animator.flag === 'flip') setTimeout(()=> this.flip = true, this.animator.timeout)
      }

      return this.animator ? this.animator.animation : null
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.card-holder .card{
  transition: transform 0.3s;
  z-index: 2;
}

#p1-hand.hand .card{
  animation: pick-p1 1s 1;
  filter: contrast(70%);
  position: absolute;
}
#p1-hand.hand .allowed.card{
  filter: none;
}
#p1-hand.hand .allowed.card:hover{
  transform: translateY(-15px);
}
#p1-hand.hand .card.throw{
  animation: throw-p1 1.6s 1;
  transform: rotateX(51deg) rotateY(-15deg) rotateZ(-34deg) translateX(29vw) translateY(-17vh);
  opacity: 0;
}
#p2-hand.hand .card{
  animation: pick-p2 1s 1;
}
.stack .card.deal-p1{
  animation: deal-p1 1s 1;
}

@keyframes pick-p1 {
  0% {  
    transform: rotateX(-90deg) rotateY(0deg) rotateZ(90deg) scale(0.8);
    opacity: 0;
    top: -40vh;
    left: -15vw;
  }
  30% {  
    transform: rotateX(32deg) rotateY(0deg) rotateZ(90deg) scale(0.8);
    opacity: 1;
    top: -40vh;
    left: -15vw;
  }
  100%{ 
    transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1);
    top: 0;
    left: 0;
  }
}

@keyframes throw-p1 {
  0% {  
    transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateX(0vw) translateY(-15px);
    opacity: 1; 
  }
  65%{  
    transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateX(0vw) translateY(-180px);
    opacity: 1; 
  }
  100%{ 
    transform: rotateX(50deg) rotateY(0deg) rotateZ(-30deg) translateX(29vw) translateY(-20vh);
    opacity: 0;
  }
}
@keyframes pick-p2 {
  0%{ 
    transform: rotateX(0deg) rotateY(20deg) rotateZ(0deg) translateX(-60vw) translateY(30vh);
    opacity: 0;
  }
  100% {  
    transform: rotateX(0) rotateY(0) rotateZ(0) translateX(0) translateY(0);
    opacity: 1; 
  }
}
</style>
