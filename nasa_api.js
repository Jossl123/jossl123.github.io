let configFile;

try {
  configFile = await import('./config.js');
} catch (error) {
    console.log("config.js not found")
}


export async function nasa_pic_of_the_day(){
    if (!configFile || !configFile.NASA_API_KEY) return {"error":"no nasa api key", "success":false} 
    URL="https://api.nasa.gov/planetary/apod?api_key="+configFile.NASA_API_KEY
    return fetch(URL)
        .then(response => response.json())
        .then(data => {
            console.log("tezstfe");return {...data, "success": true}})
        .catch(err => {return {"error":"error in fetching data from nasa api", "success":false}});
};