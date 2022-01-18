var socket = io();


// LOGGING INTO LOBBY:=======================================================================
var username; // uid

var nameInputOverlay = document.getElementById("nameInputOverlay");

var usernameField = document.getElementById("usernameInput");
var enterLobbyButton = document.getElementById("enterLobbyIMG");
var fadedAway = false;

// Listen if user is trying to join lobby
enterLobbyButton.addEventListener('click', function(){
    if(usernameField.value !== "" && fadedAway == false) {
        JoinLobby();
    }
});
document.addEventListener('keypress', function(e) {
    // pressing enter to enter lobby
    if (e.key === 'Enter' && usernameField.value !== "" && fadedAway == false) {
        JoinLobby();
    }
    // pressing enter when overlay faded away (TO SEND A MESSAGE TO CHAT)
    if (e.key === 'Enter' && fadedAway == true) {
        SendMessage();
    }
});
function JoinLobby() {
    username = usernameField.value;
    chatMessageField.placeholder = "Welcome " + username + "! Chat with other players...";
    fade(nameInputOverlay);
    fadedAway = true;

    socket.emit('playerJoinedLobby', {newPlayer:username, id:socket.id});
}

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
socket.on('playerJoinedLobby', function(msg) {
    var newPlayer = msg["newPlayer"];
    chatConversationContainer.innerHTML += "<div class='message'><strong>- " + newPlayer + "</strong> has arrived at the lake! -</div>";
});
// "player left" message:
socket.on('playerLeftLobby', function(msg) {
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
});

// IF COMING BACK FROM GAME:
if (sessionStorage.getItem("username")) {
    username = sessionStorage.getItem("username");
    nameInputOverlay.style.display = "none";
    fadedAway = true;
    
    chatMessageField.placeholder = "Welcome " + username + "! Chat with other players...";
    chatConversationContainer.innerHTML += "<div class='message'><strong>- " + username + "</strong> came back from a match -</div>";
}