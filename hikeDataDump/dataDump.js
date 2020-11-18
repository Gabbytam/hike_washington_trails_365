const Serializer = require('sequelize-to-json'); //use sequelize-to-json to grab data from database and translate it into a json object
const db= require('../models');
const hikeModel= db.hike; //setting hike model to a variable 
const fs= require('fs');

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//THIS CODE ONLY NEEDS TO BE RUN ONCE TO GRAB HIKE DATA FROM MY DATABASE AND TRANSFER IT INTO A JSON FILE

// //establish scheme - scheme to be used for serialization. Can be an object, a string or anything falsy.
// const scheme= {
//     include: ['@all'], //include all attributes 
//     exclude: ['@pk', 'createdAt', 'updatedAt'] //leave out primary key, createdAt and updatedAt
// };

// //find all hikes in the database 
// hikeModel.findAll()
// .then(allHikes => {
//     //console.log(allHikes.length);
//     let postsAsJSON= Serializer.serializeMany(allHikes, hikeModel, scheme); // .serializeMany(instances, model, [scheme, [options]]), where the allHikes returned from the findAll call are translated into a JSON object 
//     console.log(postsAsJSON);
//     fs.writeFileSync('./hikeTableData.json', JSON.stringify(postsAsJSON)); //send JSON data to determined json file 
// });

// //data dump instructions: https://www.npmjs.com/package/sequelize-to-json





//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//BELOW IS THE CODE THAT NEEDS TO BE RUN TO POPULATE YOUR DATABASE WITH ALL THE HIKE INFO
let hikes= fs.readFileSync('./hikeTableData.json'); //grabs json data from file and sets it to a variable
hikes= JSON.parse(hikes); //translate that data from JSON format to js

//loop through the data 
for(let i = 0; i < hikes.length; i++){
    //setting variables for each specific column of a row 
    let title= hikes[i].title;
    let region= hikes[i].region;
    let distance= hikes[i].distance;
    let height= hikes[i].height;
    let imgUrl= hikes[i].imgUrl;
    let description= hikes[i].description;

    //connect to database to create(or find) a row
    hikeModel.findOrCreate({
        where: {title: title},
        defaults: {region: region,
            imgUrl: imgUrl,
            height: height,
            distance: distance,
            description: description
        }
    })
    .then(([foundOrCreated, existed])=> {
        console.log('HIKE', foundOrCreated);
        console.log('EXISTED', existed);
    })
}