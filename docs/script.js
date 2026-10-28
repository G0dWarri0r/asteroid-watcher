const API_KEY = "N7tHcc8ngm8dCqkMkN89hzRpzRBPq8HdJBHHBj8k"; // i know it's here, just don't do some funny business with it
const inputDay = document.querySelector('#date');
const count = document.querySelector('#count');
const inputError = document.querySelector('#input-error');
document.getElementById("moon").style.left = toPixels(1) + "px";

inputDay.value = "2010-09-03";
loadAstroide(inputDay.value);
inputDay.addEventListener('change', (e) => {
    const date = e.target.value;
    if (!date || date < "1900-01-01") return;
    loadAstroide(date)
});

function selectDate(date) {
    return date;
}

function changeAstroid(astroids, max) {
    let index = 0
    showAstroide(astroids[0], index, max);
    const prevBtn = document.querySelector('#prev');
    const nextBtn = document.querySelector('#next');
    prevBtn.addEventListener('click', (e) => {
        if (e.target) {
            index--;
            if (index < 0) {
                index = 0;
            }
            showAstroide(astroids[index], index, max);
        }
    });
    nextBtn.addEventListener('click', (e) => {
        if (e.target) {
            index++;
            if (index >= max) {
                index = max;
            }
            showAstroide(astroids[index], index, max);
        }
    });
}

function toPixels(moons) {
    return Math.min(20 + Math.sqrt(moons) * 10, 150);
}

function showAstroide(astroid, index, max) {
    document.getElementById("name").textContent = astroid.name;
    document.getElementById("size").textContent = astroid.sizeMeter;
    document.getElementById("speed").textContent = astroid.speedKms;
    document.getElementById("miss").textContent = astroid.missMoons;
    count.textContent = `(${index + 1}/${max + 1})`

    const badge = document.querySelector('#badge');
    if (astroid.hazardous) {
        badge.textContent = "Hazardous";
        badge.classList.add("text-red-500");
        badge.classList.remove("text-green-500")
    }
    else {
        badge.textContent = "No potential danger";
        badge.classList.add("text-green-500");
        badge.classList.remove("text-red-500");

    }
    const distance = toPixels(astroid.missMoons);
    const dot = document.querySelector('#dot')
    dot.style.left = distance + "px";
    dot.style.width = `${Math.min(Math.sqrt(astroid.sizeMeter), 20)}px`;
    dot.style.height = `${Math.min(Math.sqrt(astroid.sizeMeter), 20)}px`;
    document.querySelector('.asteroid-orbit').style.animationDuration = `${astroid.speedKms}s`
}

function cleanUp(astroid) {
    const approach = astroid.close_approach_data[0];
    return {
        name: astroid.name,
        hazardous: astroid.is_potentially_hazardous_asteroid,
        sizeMeter: Number(astroid.estimated_diameter.meters.estimated_diameter_max).toFixed(1),
        speedKms: Number(approach.relative_velocity.kilometers_per_second).toFixed(1),
        missKm: Number(approach.miss_distance.kilometers).toFixed(1),
        missMoons: Number(approach.miss_distance.lunar).toFixed(1)
    };
}

function noAstro() {
    inputError.textContent = "No astro found or data exceeds limit";
}

async function loadAstroide(date) {
    const URL = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${API_KEY}`;
    const response = await fetch(URL);
    if (!response.ok) {
        throw new Error("Could not reach the server")
    }
    const data = await response.json();
    const astroides = data.near_earth_objects[`${date}`]?.map(cleanUp);
    if (!astroides) {
        noAstro();
        return;
    }
    else{inputError.textContent = "";}
    changeAstroid(astroides, astroides.length - 1);
}
