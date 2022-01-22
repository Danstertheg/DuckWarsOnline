// Setting initial values for player styles variables
//sessionStorage.setItem("skin", "danky");
//sessionStorage.setItem("headItem", "none");
//sessionStorage.setItem("outfit", "none");


// Going to the shop:
var goToShopButton = document.getElementById("styleOverlayButton");
var styleOverlay = document.getElementById("styleOverlay");
goToShopButton.addEventListener("click", function() {
    styleOverlay.style.display = "flex";
});


// Switching style category tabs:
// colors:
var tabSelected = "rgb(62, 158, 110)";
var tabUnselected = "rgb(93, 181, 216)";

//tabs:
var skinCategory = document.getElementById("skinCategory");
var headCategory = document.getElementById("headCategory");
var outfitCategory = document.getElementById("outfitCategory");
//pages:
var styleSkinPage = document.getElementById("styleSkinPage");
var styleHeadPage = document.getElementById("styleHeadPage");
var styleOutfitPage = document.getElementById("styleOutfitPage");
//listeners to switch between pages:
skinCategory.addEventListener('click', function() {
    skinCategory.style.backgroundColor = tabSelected;
    headCategory.style.backgroundColor = tabUnselected;
    outfitCategory.style.backgroundColor = tabUnselected;

    styleSkinPage.style.display = "block";
    styleHeadPage.style.display = "none";
    styleOutfitPage.style.display = "none";
});
headCategory.addEventListener('click', function() {
    skinCategory.style.backgroundColor = tabUnselected;
    headCategory.style.backgroundColor = tabSelected;
    outfitCategory.style.backgroundColor = tabUnselected;

    styleSkinPage.style.display = "none";
    styleHeadPage.style.display = "block";
    styleOutfitPage.style.display = "none";
});
outfitCategory.addEventListener('click', function() {
    skinCategory.style.backgroundColor = tabUnselected;
    headCategory.style.backgroundColor = tabUnselected;
    outfitCategory.style.backgroundColor = tabSelected;

    styleSkinPage.style.display = "none";
    styleHeadPage.style.display = "none";
    styleOutfitPage.style.display = "block";
});


//Selecting Items:
var itemSelected = "background-color: rgb(109, 241, 241); font-weight: bold; border: 3px solid black;";
var itemUnselected = "background-color: rgb(131, 178, 207); font-weight: normal; border: none;";
// default ALREADY SELECTED ITEMS (danky, none, none) or what they had:
window.onload = function() {
    if (sessionStorage.getItem("skin"))
        ChangeSkin(sessionStorage.getItem("skin"));
    else
        ChangeSkin("danky");

    if (sessionStorage.getItem("headItem"))
        ChangeHeadItem(sessionStorage.getItem("headItem"));
    else
        ChangeHeadItem("noneHead");

    if (sessionStorage.getItem("outfit"))
        ChangeOutfit(sessionStorage.getItem("outfit"));
    else
        ChangeOutfit("noneOutfit"); 
};
// to check if it isn't already done (TO NOT OVERLOAD SERVER and or page)
var currentSkin = "";
var currentHeadItem = "";
var currentOutfit = "";

const skinIMG = new Image(); // to render current skin
const headItemIMG = new Image(); // to render current head
const outfitIMG = new Image(); // to render current outfit
function ChangeSkin(skin) {
    if (skin != currentSkin) {
        var allSkinItems = document.getElementsByClassName("skin");
        for (var i = 0; i < allSkinItems.length; i++) {
            allSkinItems[i].style.cssText = itemUnselected;
        }

        sessionStorage.setItem("skin", skin);

        document.getElementById(skin).style.cssText = itemSelected;
        currentSkin = skin;        
        // actual setting of the skinIMG's src is done in UpdateStyle() as it alternates between idle1 and idle2
        // update head item src:
        if (currentHeadItem != "noneHead" && currentHeadItem != "")
            headItemIMG.src = 'img/clothingItems/' + String(currentSkin) + '/headItems/' + String(currentHeadItem) + '/l.png';
    }
}
function ChangeHeadItem(headItem) {
    if (headItem != currentHeadItem) {
        var allHeadItems = document.getElementsByClassName("head");
        for (var i = 0; i < allHeadItems.length; i++) {
            allHeadItems[i].style.cssText = itemUnselected;
        }

        sessionStorage.setItem("headItem", headItem);

        document.getElementById(headItem).style.cssText = itemSelected;
        currentHeadItem = headItem;
        
        // to render current head:
        if (headItem != "noneHead" && headItem != "")
            headItemIMG.src = 'img/clothingItems/' + String(currentSkin) + '/headItems/' + String(currentHeadItem) + '/l.png';
        else
            headItemIMG.src = '';
        console.log(headItemIMG.src);

       // UpdateStyle();
    }
}
function ChangeOutfit(outfit) {
    if (outfit != currentOutfit) {
        var allOutfits = document.getElementsByClassName("outfit");
        for (var i = 0; i < allOutfits.length; i++) {
            allOutfits[i].style.cssText = itemUnselected;
        }

        sessionStorage.setItem("outfit", outfit);

        document.getElementById(outfit).style.cssText = itemSelected;
        currentOutfit = outfit;
        // actual setting of the outfitIMG's src is done in UpdateStyle() as it alternates between idle1 and idle2
    }
}

// Updating current style (left):
const canvas = document.getElementById('currentStyleCanvas');
var animFrame = 1;
var headItemXOffset = 0; //so the hat bobs with the head

canvas.width = 300;
canvas.height = 300;
const ctx = canvas.getContext('2d'); 

function UpdateStyle() {
    var imgWidthPx = 250; // also its height
    var posX = ctx.canvas.width / 2 - imgWidthPx / 2;
    var posY = -ctx.canvas.height / 2 + 170;

    // bg circle:
    ctx.fillStyle = '#6b9cca';
    ctx.beginPath(); 
    ctx.arc(160, 150, 100, 0, Math.PI * 2); 
    ctx.fill(); 
    ctx.closePath();

    if (frame % 20 == 0) {
        animFrame = (animFrame == 1) ? 2 : 1;
        headItemXOffset = (headItemXOffset == 0) ? -5 : 0;
    }

    // if outfit is in use, don't draw skin
    if (currentOutfit == "noneOutfit") {
        // Skin:
        // LESSON: You CANT drawImage until image obj is FULLY LOADED (onload), or else nothing shows up and NO error messages either
        skinIMG.src = 'img/animations/' + String(currentSkin) + '/' + String(currentSkin) + '_l_idle' + String(animFrame) + '.png';
        ctx.drawImage(skinIMG, posX, posY, imgWidthPx, imgWidthPx);
    } else {
        // Outfit:
        outfitIMG.src = 'img/clothingItems/' + String(currentSkin) + '/outfits/' + String(currentOutfit) + '/l_idle' + String(animFrame) + '.png'; 
        ctx.drawImage(outfitIMG, posX, posY, imgWidthPx, imgWidthPx); 
    }

    // Head:
    if (currentSkin == "mrgoose") //cuz his head doesn't move but his hat does
        ctx.drawImage(headItemIMG, posX, posY + headItemXOffset, imgWidthPx, imgWidthPx); 
    else if (currentSkin == "oats") //cuz he is too to the top of the 200x200 png
        ctx.drawImage(headItemIMG, posX + headItemXOffset * -1, posY - 20, imgWidthPx, imgWidthPx); 
    else
        ctx.drawImage(headItemIMG, posX + headItemXOffset, posY, imgWidthPx, imgWidthPx); 
}

let frame = 0;
function startAnimationLoop(fps) {
    fpsInterval = 1000/fps;
    then = window.performance.now();
    startTime = then;
    animate();
}

function animate(newtime) {
    now = newtime;
    elapsed = now - then;

    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);

        frame++;

        if (currentOutfit != "" && currentHeadItem != "") { // after default items have been set
            // be gone, thot      (from the previous style)
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            UpdateStyle();
        }
    }
    
    // recursive loop
    requestAnimationFrame(animate);
}

startAnimationLoop(50);


// Exit Shop:
document.getElementById("exitShop").addEventListener("click", function() {
    styleOverlay.style.display = "none";
});

window.addEventListener('resize', function() {
    UpdateStyle();
});