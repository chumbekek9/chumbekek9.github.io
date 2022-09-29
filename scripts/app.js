
// variables

let listWord = ['MUSEO', 'GLOBO', 'VASO', 'INTERIOR', 'ESPINA', 'TROFEO', 'TEMPLO',
                'CULTURA', 'PINTURA', 'CELULAR'];
let selectedWord = [];
let selectedLetters = [];
let secretWord = '';
let hits = 0;
let mistakes = 0;
var bandera = true;
var bandera2 = true;


function setting() {
    // events

    const btnStartGame = document.querySelector('#btn__start__game');
    btnStartGame.addEventListener('click', startGame);

    const btnNewWord = document.querySelector('#btn__start__word');
    btnNewWord.addEventListener('click', addNewWord);

    const btnNewGame = document.querySelector('#btn__new');
    btnNewGame.addEventListener('click', startNewGame);

    const btnDesist = document.querySelector('#btn__desist');
    btnDesist.addEventListener('click', desist);

    const btnSaveStart = document.querySelector('#btn__save');
    btnSaveStart.addEventListener('click', saveWord);

    const btnCancel = document.querySelector('#btn__cancel');
    btnCancel.addEventListener('click', cancelWord);

    // canvas
    const imgCanvas = document.querySelector('#game__canvas__img');
    const imgCanvasStyle = getComputedStyle(game__canvas__img);
    imgCanvas.width = (imgCanvasStyle.width).split('px')[0];
    imgCanvas.height = (imgCanvasStyle.height).split('px')[0];

    const textCanvas = document.querySelector('#game__canvas__text');
    const textCanvasStyle = getComputedStyle(game__canvas__text);
    textCanvas.width = (textCanvasStyle.width).split('px')[0];
    textCanvas.height = (textCanvasStyle.height).split('px')[0];
}


window.onload = setting;



// principal functions
function formatear(){
  selectedWord.splice(0, selectedWord.length);
  selectedLetters.splice(0, selectedLetters.length);
  secretWord = '';
  hits = 0;
  mistakes = 0;
  drawHangedReset();

  //if(!(txtKey.removeEventListener('blur', keepFocus))){
  //alert("entro en el segundo");
}
function startGame() {
    selectedWord.splice(0, selectedWord.length);
    selectedLetters.splice(0, selectedLetters.length);
    hits = 0;
    mistakes = 0;
    secretWord = selectWord(listWord, selectedWord);
    start();
    showSection('none', 'none', 'flex');
}
function addNewWord() {
    showSection('none', 'flex', 'none');
}
function startNewGame() {
    formatear();
    startGame();

    if(bandera==false){

      //txtKey.addEventListener('input', keyCheck);
    }
    if(bandera2==false){

      //txtKey.addEventListener('blur', keepFocus);
    }

}
function desist() {
    showSection('flex', 'none', 'none');
}
function saveWord() {
    secretWord = addWords(listWord);

    if (secretWord) {
        selectedWord.splice(0, selectedWord.length);
        selectedLetters.splice(0, selectedLetters.length);
        hits = 0;
        mistakes = 0;
        start();
        showSection('none', 'none', 'flex');
    }
}
function cancelWord() {
    showSection('flex', 'none', 'none');
}

// helper functions

function switchEventKey(state) {
    const txtKey = document.querySelector('#inputKey');
    if (state) {
        txtKey.removeEventListener('input', keyCheck);
        txtKey.addEventListener('input', keyCheck);
        bandera=true;
        txtKey.removeEventListener('blur', keepFocus);
        txtKey.addEventListener('blur', keepFocus);
        bandera2=true;

    } else {
        txtKey.removeEventListener('input', keyCheck);
        bandera=false;

        txtKey.removeEventListener('blur', keepFocus);
        bandera2=false;
    }
}


function start() {
    //console.log('start =>', 'secretWord:', secretWord);
    drawHangedReset();
    drawUnderscore(secretWord.length);
    const txtKey = document.querySelector('#inputKey');

    txtKey.focus();


}


function showSection(start, input, game) {
    const boxStart = document.querySelector('.start');
    const boxInput = document.querySelector('.input');
    const boxGame = document.querySelector('.game');
    boxStart.style.display = start;
    boxInput.style.display = input;
    boxGame.style.display = game;

    if (input === 'flex') {
        const txtWord = document.querySelector('.input__word');
        txtWord.focus();
        txtWord.value = '';
    }if (game === 'flex') {
        switchEventKey(true);
        const txtKey = document.querySelector('#inputKey');
        txtKey.focus();
    } else {
        switchEventKey(false);
    }
}

// add Word
function selectWord(words, wordSelected) {
    let order;
    let notSelected = true;

    if (wordSelected.length == 10) {
        wordSelected.splice(0, wordSelected.length);
    }

    do {
        order = Math.floor((Math.random() * words.length));
        if (!wordSelected.includes(order)) {
            wordSelected.push(order);
            notSelected = false;
        }
    } while (notSelected);

    return words[order];
}

function addWords(words) {
    const txtWord = document.querySelector('.input__word');
    const newWord = txtWord.value.toUpperCase();
    if (isValid(newWord)) {
        if (!words.includes(newWord)) {
            words.push(newWord);
            txtWord.value = '';
            return newWord;
        } else {
            alert( newWord[0] + newWord.substring(1).toLowerCase() + ' ya ha sido incluida');
        }
    }
    return null;
}

function isValid(text) {
    var isValid = false;
    if (/^[A-Z\u00D1]+$/.test(text)) {
        isValid = true;
    }
    if(!isValid){
        alert('Por favor ingrese una palabra utilizando\n' + 'sólo letras sin acento');
    }
    return isValid;
}

// game

function keyCheck(event) {
    const txtKey = document.querySelector('#inputKey');
    txtKey.value = '';
    let letter = '';
    if (isLetter(event.data.toUpperCase().charCodeAt())) {
        letter = event.data.toUpperCase();
        if (!selectedLetters.includes(letter)) {
            if (secretWord.includes(letter)) {
                hits += letterHit(secretWord, letter, selectedLetters);
                if (hits == secretWord.length) {
                    switchEventKey(false);
                    drawEndMessage(true);
                }
            } else {
                mistakes += letterWrong(mistakes, letter, selectedLetters);
                drawHanged(mistakes);
                if (mistakes == 9) {

                    switchEventKey(false);

                    drawEndMessage(false);
                }
            }
        }
    }
}

function keepFocus() {
    const txtKey = document.querySelector('#inputKey');
    txtKey.focus();
}

function isLetter(code) {
    return ((code >= 65 && code <= 90) || code == 209 )
}

function letterHit(word, letter, listLetters) {
    let newHits = 0;
    listLetters.push(letter);
    for (let i = 0; i < word.length; i++) {
        if (word[i] === letter) {
            drawLetterHit(i, letter, word.length);
            newHits++;
        }
    }
    return newHits
}

function letterWrong(mistakes, letter, listLetters) {
    const newWroung = 1;
    listLetters.push(letter);
    drawLetterWrong(mistakes, letter);
    return newWroung;
}
