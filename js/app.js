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

  const evaluate = function() {
    const exp = $('#screen').text();
    let leftSide = '';
    let rightSide = '';
    let side = 'left';
    let opCount = 0;
    let operator = '';
    for (let i = 0; i < exp.length; i++) {
      if (isNaN(exp[i]) && exp[i] !== '.') {
        side = 'right';
        opCount++;
        operator = exp[i];
      }
      if (opCount > 1) {
        $('#screen').text('ERROR');
        return;
      }
      if (side === 'left' && !isNaN(exp[i])) {
        leftSide += exp[i];
      } else if (side === 'right' && !isNaN(exp[i])) {
        rightSide += exp[i];
      } else if (side === 'left' && exp[i] === '.') {
        leftSide += '.';
      } else if (side === 'right' && exp[i] === '.') {
        rightSide += '.';
      }
    }
    switch (operator) {
      case '+':
        return Number(leftSide) + Number(rightSide);
      case '-':
        return Number(leftSide) - Number(rightSide);
      case 'x':
        return Number(leftSide) * Number(rightSide);
      case '÷':
        if (!Number(rightSide)) {
          $('#screen').text('ERROR');
          break;
        }
        return Number(leftSide) / Number(rightSide);
    };
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
