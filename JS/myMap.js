"use strict"

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
let id=0
/////////////////////functions///////////////////////////

const calcPace=function(duration,distance){
    return Math.ceil( duration/distance)
}

const calcSpeed=function(distance,duration){

    return Math.ceil( distance/duration)
}
/////////////////////map code///////////////////////////

navigator.geolocation.getCurrentPosition(function(position){
    let latitude=position.coords.latitude
    let longitude=position.coords.longitude
    let coords=[latitude,longitude]
    map = L.map('map').setView(coords, 13);

    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    

    map.on("click",function(mapE){
        mapEvent=mapE

        form.classList.toggle("hide")
        form.classList.toggle("unhide")
        distanceinput.focus()
        
        })
    },function(){
    alert("could not get your current location")
})



/////////////////////code///////////////////////////


form.addEventListener("submit",function(e){
    e.preventDefault()
    let {lat,lng}=mapEvent.latlng;

    if(Number(durationInput.value)<0||isNaN(Number(durationInput.value)) ){

        alert("Inaccuraet duration value")
        return
    }
    
    else if(Number(distanceinput.value)<0||isNaN( Number(distanceinput.value))){

        alert("Inaccurate distance value")
        return
    }
    else if(durationInput.value===""){
        alert("Duration can't be empty")
        return
    }
    else if(distanceinput.value===""){
        alert("Distance can't be empty")
        return

    }

    if(typeInput.value==="running"){
        if(Number(candeceInput.value)<0){
            alert("Cadence can't be negative")
            return
        }
        L.marker([lat,lng],{riseOnHover:true}).addTo(map)
        .bindPopup(L.popup([lat,lng],{content: `<p  style="color:black; font-size: 18px;"> running in ${date.getDate()} of ${date.toLocaleString('default', { month: 'long' })}<p/>`,maxWidth:250,minWidth:100,autoClose:false,closeOnClick:false,className:"running-popup"}))
        .openPopup();
        verticalContainer.insertAdjacentHTML("beforeend",`<div data-candece="${candeceInput.value}" data-id="${id}" class="entry running-entry unexpanded">
                <p>Running at ${calcPace(Number(durationInput.value),Number(distanceinput.value))} m/min for ${durationInput.value}  minutes 🏃‍➡️ <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><polyline points="208 96 128 176 48 96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg> </p>
            </div>`)
            id++



            

                
    }
    else
    {
        L.marker([lat,lng],{riseOnHover:true}).addTo(map)
        .bindPopup(L.popup([lat,lng],{content: `<p  style="color:black; font-size: 18px;"> cycling in ${date.getDate()} of ${date.toLocaleString('default', { month: 'long' })}<p/>`,maxWidth:250,minWidth:100,autoClose:false,closeOnClick:false,className:"cycling-popup"}))
        .openPopup();
        verticalContainer.insertAdjacentHTML("beforeend",`<div data-elev-gain="${elevGainInput.value}" data-id="${id}" class="entry cycling-entry unexpanded">
                <p>Cycling at ${calcSpeed(Number(distanceinput.value),Number(durationInput.value))} for ${durationInput.value} minutes <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><polyline points="208 96 128 176 48 96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg> 🚴</p>
            </div>`)
            id++
    }
    // L.marker([lat,lng],{riseOnHover:true}).addTo(map)
    //     .bindPopup(L.popup([lat,lng],{content: '<p style="color:black;">Workout<p/>',maxWidth:250,minWidth:100,autoClose:false,closeOnClick:false,className:"running-popup"}))
    //     .openPopup();

        distanceinput.value=""
        durationInput.value=""
        candeceInput.value=""
        elevGainInput.value=""
        form.classList.toggle("hide")
        form.classList.toggle("unhide")


        let icon=document.querySelectorAll(".icon")
            icon[icon.length-1].addEventListener("click",function(e){

                console.log("in the icon event handeller")
                let box;
                box=e.target.closest("div")
                
               let icon1=e.target

                if(box.classList.contains("expanded")){
                    box.classList.remove("expanded")
                    box.classList.add("unexpanded")
                    icon1.classList.toggle("icon-upsideDown")
                    box.querySelector("span").remove()
                    return   
                }
                
                if (box.classList.contains("running-entry")){
                    box.insertAdjacentHTML("beforeend",`<span> Candece: ${document.querySelector(`[data-id="${box.dataset.id}"]`).dataset.candece} </span>`)
                    box.classList.add("expanded")
                    box.classList.remove("unexpanded")
                    icon1.classList.toggle("icon-upsideDown")
                }
                if (box.classList.contains("cycling-entry")){
                    box.insertAdjacentHTML("beforeend",`<span> Elevation gain: ${document.querySelector(`[data-id="${box.dataset.id}"]`).dataset.elevGain} </span>`)
                    box.classList.add("expanded")
                    box.classList.remove("unexpanded")
                    icon1.classList.toggle("icon-upsideDown")
                }
                isThereAWorkout=true
            })

})


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

    verticalContainer.addEventListener("click",function(e){
    let box=e.target
    let icon=e.target.querySelector(".icon")

    if(box.classList.contains("expanded")){
        box.classList.remove("expanded")
        box.classList.add("unexpanded")
        icon.classList.toggle("icon-upsideDown")
        box.querySelector("span").remove()
        return   
    }
    
    if (box.classList.contains("running-entry")){
        box.insertAdjacentHTML("beforeend",`<span> Candece: ${document.querySelector(`[data-id="${box.dataset.id}"]`).dataset.candece} </span>`)
        box.classList.add("expanded")
        box.classList.remove("unexpanded")
        icon.classList.toggle("icon-upsideDown")
    }
    if (box.classList.contains("cycling-entry")){
        box.insertAdjacentHTML("beforeend",`<span> Elevation gain: ${document.querySelector(`[data-id="${box.dataset.id}"]`).dataset.elevGain} </span>`)
        box.classList.add("expanded")
        box.classList.remove("unexpanded")
        icon.classList.toggle("icon-upsideDown")
    }
    })


