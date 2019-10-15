<template>
  <p id="game-message" :class="{ show: show }">{{text}}</p>
</template>

<script>

export default {
  name: 'Message',
  props: {
    message: String,
  },
  data: function () {
    return {
      text: this.message,
      show: false
    }
  },
  // computed: {
  //   text: function () {
  //     return `${this.player}-indicator`
  //   }
  // }
  created: function () {
    
    setTimeout(()=>this.show = true, 500)
    setTimeout(()=>this.$emit('clear'), 3000)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
#game-message{
  position: fixed;
  margin:0 auto;
  left: calc(50% - 120px);
  bottom: 50px;
  width:240px;
  background-color: rgb(13, 44, 64);
  padding:10px;
  border: 5px solid white;
  border-radius: 10px;
  font-weight: 600;
  text-transform: uppercase;
  animation: message 1.5s 2 alternate;
}

@keyframes message {
  0% {  
    bottom: 10px;
    opacity: 0; 
  }
  30%{  
    bottom: 50px;
    opacity: 1; 
  }
}
</style>
