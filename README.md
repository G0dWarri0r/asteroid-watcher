# ☄️ Asteroid Watcher

Browse the asteroids flying past Earth on any date, one at a time, and watch each one orbit on a live mini-map.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Open%20Site-orange?style=for-the-badge)]()

![Screenshot](screenshot.png)

## What it does

- **Flip through asteroids** with previous / next buttons, one card per asteroid.
- **Pick any date** with a calendar and see what passed Earth that day.
- **Hazard badge** shows whether NASA flags the asteroid as potentially hazardous.
- **Orbit view** puts Earth in the middle with the Moon and the asteroid circling it.
  - The asteroid's distance from Earth matches how close it really passes, measured in Moon distances.
  - The asteroid's orbit speed depends on its real speed, so faster asteroids spin faster.

## Built with

- HTML, CSS and vanilla JavaScript
- [Tailwind CSS](https://tailwindcss.com/) (via CDN) for styling
- [NASA NeoWs API](https://api.nasa.gov/) (Near Earth Object Web Service) for the data

## How the code works

### 1. Fetching the data

`loadAsteroids(day)` calls NASA's feed endpoint for one date using `fetch` with `async/await`. NASA returns the asteroids under a date key, so the code reads `near_earth_objects[day]`.

### 2. Cleaning up the response

NASA's response is deeply nested and sends numbers as strings. The `cleanUp()` function flattens each asteroid into a small object (name, hazard flag, size, speed, miss distance) and converts the numbers with `Number()`. It is applied to the whole list with `.map()`, so the rest of the app only ever works with tidy data.

### 3. Showing a card

`showAsteroid()` fills the card by writing into elements with `textContent`, and picks the badge colour based on the hazard flag. Prev / next just change which asteroid in the list is shown.

### 4. The orbit view

Each orbiting object sits inside an invisible zero-size wrapper placed at Earth's centre. The wrapper is rotated with a CSS `@keyframes` animation, and the object inside is offset from the centre, so it travels in a circle.

- `toPixels()` turns a distance in Moon units into pixels using a square-root scale. This keeps far-away asteroids on the card and close ones from sitting on top of Earth, so the order of distances is right but the spacing is compressed.
- The Moon goes through the same function (at 1 Moon distance), so it works as a reference ring.
- The asteroid's lap time is set from JavaScript with `style.animationDuration`, based on its speed.

### 5. Date picker and edge cases

The date input uses a `change` event to fetch a new day. A few safeguards keep it stable:

- Dates before 1900 are ignored, so typing a year quickly doesn't send requests for years like `0002`.
- A request counter makes sure only the latest request can update the card, so slow, outdated responses are thrown away.
- Optional chaining (`?.`) and an empty-list check show a friendly message when NASA returns nothing for a date.


## Possible next steps

- Compare two asteroids side by side
- Save favourite asteroids

## Credits

Data from [NASA Open APIs](https://api.nasa.gov/).