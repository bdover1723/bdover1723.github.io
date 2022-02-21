const sfw_theme = {
    backgroundColor: "white",
    textColor: "black",
    coverImage: "assets/yuno.png",
    searchBarColorScheme: "light",
    searchBarShadow: "0px 0px 10px rgb(0 0 0 / 25%)",
    status: "sfw",
    next: "nsfw"
};
const nsfw_theme = {
    backgroundColor: "black",
    textColor: "white",
    coverImage: "assets/rias.png",
    searchBarColorScheme: "dark",
    searchBarShadow: "0px 0px 10px rgba(255 255 255 / 25%)",
    status: "nsfw",
    next: "sfw"
};

const themes = [sfw_theme, nsfw_theme];
let currTheme = 0;

function toggleMode() {
    currTheme = (currTheme + 1) % 2;
    themeProperties = themes[currTheme]

    const html = document.querySelector("html");
    html.style.backgroundColor = themeProperties["backgroundColor"];
    html.style.color = themeProperties["textColor"];

    const img = document.querySelector("#waifu-image");
    img.style.backgroundImage = `url(${themeProperties["coverImage"]})`;

    const searchBar = document.querySelector(".waifu-input");
    searchBar.style.colorScheme = themeProperties["searchBarColorScheme"];
    searchBar.style.boxShadow = themeProperties["searchBarShadow"];

    const toggle = document.querySelector("#toggle");
    toggle.textContent = themeProperties["next"]
}

function getSpecificImage() {
    const name = document.querySelector("#waifu-name").value;
    if (currTheme == 0) {
        fetch(`https://kitsu.io/api/edge/characters?filter[name]=<${name}>`)
        .then((res) => res.json())
        .then(function(res) {
            if (res.status === 'error') {
                document.querySelector("#status").textContent = "no waifu found :(";
            }
            try {
                document.querySelector("#waifu-image").style.backgroundImage = `url("${res["data"][0]["attributes"]["image"]["original"]}")`; // kitsu was not built for this >:(
                document.querySelector("#status").textContent = null;
            } catch(error) {
                console.log(error)
                document.querySelector("#status").textContent = "no waifu found :(";
            }
        })
    } else {
        let numPages = 0;
        fetch(`https://r34-json.herokuapp.com/posts?tags=${name}`)
        .then((res) => res.json())
        .then(function(res) {
            numPages = Math.ceil(res["count"] / 100);

            pageIndex = Math.floor(Math.random() * (numPages))
            fetch(`https://r34-json.herokuapp.com/posts?tags=${name}&pid=${pageIndex}`)
            .then((res) => res.json())
            .then(function(res) {
                try {
                    if (res.status === 'error') throw error;

                    const len = Object.keys(res["posts"]).length;
                    postIndex = Math.floor(Math.random() * (len));

                    url = res["posts"][postIndex]["file_url"];

                    document.querySelector("#waifu-image").style.backgroundImage = `url(${url})`;
                    document.querySelector("#status").textContent = null;
                } catch(error) {
                    console.log(error)
                    document.querySelector("#status").textContent = "no waifu found :(";
                }
            })
        })
    }
    // document.querySelector("#waifu-name").value = null;
}

function getRandomImage() {
    fetch(`https://api.waifu.pics/${themes[currTheme]["status"]}/waifu`, {method:"Get"})
    .then((res) => res.json())
    .then(function(res) {
        document.querySelector("#waifu-image").style.backgroundImage = `url("${res.url}")`;
        document.querySelector("#status").textContent = null;
    })
}

function getBest() {
    document.querySelector("#waifu-image").style.backgroundImage = `url("assets/c2.jpg")`;
    document.querySelector("#status").textContent = null;
}

document.querySelector('#waifu-name').addEventListener("keyup", function(e) {
    if (!e) e = window.event;
    if (e.key === 'Enter'){
      getSpecificImage();
    }
});