//js file with functions 

function elevation(hikes) {
    let winter= [];
    let fall= [];
    let summer= [];
    let spring= [];
    hikes.forEach(hike => {
        if(hike.height <= 1500){
            winter.push(hike);
        } else if(hike.height >= 3001 && hike.height <= 5500){
            fall.push(hike);
        } else if(hike.height >= 5501){
            summer.push(hike);
        } else if(hike.height >= 1501 && hike.height <= 3000){
            spring.push(hike);
        }
    })
    //console.log('ALL HIKES', allHikes);
    console.log('how many', (winter.length + fall.length + summer.length + spring.length));
    return {winter, fall, summer, spring};
}

//function that cycles through all the hikes and returns the title of the matching id 
function getName(hikes, entry){
    let hikeId;
    let title;
    hikes.forEach(hike => {
        hikeId= hike.id;
        if(hikeId== entry.hikeId){
            //console.log(`hikeId ${hikeId}        hike.id: ${hike.id}`)
            title= hike.title;
        }
    })
    return title;
}

//export the function
module.exports= {elevation, getName};

