
//define the 'is' object which contains the assessor functions
const is = {
  //function to define a set
  set: function (a, b) {
    return a.value === b.value
  },
  allowedFirst: function (prev, curr, penalty, mode) {
    //if the game is in setup mode, allow any card to be played
    if(mode === 'setup') return true
    //if there is no previous card, allow any card to be played
    if(!prev) return true
    //logic to determine if we are reacting to the other players special card. Return true if the cards value is equal to the counter value of the penalty
    if(penalty) return curr.value === penalty.counterValue

    //allow a two, eight and ten to be played on any card
    if(curr.value === '2') return true
    if(curr.value === '8') return true
    if(curr.value === '10') return true
    
    //logic to make sure the card rank is greater than or equal to the previous card rank
    if (curr.runValue >= prev.runValue) return true

    return false
  },
  validMove(card, turn, topDiscarded, mode){
    //if there were no previous plays, only allow a valid move
    if (!turn.series.length) return is.allowedFirst(topDiscarded, card, turn.penalty, mode)
    //when there was a previous card played, allow it if it is part of a set
    return is.set(turn.series[0], card)
  },
  penaltyDue: function (discarded, prevPenalty) {
    let penalty = null
    //if the discard pile is empty, return no penalty
    if(!discarded.length) return penalty
    const topDiscard = discarded[discarded.length - 1]
    // console.log(discarded.map(card=>card.name), topDiscard)

    //if there was a previous penalty and it was due to the current topDiscard card, then ignore it
    if(prevPenalty && prevPenalty.triggerCard.name === topDiscard.name)
      return penalty
      
    switch (topDiscard.value) {
      case '8':
        penalty = { pick: 0, counterValue: '8', missTurn: true, triggerCard: topDiscard  }
        break
    }
    return penalty
  }
}

export default is

