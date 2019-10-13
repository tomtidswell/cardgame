<template>
  <img :src="card.source"
    v-on:click="emitCardClick(index)"
    class="card"
    :class="{ throw: animate }" />
</template>

<script>

export default {
  name: 'PlayingCard',
  props: {
    index: Number,
    card: Object,
    canBePlayed: Boolean
  },
  data: function () {
    return {
      animate: false
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
      // this.$emit('cardClick', this.card, index)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
.hand .card{
  margin-right: -40px;
  margin-left: -40px;
  transition: transform 0.3s;
  z-index: 2;
}
#p1-hand.hand .card:hover{
  transform: translateY(-15px);
}
#p1-hand.hand .card.throw{
  animation: throw-p1 2s infinite;
  transform: rotateX(51deg) rotateY(-15deg) rotateZ(-34deg) translateX(29vw) translateY(-17vh);;
  /* opacity: 0; */
}
@keyframes throw-p1 {
  0% {  
    transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateX(0vw) translateY(-15px);
    opacity: 1; 
  }
  55%{  
    transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateX(0vw) translateY(-150px);
    opacity: 1; 
  }
  100%{ 
    transform: rotateX(51deg) rotateY(-15deg) rotateZ(-34deg) translateX(29vw) translateY(-17vh);
    /* transform: rotateX(50deg) rotateY(0deg) rotateZ(-30deg) translateX(29vw) translateY(-17vh);
        transform: rotateX(50deg) rotate(24.57deg); */
    /* opacity: 0; */
  }
}
</style>
