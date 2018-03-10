// Listens for page information
const path = chrome.runtime.getURL("./stopwords.txt");
const client_id = "bdd9c482459147cfab6e37b53bd12111";
const client_secret = "0af638224b40476198c7ac3ee514b062";
const spotifySearch = "https://api.spotify.com/v1/search";

let token = '';

getAuthorization();


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request !== undefined) {
      getSongFromSpotify(request);
    }     
});

function getSongFromSpotify(pageData) {
  console.log("TITLE: " + pageData.title);
  let query = parseWords(pageData.title);

  console.log("WORDS: " + query);
  makeSearchRequest(query);
}

// Parses words into array, removing punctuation and whitespace
function parseWords(words) {
  words = words.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
  words = words.split(" ");
  return words;
}

function makeSearchRequest(query) {
    var xmlHttp = new XMLHttpRequest();
    var parameters = "q=" + query[0];
    for(let i = 1; i < query.length; i++) {
      if(i > 1) {
        break;
      } else {
        parameters += "%20" + query[i];
      }
    }
    parameters += "&type=track&limit=1";
    console.log(parameters);

    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          if(xmlHttp.response.tracks.items.length > 0) {
            let object = xmlHttp.response.tracks.items[0].uri;
            
            let player = document.getElementById("player");
            let uri = "https://open.spotify.com/embed?uri=";
            player.setAttribute("src", uri+object);
          } else {
            console.log("There are no songs related to this webpage title");
          }
        }
    }
   
    xmlHttp.open("GET", "https://api.spotify.com/v1/search?" + parameters, true); 
    xmlHttp.responseType = "json";
    xmlHttp.setRequestHeader("Authorization", "Bearer " + token);
    xmlHttp.setRequestHeader("Content-Type", "application/json");
    
    xmlHttp.send(null);
}

function getAuthorization() {
  var xmlHttp = new XMLHttpRequest();
  var baseCode = btoa(client_id + ":" + client_secret);
  var params = "grant_type=client_credentials";

  xmlHttp.onreadystatechange = function() { 
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      token = xmlHttp.response.access_token;
      console.log(token);
    }
  }

  xmlHttp.open("POST", "https://accounts.spotify.com/api/token", true);
  xmlHttp.responseType = "json";
  xmlHttp.setRequestHeader("Authorization", "Basic " + baseCode);
  xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
  xmlHttp.send(params);
}

