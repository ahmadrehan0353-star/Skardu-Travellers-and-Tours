# Skardu Traveller and Tours — website

## Start here
1. Open **js/config.js** and replace the placeholders (phone, WhatsApp, email, address, hours).
   They update on every page at once. WhatsApp buttons start working as soon as a number is added.
2. Tour details: in **js/data.js**, replace `[DAYS]`, `[YOUR PRICE]` and `[EDIT INCLUSIONS]` for each tour.
3. Edit the booking/payment answer at the bottom of **contact.html**.

## Photos
The site uses free photos of Skardu and Baltistan from Unsplash (free for commercial use, see unsplash.com/license).
They load straight from Unsplash, so you need an internet connection to see them.
Some are general Skardu-region shots standing in for a specific place. To use your own photo,
put it in the **images** folder and change that place's `image:` in **js/data.js** to `"images/your-photo.jpg"`.

## Pages
index.html (home) · destinations.html · tours.html · seasons.html · plan.html · contact.html

## Putting it online
Upload the whole folder to any static host (Netlify, GitHub Pages, Hostinger, cPanel).
