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
});


function getCookie(cookieName) {
    let results = document.cookie.match(`(^|;) ?${cookieName}=([^;]*)(;|$)`);

    if (results) {
        return (unescape(results[2]));
    }
    else {
        return null;
    }
}

function ajaxLogoutUser() {
    $.ajax({
        method: "DELETE",
        url: '/logoff',
        headers: {
            "x-auth": getCookie("x-auth")
        }
    }).then(function (res) {
        window.location="/";
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
        showMsg("Movie successfully added!", "success");
    });
}
