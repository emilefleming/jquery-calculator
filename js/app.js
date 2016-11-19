(function() {
  'use strict';

  const $screen = $('#screen');

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
      case 'x':
        return multiply(op1, op2);
      case '÷':
        return divide(op1, op2);
      default:
        return 'ERROR';
    }
  };

  const eval1 = function(text) {
    let finalResult = text;
    const chunk = text.match(/(-?\d*\.?\d+)(\x|÷)(-?\d*\.?\d+)/);

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

  const evaluate = function(text) {
    const result = eval1(text);
    const finalResult = eval2(result);

    return finalResult;
  };

  const toScreen = function(text) {
    if (text === 'C') {
      clear();

      return;
    }
    if ($screen.text() === 'ERROR') {
      return;
    }
    if (text === '=') {
      $screen.text(evaluate($screen.text()));

      return;
    }
    $screen.text($screen.text() + text);
  };

  $('.buttons').on('click', 'span', (event) => {
    toScreen($(event.target).text());
  });

  $('body').keydown(() => {
    if (event.key.search(/[0-9]|\.|-|\+/) === 0) {
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
        $screen.text($screen.text().slice(0, -1));
        break;
      case '*':
        toScreen('x');
        break;
      case '/':
        toScreen('÷');
        break;
      default:
        break;
    }
  });
})();
