(function() {
  'use strict';

  let $screen = $('.screen');
  let leftSideLength = 0;
  const variables = {};

  const labelLength = function(event) {
    if (event.which !== 8 && event.which < 65 || event.which > 122) {
      event.preventDefault();
    }
    $(event.target).attr('size', event.target.value.length + 1);
  };

  const setVar = function(event) {
    const varName = event.target.value;

    $(event.target).attr('size', event.target.value.length);
    if (!event.target.value) {
      labelLength(event);

      return;
    }
    variables[varName] = [];
    variables[varName][0] = event.target.parentNode.textContent;
    variables[varName][1] = $('<span>').text(`[${varName}]`);
    variables[varName][1].prependTo($('#variable-container'));
  };

  const remVar = function(event) {
    const varName = event.target.value;

    if (!variables[varName]) {
      return;
    }
    variables[varName][1].remove();
    delete variables[varName];
  };

  const clear = function() {
    $screen.empty();
  };

  const evalChunk = function(chunk) {
    const op1 = chunk[1];
    const op2 = chunk[3];

    switch (chunk[2]) {
      case '+':
        return Number(op1) + Number(op2);
      case '-':
        return Number(op1) - Number(op2);
      case '*':
        return Number(op1) * Number(op2);
      case '/':
        if (op2 === '0') {
          return 'ERROR';
        }

        return Number(op1) / Number(op2);
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
    const diff = $screen.text().length - leftSideLength;

    leftSideLength = Math.max($screen.text().length, leftSideLength);
    if (diff < 1 || $('.screen').length < 2) {
      for (let i = 0; i < diff * -1; i++) {
        $screen.prepend($('<span>').text(' '));
      }

      return;
    }
    for (const screen of $('.screen.solved')) {
      for (let i = 0; i < diff; i++) {
        $(screen).prepend($('<span>').text(' '));
      }
    }
  };

  const printResult = function(result) {
    padScreens();
    $screen.addClass('solved');
    $('<span>').addClass('operator equals').text(' = ').appendTo($screen);
    const $res = $('<label>').addClass('result').text(result).appendTo($screen);
    const $input = $('<input>').attr('type', 'text').attr('size', '1');

    $input.focusout(setVar).focusin(remVar).keydown(labelLength).appendTo($res);
    $('title').text($screen.text());
    $screen = $('<div>').addClass('screen').append($('<span>').text(result));
    $('#screen-container').prepend($screen);
  };

  const replaceVars = function(text) {
    let value = text;
    const match = text.match(/(\[)([a-z]+)(])/i);

    if (match) {
      const matchedVar = match[2];

      value = value.replace(match[0], variables[matchedVar][0]);
      value = replaceVars(value);
    }

    return value;
  };

  const evaluate = function() {
    const text = $screen.text().replace(/ /g, '');
    const noVars = replaceVars(text);
    const result = eval1(noVars);
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

  $('#variable-container').on('click', 'span', (event) => {
    $(event.target).clone().addClass('variable').appendTo($screen);
  });

  $('#buttons-container').on('click', 'button', (event) => {
    toScreen($(event.target).text());
  });

  $('#screen-container').on('click', (event) => {
    if (event.target.tagName !== 'SPAN' && event.target.tagName !== 'LABEL') {
      console.log(event.target.tagName);
      return;
    }
    $(event.target).parent().toggleClass('starred');
  });

  $('body').keydown(() => {
    if (event.target.tagName === 'INPUT') {
      return;
    }
    if (event.key.search(/[0-9]|\.|-|\+|\/|\*/) === 0) {
      toScreen(event.key);

      return;
    }
    switch (event.key) {
      case 'Enter':
        $screen.text(evaluate($screen.text()));
        break;
      case '=':
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
