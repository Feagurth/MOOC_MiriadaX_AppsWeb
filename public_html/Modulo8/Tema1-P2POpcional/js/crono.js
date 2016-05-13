/* 
 * Copyright (C) 2016 Luis Cabrerizo Gómez
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */


$(function () {
    var t, cl = $("#crono");


    /**
     * Función que actualiza el contenido el objeto chrono, añadiendo 0.01 a su 
     * valor y presentando el resultado en pantalla
     * @returns {undefined}
     */
    function mostrar() {
        cl.html((+cl.html() + 0.01).toFixed(2));
    }
    ;


    /**
     * Función que crea un intervalo de tiempo para que se ejecute 
     * la funcion mostrar cada decima de segundo
     * @returns {undefined}
     */
    function arrancar() {
        t = setInterval(mostrar, 10);
    }
    ;


    /**
     * Funcion que desactiva el intervalo de ejecución
     * @returns {undefined}
     */
    function parar() {
        clearInterval(t);
        t = undefined;

        $("#lista").append("<li>" + cl.html() + "</li>");


    }
    ;


    /**
     * Función que alterna las funciones de arrancar y parar
     * @returns {undefined}
     */
    function cambiar() {
        if (!t) {
            arrancar();
        }
        else {
            parar();
        }
    }
    ;

    /**
     * Función que nos permite saber si estamos en un disposivo movil mediante 
     * la creación de un evneto touch. 
     * @returns {Boolean} True si el evento se puede crear, False en caso contrario
     */
    function isMobile() {
        try {
            document.createEvent("TouchEvent");
            return true;
        }
        catch (e) {
            return false;
        }
    }
    ;

    // Comprobamos si estamos en un dispositivo movil
    if (isMobile()) {

        // Si es asi, ocultamos los botones y mostramos el texto explicatorio
        $("#botones").addClass("oculto");
        $("#texto").addClass("visible");
    }
    else
    {
        // En caso contrario, ocultamos el texto explicativo 
        // y mostramos los botones
        $("#texto").addClass("oculto");
        $("#botones").addClass("visible");

    }


    // Asignamos un evento a la accion tap
    $("#content").on("tap", cambiar);

    // Asignamos un evento a la accion swipe
    $("#content").on("swipe", function () {
        // Comprobamos si se esta ejecutando el contador
        if (!t)
        {
            // Si no es así, limpiamos el cronometro
            cl.html("0.00");

            // Limpiamos la lista de resultados
            $("#lista").empty();
        }

    });

    // Asignamos un evento a la accion click del botón iniciar
    $("#iniciar").on("click", cambiar);


    // Asignamos un evento a la accion swipe
    $("#reset").on("click", function () {
        // Comprobamos si se esta ejecutando el contador
        if (!t)
        {
            // Si no es así, limpiamos el cronometro
            cl.html("0.00");

            // Limpiamos la lista de resultados
            $("#lista").empty();
        }

    });

});