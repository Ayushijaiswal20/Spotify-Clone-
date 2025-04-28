let currentsong= new Audio();
let songs=[]
let currfolder;
function convertSecondsToMinuteSecond(seconds) {
    // Ensure the input is a number and is non-negative
    if (typeof seconds !== 'number' || seconds < 0) {
        return '00:00';
    }

    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds =Math.floor(seconds % 60);

    // Format seconds to always be two digits
    const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    return `${minutes}:${formattedSeconds}`;
}
async function getsongs(folder){
    currfolder=folder;
let a=await fetch(`http://127.0.0.1:5500/spotifyclone/${folder}/`)
let response=await a.text()
// console.log(response)
let div=document.createElement("div")
div.innerHTML=response;
let as=div.getElementsByTagName("a")
// console.log(as)
 songs=[]
for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if(element.href.endsWith(".mp3")){
        songs.push(element.href.split(`/${folder}/`)[1])
    }
}
let songul=document.querySelector(".songlist").getElementsByTagName("ul")[0]
songul.innerHTML=" "
for (const song of songs) {
    songul.innerHTML=songul.innerHTML + `<li>
      
                                <img class="invert" src="music.svg" alt="Music">
                                   <div class="info">
                                
                               
                                 <div> ${song.replace("%20"," ")}</div>
                                   <div>Harry</div>
                                   </div>
                               
                                <div class="playnow">
                                    <span>Play Now</span>
                                <img class="invert" src="play.svg" alt="play"></div>
                           </li>`;
    
}

Array.from (document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click",element=>{
   
    playmusic( e.querySelector(".info").firstElementChild.innerHTML.trim())
})
})

 return songs
}
const playmusic=(track,pause=false)=>{
    currentsong.src=`/spotifyclone/${currfolder}/`+ track;
   // let audio=new Audio("/spotifyclone/songs/"+ track)
   if(!pause){
    currentsong.play()
    play.src="pause.svg"}
    
     document.querySelector(".songinfo").innerHTML=track;
      document.querySelector(".songtime").innerHTML="00:00/00:00";
      
}
async function displayalbums(){
    let a=await fetch(`http://127.0.0.1:5500/spotifyclone/songs/`)
let response=await a.text()
// console.log(response)
let div=document.createElement("div")
div.innerHTML=response;
let anchors=div.getElementsByTagName("a")
let folders=[]
let cardcontainer=document.querySelector(".cardcontainer")
let array=Array.from ( anchors)
    // console.log(e.href)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
    
    if(e.href.includes("/songs/")){
       let folder= e.href.split("/").slice(-2)[1]
       let a=await fetch(`http://127.0.0.1:5500/spotifyclone/songs/${folder}/info.json`)
       let response=await a.json()
    //    console.log(response)
       cardcontainer.innerHTML=cardcontainer.innerHTML+ ` <div data-folder="${folder}" class="card ">
                        <div  class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 16 16">
                                <!-- Round green background -->
                                <circle cx="8" cy="8" r="8" fill="green" />
                                <!-- Play icon -->
                                <path
                                    d="M10.804 8 5 4.633v6.734zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696z"
                                    fill="white" />
                            </svg>

                        </div>
                        <img src="/spotifyclone/songs/${folder}/cover.jpg" alt="Image">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`

                    
    }
}
Array.from (document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click",async item=>{
        // console.log(item.target,item.currentTarget.dataset.folder)
        songs=await getsongs(`songs/${ item.currentTarget.dataset.folder}`)
        playmusic(songs[0])
       
    })
})

}
async function main(){
   
    //Get the list of all songs
 await getsongs("songs/ncs")
playmusic(songs[0],true)
// console.log(songs)

//Display all the albums on the page
displayalbums()




// Attach an event listner to play,next and previous
play.addEventListener("click",()=>{
    if (currentsong.paused){
        currentsong.play();
        play.src="pause.svg"


    }
    else{
        currentsong.pause();
        play.src="play1.svg"
    }
})
//listen for time update event
currentsong.addEventListener("timeupdate",()=>{
    console.log(currentsong.currentTime,currentsong.duration)
    document.querySelector(".songtime").innerHTML=`${convertSecondsToMinuteSecond(currentsong.currentTime)}/${convertSecondsToMinuteSecond(currentsong.duration)}`
    document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100+"%"
    })

// Add an event listener to seekbar
document.querySelector(".seekbar").addEventListener("click",e=>{
     let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
    document.querySelector(".circle").style.left=percent +"%";
  currentsong.currentTime=((currentsong.duration)*percent)/100;
})
//Add an event listner for hamburger
document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left="0";
})
//Add an event listner for close button
document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-120%";
})
//Add an event listner to previous and next
previous.addEventListener("click",()=>{
    let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    if((index-1)>=0){
        playmusic(songs[index-1])
    }

})
//Add an event listner to previous and next
next.addEventListener("click",()=>{
    currentsong.pause()
    let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    if((index+1)<songs.length){
        playmusic(songs[index+1])
    }

})
// Add an event to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    // console.log(e,e.target.value)
currentsong.volume=parseInt(e.target.value)/100;
if (currentsong.volume>0){
    document.querySelector(".volume>img").src= document.querySelector(".volume>img").src.replace("mute.svg","volume.svg")
}
})

//add eve

document.querySelector(".volume>img").addEventListener("click",e=>{
    if(e.target.src.includes("volume.svg")){
        e.target.src=  e.target.src.replace("volume.svg","mute.svg")
        currentsong.volume=0;
        document.querySelector(".range").getElementsByTagName("input")[0].value=0
    }
    else{
        e.target.src=  e.target.src.replace("mute.svg","volume.svg")
        currentsong.volume=0.10;
        document.querySelector(".range").getElementsByTagName("input")[0].value=10
    }
})
}
main()