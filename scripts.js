document.getElementById('translateButton').addEventListener('click', translateText);
document.getElementById('copyButton').addEventListener('click', copyText);

function translateText() {
    const inputText = document.getElementById('inputText').value.trim();
    const translationType = document.getElementById('translationType').value;
    let outputText = '';

    if (inputText === '') {
        document.getElementById('errorMessage').textContent = "Veuillez entrer du texte à traduire.";
        return;
    }

    document.getElementById('errorMessage').textContent = "";

    const cleanedText = replaceSpecialCharacters(inputText);

    let detectedType;
    if (/^[01\s]+$/.test(inputText)) {
        detectedType = 'binary';
    } else if (/^[.\-\s/]+$/.test(inputText)) {
        detectedType = 'morse';
    } else if (/^[\da-fA-F\s]+$/.test(inputText)) {
        detectedType = 'hex';
    } else if (containsHieroglyphs(inputText)) {
        detectedType = 'hieroglyphs';
    } else if (containsBraille(inputText)) {
        detectedType = 'braille';
    } else {
        detectedType = 'text';
    }

    if (translationType === 'original') {
        switch (detectedType) {
            case 'binary':
                outputText = binaryToText(inputText);
                break;
            case 'morse':
                outputText = morseToText(inputText);
                break;
            case 'hex':
                outputText = hexToText(inputText);
                break;
            case 'hieroglyphs':
                outputText = hieroglyphsToText(inputText);
                break;
            case 'braille':
                outputText = brailleToText(inputText);
                break;
            default:
                outputText = inputText;
        }
    } else {
        switch (translationType) {
            case 'binary':
                outputText = textToBinary(inputText);
                break;
            case 'morse':
                outputText = textToMorse(inputText);
                break;
            case 'hex':
                outputText = textToHex(inputText);
                break;
            case 'hieroglyphs':
                outputText = textToHieroglyphs(inputText);
                break;
            case 'braille':
                outputText = textToBraille(inputText);
                break;
            default:
                outputText = "Sélectionnez une option de traduction valide.";
        }
    }

    document.getElementById('outputText').value = outputText;
}

function replaceSpecialCharacters(text) {
    return text.replace(/[^a-zA-Z0-9\s]/g, '�');
}


function containsHieroglyphs(text) {
    return /[\uD800-\uDBFF\uDC00-\uDFFF]/.test(text);
}

function containsBraille(text) {
    return /[\u2800-\u28FF]/.test(text);
}

function textToBinary(text) {
    return text.split('').map(char => {
        return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join(' ');
}

function binaryToText(binary) {
    if (binary.replace(/\s/g, '').length % 8 !== 0) {
        document.getElementById('errorMessage').textContent = "Le texte binaire n'est pas valide.";
        return '';
    }

    const bytes = binary.split(' ');
    return bytes.map(byte => String.fromCharCode(parseInt(byte, 2))).join('');
}

function textToMorse(text) {
    const morseCode = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.',
        'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.',
        'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-',
        'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..',
        '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
        '6': '-....', '7': '--...', '8': '---..', '9': '----.',
        ' ': '/', '.': '.-.-.-', ',': '--..--', '?': '..--..', '\'': '.----.', '!': '-.-.--',
        '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.',
        '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-',
        '@': '.--.-.',
    };

    return text.toUpperCase().split('').map(char => {
        return morseCode[char] || '';
    }).join(' ');
}

function textToHex(text) {
    let hex = '';
    for (let i = 0; i < text.length; i++) {
        hex += text.charCodeAt(i).toString(16).toUpperCase().padStart(2, '0');
    }
    return hex;
}

function hexToText(hex) {
    let text = '';
    for (let i = 0; i < hex.length; i += 2) {
        text += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return text;
}


function morseToText(morse) {
    const morseCode = {
        '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F', '--.': 'G',
        '....': 'H', '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N',
        '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T', '..-': 'U',
        '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y', '--..': 'Z', '-----': '0',
        '.----': '1', '..---': '2', '...--': '3', '....-': '4', '.....': '5', '-....': '6',
        '--...': '7', '---..': '8', '----.': '9', '/': ' ',
        '.-.-.-': '.', '--..--': ',', '..--..': '?', '.----.': '\'', '-.-.--': '!',
        '-..-.': '/', '-.--.': '(', '-.--.-': ')', '.-...': '&', '---...': ':',
        '-.-.-.': ';', '-...-': '=', '.-.-.': '+', '-....-': '-', '..--.-': '_',
        '.-..-.': '"', '...-..-': '$', '.--.-.': '@',
    };

    return morse.split(' ').map(code => morseCode[code] || '').join('');
}

function textToHieroglyphs(text) {
    const hieroglyphs = {
        'A': '𓀀', 'B': '𓀁', 'C': '𓀂', 'D': '𓀃', 'E': '𓀄', 'F': '𓀅', 'G': '𓀆',
        'H': '𓀇', 'I': '𓀈', 'J': '𓀉', 'K': '𓀊', 'L': '𓀋', 'M': '𓀌', 'N': '𓀍',
        'O': '𓀎', 'P': '𓀏', 'Q': '𓀐', 'R': '𓀑', 'S': '𓀒', 'T': '𓀓', 'U': '𓀔',
        'V': '𓀕', 'W': '𓀖', 'X': '𓀗', 'Y': '𓀘', 'Z': '𓀙',
        '0': '𓀠', '1': '𓀡', '2': '𓀢', '3': '𓀣', '4': '𓀤', '5': '𓀥',
        '6': '𓀦', '7': '𓀧', '8': '𓀨', '9': '𓀩', ' ': ' '
    };

    return text.toUpperCase().split('').map(char => {
        return hieroglyphs[char] || char;
    }).join('');
}

function hieroglyphsToText(hieroglyphs) {
    const hieroglyphsMap = {
        '𓀀': 'A', '𓀁': 'B', '𓀂': 'C', '𓀃': 'D', '𓀄': 'E', '𓀅': 'F', '𓀆': 'G',
        '𓀇': 'H', '𓀈': 'I', '𓀉': 'J', '𓀊': 'K', '𓀋': 'L', '𓀌': 'M', '𓀍': 'N',
        '𓀎': 'O', '𓀏': 'P', '𓀐': 'Q', '𓀑': 'R', '𓀒': 'S', '𓀓': 'T', '𓀔': 'U',
        '𓀕': 'V', '𓀖': 'W', '𓀗': 'X', '𓀘': 'Y', '𓀙': 'Z',
        '𓀠': '0', '𓀡': '1', '𓀢': '2', '𓀣': '3', '𓀤': '4', '𓀥': '5',
        '𓀦': '6', '𓀧': '7', '𓀨': '8', '𓀩': '9', ' ': ' '
    };

    const regex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

    return hieroglyphs.replace(regex, function (match) {
        return hieroglyphsMap[match] || match;
    });
}


const brailleAlphabet = {
    'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑', 'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚',
    'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕', 'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
    'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽', 'z': '⠵',
    '1': '⠼⠁', '2': '⠼⠃', '3': '⠼⠉', '4': '⠼⠙', '5': '⠼⠑', '6': '⠼⠋', '7': '⠼⠛', '8': '⠼⠓', '9': '⠼⠊', '0': '⠼⠚',
    ' ': ' ', ',': '⠂', ';': '⠆', ':': '⠒', '.': '⠲', '!': '⠖', '(': '⠦', ')': '⠴', '?': '⠦', '\'': '⠄', '-': '⠤', '/': '⠌',
    '@': '⠈', '&': '⠯', '*': '⠡', '+': '⠬', '=': '⠿'
};

const reverseBrailleAlphabet = {};
for (const [key, value] of Object.entries(brailleAlphabet)) {
    reverseBrailleAlphabet[value] = key;
}

function textToBraille(text) {
    return text.split('').map(char => brailleAlphabet[char.toLowerCase()] || '').join('');
}

function brailleToText(braille) {
    return braille.split('').map(char => reverseBrailleAlphabet[char] || '').join('');
}


function copyText() {
    const outputText = document.getElementById('outputText');
    outputText.select();
    outputText.setSelectionRange(0, 99999);
    document.execCommand("copy");

    const copyButton = document.getElementById('copyButton');
    copyButton.textContent = '✅';
    setTimeout(() => {
        copyButton.textContent = 'Copier';
    }, 3500);
}



document.addEventListener('DOMContentLoaded', function () {
    function clearTextFields() {
        const TextFields = document.querySelectorAll('input[type="text"], textarea');

        TextFields.forEach(field => field.value = '');
    }

    document.getElementById('deleteButton').addEventListener('click', clearTextFields);
});


document.addEventListener('DOMContentLoaded', function () {
    const themeSwitch = document.getElementById('themeSwitch');
    const toggleButton = document.getElementById('toggleDarkModeButton');

    function toggleDarkMode() {
        document.body.classList.add('transitioning');
        document.querySelector('header').classList.add('transitioning');

        setTimeout(function () {
            document.body.classList.toggle('dark-mode');
            document.querySelector('header').classList.toggle('dark-mode');
            document.body.classList.remove('transitioning');
            document.querySelector('header').classList.remove('transitioning');
        }, 50);
    }

    if (themeSwitch) {
        themeSwitch.addEventListener('change', toggleDarkMode);
    }

    function enableDarkMode() {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkModeEnabled', 'true');
    }

    function disableDarkMode() {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkModeEnabled', 'false');
    }

    const darkModeEnabled = localStorage.getItem('darkModeEnabled');
    if (darkModeEnabled === 'true') {
        enableDarkMode();
    }

    if (toggleButton) {
        toggleButton.addEventListener('click', function () {
            const darkModeEnabled = localStorage.getItem('darkModeEnabled');
            if (darkModeEnabled === 'true') {
                disableDarkMode();
            } else {
                enableDarkMode();
            }
        });
    }
});