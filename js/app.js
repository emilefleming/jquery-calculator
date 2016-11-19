(function() {
  'use strict';

  let $screen = $('.screen');

  const clear = function() {
    $screen.empty();
  };

  const add = function(op1, op2) {
    return Number(op1) + Number(op2);
  };

  const subtract = function(op1, op2) {
    return Number(op1) - Number(op2);
  };

  const multiply = function(op1, op2) {
    return Number(op1) * Number(op2);
  };

  const divide = function(op1, op2) {
    if (op2 === '0') {
      return 'ERROR';
    }

    return Number(op1) / Number(op2);
  };

  const evalChunk = function(chunk) {
    const op1 = chunk[1];
    const op2 = chunk[3];

    switch (chunk[2]) {
      case '+':
        return add(op1, op2);
      case '-':
        return subtract(op1, op2);
      case '*':
        return multiply(op1, op2);
      case '/':
        return divide(op1, op2);
      default:
        return 'ERROR';
    }
  };

  const eval1 = function(text) {
    let finalResult = text;
    const chunk = text.match(/(-?\d*\.?\d+)(\*|\/)(-?\d*\.?\d+)/);

    if (chunk) {
      const result = evalChunk(chunk);

      finalResult = finalResult.replace(chunk[0], result);
      finalResult = eval1(finalResult);
    }

    return finalResult;
  };

  const eval2 = function(text) {
    let finalResult = text;
    const chunk = text.match(/(-?\d*\.?\d+)(\+|-)(-?\d*\.?\d+)/);

    if (chunk) {
      const result = evalChunk(chunk);

      finalResult = finalResult.replace(chunk[0], result);
      finalResult = eval2(finalResult);
    }

    return finalResult;
  };

  const padScreens = function() {
    $('.screens');
  };

  const printResult = function(result) {
    padScreens();
    $screen.addClass('solved');
    $('<span>').addClass('operator').text(' =').appendTo($screen);
    $('<span>').addClass('result').text(result).appendTo($screen);
    $screen = $('<div>').addClass('screen').append($('<span>').text(result));
    $('#screen-container').prepend($screen);
  };

  const evaluate = function() {
    const text = $screen.text().replace(/ /g, '');
    const result = eval1(text);
    const finalResult = eval2(result);

    printResult(finalResult);
  };

  const addOp = function(op) {
    $('<span>').addClass('operator').text(op).appendTo($screen);
  };

  const toScreen = function(text) {
    switch (text) {
      case 'CLEAR':
        clear();
        break;
      case $screen.text() === 'ERROR':
        break;
      case 'ENTER':
        $screen.text(evaluate($screen.text()));
        break;
      case 'DELETE' :
        $screen.children(':last-child').remove();
        break;
      case '+':
        addOp(' + ');
        break;
      case '-':
        addOp(' - ');
        break;
      case '*':
        addOp(' * ');
        break;
      case '/':
        addOp(' / ');
        break;
      default:
        $('<span>').text(text).appendTo($screen);
        break;
    }
  };

  $('#buttons-container').on('click', 'button', (event) => {
    toScreen($(event.target).text());
  });

  $('body').keydown(() => {
    if (event.key.search(/[0-9]|\.|-|\+|\/|\*/) === 0) {
      toScreen(event.key);

      return;
    }
    switch (event.key) {
      case 'Enter':
        $screen.text(evaluate($screen.text()));
        break;
      case 'Escape':
        $screen.text('');
        break;
      case 'Backspace':
        $screen.children(':last-child').remove();
        break;
      default:
        break;
    }
  });
})();
