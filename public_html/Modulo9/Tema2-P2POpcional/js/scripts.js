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

var map, lat, lng;

$(function () {

    geolocalizar();

});

function geolocalizar() {


    //localStorage.posiciones = "";

    GMaps.geolocate({
        success: function (position) {
            lat = position.coords.latitude;  // guarda coords en lat y lng
            lng = position.coords.longitude;

            map = new GMaps({// muestra mapa centrado en coords [lat, lng]
                el: '#map',
                lat: lat,
                lng: lng,
                click: enlazarMarcador,
                tap: enlazarMarcador
            });

            if (localStorage.posiciones)
            {

                var posiciones = JSON.parse(localStorage.posiciones);

                posiciones.forEach(function (elemento) {
                    map.addMarker({lat: elemento[0], lng: elemento[1]});  // pone marcador en mapa
                });


                for (var i = 0; i < map.markers.length; i++)
                {
                    if (i > 0)
                    {
                        map.drawRoute({
                            origin: [map.markers[i - 1].getPosition().lat(), map.markers[i - 1].getPosition().lng()], // origen en coordenadas anteriores
                            // destino en coordenadas del click o toque actual
                            destination: [map.markers[i].getPosition().lat(), map.markers[i].getPosition().lng()],
                            travelMode: 'driving',
                            strokeColor: '#000000',
                            strokeOpacity: 0.6,
                            strokeWeight: 5
                        });
                    }
                }


            }
            else
            {

                map.addMarker({lat: lat, lng: lng});  // marcador en [lat, lng]
            }
        },
        error: function (error) {
            alert('Geolocalización falla: ' + error.message);
        },
        not_supported: function () {
            alert("Su navegador no soporta geolocalización");
        }
    });
}

function enlazarMarcador(e) {

    // muestra ruta entre marcas anteriores y actuales
    map.drawRoute({
        origin: [lat, lng], // origen en coordenadas anteriores
        // destino en coordenadas del click o toque actual
        destination: [e.latLng.lat(), e.latLng.lng()],
        travelMode: 'driving',
        strokeColor: '#000000',
        strokeOpacity: 0.6,
        strokeWeight: 5
    });

    lat = e.latLng.lat();   // guarda coords para marca siguiente
    lng = e.latLng.lng();

    map.addMarker({lat: lat, lng: lng});  // pone marcador en mapa

    posiciones = new Array();

    map.markers.forEach(function (elem, i) {
        posiciones.push(new Array(elem.getPosition().lat(), elem.getPosition().lng()));
    });


    localStorage.posiciones = JSON.stringify(posiciones);
}