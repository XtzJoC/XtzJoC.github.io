//Constants values
const ALPHA_ALW_CHARS = "abcdefghijklmnopqrstuvwxyz";
const NUM_ALW_CHARS = "0123456789";
const BASE_SPECIALS_ALW_CHARS = "&()=/*+-_<>,;:!?./$#@";
const BASE_CHAR_SUBSTITUTION = {
    'o':'0', 'i':'1', 'z':'2', 'e':'3', 'a':'@', 's':'$', 'g':'6', 't':'7', 'b':'8', 'l':'L'
};

const BASE_RESLUT_TEXT = "------------";
const MAX_PWD_STEPS = 10000;
const MIN_PARAMETERS_LENGHT = 4;

//Elements form the html page
const siteInput = document.getElementById("site");
const usernameInput = document.getElementById("username");
const universalPasswordInput = document.getElementById("u-password");
const showPasswordBtn = document.getElementById("show-password");
const passwordLenghtInput = document.getElementById("password-lenght");
const customLenghtBtn = document.getElementById("custom-lenght");
const customCharsInput = document.getElementById("special-chars");
const customCharsBtn = document.getElementById("custom-chars");
const customSubstitutesInput = document.getElementById("substitutes");
const customSubstitutesBtn = document.getElementById("custom-substitutes");
const customSubstitutesDescription = document.getElementById("substitutes-used");

const infoField = document.getElementById("info-field");
const generateBtn = document.getElementById("generate")

const resultInput = document.getElementById("result-input");
const resultTitle = document.getElementById("result-title");
const copyPwdBtn = document.getElementById("copy-pwd")


//Encryption function
function Encrypt(site, username, key, customLenght = 12,
                 customChars = BASE_SPECIALS_ALW_CHARS, customSubsitutes = BASE_CHAR_SUBSTITUTION){
    var encryptedData = "";
    var i = 0;

    while(encryptedData.length < customLenght && i < MAX_PWD_STEPS){
        var char1 = site[i % site.length].charCodeAt(0);
        var char2 = username[i % username.length].charCodeAt(0);
        var char3 = key[i % key.length].charCodeAt(0)

        var encryptedChar = char1 ^ char2 ^ char3;
        encryptedChar = String.fromCharCode(encryptedChar);
        var lowChar = encryptedChar.toLocaleLowerCase();
        
        if(ALPHA_ALW_CHARS.includes(lowChar) || NUM_ALW_CHARS.includes(lowChar)
            || customChars.includes(lowChar)){

            if(lowChar in customSubsitutes) encryptedChar = customSubsitutes[lowChar];
            
            encryptedData += encryptedChar;
        }
        
        i++;
    }

    if(encryptedData.length < customLenght){
        UpdateInfoField("The password can't be generated with these parameters");
        return BASE_RESLUT_TEXT;
    }

    UpdateInfoField(`Password successfully generated with ${i - customLenght} failures`, "#20bf6b");
    return encryptedData;
}

// Conversion functions
function DictToStr(dict){
    if(typeof dict != "object"){
        console.log(`The type ${typeof dict} is disallowed !`);
        return "";
    }

    var str = "";

    for(var key in BASE_CHAR_SUBSTITUTION){
        str += `${key}:${BASE_CHAR_SUBSTITUTION[key]},`
    }

    if(str.length > 0) str = str.slice(0, -1);

    return str;
}

function StrToDict(str){
    if(typeof str != "string"){
        console.log(`The type ${typeof dict} is disallowed !`);
        return {};
    }

    var pieces = str.split(',');
    var dict = {};

    for(var i = 0; i < pieces.length; i++){
        var piece = pieces[i];

        if(piece.length != 3) {
            continue;
        }

        var key = piece[0];
        var value = piece[2];

        dict[key] = value;
    }

    return dict;
}

// // Functions linked with the html page

//#region input call back
function IsBaseInput(charCode){
    //Backspace, enter, tab and dell
    if(charCode === 8 || charCode == 9 || charCode == 13 || charCode === 46){
        return true;
    }

    //Arrows : up, down, left and right
    if(charCode >= 37 && charCode <= 40){
        return true;
    }

    return false;
}

function IsNumber(event){
    var key = event.keyCode;

    if(key >= 96 && key < 105){
        return true;
    }

    return IsBaseInput(key);
}

function IsAllowedChar(char){
    if(ALPHA_ALW_CHARS.includes(char.toLocaleLowerCase()) || ALPHA_ALW_CHARS.includes(char.toLocaleUpperCase()) 
       || NUM_ALW_CHARS.includes(char) || customCharsInput.value.includes(char)){
        return true;
    }

    return false;
}

function IsCustomChar(event){
    var keyChar = event.key;

    if(IsAllowedChar(keyChar)){
        return false;
    }

    return true;
}

function UpdateSubstitutesDescription(){
    var customSubsitutesDict = StrToDict(customSubstitutesInput.value);
    var subsStr = JSON.stringify(customSubsitutesDict);
    subsStr = subsStr.replace(/"/g, '');
    customSubstitutesDescription.innerHTML = subsStr;
}
//#endregion

//#region Onclick call back
function ShowPassword(){
    if(universalPasswordInput.type === "password"){
        universalPasswordInput.type = "text";
        showPasswordBtn.style.backgroundImage = 'url("Images/eye-open.png")';
    }
    else {
        universalPasswordInput.type = "password";
        showPasswordBtn.style.backgroundImage = 'url("Images/eye-closed.png")';
    }
}

function EnableCustomLenght(){
    if(passwordLenghtInput.disabled === true){
        passwordLenghtInput.disabled = false;
        customLenghtBtn.style.backgroundImage = 'url("Images/check.png")';
    }else{
        passwordLenghtInput.disabled = true;
        passwordLenghtInput.value = "12";
        customLenghtBtn.style.backgroundImage = 'unset';
    }
}

function EnableCustomChars(){
    if(customCharsInput.disabled === true){
        customCharsInput.disabled = false;
        customCharsBtn.style.backgroundImage = 'url("Images/check.png")';
    }else{
        customCharsInput.disabled = true;
        customCharsInput.value = BASE_SPECIALS_ALW_CHARS;
        customCharsBtn.style.backgroundImage = 'unset';
    }
}

function EnableCustomSubstitutes(){
    if(customSubstitutesInput.disabled === true){
        customSubstitutesInput.disabled = false;
        customSubstitutesBtn.style.backgroundImage = 'url("Images/check.png")';
    }else{
        customSubstitutesInput.disabled = true;
        customSubstitutesInput.value = DictToStr(BASE_CHAR_SUBSTITUTION);
        customSubstitutesBtn.style.backgroundImage = 'unset';
    }
}

function GeneratePassword(){
    //Initialize the result text to the failure result
    resultInput.value = `${BASE_RESLUT_TEXT}`;

    var site = siteInput.value;
    var username = usernameInput.value;
    var uPwd = universalPasswordInput.value;

    //Generation disabled when a value is empty
    if(site === "" || username === "" || uPwd === ""){
        UpdateInfoField("Please enter all requiered values");
        return;
    }

    //Generation disabled when a value is not enough long
    if(site.length <= MIN_PARAMETERS_LENGHT || username.length <= MIN_PARAMETERS_LENGHT
      || uPwd.length <= MIN_PARAMETERS_LENGHT){
        UpdateInfoField(`Please enter parameters of lenght higher than ${MIN_PARAMETERS_LENGHT}`);
        return;
    }

    //Generation disabled when each values has the same lenght
    if(site.length === username.length && site.length === uPwd.length){
        UpdateInfoField("Please enter parameters of different lenghts");
        return;
    }

    var customLenght = parseInt(passwordLenghtInput.value);
    var customChars = customCharsInput.value;
    var customSubsitutes = StrToDict(customSubstitutesInput.value);

    if(!(customLenght > 0)){
        UpdateInfoField("The password lenght is incorrect");
        return;
    }

    //console.log(`s:${site},u:${username},p:${uPwd},l:${customLenght},c:${customChars} and sub:${customSubsitutes}`)

    var pwd = Encrypt(site, username, uPwd, customLenght, customChars, customSubsitutes);

    resultTitle.innerHTML = "Your custom password :";
    resultInput.value = `${pwd}`;
}

function CopyGeneratedPassword(){
    if(resultInput.value === BASE_RESLUT_TEXT) return;
    resultInput.select();
    document.execCommand("Copy");
}
//#endregion

function UpdateInfoField(msg, color = "#eb3b5a"){
    infoField.innerHTML = msg;
    infoField.style.color = color;
}

function Main(){
    ShowPassword();
    EnableCustomLenght();
    EnableCustomChars();
    EnableCustomSubstitutes();
    
    showPasswordBtn.addEventListener('click', ShowPassword);
    customLenghtBtn.addEventListener('click', EnableCustomLenght);
    customCharsBtn.addEventListener('click', EnableCustomChars);
    customSubstitutesBtn.addEventListener('click', EnableCustomSubstitutes);
    generateBtn.addEventListener('click', GeneratePassword);
    copyPwdBtn.addEventListener('click', CopyGeneratedPassword);

    passwordLenghtInput.onkeydown = IsNumber;
    customCharsInput.onkeydown = IsCustomChar;
    customSubstitutesInput.oninput =  UpdateSubstitutesDescription;

    UpdateSubstitutesDescription();

    UpdateInfoField("");
    resultInput.value = BASE_RESLUT_TEXT;
}

Main();