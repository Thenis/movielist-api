$(function () {
    showHideUserLink();

    $("#start-now-btn").click(function () {
        showMsg("success", "success");
    });

    // $("#home").click(function () {
    //     showView("home-page");
    //     ajaxRegister()
    // });

    // $("#register").click(function () {
    //     showView("register-page");
    // });

    // $("#lists").click(function () {
    //     showView("lists-page");
    //     listAllLists();
    // });

    // $("#add-list").click(function () {
    //     showView("add-list-form");
    // });

    // $("#add-movie").click(function () {
    //     showView("add-movie-form");
    //     loadListNamesInSelect();
    // });

    

    

    $("#movie-input").on("input", function () {
        let movieName = $(this).val();
        ajaxGetMovies(movieName);
    })
    $("#log-out").click(ajaxLogoutUser);
});

// function ajaxLocalAPI() {
//     $.ajax({
//         method: "GET",
//         url: "http://localhost:3000/lists",
//         headers: {
//             "x-auth": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OTI3MTNlN2I1MzdlMjNkNzA0OGVjM2YiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNDk1NzMzMjIzfQ.FOw4-q7dWveUzqsiisFNVtLJ7bRjWwMfiM0A_aZVwYM"
//         },
//         dataType: "JSON"
//     }).then((result) => {
//         console.log(result)
//     })


// }

function setCookie(name, value, expYear, expMonth, expDay, path, domain, secure) {
    let cookieString = `${name}=${escape(value)}`;

    if (expYear) {
        let expires = new Date(expYear, expMonth, expDay);
        cookieString += `; expires=${expires.toUTCString()}`;
    }

    if (path) {
        cookieString += `; path=${escape(path)}`;
    }

    if (domain) {
        cookieString += `; domain=${escape(domain)}`;
    }

    if (secure) {
        cookieString += "; secure";
    }

    document.cookie = cookieString;
}

function getCookie(cookieName) {
    let results = document.cookie.match(`(^|;) ?${cookieName}=([^;]*)(;|$)`);

    if (results) {
        return (unescape(results[2]));
    }
    else {
        return null;
    }
}


function deleteCookie(cookieName) {
    let cookieDate = new Date();
    cookieDate.setTime(cookieDate.getTime() - 1);
    document.cookie = cookieName += `=; expires=${cookieDate.toUTCString()}`;
}

function ajaxLogoutUser() {
    $.ajax({
        method: "DELETE",
        url: '/logoff',
        headers: {
            "x-auth": getCookie("x-auth")
        }
    }).then((res) => {
        console.log("here");
        window.location = "/login";
        showMsg("Successfully logged off!", "success");
    }).catch((err) => showMsg("Error", "error"));
    
    showHideUserLink();
}

function ajaxGetMovies(queryString) {
    const apiKey = "87cdafe12d9bdca68ba01c573e34376f";

    let result = $.ajax({
        method: "GET",
        url: `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${queryString}&page=1&include_adult=false`,

        dataType: "JSON"
    }).then(function (movies) {
        console.log(movies.results);
        $("#movie-query-list").empty();

        for (let movie of movies.results) {
            $("<li>")
                .addClass("list-group-item list-group-item-action")
                .append($("<img>").attr("src", (movie.poster_path === null ? "img/default-movie.png" : `https://image.tmdb.org/t/p/w45_and_h67_bestv2${movie.poster_path}`)))
                .append($("<a>")
                    .attr("href", "#")
                    .text(movie.original_title)
                    .click(function () {
                        addMovie($(this).text())
                    }))
                .appendTo($("#movie-query-list"));
        }
    });
}

function showHideUserLink() {
    if(getCookie("x-auth")) {
        $("#user-nav").text(getCookie("username"))
            .append($("<span></span>").addClass("caret"));
    } else {
        $("#user-nav").hide();
    }
}

function showMsg(msg, type) {
    let alert;

    if (type === "success") {
        alert = $("#success-alert");
    } else {
        alert = $("#error-alert");
    }

    alert
        .text(msg) // append msg
        .show(); // show it


    setTimeout(() => {
        alert.fadeOut();
    }, 2000); // alert fades out after 2s
}

function checkObjIfEmpty(obj) {
    if (Object.keys(obj).length === 0) {
        return true;
    }

    return false;
}

let movieListManipulator = (function () {
    let lists = {};
    let id = 0;

    return {
        addList: (list) => {
            lists[id] = list;
            id++;
        },

        getLists: () => lists,

        getListNameById: (id) => lists[id].name,

        addMovieToList: (listId, movie) => {
            lists[listId]["movies"][id] = movie;
            id++;
        },
        deleteMovie: (listId, movieId) => delete lists[listId]["movies"][movieId]
    };
})();

function addList() {
    let listNameInput = $("#list-input").val();
    let listDescrInput = $("#list-descr").val();

    movieListManipulator.addList({
        name: listNameInput,
        description: listDescrInput,
        movies: {}
    });

    showMsg("List successfully added!", "success");
}

function listAllLists() {
    let target = $("#target-location"); // location of where the lists will be appended

    let listObj = movieListManipulator.getLists();

    if (checkObjIfEmpty(listObj)) {
        return;
    }

    target.empty(); // clear child elements

    for (let listKey in listObj) {
        if (listObj.hasOwnProperty(listKey)) {
            let gridDiv = $("<div>").addClass("col-sm-6");

            let cardDiv = $("<div>").addClass("card");

            let cardBlockDiv = $("<div>").addClass("card-block center-block");

            let cardTitle = $("<h3>").addClass("card-title text-center");

            let linkElement = $("<a>")
                .attr("href", "#")
                .text(listObj[listKey].name);

            let cardListDescription = $("<i>")
                .text((listObj[listKey].description === "") ? "No Description" : listObj[listKey].description); // checks if the is a description. If there isn't it displays "No description"

            linkElement.click(function () {
                if (checkObjIfEmpty(listObj[listKey].movies)) {
                    showMsg("No movies available in selected list.");
                } else {
                    listMovies(listKey, listObj[listKey].movies); // lists the movies with listId and movies object
                }
            });

            cardTitle.append(linkElement);

            cardBlockDiv.append(cardTitle);
            cardBlockDiv.append(cardListDescription);

            cardDiv.append(cardBlockDiv);

            gridDiv.append(cardDiv);

            target.append(gridDiv);

        }
    }
}

function loadListNamesInSelect() {
    let select = $("#list-select");

    let listNames = movieListManipulator.getLists();

    if (checkObjIfEmpty(listNames)) {
        return;
    }

    select.empty(); // empties all the its children

    for (let key in listNames) {
        if (listNames.hasOwnProperty(key)) {
            let option = $("<option>")
                .val(key)
                .text(listNames[key].name)
                .appendTo(select);
        }
    }
}

function addMovie(movieName) {

    let listId = $("#list-select :selected").val();

    if (listId === "no-lists") {
        showMsg("No lists available.", "error");
        return;
    }

    movieListManipulator.addMovieToList(listId, {
        name: movieName
    })

    showMsg("Movie successfully added!", "success");
}

function listMovies(listId, movieObj) {
    let tbody = $("#movie-list");

    tbody.empty(); // clear table child elements

    $("#movie-header").text(`Movies in list - ${movieListManipulator.getListNameById(listId)}`);

    for (let key in movieObj) {
        if (movieObj.hasOwnProperty(key)) {

            let tr = $("<tr>");

            let tdMovie = $("<td>");

            let tdUpDown = $("<td>");

            let tdDeleteButton = $("<td>");

            let deleteButton = $("<button>")
                .text("Remove")
                .addClass("btn btn-sm btn-danger")
                .click(function () {
                    movieListManipulator.deleteMovie(listId, key);

                    $(this).parent().parent().remove();

                    showMsg("Movie successfully removed!", "success");
                });

            let upSpan = $("<span>")
                .addClass("glyphicon glyphicon-arrow-up")
                .click(function () {

                    let tr = $(this).parent().parent();
                    let previousSibling = tr.prev();
                    tr.insertBefore(previousSibling);

                });


            let downSpan = $("<span>")
                .addClass("glyphicon glyphicon-arrow-down")
                .click(function () {
                    let tr = $(this).parent().parent();
                    let nextSibling = tr.next();
                    tr.insertAfter(nextSibling);
                });


            tdDeleteButton.append(deleteButton);

            tdMovie.text(movieObj[key].name);
            tr.attr("id", key);
            tdUpDown.append(upSpan);
            tdUpDown.append(downSpan);

            tr.append(tdMovie);
            tr.append(tdUpDown);
            tr.append(tdDeleteButton);
            tbody.append(tr);

            showView("movie-page");
        }
    }
}