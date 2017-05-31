$(function () {
    showHideUserLink();

    $("#start-now-btn").click(function () {
        showMsg("success", "success");
    });

    $("#movie-input").on("input", function () {
        let movieName = $(this).val();
        ajaxGetMovies(movieName);
    });

    $("#log-out").click(ajaxLogoutUser);

    // $("#movie-query-list").click(function() {
    //     console.log($(this).text())
    // });
});

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
    }).then(function (res) {
        console.log("here");
        location.reload();
        showMsg("Successfully logged off!", "success");
        showHideUserLink();
    }).catch((err) => showMsg("Error", "error"));
}

function ajaxGetMovies(queryString) {
    let result = $.ajax({
        method: "POST",
        url: "/get-movie",
        data: { queryString },
        dataType: "JSON"
    }).then(function (movies) {
        console.log(movies);
        $("#movie-query-list").empty();

        //if array is empty
        if (movies.results.length === 0) {
            $("<li>")
                .addClass("list-group-item list-group-item-action")
                .text("No movies found")
                .appendTo($("#movie-query-list"));
            return;
        }

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
    }).catch((err) => console.log(err));
}

function showHideUserLink() {
    $("#navbar li a").show();
    if (getCookie("x-auth")) {
        $("#login").hide();
        $("#register").hide();
        $("#user-nav").text(getCookie("username"))
            .append($("<span></span>").addClass("caret"));
    } else {
        $("#lists").hide();
        $("#add-list").hide();
        $("#add-movie").hide();
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

    let data = {
        movieName
    };

    $.ajax({
        method: "PATCH",
        url: `/lists/${listId}/addmovie`,
        data: data ,
        dataType: "JSON"
    }).then((response) => {
        console.log(response);
    });

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