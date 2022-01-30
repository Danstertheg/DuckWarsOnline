var socket = io();


// 1. LOGGING INTO LOBBY:=======================================================================
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
    sessionStorage.setItem("username", username);
    chatMessageField.placeholder = "Welcome " + username + "! Chat with other players...";
    document.getElementById("styleShopUsername").innerHTML = username; // for item shop!
    fade(nameInputOverlay);
    fadedAway = true;

    socket.emit('playerJoinedWorld', {newPlayer:username, id:socket.id});
}


// 2. SEARCHING AND CREATING GAMES:=======================================================================

// A. To change the match container to the Create Game FORM===========================
function DisplayCreateGameForm() {
    // below, mate, is the magic of "backticks": `      (this lil ASCII sucker will allow you to write a JS string through many lines)
    document.getElementById("gameListSection").innerHTML = `<div class="boxTitle titleWithBackBtn">
                    <img src="img/goBack.png" onclick="DisplayPublicGames()" title="Go back">
                    <p>Create Game</p>
                </div>
            <div class="createGameFormContainer">
                <div class="createGameFormRow">
                    <p>Game ID:</p>
                    <input type="text" placeholder="Enter an identifier..." id="createdGameName">
                </div> 

                <div class="createGameFormRow">
                    <p>Private:</p>
                    <input type="checkbox" id="createdGamePrivate">
                </div>

                <div class="createGameFormRow" id="passwordRow">
                    <p>Password:</p>
                    <input type="text" placeholder="Enter a password..." id="createdGamePassword">
                </div> 

                <div style="display: flex; justify-content: center;"><img src="img/createGameForm.png" id="createGame"></div>
            </div>`;
            
    // LOGIC FOR CREATE GAME FORM: ================================================================
    var hiddenPasswordRow = document.getElementById("passwordRow");
    // a game's 3 creation fields:
    var gameIDField = document.getElementById("createdGameName");
    var gamePrivateField = document.getElementById("createdGamePrivate");
    var gamePWField = document.getElementById("createdGamePassword");

    // show password field if PRIVATE is selected
    document.getElementById("createdGamePrivate").addEventListener("change", function() {
        hiddenPasswordRow.style.display = (this.checked) ? "flex" : "none";
    });

    // press button to create (check that ID was named and other checks)
    document.getElementById("createGame").addEventListener("click", function() {
        // check that game has been given ID:
        if (gameIDField.value === "") {
            gameIDField.style.border = "red solid 3px";
        } 
        // check that game has been given PW if PRIVATE
        else if (gamePrivateField.checked && gamePWField.value === "") {
            gameIDField.style.border = "none";
            gamePWField.style.border = "red solid 3px";
        }
        // checks passed, creating game now and going back to the Public Games List
        else {
            // ****** FUTURE CODE COMMENTED HERE - DONT ERASE plz mate
            // CHECK THAT GAME ID HAS NOT BEEN TAKEN HERE! Use the css response written below plz:

            /* 
            if (game has been taken) {    // CHANGE THIS LINE TO THE ACTUAL CHECK
                gameIDField.style.border = "red solid 3px";
                gameIDField.value = "";
                gameIDField.placeholder = "ID taken, choose another!";
            } else 
                //proceed to create a game in DB and run DisplayPublicGames()
            */

            // ******
            
            if (gamePrivateField.checked) {// if it has a PW
                //alert("Game created successfully! Find it on the Public Games list or, if private, search for it below.")
                socket.emit('createLobby',{name: gameIDField.value, password: gamePWField.value});
                DisplayPublicGames(); // GAME CREATED SUCCESSFULLY, go back to the lobby and search for it or see it in Public list
            }
            else {
                socket.emit('createPublicLobby',{name: gameIDField.value}); // not yet implemented on backend
                
                //erase later:
                gameIDField.style.border = "red solid 3px";
                gameIDField.value = "";
                gameIDField.placeholder = "Only private games for now!"
                alert("YO! This is a public game with no PW. Socket emitted 'createPublicLobby', which has not yet been implemented in backend.");
            }

            
        }
    })
}

// B. To reset the container back to the DEFAULT PUBLIC GAMES:============================
function DisplayPublicGames() {
    document.getElementById("gameListSection").innerHTML = `<div class="boxTitle">Public Games</div> 
                    <div id="matchContainer">
                        <div class="match">
                            <div class="gameID"> LENTIL-SOUP
                                <p id="playerCount"> _ players</p>
                            </div>
                            <img class="joinGame" src="img/join.png" id="onlyGameForNow">
                        </div>
                    </div>
                    <div class="findCreateActions">
                    <div id = "findGameInput">
                        <input type="text" placeholder="Do not try. Not ready" id="findGameField" >
                        <img class="findGameButton" onclick="SearchForGame()" src="img/find.png" title="Find a game">
                    </div>
                    <img src="img/createGame.png" id = "createLobby" onclick ="DisplayCreateGameForm()" title="Create a new game!">
                </div>`;
    GetPlayerCounts();
    
    // get overall list:
    socket.emit('getLobbyList');
}

// C. Search for Game ID: =============================  needs work!
var matchList = document.getElementById("matchContainer"); // where all matches are listed and where we will list the result of a SUCCESSFUL SEARCH
var gameFindField = document.getElementById("findGameField");

function SearchForGame() {
    if (gameFindField.value === "") // if it is empty, gtfo
        return;

    if (true) { // gameID is not found on DB 
        gameFindField.style.border = "red solid 3px";
        gameFindField.value = "";
        gameFindField.placeholder = "gonna cry?";//"- Game NOT found -"
    } else { // gameID is found!
        var desiredGame = gameFindField.value; // gameID!

        if (true) { //GAME IS PRIVATE
            OpenPWInputForm(desiredGame);

        } else { // GAME IS NOT PRIVATE
            // revert any CSS done above for invalid searched:
            gameFindField.style.border = "none";
            gameFindField.value = "";
            gameFindField.placeholder = "ID found! Join above";

            var playerCountForThisID = 0; // CALL FUNC TO GET PLAYER COUNT FOR THIS SEARCHED ID HERE!---------
            matchList.innerHTML = `<div class="match" style="background-color: rgb(157 248 221); border: black solid 3px;">
                                        <div class="gameID">` +  desiredGame  + `
                                            <p id="playerCount"> ` + playerCountForThisID + ` players</p>
                                        </div>
                                        <img class="joinGame" src="img/join.png" id="` +  desiredGame  + `" onclick="attemptJoin(this.id)">
                                    </div>`;      
        }
    }
};

function OpenPWInputForm(gameID) {
    document.getElementById("gameListSection").innerHTML =  ` <div style="height: 100%; width: 100%;">
                                <img src="img/goBack.png" onclick="DisplayPublicGames()" title="Go back" class="goBack">
                                <div class="createGameFormRow" style="flex-direction: column;">
                                    <p>Enter Password</p>
                                    <input type="text" id="gamePassword">
                                    <img class="joinGame" src="img/join.png" id="attemptPW" style="margin-top: 20px;"> 
                                </div>
                                </div>`;
    // function to test pw is encapsuled in this if-statement cuz it is specific to this route
    var attemptedPWField = document.getElementById("gamePassword");
    document.getElementById("attemptPW").addEventListener("click", function() {
        if (attemptedPWField.value === "") // if it is empty, gtfo
            return;
        attemptJoinViaPW(gameID, attemptedPWField.value);

        // if it didn't go to game.html -> pw is incorrect -> let them know via this css:
        attemptedPWField.value = "";
        attemptedPWField.style.border = "red solid 3px";
        attemptedPWField.placeholder = "Incorrect password, try again";

       /* if (true) { // PW is incorrect
            attemptedPWField.value = "";
            attemptedPWField.style.border = "red solid 3px";
            attemptedPWField.placeholder = "Incorrect password, try again"
        } else { // PW IS CORRECT ! (let them in the game - in game.html) 
            // call function to let them in the game by giving it the gameID - this variable: desiredGame
            attemptJoinViaPW(gameID, attemptedPWField.value);
        }*/
    })

}


/// Lobby Code
// function joinLobby(id){
//     console.log(id)
// }
function showCreateLobbyForm(){
 let form = document.getElementById("createLobbyForm");
 form.style = "display:block;"
}
/*function createLobby(){
    let lobbName = document.getElementById("lobbyName").value;
    let lobbPassword = document.getElementById("lobbyPassword").value;

    /// ensure to filter out empty strings here 

    if (lobbName == ''){
        console.log("handle empty name here")
    }
    if (lobbPassword == ''){
        lobbPassword = '';
    }
    socket.emit('createLobby',{name:lobbName,password:lobbPassword})
}*/

socket.on('updateLobbyList',function(list){
    let lobbyList = list['values'];
    
    Object.entries(lobbyList).forEach(([key, value]) => {

        //console.log(key, value) 
        Object.entries(value).forEach(([lobbyId, lobby]) => {
            //console.log(lobbyId, lobby)
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
                
                /// Player related variables
                username = sessionStorage.getItem("username");
                skin = sessionStorage.getItem("skin");
                headItem = sessionStorage.getItem("headItem");
                outfit = sessionStorage.getItem("outfit");
                playerId = socket.id;
                console.log(username);
                if (lobby['password'] == ''){
                /// add empty password check here, "if the user forgot to enter a password with a lobby that requires one."
                /// check password size before sending also, just to reduce errors server has to handle
                socket.emit("requestJoin",{pId:playerId,playerName:username,skin:skin,headItem:headItem, outfit:outfit,lId:lobby["lobbyId"],password:''})
                }
                else{
                    // lobby is password protected...
                    //openJoinForm(playerId,lobby["lobbyId"])
                    OpenPWInputForm(lobby["lobbyId"]);
                }
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

/*function openJoinForm(playerId,lobbyId){

    document.getElementById("joinForm").style = "display:block";
    document.getElementById("lobbyId").value = lobbyId;
    document.getElementById("playerId").value = playerId;
}*/
function attemptJoinViaPW(gameID, gamePW){
    let username = sessionStorage.getItem("username");
    let skin = sessionStorage.getItem("skin");
    let headItem = sessionStorage.getItem("headItem");
    let outfit = sessionStorage.getItem("outfit");
    //let passAttempt = document.getElementById("passAttempt").value;
    //let lId = document.getElementById("lobbyId").value;
    //let pId = document.getElementById("playerId").value;
    socket.emit("requestJoin",{pId:socket.id, playerName:username, skin:skin, headItem:headItem, outfit:outfit, lId:gameID, password:gamePW})
}
socket.on("successfulJoin",function(){
    JoinGame();
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


// 3. FETCHING LOBBY LIST: =======================================================================
var onlyGameForNow = document.getElementById("onlyGameForNow");
onlyGameForNow.addEventListener('click', function() {
    JoinGame();
});

function JoinGame() {
    sessionStorage.setItem("username", username);
    window.location.href = 'game.html?game:' + "SD";
}

// MORE GAMES AT ONCE IS FUTURE IMPLEMENTATION! not in this commit bois
GetPlayerCounts();
function GetPlayerCounts() {
    var playerCountDiv = document.getElementById('playerCount');
    socket.emit('getPlayerCount');
    socket.on('playerCount', function(playerCount) {
        playerCountDiv.innerHTML = playerCount + " players";
    });
}


// 4. CHAT: ======================================================================================
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


// 5. OTHER FUNCTIONALITY: ======================================================================================
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