(function() {
  'use strict';

  const toScreen = function(text) {
    if(text === 'C') {
      clear();
      return;
    }
    if ($('#screen').text() === 'ERROR') {
      return;
    }
    if (text === '=') {
      $('#screen').text(evaluate());
      return;
    }
    $('#screen').text($('#screen').text() + text)
  }

  const clear = function() {
    $('#screen').empty();
  }

  const error = function () {
    $('#screen').text('ERROR');
  }

  const add = function(a, b) {
    return Number(a) + Number(b);
  }

  const subtract = function(a, b) {
    return Number(a) - Number(b);
  }

  const multiply = function(a, b) {
     return Number(a) * Number(b);
  }

  const divide = function(a, b) {
    if (b === '0') {
      alert('bro u cant divide by zero');
      return;
    }
    return Number(a) / Number(b);
  }

  const evaluate = function() {
    const rawExp = $('#screen').text();
    const expParts = rawExp.match(/(\-?\d*\.?\d+)(\+|\-|\x|\÷)(\-?\d*\.?\d+)/);
    const a = expParts[1];
    const b = expParts[3];
    switch (expParts[2]) {
      case '+':
        return add(a, b);
      case '-':
        return subtract(a, b);
      case 'x':
        return multiply(a, b);
      case '÷':
        return divide(a, b);
      default:
        console.log(`Didn't recognize the operator ${expParts[2]}`);
    }
  }

  $('.buttons').on('click', 'span', (event) => {
    toScreen($(event.target).text())
  });

  $('body').keydown(() => {
    if (event.key === 'Backspace') {
      $('#screen').text($('#screen').text().slice(0, $('#screen').text().length - 1));
      return;
    }
    if (event.key === 'Enter') {
      $('#screen').text(evaluate());
      return;
    }
    if (event.key === 'Escape') {
      clear();
      return;
    }
    if (event.key === '+' || event.key === '-') {
      toScreen(event.key);
      return;
    }
    if(event.key === '*') {
      toScreen('x');
      return;
    }
    if(event.key === '/') {
      toScreen('÷');
      return;
    }
    if (isNaN(event.key)) {
      return;
    }
    toScreen(event.key);
  })
})();
