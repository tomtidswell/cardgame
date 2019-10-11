<template>
  <p id="game-message">{{msg}}</p>
</template>

<script>

export default {
  name: 'Message',
  props: {
    msg: String,
  },
  // data: function () {
  //   return {
  //     className: `${this.player}-indicator`
  //   }
  // },
  // computed: {
  //   className: function () {
  //     return `${this.player}-indicator`
  //   }
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
#game-message{
  position: fixed;
  margin:0 auto;
  left:0;
  right:0;
  width:250px;
  transition: all, 1s;
  bottom:-150px;
  background-color: rgb(200,121,178);
  padding:10px;
  border: 5px solid white;
  border-radius: 10px;
  font-weight: 600;
  text-transform: uppercase;
}

#game-message.show{
  transition: all, 1s;
  bottom:50px;
}
</style>
