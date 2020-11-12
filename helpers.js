//js file with functions 

function elevation(hikes) {
    let winter= [];
    let fall= [];
    let summer= [];
    let spring= [];
    hikes.forEach(hike => {
        if(hike.height <= 1500){
            winter.push(hike);
        } else if(hike.height >= 3001 && hike.height <= 6000){
            fall.push(hike);
        } else if(hike.height >= 6001){
            summer.push(hike);
        } else if(hike.height >= 1501 && hike.height <= 3000){
            spring.push(hike);
        }
    })
    //console.log('ALL HIKES', allHikes);
    return {winter, fall, summer, spring};
}

//function checkSave

//export the function
module.exports= {elevation};

