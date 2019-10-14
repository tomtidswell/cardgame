
//define the 'is' object which contains the assessor functions
const is = {
  //function to define a set
  set: function (a, b) {
    return a.value === b.value
  },
  //function to define a run
  run: function (a, b) {
    //not a run if they are not the same suit
    if (a.suit !== b.suit) return false
    //assess the index value of the rank, and see if they are consecutive
    if (a.runValue === b.runValue + 1) return true
    if (a.runValue === b.runValue - 1) return true
    //allow a run to travel from two to ace and vice versa
    if (a.runValue === 0 && b.runValue === 12) return true
    if (a.runValue === 12 && b.runValue === 0) return true
    return false
  },
  allowedFirst: function (prev, curr, penalty) {
    //logic to determine if we are reacting to the other players special card. Return true if the cards value is equal to the counter value of the penalty
    if(penalty) return curr.value === penalty.counterValue

    //allow an ace to be played on any card
    if(curr.value === 'ACE') return true

    //logic to make sure we follow suit/rank 
    if (curr.suit === prev.suit) return true
    if (curr.value === prev.value) return true

    return false
  },
  validMove(card, turn, topDiscarded){
    //if there were no previous plays, only allow a valid move
    if (!turn.series.length) return is.allowedFirst(topDiscarded, card, turn.penalty)

    //when there is only one previous card played
    if (turn.series.length === 1) {
      //if the card would be a valid second card in a run or set, allow it
      return is.set(turn.series[0], card) || is.run(turn.series[0], card)
    }

    //check to make sure the series is continuing as it should
    return is[turn.seriesType](turn.series[0], card) ? true : false
  },
  penaltyDue: function (discarded, prevPenalty) {
    const topDiscard = discarded[discarded.length - 1]
    let penalty = null
    // console.log(discarded.map(card=>card.name), topDiscard)

    //if there was a previous penalty and it was due to the current topDiscard card, then ignore it
    if(prevPenalty && prevPenalty.triggerCard.name === topDiscard.name)
      return penalty
      
    switch (topDiscard.value) {
      case '2':
        penalty = { pick: 2, counterValue: '2', missTurn: true, triggerCard: topDiscard }
        break
      case '8':
        penalty = { pick: 0, counterValue: '8', missTurn: true, triggerCard: topDiscard  }
        break
      case 'J':
        if (topDiscard.suit === 'S' || topDiscard.suit === 'C')
          penalty = { pick: 7, counterValue: 'J', missTurn: true, triggerCard: topDiscard  }
        break
    }
    return penalty
  }
}

export default is

