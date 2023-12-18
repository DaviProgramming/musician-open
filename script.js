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

const albuns = {

  albunsNovosBrasil() {
    let url =
      "https://api.spotify.com/v1/browse/new-releases?country=BR&limit=30";

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error != null) {

          createToken();

        } else {

            data.albums.items.forEach(album => {
                this.tratamentoAlbum(album, '#novidadesBR');
            })
        }
      })
      .catch((error) => {
      });
  },


  albunsNovosUS(){

    let url =
      "https://api.spotify.com/v1/browse/new-releases?country=US&limit=30";

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error != null) {

          createToken();

        } else {

            data.albums.items.forEach(album => {
                this.tratamentoAlbum(album, '#novidadesUS');
            })
        }
      })
      .catch((error) => {
      });


  },




  tratamentoAlbum(album, listname){



    let nome = album.name;
    let link = album.external_urls.spotify;
    let imagem = album.images[0].url;


    this.criarAlbuns({nome, link, imagem, listname})

  },


  criarAlbuns(data){

    let divFather = document.querySelector(data.listname);

    let divItem = document.createElement("div");
    divItem.classList.add("item");
    let divCard = document.createElement("a");
    divCard.classList.add("card");
    divCard.href = data.link;
    divCard.target = "_blank";

    let divCardImage = document.createElement("div");
    divCardImage.classList.add("card-image");
    let image = document.createElement("img");
    image.src = data.imagem;

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
  }
};

const playlists = {
  playlistBrasil() {
    let url =
      "https://api.spotify.com/v1/browse/featured-playlists?country=BR&limit=30";

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error != null) {
          createToken();

          init.getPlaylistsAndAlbuns();
        } else {
          this.tratamentoPlaylist(data, "#playlistsBr");
        }
      })
      .catch((error) => {
      });
  },

  playlistWorld() {

    let url =
      "https://api.spotify.com/v1/browse/featured-playlists?country=US&limit=30";

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error != null) {
          createToken();

          init.getPlaylistsAndAlbuns();
        } else {
          this.tratamentoPlaylist(data, "#world");
        }
      })
      .catch((error) => {
      });
  },

  tratamentoPlaylist(dataPlaylist, listName) {
    let playlists = dataPlaylist.playlists;

    playlists.items.forEach((playlist) => {
      let nome = playlist.name;
      let imagem = playlist.images[0].url;
      let link = playlist.external_urls.spotify;

      this.criarPlaylists({ nome, imagem, link, listName });
    });

    this.load++;
  },

  criarPlaylists(data) {
    let divFather = document.querySelector(data.listName);

    let divItem = document.createElement("div");
    divItem.classList.add("item");
    let divCard = document.createElement("a");
    divCard.classList.add("card");
    divCard.href = data.link;
    divCard.target = "_blank";

    let divCardImage = document.createElement("div");
    divCardImage.classList.add("card-image");
    let image = document.createElement("img");
    image.src = data.imagem;

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

const init = {

  getPlaylistsAndAlbuns() {

    function promisePlayLists() {
      return new Promise((resolve, reject) => {

        playlists.playlistBrasil();
        playlists.playlistWorld();
        albuns.albunsNovosBrasil();
        albuns.albunsNovosUS();

        

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
          autoplayHoverPause:false,
        });
      })
      .catch((erro) => {
        console.error(erro);
      });


  },

  createListeners() {

    let buttonSearch = document.querySelector(".form-control i");

    buttonSearch.addEventListener("click", (event) => {

       let input = event.target.parentNode.querySelector('input');

       if(input.value.length <= 3){

        if(!input.parentNode.classList.contains('error')){
            input.parentNode.classList.add('error');
        }

       }
       else {

        if(input.parentNode.classList.contains('error')){
            input.parentNode.classList.remove('error');
        }

        window.location.href = 'search.html?search=' + input.value;

       

       }
    });


  },
};



async function startAll() {

    $(".owl-carousel.skeleton-carousel").owlCarousel({
        margin: 20,
        loop: true,
        autoWidth: true,
        items: 9,
        autoplayTimeout: 3000,
        autoplayHoverPause:false,
      });

   

  if (token == null || token == "") {
    await createToken();
  }

  init.createListeners();
  init.getPlaylistsAndAlbuns();
}

startAll();
