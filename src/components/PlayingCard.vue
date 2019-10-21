<template>
  <img class="card"
    v-on:click="emitCardClick(index)"
    :data-card="card.name"
    :class="{ allowed: canBePlayed, [className]: className }"
    :src="face || flip ? card.source : card.sourceBack" />
</template>


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
  computed: {
    className: function () {
      return this.card.specialClass
    }
  },
  methods: {
    emitCardClick(index){  
      console.log('Interactive:', this.interactive, 'Can be played:', this.canBePlayed)
      //block play if card is not allowed
      if (!this.interactive) return
      //block play if card is not allowed
      if (!this.canBePlayed) return
      //emit the event
      this.$emit('cardClick', this.card, index)
    },
    animationName(){
      // if(this.animator){
      //   if(this.animator.flag === 'flip') setTimeout(()=> this.flip = true, this.animator.timeout)
      // }
      // return this.animator ? this.animator.animation : null
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.card-holder .card{
  position: relative;
  z-index: 2;
}
.piles .card{
  position: relative;
}

/* ALLOWED / NOT ALLOWED CLASSES */

.p1-hand .card{
  transition: transform 0.3s;
  filter: contrast(70%);
}
.p1-hand .allowed.card{
  filter: none;
}
.p1-hand .allowed.card:hover{
  transform: translateY(-15px);
}

/* DEALING CLASSES */

.card.p1-stack-hand{ animation: p1-stack-hand 1s 1; }
.card.p2-stack-hand{ animation: p2-stack-hand 1s 1; }

/* HAND -> PILE CLASSES */
.card.p1-hand-pile0{ animation: p1-hand-pile0 1s 1; }
.card.p1-hand-pile1{ animation: p1-hand-pile1 1s 1; }
.card.p1-hand-pile2{ animation: p1-hand-pile2 1s 1; }

/* PILE -> DISCARD CLASSES */
.card.p1-pile0-discard{ animation: p1-pile0-discard 1s 1; }
.card.p1-pile1-discard{ animation: p1-pile1-discard 1s 1; }
.card.p1-pile2-discard{ animation: p1-pile2-discard 1s 1; }

/* DISCARD -> HAND CLASSES */

.card.p1-discard-hand{ animation: p1-discard-hand 1s 1; }
.card.p2-discard-hand{ animation: p2-discard-hand 1s 1; }


/* HAND -> DISCARD CLASSES */
.card.p1-hand-discard{ animation: p1-hand-discard 1s 1; }

/* BURN CARDS */
.card.burn{ animation: burn 2s 1; opacity: 0; }



@keyframes p1-stack-hand {
  0% {  
    transform: rotateX(-90deg) rotateY(0deg) rotateZ(90deg) scale(0.8);
    opacity: 0;
    top: -40vh;
    left: -190px;
  }
  10% {  
    opacity: 1;
    transform: rotateX(-90deg) rotateY(0deg) rotateZ(90deg) scale(0.8);
    top: -40vh;
    left: -190px;
  }
  50% {  
    transform: rotateX(32deg) rotateY(0deg) rotateZ(90deg) scale(0.8);
    top: -40vh;
    left: -190px;
  }
  100%{ 
    transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1);
    top: 0;
    left: 0;
  }
}

@keyframes p2-stack-hand {
  0%{ 
    top: 30vh;
    left: -190px;
    transform: rotate(90deg);
    opacity: 0;
  }
  100% {  
    top: 0vh;
    left: 0vw;
    transform: rotate(0deg);
    opacity: 1; 
  }
}

@keyframes p2-discard-hand {
  0%{ 
    transform: rotateX(0deg) rotateY(20deg) rotateZ(0deg) translateX(-10vw) translateY(30vh);
    opacity: 0;
  }
  100% {  
    transform: rotateX(0) rotateY(0) rotateZ(0) translateX(0) translateY(0);
    opacity: 1; 
  }
}

@keyframes p1-hand-pile0 {
  from{ 
    top: 20vh;
    left: 20vw;
    opacity: 0;
  }
  to{  
    top: 0vh;
    left: 0vw;
    opacity: 1; 
  }
}
@keyframes p1-hand-pile1 {
  from{ 
    top: 20vh;
    left: 10vw;
    opacity: 0;
  }
  to{  
    top: 0vh;
    left: 0vw;
    opacity: 1; 
  }
}
@keyframes p1-hand-pile2 {
  from{ 
    top: 20vh;
    left: 0vw;
    opacity: 0;
  }
  to{  
    top: 0vh;
    left: 0vw;
    opacity: 1; 
  }
}
@keyframes p1-pile0-discard {
  from{ 
    top: 20vh;
    left: -20vw;
    opacity: 0;
  }
  to{  
    top: 0vh;
    left: 0vw;
    opacity: 1; 
  }
}
@keyframes p1-pile1-discard {
  from{ 
    top: 20vh;
    left: -100px;
    opacity: 0;
  }
  to{  
    top: 0vh;
    left: -30px;
    opacity: 1; 
  }
}
@keyframes p1-pile2-discard {
  from{ 
    top: 20vh;
    left: 30px;
    opacity: 0;
  }
  to{  
    top: 0vh;
    left: 0vw;
    opacity: 1; 
  }
}
@keyframes p1-hand-discard {
  from{ 
    top: 20vh;
    left: 5vw;
    opacity: 0;
  }
  to{  
    top: 0vh;
    left: 0vw;
    opacity: 1; 
  }
}
@keyframes p1-discard-hand {
  from{ 
    top: -40vh;
    left: -5vw;
    opacity: 0;
    transform:scale(0.8);
  }
  to{  
    top: 0vh;
    left: 0vw;
    opacity: 1;
    transform:scale(1);
  }
}
@keyframes burn {
  0%{ 
    filter: sepia(0);
  }
  80%{  
    filter: sepia(1);
    opacity: 1;
  }
  100%{  
    filter: sepia(1);
    opacity: 0;
  }
}

</style>
