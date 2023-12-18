const params = new URLSearchParams(window.location.search);
const pesquisaUrl = params.get('search');


var token = localStorage.getItem("MusicianTokenSpotifySecret");


const createToken = () => {
    const url = "https://accounts.spotify.com/api/token";
    const clientId = "";
    const clientSecret = "";

    const formData = new URLSearchParams();
    formData.append("grant_type", "client_credentials");
    formData.append("client_id", clientId);
    formData.append("client_secret", clientSecret);

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
    })
        .then((response) => response.json())
        .then((data) => {
            token = data.access_token;
            localStorage.setItem("MusicianTokenSpotifySecret", token);
        })
        .catch((error) => {
        });
};


const search = {

    getSearch(search) {
        fetch("https://api.spotify.com/v1/search?q=" + search + "&type=album%2Cartist", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                this.tratamentoSearch(data);
            })
            .catch((error) => {
            });
    },

    tratamentoSearch(dados) {
        if (dados.error != null) {
            createToken();

            this.getSearch();
        } else {


            let albuns = dados.albums;
            let musicos = dados.artists;


            albuns.items.forEach(artista => {
                let nome = artista.name;
                let link = artista.external_urls.spotify;
                let image = artista.images[0].url;

                if (image != null) {

                    this.createResults({ nome, link, image, tipo: 'albuns' })


                }
            })

            musicos.items.forEach(artista => {
                let nome = artista.name;
                let link = artista.external_urls.spotify;
                let image = artista.images[0].url;
                console.log(artista)

                if (image != null) {

                    this.createResults({ nome, link, image, tipo: 'artistas' })


                }
            })

        }
    },

    createResults(data) {

        let divFather = '';

        if (data.tipo == 'artistas') {

            divFather = document.querySelector('#artistas');

        } else if (data.tipo == 'albuns') {
            divFather = document.querySelector('#albuns');
        }

        let divItem = document.createElement("div");
        divItem.classList.add("item");
        let divCard = document.createElement("a");
        divCard.classList.add("card");
        divCard.href = data.link;
        divCard.target = "_blank";

        let divCardImage = document.createElement("div");
        divCardImage.classList.add("card-image");
        let image = document.createElement("img");
        image.src = data.image;

        let divCardText = document.createElement("div");
        divCardText.classList.add("card-text");
        let divCardtexttitle = document.createElement("div");
        divCardtexttitle.classList.add("card-text-title");
        divCardtexttitle.innerHTML = data.nome;

        divCardImage.appendChild(image);
        divCardText.appendChild(divCardtexttitle);

        divCard.appendChild(divCardImage);
        divCard.appendChild(divCardText);

        divItem.appendChild(divCard);

        divFather.appendChild(divItem);




    },
};


const listeners = () => {
    let buttonSearch = document.querySelector(".form-control i");

    buttonSearch.addEventListener("click", (event) => {

        let input = event.target.parentNode.querySelector('input');

        if (input.value.length <= 3) {

            if (!input.parentNode.classList.contains('error')) {
                input.parentNode.classList.add('error');
            }

        }
        else {

            if (input.parentNode.classList.contains('error')) {
                input.parentNode.classList.remove('error');
            }

            window.location.href = 'search.html?search=' + input.value;



        }
    });
}


async function startAll() {

    listeners();


    $(".owl-carousel.skeleton-carousel").owlCarousel({
        margin: 20,
        loop: true,
        autoWidth: true,
        items: 9,
        autoplayTimeout: 3000,
        autoplayHoverPause: false,
    });


    if (params.get('search') == null || params.get('search') == '' || params.get('search') == ' ') {
        window.location.href = '/';
    } else {

        document.querySelector('input').value = params.get('search');


        let spanResultadoTexto = document.querySelector('.carousels-title span').innerHTML = params.get('search');

        if (token == '' || token == null) {
            await createToken();
        }


        function promisePlayLists() {
            return new Promise((resolve, reject) => {

                search.getSearch(String(params.get('search')));



                setTimeout(() => {
                    resolve(true);
                }, 3000);
            });
        }

        promisePlayLists()

            .then((resultado) => {
                document.querySelectorAll('.owl-carousel.skeleton-carousel').forEach(carousel => {
                    carousel.remove();
                })

                $(".owl-carousel").owlCarousel({
                    margin: 20,
                    loop: true,
                    autoWidth: true,
                    items: 9,
                    autoplay: true,
                    autoplayTimeout: 3000,
                    autoplayHoverPause: false,
                });
            })
            .catch((erro) => {
            });

    }




}

startAll();