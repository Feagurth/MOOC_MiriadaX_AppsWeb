var galeria = [
    {persona: "Buddha - बुद्धा",
        frase: "En la confrontación entre el arrollo y la roca, el arrollo siempre ganará, no por la fuerza, sino por la persistencia.",
        foto: "http://www.imagexia.com/img/Cara-de-Buda.jpg"
    },
    {persona: "Khalil Gibran - جبران خليل جبران بن ميخائل بن سعد",
        frase: "El silencio del envidioso está lleno de ruidos.",
        foto: "http://www.hannaharendtcenter.org/wp-content/uploads/2015/05/111.jpg"
    },
    {persona: "Confucio - 孔子",
        frase: "Todo tiene belleza pero no todo el mundo la puede ver.",
        foto: "http://3.bp.blogspot.com/-VlsuMSoivLU/VeMlD-LymUI/AAAAAAABKPU/Q8PYwsFbqxg/s1600/confucio.jpeg"
    },
    {persona: "Lev Nikoláievich Tolstói - Лев Николаевич Толстой",
        frase: "Mi felicidad consiste en que sé apreciar lo que tengo y no deseo con exceso lo que no tengo.",
        foto: "http://malba.s3-website-sa-east-1.amazonaws.com/wp-content/uploads/2014/09/tolstoi-05.jpg"
    },
    {persona: "Platón - Πλάτων",
        frase: "El más importante y principal negocio público es la buena educación de la juventud.",
        foto: "https://s-media-cache-ak0.pinimg.com/236x/ee/c4/f3/eec4f3420f7024c58f1b44de233d8ecd.jpg"
    },
    {persona: "Henrik Ibsen - hɛnɾɪk ˈjoːhɑn ˈɪpsən",
        frase: "Si dudas de ti mismo, estás vencido de antemano.",
        foto: "https://ebooks.adelaide.edu.au/i/ibsen/henrik/gosse/images/bust2.jpg"
    }
];

var t, actual;

$(function () {
    generar_selector();

    $("#editar").on("click", function () {
        clearTimeout(t);

        $("#persona_d").html(galeria[actual].persona);
        $("#frase_d").html(galeria[actual].frase);
        $("#foto_d").html(galeria[actual].foto);

        if ($("#datos").css("display") === "none")
        {
            $("#datos").css("display", "block");
        }
        else
        {
            $("#datos").css("display", "none");
            
            select(actual);
        }
    });


    $("#nuevo").on("click", function () {
        $("#datos").css("display", "none");

        actual = galeria.push({
            persona: $("#persona_d").html(),
            frase: $("#frase_d").html(),
            foto: $("#foto_d").html()
        }) - 1;

        generar_selector();

        select(actual);
    });

    $("#borrar").on("click", function () {

        $("#datos").css("display", "none");

        if (galeria.length !== 1)
        {
            galeria.splice(actual, 1);

            generar_selector();

            if (actual !== 0)
            {
                actual = actual - 1;
            }


            select(actual);
        }
    });

    $("#guardar").on("click", function () {

        $("#datos").css("display", "none");

        galeria[actual].persona = $("#persona_d").html();
        galeria[actual].frase = $("#frase_d").html();
        galeria[actual].foto = $("#foto_d").html();

        select(actual);

    });


    select(0);
});

function select(i) {
    actual = i;

    $(".contenido nav a")
            .removeClass("on off")
            .addClass(function (j) {
                return(j === i) ? "on" : "off";
            });

    $("#persona").html(galeria[i].persona);
    $("#frase").html(galeria[i].frase);
    $("#foto").attr("src", galeria[i].foto);

    clearTimeout(t);
    t = setTimeout(function () {
        select((i + 1) % galeria.length);
    }, 2000);
}

function generar_selector() { // regenera la botonera
    var selector = $("#selector");

    selector.html("");

    galeria.forEach(function (elem, i) {
        selector.append("<li><a onClick='select(" + i + ")'></a></li>");
    });
}
