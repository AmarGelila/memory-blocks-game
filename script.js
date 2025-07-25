const images = 
[
    {
        src: "media/image (1).png",
        alt: "" 
    },
    {
        src: "media/image (2).png",
        alt: "" 
    },
    {
        src: "media/image (3).png",
        alt: "" 
    },
    {
        src: "media/image (4).png",
        alt: "" 
    },
    {
        src: "media/image (5).png",
        alt: "" 
    },
    {
        src: "media/image (6).png",
        alt: "" 
    },
    {
        src: "media/image (7).png",
        alt: "" 
    },
    {
        src: "media/image (8).png",
        alt: "" 
    },
    {
        src: "media/image (9).png",
        alt: "" 
    },
    {
        src: "media/image (10).png",
        alt: "" 
    },
    {
        src: "media/image (11).png",
        alt: "" 
    },
    {
        src: "media/image (12).png",
        alt: "" 
    },
    {
        src: "media/image (13).png",
        alt: "" 
    },
    {
        src: "media/image (14).png",
        alt: "" 
    },
    {
        src: "media/image (15).png",
        alt: "" 
    },
]

let players = JSON.parse( localStorage.getItem("Players High Scores") ) || [];
const states = document.querySelector(".states table");
let uniqueImageEles = new Set();
const header = document.querySelector("header");
const board = document.querySelector("main .container");
const interface = document.querySelector(".interface");
const start = document.querySelector(".interface button");
let firstPair = undefined;
let secondPair = undefined;
const trueSound = new Audio("./audio/true.mp3");
const nameEle = document.querySelector(".name span");
const wrongTriesEle = document.querySelector(".tries span");
let wrongTries = 0;
let score = 0;
let playerName;

updatePlayerStates();

start.addEventListener("click" , () => {
    playerName = window.prompt("Enter your name:");
    nameEle.textContent = playerName;
    header.style.display = 'block';
    interface.style.display = "none";
    showBoard();
});

board.addEventListener( "click" , (e) => {
    if ( e.target.classList.contains("image") === true && e.target.classList.contains("show") === false && secondPair === undefined )
    {
        let image = e.target;
        image.classList.add("show");
        if ( firstPair === undefined ) firstPair = image;
        else
        {
            secondPair = image;
            if ( firstPair.children[1].getAttribute("src") !== secondPair.children[1].getAttribute("src") )
            {
                wrongTriesEle.textContent = ++wrongTries;
                setTimeout( () => {
                    firstPair.classList.remove("show");
                    secondPair.classList.remove("show");
                } , 1000 );
            }
            else
            {
                score++;
                trueSound.play();
                checkEnd();
            }

            setTimeout( () => {
                firstPair = undefined;
                secondPair = undefined;
            }, 1000 );
        }
    }
});

function showBoard(){
    structBoard();
    const imagesEles = document.querySelectorAll(".image");
    fillBoard(imagesEles);
}

function structBoard(){
    for ( let i = 1 ; i <= images.length * 2 ; i++ ){
        const image = document.createElement("div");
        image.className = "image";
        const back = document.createElement("img");
        back.className = "back";
        const front = document.createElement("img");
        front.src = "media/hidden.svg";
        front.className = "front";
        image.append(front , back);
        board.append(image);
    }
}

function fillBoard(imagesEles)
{
    for ( let i = 0 ; i < images.length ; i++ )
    {
        let randomEle1 = getRandomImageEle();
        let randomEle2 = getRandomImageEle();
        imagesEles[randomEle1].children[1].src = images[i].src;
        imagesEles[randomEle1].children[1].alt = images[i].alt;        
        imagesEles[randomEle2].children[1].src = images[i].src;
        imagesEles[randomEle2].children[1].alt = images[i].alt;
    }
}

function checkEnd()
{
    if ( score === images.length )
    {   
        let found = false;
        players.forEach( ele => {
            if ( ele.Name === playerName )
            {
                found = true;
                if ( ele.highScore > wrongTries )
                {
                    ele.highScore = wrongTries;
                    localStorage.setItem("Players High Scores" , JSON.stringify(players));
                }
            }
        });

        if ( found === false )
        {
            let player = { Name: playerName , highScore: wrongTries };
            players.push(player);
            localStorage.setItem("Players High Scores" , JSON.stringify(players));
        }

        updatePlayerStates();
        setTimeout( () => reset() , 3000 ); 
    }
}

function reset()
{
    score = 0;
    wrongTries = 0;
    uniqueImageEles.clear();
    interface.style.display = "flex";
    Array.from(board.children).forEach( ele => {
        ele.remove();
    });
    header.style.display = 'none';
    updatePlayerStates();
}

function updatePlayerStates()
{
    states.innerHTML = `<thead>
                            <th>Player</th>
                            <th>Best Score</th>
                        </thead>`;

    players.forEach( p => {
       states.innerHTML += `<tr>
                                <td>${p.Name}</td>
                                <td>${p.highScore}</td>
                            </tr>`; 
    });             
}

function getRandomImageEle()
{
    let random = Math.floor( Math.random() * images.length * 2 );
    if ( uniqueImageEles.has(random) === false ) 
    {
        uniqueImageEles.add(random);
        return random;
    }
    else return getRandomImageEle();
}