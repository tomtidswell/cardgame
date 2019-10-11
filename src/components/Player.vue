<template>
  <div class="hand-holder">
    <div :class="className" class="play-indicator">
      <span v-if="player==='p1'">Your Turn</span>
      <button v-if="player==='p1'" id="end-button">End</button>
      <span v-if="player==='p2'">Computer</span>
      <span v-if="player==='p2'">Thinking</span>
    </div>
    <div class="hand" v-if="player==='p1'" id="p1-hand">
      <img v-for="(card, index) in cards" 
        :key="index" 
        :src="card.source" 
        class="card" />
    </div>
    <div class="hand" v-if="player==='p2'" id="p2-hand">
      <img v-for="(card, index) in cards" 
        :key="index" 
        :src="card.sourceBack" 
        class="card" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Player',
  props: {
    player: String,
    cards: Array
  },
  data: function () {
    return {
      className: `${this.player}-indicator`
    }
  },
  // computed: {
  //   className: function () {
  //     return `${this.player}-indicator`
  //   }
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#p1-hand{
  min-height: 144px;
  z-index: 2;
}
#p2-hand{
  min-height: 144px;
  transform: scale(0.7);
}
.hand-holder{
  display: flex;
  justify-content: center;
}
.play-indicator{
  opacity: 0;
  transition: all 1s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
}
.play-indicator.active{
  opacity: 1;
}
.hand{
  padding-right: 40px;
  padding-left: 40px;
  display: flex;
}
.hand .card{
  margin-right: -40px;
  margin-left: -40px;
}
</style>
