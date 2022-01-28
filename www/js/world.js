var socket = io();


// LOGGING INTO LOBBY:=======================================================================
var username; // uid

var nameInputOverlay = document.getElementById("nameInputOverlay");

var usernameField = document.getElementById("usernameInput");
var enterWorldButton = document.getElementById("enterWorldIMG");
var fadedAway = false;

// Listen if user is trying to join world
enterWorldButton.addEventListener('click', function(){
    if(usernameField.value !== "" && fadedAway == false) {
        JoinWorld();
    }
});
document.addEventListener('keypress', function(e) {
    // pressing enter to enter world
    if (e.key === 'Enter' && usernameField.value !== "" && fadedAway == false) {
        JoinWorld();
    }
    // pressing enter when overlay faded away (TO SEND A MESSAGE TO CHAT)
    if (e.key === 'Enter' && fadedAway == true) {
        SendMessage();
    }
});
function JoinWorld() {
    username = usernameField.value;
    chatMessageField.placeholder = "Welcome " + username + "! Chat with other players...";
    document.getElementById("styleShopUsername").innerHTML = username; // for item shop!
    fade(nameInputOverlay);
    fadedAway = true;

    socket.emit('playerJoinedWorld', {newPlayer:username, id:socket.id});

    //document.getElementById("logout").style.display = 'block';
}

/// Lobby Code
// function joinLobby(id){
//     console.log(id)
// }
function showCreateLobbyForm(){
 let form = document.getElementById("createLobbyForm");
 form.style = "display:block;"
}
function createLobby(){
    let lobbName = document.getElementById("lobbyName").value;
    let lobbPassword = document.getElementById("lobbyPassword").value;
    /// ensure to filter out empty strings here 

    if (lobbName == ''){
        console.log("handle empty name here")
    }
    if (lobbPassword == ''){
        lobbPassword = '';
    }
    socket.emit('createLobby',{name:lobbPassword,password:lobbName})
}
socket.on('updateLobbyList',function(list){
    let lobbyList = list['values'];
    
    Object.entries(lobbyList).forEach(([key, value]) => {

        console.log(key, value) 
        Object.entries(value).forEach(([lobbyId, lobby]) => {
            console.log(lobbyId, lobby)
            let matches = document.getElementById('matchContainer');
            let newMatch = document.createElement("div");
            newMatch.classList.add("match");

            let matchName = document.createElement("div");
             matchName.classList.add("gameID")
            // set lobby name
            matchName.innerText = lobby["lobbyName"];

            let matchCount = document.createElement("p");
            matchCount.classList.add("playerCount");
            // set lobby player count
            matchCount.innerText = lobby["playerCount"] + " players";

            let matchJoinBtn = document.createElement("img");
            matchJoinBtn.onclick = function(){
                //When someone clicks join button, add their player onto the lobby with lobbyId clicked.
                console.log(lobby["lobbyId"])
            }
            matchJoinBtn.classList.add("joinGame")
            matchJoinBtn.src = "../img/join.png";
            matchName.append(matchCount);
            newMatch.append(matchName);
            newMatch.append(matchJoinBtn);
            matches.append(newMatch);



        })
      
    })


    
// console.log(list)
// console.log(list['values'][0][0]['lobbyName'])
});
// end of lobby code


// FADING FUNCTION: (Reduce opacity and then display: none)
function fade(element) {
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            element.style.display = 'none';
            // once it has faded away, remove overlay:
            //nameInputOverlay.parentNode.removeChild(nameInputOverlay);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= 0.1;
    }, 50);
}


// FETCHING LOBBY LIST: =======================================================================
var onlyGameForNow = document.getElementById("onlyGameForNow");
onlyGameForNow.addEventListener('click', function() {
    JoinGame();
});

function JoinGame() {
    sessionStorage.setItem("username", username);
    window.location.href = 'game.html';
}

// MORE GAMES AT ONCE IS FUTURE IMPLEMENTATION! not in this commit bois
var playerCountDiv = document.getElementById('playerCount');
socket.emit('getPlayerCount');
socket.on('playerCount', function(playerCount) {
    playerCountDiv.innerHTML = playerCount + " players";
});


// CHAT: ======================================================================================
var chatMessageField = document.getElementById("chatMessageField");
var chatMessageBtn = document.getElementById("sendMessage");
var chatConversationContainer = document.getElementById("chatConversationContainer");

// "player joined" message:
socket.on('playerJoinedWorld', function(msg) {
    var newPlayer = msg["newPlayer"];
    chatConversationContainer.innerHTML += "<div class='message'><strong>- " + newPlayer + "</strong> has arrived at the lake! -</div>";
});
// "player left" message:
socket.on('playerLeftWorld', function(msg) {
    chatConversationContainer.innerHTML += "<div class='message'>- Someone flew away -</div>";
});

chatMessageBtn.addEventListener('click', function() {
    SendMessage();
});

socket.on('chatMessage', function(msg) {
    var messageItself = msg["msg"];
    var sender = msg["sender"];
    chatConversationContainer.innerHTML += "<div class='message'><strong>" + sender + ": </strong>" + messageItself + "</div>";
    chatConversationContainer.scrollTop = chatConversationContainer.scrollHeight;
});

function SendMessage() {
    if (chatMessageField.value !== "") {
        socket.emit('chatMessage', {msg:chatMessageField.value, id:socket.id, sender:username});
        chatMessageField.value = "";
    }
}


// OTHER FUNCTIONALITY: ======================================================================================
//Log out button:
var logOutDiv = document.getElementById("logout");
logOutDiv.addEventListener('click', function() {
    nameInputOverlay.style.display = "flex";
    nameInputOverlay.style.opacity = "1";
    fadedAway = false;
    chatConversationContainer.innerHTML += "<div class='message'>- Someone flew away -</div>";

    //document.getElementById("logout").style.display = 'none';
});

// IF COMING BACK FROM GAME:
if (sessionStorage.getItem("username")) {
    username = sessionStorage.getItem("username");
    nameInputOverlay.style.display = "none";
    fadedAway = true;

    //document.getElementById("logout").style.display = 'block';
    
    document.getElementById("styleShopUsername").innerHTML = username; // for item shop!
    chatMessageField.placeholder = "Welcome " + username + "! Chat with other players...";
    chatConversationContainer.innerHTML += "<div class='message'><strong>- " + username + "</strong> came back from a match -</div>";
}