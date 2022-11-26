const darkModeToggle= document.querySelector("#dark-mode-toggle");
const isDarkMode=document.body.classList.contains("dark");
darkModeToggle.addEventListener("click",()=>{
    document.body.classList.toggle("dark");

localStorage.setItem("darmode",isDarkMode);
//change mobile status bar color
document.querySelector('meta[name="theme-color"').setAttribute("content",isDarkMode ? "#1a1a2e":"#fff");
});
// initial value

//screens
const start_screen=document.querySelector("#start-screen");
const game_screen=document.querySelector("#game-screen");
const pause_screen=document.querySelector("#pause-screen");

//elements
const cells = document.querySelectorAll('.main-grid-cell');
const name_input=document.querySelector("#input-name");
const player_name=document.querySelector("#player-name");
const game_level=document.querySelector("#game-level");
const game_time=document.querySelector("#game-time");
const number_inputs =document.querySelector(".number");


//seviye seçimi yapımı
let level_index=0;//leveli değiştirebileceğimizden let tanımladık.
let level=CONSTANT.LEVEL[level_index];

let timer=null;
let pause=false;
let  seconds=0;

let sd =undefined;//cell und
let sd_answer=undefined;
// *********

const getGameInfo=()=>JSON.parse(localStorage.getItem("game"));


//9 hücre için başlangıç


//******************
 
const setPlayerName=(name) =>localStorage.setItem("player_name",name);
const getPlayerName=() =>localStorage.getItem("player_name");

const showTime=(secons)=>new Date(seconds*1000).toISOString().substr(11,8);


const clearSudoku = ()=>{
    for(let i=0;i<Math.pow(CONSTANT.GRID_SIZE, 2);i++){
         cells[i].innerHTML='';
        cells[i].classList.remove("filled");
        cells[i].classList.remove("selected"); 
       }  
}

const initsudoku=()=>{
    //yeni oyuna başlamadan eski oyunu temizlemek gerekiyor..
    clearSudoku();
    //sudokuyu burada tanımladık...
   sd=sudokuGeneration(level);
   sd_answer=[...sd.question];//dönen değeri aldık

   console.table(sd_answer);
   seconds=0;
   startGame();
   //sudokuda göster
   for(let i=0;i<Math.pow(CONSTANT.GRID_SIZE,2);i++){
    let row=Math.floor(i /CONSTANT.GRID_SIZE);
    let col =i%CONSTANT.GRID_SIZE;

    cells[i].setAttribute("data-value",sd.question[row][col]);

    if(sd.question[row][col] !==0){
        cells[i].classList.add('filled');
        cells[i].innerHTML=sd.question[row][col];
    }
   }
}

const removeErr = () => cells.forEach(e => e.classList.remove('err'));

const saveGameInfo = () => {
    let game = {
        level: level_index,
        seconds: seconds,
        sd: {
            original: sd.original,
            question: sd.question,
            answer: sd_answer
        }
    }
    localStorage.setItem('game', JSON.stringify(game));
}


const startGame =()=>{
    start_screen.classList.remove("active");
    game_screen.classList.add("active");
  
    player_name.innerHTML=name_input.value.trim();
    player_name.classList.add("capitilize");
    setPlayerName(player_name);

    game_level.innerHTML=CONSTANT.LEVEL_NAME[level_index];

    seconds=0;
    showTime(seconds);

    timer=setInterval(() => {
     if(!pause){
        seconds=seconds+1;
        game_time.innerHTML=showTime(seconds);
     }
    },1000);
}

const initCellsEvent = () => {
    cells.forEach((e, index) => {
        e.addEventListener('click', () => {
            if (!e.classList.contains('filled')) {
                cells.forEach(e => e.classList.remove('selected'));

                selected_cell = index;
                e.classList.remove('err');
                e.classList.add('selected');
            
            }
        })
    })
}

const turnStartScreen=()=>{
    clearInterval(timer);
    pause=false
    seconds=0;
    start_screen.classList.add("active");
    game_screen.classList.remove("active");
    pause_screen.classList.remove("active");
}
//button event
document.querySelector("#btn-level").addEventListener("click",(e)=>{
    level_index=level_index+1 > CONSTANT.LEVEL.length -1 ? 0: level_index+1;//başa dönmesi için
    level=CONSTANT.LEVEL[level_index];
    e.target.innerHTML=CONSTANT.LEVEL_NAME[level_index];//level name seötiğimiz indexe eşit olacak.     
});

document.querySelector("#btn-play").addEventListener("click",()=>{
    if(name_input.value.trim().length > 0){
      alert("oyun başladı.");
      initsudoku();
      startGame();
    }else{
        name_input.classList.add("input-err");
        
        setTimeout(()=>{
       name_input.classList.remove("input-err");
       name_input.focus();
        },500);
    }
});

document.querySelector("#btn-pause").addEventListener("click",()=>{
pause_screen.classList.add("active");
pause=true;    
});
document.querySelector("#btn-resume").addEventListener("click",()=>{
pause_screen.classList.remove("active");
pause=false;    
});
document.querySelector("#btn-new-game").addEventListener("click",()=>{
turnStartScreen();  
});

//***********


const init = ()=>{
    const darkmode=JSON.parse(localStorage.getItem("darkmode"));
    document.body.classList.add(darkmode ? "dark" : "ligth");
    document.querySelector('meta[name="theme-color"').setAttribute("content",isDarkMode ? "#1a1a2e":"#fff");
   
    const game =getGameInfo(); 
   
    document.querySelector("#btn-continue").style.display = game ? "grid" : "none" ;//burada tekrar bak devam görünmemesi gereiyor.
   
   initGameGrid();
   initCellsEvent();
//   if(getPlayerName()){
//     name_input.value=getPlayerName();
//   }else{
//      name_input.focus();
//   }

}
init();