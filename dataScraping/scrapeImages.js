// const puppeteer= require('puppeteer'); //to be able to use xpath to datascrape
// const fs= require('fs'); //to write data into json file 
// const db= require('../models');
// process.setMaxListeners(0);
// // let hikeNames= [];
// // //get hike names 
// // db.hike.findAll()
// // .then(foundHikes => {
// //     for(let hike of foundHikes){
// //         //console.log(hike.title);
// //         hikeNames.push(hike.title);
// //         //console.log(hike.id);
// //         fs.writeFileSync('./imageData.json', JSON.stringify(hikeNames));
// //     }
// //     //console.log(foundHikes.length);
// // })

// //grab names from JSON file and change them to have - instead of spaces 
// let hikeNames= fs.readFileSync('./imageData.json');
// hikeNames= JSON.parse(hikeNames);
// let newNames= [];

// for(let name of hikeNames){
    name = name.toLowerCase();
    name = name.replace(/-/g, '');
    name = name.replace(/\(/g, '');
    name = name.replace(/\)/g, '');
    name = name.replace(/:/g, '');
    name = name.replace(/ /g, '-');
//     // for(let i= 0; i<name.length; i++){
//     //     if(name[i]== ' '){
//     //         console.log('a space', name[i]);
//     //        name[i]= '-';
//     //     }
//     // }
//     newNames.push(name);
// }

// //console.log(hikeNames);
// console.log(newNames);

// let newUrls = [];

// async function scrapeProduct(url) {
//     try {
//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();
//         await page.setDefaultNavigationTimeout(0); //get rid of timeout error
//         await page.goto(url);
    
 
//             const [el] = await page.$x(`//*[@id="hike-carousel"]/div/div/img`); //path comes from inspect tool --> copy --> copy xpath
//             const src = await el.getProperty('src');
//             const imgUrl = await src.jsonValue();
//             newUrls.push(imgUrl);
          
//         fs.writeFileSync('./imgurlData.json', JSON.stringify(newUrls));
        
//         browser.close();
//     } catch(err) {
//         console.log('error', err);
//     }
// }

// function getUrl(names){
//     for(let name of names){
//         scrapeProduct(`https://www.wta.org/go-hiking/hikes/${name}`);
//     }
// }

// getUrl(newNames);


// //create new table with hike title, bigger image url, and hikeId