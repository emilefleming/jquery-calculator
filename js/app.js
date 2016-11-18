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
      $('#screen').text(evaluate($('#screen').text()));
      return;
    }
    $('#screen').text($('#screen').text() + text)
  }

  const clear = function() {
    $('#screen').empty();
  }

  const error = function (text) {
    $('#screen').text('ERROR');
    // alert(text);
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
      alert('bro u cant divide by zero lmao');
      return 'ERROR';
    }
    return Number(a) / Number(b);
  }

  const evalChunk = function(chunk) {
    const a = chunk[1];
    const b = chunk[3];
    switch (chunk[2]) {
      case '+':
        return add(a, b);
      case '-':
        return subtract(a, b);
      case 'x':
        return multiply(a, b);
      case '÷':
        return divide(a, b);
      default:
        alert(`Didn't recognize the operator ${chunk[2]}`);
    }
  }

  const eval1 = function(text) {
    let finalResult = text;
    const chunk = text.match(/(\-?\d*\.?\d+)(\x|\÷)(\-?\d*\.?\d+)/);
    if (chunk) {
      const result = evalChunk(chunk);
      finalResult = finalResult.replace(chunk[0], result);
      finalResult = eval1(finalResult);
    }
    return finalResult;
  }

  const eval2 = function(text) {
    let finalResult = text;
    const chunk = text.match(/(\-?\d*\.?\d+)(\+|\-)(\-?\d*\.?\d+)/);
    if (chunk) {
      const result = evalChunk(chunk);
      finalResult = finalResult.replace(chunk[0], result);
      finalResult = eval2(finalResult);
    }
    return finalResult;
  }



  const evaluate = function(text) {
    const result = eval1(text);
    const finalResult = eval2(result);
    return finalResult;
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
      $('#screen').text(evaluate($('#screen').text()));
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
    if(event.key === '.') {
      toScreen('.');
      return;
    }
    if (isNaN(event.key)) {
      return;
    }
    toScreen(event.key);
  })
})();
