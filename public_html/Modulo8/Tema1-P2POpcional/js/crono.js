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


    function mostrar() {
        cl.html((+cl.html() + 0.01).toFixed(2));
    }
    ;

    function arrancar() {
        t = setInterval(mostrar, 10);
    }
    ;

    function parar() {
        clearInterval(t);
        t = undefined;
    }
    ;

    function cambiar() {
        if (!t) {
            arrancar();
        }
        else {
            parar();
        }
    }
    ;

    $("#content").on("tap", cambiar);

    $("#content").on("swipe", function () {
        cl.html("0.00");

    });
});