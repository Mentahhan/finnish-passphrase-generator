var wordlist = [];
var filteredWordlist = [];

function loadXMLDoc() {
    var xmlHttpReq = new XMLHttpRequest();
    
    xmlHttpReq.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var xml = this.responseXML.getElementsByTagName("s");
            for(var i = 0; i < xml.length; i++) {
                wordlist.push(xml[i].childNodes[0].nodeValue);
            }
        }
    };
    xmlHttpReq.open("GET", "wordlist/kotus-sanalista_v1.xml", true);
    xmlHttpReq.send();
}

function generatePassPhrase() {
    var pass = "";
    var wordCount = document.getElementById("wordCount").value;
    var wordSeparator = document.getElementById("wordSeparator").value;
    var capitals = document.getElementById("capType").value;
    var sym = document.getElementById("sym").checked;
    var num = document.getElementById("num").checked;
    var noSpecialLetters = document.getElementById("noSpecialLetters").checked;
    var hasSymbol = false;
    var hasNumber = false;

    if (noSpecialLetters && filteredWordlist.length == 0) {
        wordlist.forEach(word => {
            /^[a-z]+$/g.test(word) ? filteredWordlist.push(word) : false ;
        });
    }

    for (var i = 1; i <= wordCount; i++) {
        pass += getWord(capitals, noSpecialLetters);

        if (sym && !hasSymbol &&getRandom(0, 2) == 1) {
            pass += addSymbol();
            hasSymbol = true;
        }
        else if (num && !hasNumber && getRandom(0, 2) == 1) {
            pass += addNumber();
            hasNumber = true
        }
        
        if (i < wordCount)
            pass += wordSeparator
        else if (sym && !hasSymbol)
            pass += addSymbol();
        else if (num && !hasNumber)
            pass += addNumber();
    }

    document.getElementById("passphrase").value = pass;
}

function getWord(capitals, noSpecialLetters) {
    if(noSpecialLetters)
        var str = filteredWordlist[getRandom(0, filteredWordlist.length - 1)];
    else
        var str = wordlist[getRandom(0, wordlist.length - 1)];
    
    if (capitals == "noCap")
        return str;
    else if (capitals == "fullCap")
        str = fullCapitalize(str);
    else if (capitals == "cap")
        str = capitalize(str);
    else if (capitals == "randCap")
        str = randomCapitalize(str);

    return str;
}

function getRandom(min, max) {
    return Math.floor((Math.random() * max) + min);
}

function fullCapitalize(str) {
    return str.toUpperCase();
}

function capitalize(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function randomCapitalize(str) {
    var str = str.split("").map(function(c) {
        return c[Math.round(Math.random())?"toUpperCase":"toLowerCase"]();
    }).join("");

    return str;
}

function addSymbol() {
    var sym = "!#%&?@";
    return sym[getRandom(0, sym.length)];
}

function addNumber() {
    return getRandom(0, 9);
}

function copyToClipboard() {
    var str = document.getElementById("passphrase").value;
    navigator.clipboard.writeText(str);
}