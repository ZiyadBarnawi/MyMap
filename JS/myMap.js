"use strict"
/////////////////////this function must be first so the localStorage code would work for the id///////////////////////////


const getIdFromLocalStorage=function(){
    return localStorage.getItem("id")
}


/////////////////////Variables///////////////////////////
let typeInput=document.querySelector(".type-input")
let distanceinput=document.querySelector(".distance-input")
let durationInput=document.querySelector(".duration-input")
let candeceInput=document.querySelector(".candece-input")
let elevGainInput=document.querySelector(".elev-gain-input")
let mapDiv=document.querySelector(".map")
let form=document.querySelector(".form");
let map,mapEvent;
let candeceDiv=document.querySelector(".candece-div")
let elevGainDiv=document.querySelector(".elev-gain-div")
let date =new Date();
let verticalContainer=document.querySelector(".vertical-container")
let id
if (localStorage.getItem("id")===null)
     id=0
else
     id=getIdFromLocalStorage()
let clickedEntry;
let latitude,longitude;
let mapZoomLvl=13
/////////////////////functions///////////////////////////
const hideExpandedBox=function(box,icon){
        box.classList.remove("expanded")
        box.classList.add("unexpanded")
        icon.classList.toggle("icon-upsideDown")
        box.querySelector("span")?.classList.toggle("hidden-span")
        box.querySelector("span")?.classList.toggle("unhidden-span")
}
const unhideExpandedBox=function(box,icon){
    box.classList.add("expanded")
    box.classList.remove("unexpanded")
    icon.classList.toggle("icon-upsideDown")

    box.querySelector("span")?.classList.toggle("unhidden-span")
    box.querySelector("span")?.classList.toggle("hidden-span")
}

const calcPace=function(duration,distance){
    return Math.round( duration/distance)
}

const calcSpeed=function(distance,duration){

    return Math.round( distance/duration)
}

const goToWorkoutEventListner=function(e){
    // let entries= verticalContainer.querySelectorAll(".entry")
    // for (let entry of entries){
    //         entry.addEventListener("click",function(e){
                if(e.target.tagName==="DIV"){
                    clickedEntry=e.target
                    goToWorkout(clickedEntry)
                    return clickedEntry
                    
                }
                else{
                    clickedEntry=e.target.closest("div")
                    
                    goToWorkout(clickedEntry)
                    return clickedEntry
                }
            // })

            
}

const goToWorkout=function(entry){
    map.setView([entry.dataset.lat,entry.dataset.lng],mapZoomLvl,{animate:true,pan:{duration:1}})
}
    
const setLocalStorage=function(entry){
        localStorage.setItem(`workout ${entry.dataset.id}`,entry.outerHTML)
}
const getLocalStorage=function(){
    let entries=[]
    for (let i =0;i<localStorage.length;i++){
        if(localStorage.key(i).split(" ")[0]==="workout"){
            entries.push(localStorage.getItem(localStorage.key(i)))
        }

    }
    return entries
}
const setIdToLocalStorage=function(){
    localStorage.setItem("id",id+"")
}
const addEntriesFromLocalStorage=function(){
    for(let entry of getLocalStorage()){

        verticalContainer.insertAdjacentHTML("beforeend",entry)
    }
}
/////////////////////map code///////////////////////////

navigator.geolocation.getCurrentPosition(function(position){
     latitude=position.coords.latitude
     longitude=position.coords.longitude
    let coords=[latitude,longitude]
    map = L.map('map').setView(coords, mapZoomLvl);

    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    

    map.on("click",function(mapE){
        mapEvent=mapE
        form.classList.toggle("hide")
        form.classList.toggle("unhide")
        distanceinput.focus()
        
    })
        let entriesStrings=getLocalStorage()
        let parser = new DOMParser();
        
        for(let entry of entriesStrings){
            let doc=parser.parseFromString(entry,"text/html");
            let restoredElement = doc.body.firstElementChild;
            if(restoredElement.classList.contains("running-entry")){
        
        
                console.log(restoredElement.dataset.date,restoredElement.dataset.lat,restoredElement.dataset.lng,restoredElement.dataset.id,restoredElement.dataset.candece)
        
        
                L.marker([Number(restoredElement.dataset.lat),Number(restoredElement.dataset.lng)],{riseOnHover:true}).addTo(map)
                    .bindPopup(L.popup([restoredElement.dataset.lat,restoredElement.dataset.lng],{content: `<p  style="color:black; font-size: 18px;"> running in ${restoredElement.dataset.date}<p/>`,maxWidth:250,minWidth:100,autoClose:false,closeOnClick:false,className:"running-popup"}))
                    .openPopup();}
            else
                {
                L.marker([restoredElement.dataset.lat,restoredElement.dataset.lng],{riseOnHover:true}).addTo(map)
                    .bindPopup(L.popup([restoredElement.dataset.lat,restoredElement.dataset.lng],{content: `<p  style="color:black; font-size: 18px;"> cycling in ${restoredElement.dataset.date}<p/>`,maxWidth:250,minWidth:100,autoClose:false,closeOnClick:false,className:"cycling-popup"}))
                    .openPopup();}
            
        }
},function(){
    alert("could not get your current location")
})



// /////////////////////code///////////////////////////
typeInput.addEventListener("change",function(e){
    if (typeInput.value==="cycling")
        {
    elevGainDiv.style.display="block"
    candeceDiv.style.display="none"}
    else{
    elevGainDiv.style.display="none"
    candeceDiv.style.display="block"
    }
})

form.addEventListener("submit",function(e){
    e.preventDefault()
    let {lat,lng}=mapEvent.latlng;

    if(Number(durationInput.value)<0||isNaN(Number(durationInput.value)) ){
                durationInput.focus()
        alert("Inaccuraet duration value")
        return
    }
    
    else if(Number(distanceinput.value)<0||isNaN( Number(distanceinput.value))){
        distanceinput.focus()
        alert("Inaccurate distance value")
        return
    }
    else if(durationInput.value===""){
        durationInput.focus()
        alert("Duration can't be empty")
        return
    }
    else if(distanceinput.value===""){
        distanceinput.focus()
        alert("Distance can't be empty")
        return

    }

    if(typeInput.value==="running"){
        if(Number(candeceInput.value)<0){
            alert("Cadence can't be negative")
            candeceInput.focus()
            return
        }



        L.marker([lat,lng],{riseOnHover:true}).addTo(map)
        .bindPopup(L.popup([lat,lng],{content: `<p  style="color:black; font-size: 18px;"> running in ${date.getDate()} of ${date.toLocaleString('default', { month: 'long' })}<p/>`,maxWidth:250,minWidth:100,autoClose:false,closeOnClick:false,className:"running-popup"}))
        .openPopup();
        verticalContainer.insertAdjacentHTML("beforeend",`<div data-date="${date.getDate()} of ${date.toLocaleString('default', { month: 'long' })}" data-lat="${mapEvent.latlng.lat}" data-lng="${mapEvent.latlng.lng}" data-candece="${candeceInput.value}" data-id="${id}" class="entry running-entry unexpanded">
                <p>Running at ${calcPace(Number(durationInput.value),Number(distanceinput.value))} m/min for ${durationInput.value}  minutes 🏃‍➡️ <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><polyline points="208 96 128 176 48 96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg> <span class="hidden-span"> Candece: ${candeceInput.value} </span> </p>
            </div>`)
            id++ 
            setIdToLocalStorage()     
    }
    else
    {
        L.marker([lat,lng],{riseOnHover:true}).addTo(map)
        .bindPopup(L.popup([lat,lng],{content: `<p  style="color:black; font-size: 18px;"> cycling in ${date.getDate()} of ${date.toLocaleString('default', { month: 'long' })}<p/>`,maxWidth:250,minWidth:100,autoClose:false,closeOnClick:false,className:"cycling-popup"}))
        .openPopup();
        verticalContainer.insertAdjacentHTML("beforeend",`<div data-date="${date.getDate()} of ${date.toLocaleString('default', { month: 'long' })}" data-lat="${mapEvent.latlng.lat}" data-lng="${mapEvent.latlng.lng}" data-elev-gain="${elevGainInput.value}" data-id="${id}" class="entry cycling-entry unexpanded">
                <p>Cycling at ${calcSpeed(Number(distanceinput.value),Number(durationInput.value))} m/min for ${durationInput.value} minutes 🚴 <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><polyline points="208 96 128 176 48 96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg> <span class="hidden-span"> Elevation gain: ${elevGainInput.value} </span> </p>
            </div>`)
            id++
            setIdToLocalStorage()
    }
        distanceinput.value=""
        durationInput.value=""
        candeceInput.value=""
        elevGainInput.value=""
        form.classList.toggle("hide")
        form.classList.toggle("unhide")
    
        let icons=document.querySelectorAll(".icon")
        for(let icon of icons){
            icon.addEventListener("click",function(e){
                let box=e.target.closest("div")

                if(box.classList.contains("expanded")){
                    hideExpandedBox(box,icon)
                    return   
                }
                
                if (box.classList.contains("running-entry")){

                    
                    unhideExpandedBox(box,icon)

                }
                if (box.classList.contains("cycling-entry")){
                    unhideExpandedBox(box,icon)
                }
            })
        }



        

        let entries=document.querySelectorAll(".entry")

        for(let entry of entries){

             entry.addEventListener("click",function(e){
                 goToWorkoutEventListner(e)
             })
        }



        for(let entry of entries){
            setLocalStorage(entry);
        }


        })
    
    
        

addEntriesFromLocalStorage()

