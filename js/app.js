// Constnt of Api url
const _apiUrl = 'https://api.soccersapi.com/v2.2/';

// Constant of the token value required for the Api request authentication.
const _apiToken = 'a201cbc389fbbd97ac96340c4587b906';

// Constant of the username value required for the Api request authentication.
const _apiUsername='somtobuchi';

// Setting the preloader display style to block
document.querySelector(".preloader").style.display = "block";

// Getting the current url parameter.
let url = window.location.href;

// The toggleNavBar function is called on click. Html Classs: "nav-itemcancel"
// For the mobile responsive menu
const toggleNavBar = () => {
    let navBar = document.getElementById('mobile-nav');
    if (navBar.style.left == '25%') {
        navBar.style.left = '100%';
        setTimeout(() => {
            navBar.style.display = 'none';
        }, 700);
    } 
    else{
        navBar.style.display = 'block'; 
        setTimeout(() => {
            navBar.style.left = '25%';   
        }, 200);  
    }
    
    return;
}

// The setSearchPlayer Function is called onclick from the list of searched players
// Storing the player id to local storage which is required to make an api call in the view_player html view
const setSearchPlayer = (player_id) => {
    // Storing
    localStorage.setItem("Player-search", player_id);
    // Updating the view
    window.location.href="view_player.html";
}

// If currenct url is  the index page
if(url.includes('index.html')){

    // Remove any previously saved player id from the local storage
    localStorage.removeItem("Player-search");

    // Set preloader display to none after 2 seconds, to diplay the content of this page
    setTimeout(()=>{
        document.querySelector(".preloader").style.display = "none"; 
    },2000) 

    // Hidding the searched content list
    document.getElementById("result").style.display = "none";

    // Adding an event listiner of click to the search button
    let fetchBtn = document.getElementById("fetchBtn"); 
    fetchBtn.addEventListener("click", buttonclickhandler); 
    
    // Creating the call back function of the event listener 
    function buttonclickhandler() {   

        // Getting the value from the input field
        let search = document.getElementById('search-field').value;

        // If the user is yet to input any value
        if(search == ''){
            // Display error message for 3 seconds
            document.getElementById('error').innerText = "Please input player name";
            setTimeout(()=>{
                document.getElementById('error').innerText = "";
            },3000)
            return;
        }
        
        // Instantiate an new XHR Object 
        const xhr = new XMLHttpRequest(); 
    
        // Open an obejct (GET/POST, PATH, 
        // ASYN-TRUE/FALSE) 
        xhr.open("GET", `${_apiUrl}search/?user=${_apiUsername}&token=${_apiToken}&t=all&q=${search}`, true); 
    
        // When response is ready 
        xhr.onload = function () { 
            // If status is 200 [successful]
            if (this.status === 200) { 
                // Api $_apiUrl returns object: {data, metadata}.
                // Data include response of what we wish to take
                // Changing string data into JSON Object 
                data = JSON.parse(this.responseText).data; 
                // This is a football Player search website
                // We filter the response to object of type player, eg when user searches for "Chelsea",
                // We want to filter the search and take only data of players and not team chelsea
                try {
                    data = data.filter(x => x.type == "player");
                    let list = document.getElementById("list"); 
                    str = "<tr><th>Player name</th><th>action</th></tr>";
                    for (key in data) { 
                        str += `<tr>
                                    <td>${data[key].name}</td>
                                    <td>
                                        <a href="javascript:void(0)" class="search-button search-action" 
                                            onclick="setSearchPlayer('${data[key].id}')">
                                                See profile
                                        </a>
                                    </td>
                                </tr>`; 
                        if(key==5){
                            break;
                        }
                    } 
                    list.innerHTML = str; 
                    document.getElementById("search").style.display ="none";
                    document.getElementById("result").style.display = "block";
                }catch(err){
                    document.getElementById('error').innerText = "No Player found";
                    setTimeout(()=>{
                        document.getElementById('error').innerText = "";
                    },3000)
                }
            } 
            else { 
                console.log("File not found"); 
            } 
    
        } 
        // At last send the request 
        xhr.send(); 
    } 
} else if(url.includes('view_player.html')){
    let player = JSON.parse(localStorage.getItem('Player-search'));
    if(player){
        const xhr = new XMLHttpRequest(); 
        xhr.open("GET", `${_apiUrl}players/?user=${_apiUsername}&token=${_apiToken}&t=info&id=${player}`, true); 
        xhr.onload = function () { 
            if (this.status === 200) { 
                data = JSON.parse(this.responseText).data; 
                document.getElementById("image").src= data.img ? data.img: './img/profile-placeholder-image-gray-silhouette-260nw-1153673752.webp';
                document.querySelector("h3").innerText= data.name ? data.name : "Unavailable";
                document.getElementById("common_name").innerText= data.common_name ? `Common name: ${data.common_name}` : "Unavailable";
                document.getElementById("first_name").innerText= data.firstname ? `First name: ${data.firstname}` : "Unavailable";
                document.getElementById("last_name").innerText= data.lastname ? `Last name: ${data.lastname}` : "Unavailable";
                document.getElementById("age").innerText= data.birthday ? `Age: ${data.birthday}` : "Unavailable";
                document.getElementById("dob").innerText= data.birthday ? `Birthday: ${data.birthday}` : "Unavailable";
                document.getElementById("position").innerText= data.position ? `Position: ${data.position}` : "Unavailable";
                document.getElementById("shirt_number").innerText= data.shirt_number ? `Shirt number: ${data.shirt_number}` : "Unavailable";
                document.getElementById("foot").innerText= data.foot ? `Foot: ${data.foot}` : "Unavailable";
                document.getElementById("height").innerText= data.height ? `Height: ${data.height}` : "Unavailable";
                document.getElementById("weight").innerText= data.weight ? `Weight: ${data.weight}` : "Unavailable";
                document.getElementById("nationality").innerText= data.country.name ? `Country: ${data.country.name}` : "Unavailable";
                document.querySelector(".preloader").style.display = "none"; 
            } 
            else { 
                console.log("File not found"); 
            } 
        } 
        xhr.send(); 
    }else{
         window.location.href="index.html";
    }
}