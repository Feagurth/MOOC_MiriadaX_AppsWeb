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

// Variables globales
var map, lat, lng;

$(function () {

    // Asignamos una función al evento click y al evento tap sobre el botón de reiniciar
    $("#reiniciar").on("click tap", function () {

        // Creamos una ventana para pedir confirmación al usuario
        $.confirm({
            // Asignamos título a la ventana
            title: 'Reiniciar marcadores',
            // Permitimos el uso del teclado para interactuar con la ventana
            keyboardEnabled: true,
            // Asignamos el botón intro del teclado para la confirmación
            confirmKeys: [13],
            // Asignamos el botón escape del teclado para la cancelación
            cancelKeys: [27],
            // Definimos el texto a mostrar
            content: '¿Desea eliminar todos los marcadores?',
            // Definimos el tema de la ventana
            theme: 'white',
            // Creamos la función que se ejecutará cuando se pulse el botón de aceptar
            confirm: function () {

                // Si el usuario confirma el borrado de los marcadores, 
                // eliminamos los valores almacenados en localStorage
                localStorage.posiciones = "";

                // Llamamos a la función geolocalizar para que realice sus funciones
                geolocalizar();

            }
        });

    });

    // Al cargar la página por primera vez llamamos a la función geolocalizar
    geolocalizar();

});

/**
 * Función que nos permite generar un mapa y cargar las posiciones anteriores
 * @returns {undefined}
 */
function geolocalizar() {

    // Usamos la función geolocate para conseguir nuestra posición
    GMaps.geolocate({
        /**
         * Función que se ejecuta al realizarse una petición exitosa de geolocalización
         * @param {type} position El valor de la posición geolocalizada
         * @returns {undefined}
         */
        success: function (position) {

            // Almacenamos el valor de latitud y longitud en las variables para tal efecto
            lat = position.coords.latitude;
            lng = position.coords.longitude;

            // Creamos un mapa
            map = new GMaps({
                // El mapa estará anclado al elemento con id map
                el: '#map',
                // Especificamos la longitud  y latitud donde se centrará el mapa
                lat: lat,
                lng: lng,
                // Definimos las funciones a ejecutarse al hacer click o tap
                click: enlazarMarcador,
                tap: enlazarMarcador
            });

            // Comprobamos si hay valores de posiciones almacenados con 
            // anterioridad en localStorage
            if (localStorage.posiciones)
            {
                // Si es así, deserializamos la cadena JSON a su formato original
                var posiciones = JSON.parse(localStorage.posiciones);

                // Iteramos por todas las posiciones del array                 
                posiciones.forEach(function (elemento) {
                    // Para cada posición añadimos un marcado al mapa
                    map.addMarker({lat: elemento[0], lng: elemento[1]});
                });

                // Iteramos por todos los marcadores del mapa excepto el último
                for (var i = 0; i < map.markers.length - 1; i++)
                {

                    // Llamamos a la funcion dibujar ruta pasándole como parámetros 
                    // la posicion del marcador actual y la posición del siguiente 
                    // marcador para dibujar la ruta enter ellos
                    dibujarRuta(
                            [map.markers[i].getPosition().lat(), map.markers[i].getPosition().lng()],
                            [map.markers[i + 1].getPosition().lat(), map.markers[i + 1].getPosition().lng()]);
                }

                // Finalmente centramos el mapa en el último marcador que tenemos en el array
                map.setCenter(map.markers[map.markers.length - 1].getPosition().lat(), map.markers[map.markers.length - 1].getPosition().lng());
            }
            else
            {
                // Si no tenemos ningún valor almacenado en localStorage 
                // ponemos un marcador con los valores obtenidos de la 
                // geolocalizacio´n
                map.addMarker({lat: lat, lng: lng});
            }
        },
        /**
         * Función que se ejecuta cuando se produce un error
         * @param {type} error El error que se ha producido
         * @returns {undefined}
         */
        error: function (error) {
            // Creamos un mensaje de alerta para el usuario
            $.alert({
                title: '¡Error!',
                content: 'Geolocalización falla: ' + error.message
            });
        },
        /**
         * Función que se ejecuta si la geolocalización no está disponible
         * @returns {undefined}
         */
        not_supported: function () {
            // Creamos un mensaje de alerta para el usuario
            $.alert({
                title: '¡Atención!',
                content: 'Su navegador no soporta geolocalización'
            });            
        }
    });
}

/**
 * Función que nos permite enlazar el ultimo marcador existente con el anterior
 * @param {type} e El objeto que contiene los datos del evento
 * @returns {undefined}
 */
function enlazarMarcador(e) {


    // Llamamos a la función encargada de dibujar la ruta, pasándole los 
    // valores de las coordenadas del ultimo marcador y las coordenadas 
    // del marcador que se está creando con el evento click o tap
    dibujarRuta([lat, lng], [e.latLng.lat(), e.latLng.lng()]);

    // Guardamos en las variables globales los valores de longitud y latitud del click o del toque actual
    lat = e.latLng.lat();
    lng = e.latLng.lng();

    // Finalmente añadimos un marcador al mapa con la longitud y latitud del click o del toque actual
    map.addMarker({lat: lat, lng: lng});

    // Definimos un array donde almacenaremos las posiciones de los marcadores
    posiciones = new Array();

    // Iteramos por todos los marcadores que hay posicionados en el mapa
    map.markers.forEach(function (elem, i) {
        // Alimentamos el array de posiciones con arrays de longitud y latitud
        posiciones.push(new Array(elem.getPosition().lat(), elem.getPosition().lng()));
    });

    // Almacenamos el array de posiciones en localStorage despues de transformarlo en una cadena JSON
    localStorage.posiciones = JSON.stringify(posiciones);
}


/**
 * Función que nos permite dibujar una ruta entre dos puntos
 * @param {Array} arrayOrigen Array que contiene las coordenadas de origen en formato [latitud, longitud]
 * @param {Array} arrayDestino Array que contiene las coordenadas de destino en formato [latitud, longitud]
 * @returns {undefined}
 */
function dibujarRuta(arrayOrigen, arrayDestino)
{
    // Dibujamos una ruta entre la posición de origen y la posición de destino
    map.drawRoute({
        // Origen en coordenadas anteriores
        origin: arrayOrigen,
        // Destino en coordenadas del click o toque actual
        destination: arrayDestino,
        // Especificamos el modo de viaje
        travelMode: 'driving',
        // Definimos el color del trazo
        strokeColor: '#000000',
        // Definimos la opacidad del trazo
        strokeOpacity: 0.6,
        // Definimos el ancho del trazo
        strokeWeight: 5
    });
}