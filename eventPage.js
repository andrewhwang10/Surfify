// let player = $("#player");
// let uri = "https://open.spotify.com/embed?uri=";
// player.attr("src", uri+"spotify:track:1g5AwXgekJ2ToKHw0Nw2p5");

// Listens for page information
const path = chrome.runtime.getURL("./stopwords.txt");
const client_id = "bdd9c482459147cfab6e37b53bd12111";
const client_secret = "0af638224b40476198c7ac3ee514b062";
const spotifySearch = "https://api.spotify.com/v1/search";

getAuthorization();

let file = new File([""], path);
let stopWords = new Set();
let reader = new FileReader();

reader.onload = function(e) {
  e.target.result
  for (let i = 0; i < e.target.result.length; i++) {
    stopWords.add(e.target.result[i]);
  }
}
reader.readAsText(file);



chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request !== undefined) {
      console.log("TITLE: " + request.title);
      let query = parseWords(request.title);
      query = removeStopWords(query);
      console.log(stopWords);
      console.log("WORDS: " + query);
      httpGetAsync(query[0]);
    }      
});

// Parses words into array, removing punctuation and whitespace
function parseWords(words) {
  words = words.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
  words = words.split(" ");
  return words;
}

function removeStopWords(words) {
  for(let i = 0; i < words.length; i++) {
    if(stopWords.has(words[i].toLowerCase())) {
      words.splice(i, 1);
      i--;
    }
  }
  return words;
}

function httpGetAsync(parameters) {
    var xmlHttp = new XMLHttpRequest();
    var URL = "https://api.spotify.com/v1/search";
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          let object = xmlHttp.responseText;
          console.log(object);
        }
    }
   
    xmlHttp.open("GET", URL, true); // true for asynchronous
    xmlHttp.setRequestHeader("Authorization", "Bearer" + token);
    var q = "q=" + parameters + "&type=track";
    xmlHttp.send(q);
}

function getAuthorization() {
  var xmlHttp = new XMLHttpRequest();
  var baseCode = btoa(client_id + client_secret);
  var params = "grant_type=client_credentials";

  xmlHttp.onreadystatechange = function() { 
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      token = xmlHttp.responseText;
      console.log(token);
    }
  }

  xmlHttp.open("POST", "https://accounts.spotify.com/api/token", true);
  xmlHttp.setRequestHeader("Authorization", "Basic " + baseCode);
  xmlHttp.send(params);
}