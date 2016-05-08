/**
 * 
 * @type Array Array que contiene las citas iniciales de la aplicación definidas como objetos
 */
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

// Definimos dos variables globales
// actual controla el valor de la cita que se está mostrando actualmente.
// t controla el tiempo pasado entre el cambio de citas
var t, actual;

/**
 * Función que se ejecuta en cuanto la página esté cargada
 * @returns {undefined}
 */
$(function () {

    // Generamos la botonera inferior
    generar_selector();

    /**
     * Funcion que se ejecuta al pulsar el botón de editar
     */
    $("#editar").on("click", function () {

        // Paramos el cronometro
        clearTimeout(t);

        // Cargamos los valores de las citas para editar
        $("#persona_d").html(galeria[actual].persona);
        $("#frase_d").html(galeria[actual].frase);
        $("#foto_d").html(galeria[actual].foto);

        // Comprobamos si el objeto datos estaba oculto
        if ($("#datos").css("display") === "none")
        {

            // Si es así, lo mostramos
            $("#datos").css("display", "block");
        }
        else
        {
            // En caso contrario lo ocultamos
            $("#datos").css("display", "none");

            // Y seleccionamos la cita actual
            select(actual);
        }
    });

    /**
     * Función que se ejecuta al pulsar el botón de nueva cita
     */
    $("#nuevo").on("click", function () {

        // Ocultamos el panel de edición
        $("#datos").css("display", "none");

        // Añadimos al array los valores introducidos en los campos de edición,
        // y modificamos el valor de la cita actual
        actual = galeria.push({
            persona: $("#persona_d").html(),
            frase: $("#frase_d").html(),
            foto: $("#foto_d").html()
        }) - 1;

        // Regeneramos la botonera inferior, para que se cree con el botón 
        // correspondiente a la nueva cita
        generar_selector();

        // Seleccionamos la cita actual para mostrar
        select(actual);
    });

    /**
     * Función que se ejecuta al pulsar el botón de borrar cita
     */
    $("#borrar").on("click", function () {

        // Ocultamos el panel de edición
        $("#datos").css("display", "none");

        // Comprobamos el el tamaño del array de citas es distinto a 1
        if (galeria.length !== 1)
        {
            // Si lo es, eliminamos del array la cita actual
            galeria.splice(actual, 1);

            // Regenramos la botonera
            generar_selector();

            // Coprobamos si el valor de la cinta actual es distinto de cero
            if (actual !== 0)
            {
                // Si es así, decrementamos el valor de la cita actual en 1 para 
                // que se seleccione la cita anterior a la borrada
                actual = actual - 1;
            }

            // Seleccionamos la cita actual
            select(actual);
        }
    });

    /**
     * Función que se ejecuta al pulsar el botón de modificar cita
     */
    $("#guardar").on("click", function () {

        // Ocultamos el panel de edición
        $("#datos").css("display", "none");

        // Actualizamos el valor del array con los valores de los campos de edición,
        // actualizando la cita actual
        galeria[actual].persona = $("#persona_d").html();
        galeria[actual].frase = $("#frase_d").html();
        galeria[actual].foto = $("#foto_d").html();

        // Seleccionamos la cita actual
        select(actual);

    });

    // Seleccionamos la primera cita del array
    select(0);
});

/**
 * Función que nos permite seleccionar una de las citas
 * @param {type} i int El valor de la posición de la cita a mostrar
 * @returns {undefined}
 */
function select(i) {

    // Pasamos el valor del parámetro a a la variable actual
    actual = i;

    // Para todos los botones de la botonera
    $(".contenido nav a")
            // Eliminamos las clases on y off
            .removeClass("on off")

            // Añadimos la clase on al botón cuyo indice se corresponda con el 
            // valor de la cita actual y el resto les ponemos la clase off
            .addClass(function (j) {
                return(j === i) ? "on" : "off";
            });

    // Copiamos los valores de las citas a los respectivos campos para su visualización
    $("#persona").html(galeria[i].persona);
    $("#frase").html(galeria[i].frase);
    $("#foto").attr("src", galeria[i].foto);

    // Limpiamos el cronometro
    clearTimeout(t);

    // Creamos una función que se ejecuta cada 2 segundos
    t = setTimeout(function () {
        // Seleccionamos la siguiente cita
        select((i + 1) % galeria.length);
    }, 2000);
}

/**
 * Función que nos permite generar la botonera inferior de las citas
 * @returns {undefined}
 */
function generar_selector() {

    // Volcamos a una varible el objeto con id selector
    var selector = $("#selector");

    // Eliminamos su contenido
    selector.html("");

    // Iteramos por cada elemento del array de citas
    galeria.forEach(function (elem, i) {
        // Para cada elemento, concatenamos un elemento lista con un evento 
        // onClick que ejecuta la funcion select pasándo como parámetro el valor de la fila
        selector.append("<li><a onClick='select(" + i + ")'></a></li>");
    });
}
