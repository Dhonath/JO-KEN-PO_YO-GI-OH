const state =
{
score:
{
playerScore: 0,
computerScore: 0,
scoreBox: document.getElementById("score_points"),
},
cardSprite:{
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
},

fieldCards: 
{
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
},
actions:
{
    button: document.getElementById("next-duel"),
},

};

const playerSides = 
{
    playe1: "player-cards",
    computer: "computer-cards"
}

const pathImages = "./src/assets/icons/";

const carddata = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        winOf:[1],
        loseOf:[2],

    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        winOf:[2],
        loseOf:[0],

    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        winOf:[0],
        loseOf:[1],

    },

];

async function getRandomCardId()
{
    const randomIndex = Math.floor(Math.random() * carddata.length);
    return carddata[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide)
{
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");


    if(fieldSide === playerSides.playe1)
    {
        

        cardImage.addEventListener("mouseover", () =>{
            drawSelectCard(IdCard);
        });

        cardImage.addEventListener("click", () => {
            setCardField(cardImage.getAttribute("data-id"));
        });
        
    }
    
    

    return cardImage;
}

async function setCardField(cardId)
{
    await removeallCardsImag();


    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    state.fieldCards.player.src = carddata[cardId].img;
    state.fieldCards.computer.src = carddata[computerCardId].img;


    state.cardSprite.name.innerText = "";
    state.cardSprite.type.innerText = "";



    let duelResult = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResult);
}


async function updateScore()
{
    state.score.scoreBox.innerText = `Win : ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function drawButton(text)
{
state.actions.button.innerText = text;
state.actions.button.style.display = "block";
}

async function checkDuelResults(playerCardId, computerCardId)
{
    let duelResults = "draw";
    let playerCard = carddata[playerCardId];

    if(playerCard.winOf.includes(computerCardId))
    {
        duelResults = "Ganhou";
        await PlayAudio("win");
        state.score.playerScore++;
    }

    if(playerCard.loseOf.includes(computerCardId))
    {
        duelResults = "Perdeu";
        await PlayAudio("lose");
        state.score.computerScore++;
    }

    return duelResults;
}

async function drawCars(cardNumbers, fieldSide)
{
    for(let i = 0; i <cardNumbers; i++)
    {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);


        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function removeallCardsImag()
{
    let cards = document.querySelector("#computer-cards");
    let imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

     cards = document.querySelector("#player-cards");
     imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function drawSelectCard(index)
{
    state.cardSprite.avatar.src = carddata[index].img;
    state.cardSprite.name.innerText = carddata[index].name;
    state.cardSprite.type.innerText = "Attibute : " + carddata[index].type;
}


async function resetDuel()
{
    state.cardSprite.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

async function PlayAudio(status)
{
const audio = new Audio(`./src/assets/audios/${status}.wav`);
audio.play();
}
function init()
{
drawCars(5, playerSides.playe1);
drawCars(5, playerSides.computer);

const bgm = document.getElementById("bgm");
bgm.play();
}
init();