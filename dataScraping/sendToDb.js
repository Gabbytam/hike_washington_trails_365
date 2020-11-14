//this file is used to grab the json hike data and put it in the database
const db= require('./models');
const fs= require('fs');

let hikes= fs.readFileSync('./hikeData.json');
hikes= JSON.parse(hikes);

console.log(hikes.length);
for(let i = 0; i < hikes.length; i++){
    let title= hikes[i].title;
    let region= hikes[i].region;
    let distance= hikes[i].dist;
    let height= hikes[i].height;
    let imgUrl= hikes[i].imgUrl;
    let summary= hikes[i].summary;
    // console.log(title);
    // console.log(region);
    // console.log(distance);
    // console.log(height);
    // console.log(imgUrl);
    // console.log(summary);
    db.hike.findOrCreate({
        where: {title: title},
        defaults: {region: region,
            imgUrl: imgUrl,
            height: height,
            distance: distance,
            description: summary
        }
    })
    .then(([foundOrCreated, existed])=> {
        console.log('HIKE', foundOrCreated);
        console.log('EXISTED', existed);
    })
}
