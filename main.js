const url = 'https://gist.githubusercontent.com/alex-oleshkevich/6946d85bf075a6049027306538629794/raw/3986e8e1ade2d4e1186f8fee719960de32ac6955/by-cities.json';
const apikey = 'd5e44ddd8ccf4615bf04c364515a0c62';


async function getData(){
  const response =  await fetch(url);
  const data = await response.json();
  console.log(data);
  return data
}

async function getRegions(){
    const data = await getData();
    const regions = data[0].regions.map(region => region.name);

    regions.forEach(region => {
   const option = document.createElement("option");
   option.innerHTML = region;
    document.getElementById("select-region").appendChild(option);
});
}

async  function getCities(cities){
    document.getElementById('select-city').innerHTML = "";
    cities.forEach( city =>{
       const option = document.createElement("option");
        option.innerHTML = city.name;
        document.getElementById("select-city").appendChild(option);
    })
}

async function setRegions(select){
    const selectedregion = select.options[select.selectedIndex].innerHTML;
    const data = await getData();
    const filteredregion = data[0].regions.filter(region => region.name === selectedregion);
     getCities(filteredregion[0].cities);
}
function activeButton(){
    document.getElementById("button").disabled = false;
}
function kelvintoCelcius(temp){
    return Math.round( (( temp - 273 ) * 100) / 100);
}

 function getoutDate(weatherdata){
    document.getElementById("data").innerHTML = "";

    const today = new Date();
    const selectedDate = new Date();
    selectedDate.setDate(selectedDate.getDate() + (document.getElementById('select-date').selectedIndex - 1));
    const selectedDay = selectedDate.getDate();
    console.log(selectedDay);
    weatherdata.list.forEach(currentWeather => {
        
        const unixTimestamp = currentWeather.dt;
        const currentWeatherDay = new Date(unixTimestamp * 1000).getDate();
        console.log(currentWeatherDay);
        const p = document.createElement('p');
        if (selectedDay === currentWeatherDay) {
            p.innerHTML = new Date(unixTimestamp * 1000).toLocaleString()
                + ' — ' 
                + kelvintoCelcius(currentWeather.main.temp_min)
                + ' / '
                + kelvintoCelcius(currentWeather.main.temp_max);
                document.getElementById('data').appendChild(p);
        }
    });

}
 
async function getWeather(){
    const cityid = document.getElementById("select-city");
    const city = cityid.options[cityid.selectedIndex].innerHTML;
    const apiurl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apikey}`;
    const data = await fetch(apiurl);
    const weatherdata = await data.json();
    console.log(weatherdata);
    if(weatherdata.cod === "200"){
        getoutDate(weatherdata);
    }
    else{
        document.getElementById("data").innerHTML = "";
        const p = document.createElement("p");
        p.innerHTML = "Error";
        document.getElementById("data").appendChild(p);

    }
}



getRegions();
