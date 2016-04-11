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

// Asignación de la inicialización de Javascript en la web
window.onload = inicializar;

/**
 * Función para inicializar la página, las variables y eventos necesarios para 
 * su funcionamiento
 * @returns {undefined}
 */
function inicializar()
{

    // Comprobamos usando el botón de igual para comprobar los tipos de sistemas 
    // que se pueden usar para enlazar elementos y los almacenamos en una variables 
    // globales para poder usar en la función crearEvento
    tieneEventlistener = (document.getElementById('igual').addEventListener ? true : false);
    tieneAttachEvent = (document.getElementById('igual').attachEvent ? true : false);


    // Asignamos los eventos a los botones numéricos
    crearEvento(document.getElementById('1'), 'click', anyadir1);
    crearEvento(document.getElementById('2'), 'click', anyadir2);
    crearEvento(document.getElementById('3'), 'click', anyadir3);
    crearEvento(document.getElementById('4'), 'click', anyadir4);
    crearEvento(document.getElementById('5'), 'click', anyadir5);
    crearEvento(document.getElementById('6'), 'click', anyadir6);
    crearEvento(document.getElementById('7'), 'click', anyadir7);
    crearEvento(document.getElementById('8'), 'click', anyadir8);
    crearEvento(document.getElementById('9'), 'click', anyadir9);
    crearEvento(document.getElementById('0'), 'click', anyadir0);
    crearEvento(document.getElementById('punto'), 'click', anyadirPunto);

    // Asignamos los eventos a los botones de las operaciones básicas
    crearEvento(document.getElementById('suma'), 'click', suma);
    crearEvento(document.getElementById('resta'), 'click', resta);
    crearEvento(document.getElementById('multiplicacion'), 'click', multiplicacion);
    crearEvento(document.getElementById('division'), 'click', division);

    // Asignamos los eventos a los botones de las operaciones avanzadas
    crearEvento(document.getElementById('cuadrado'), 'click', cuadrado);
    crearEvento(document.getElementById('potencia'), 'click', potencia);
    crearEvento(document.getElementById('inverso'), 'click', inverso);
    crearEvento(document.getElementById('raiz'), 'click', raiz);
    crearEvento(document.getElementById('entera'), 'click', entera);
    crearEvento(document.getElementById('neg'), 'click', neg);

    // Asignamos los eventos al botón de limpiar datos
    crearEvento(document.getElementById('clear'), 'click', limpia);

    // Asignamos los eventos al botón de mostras resultados
    crearEvento(document.getElementById('igual'), 'click', igual);


    // Inicializamos las variables necesarias para el funcionamiento de la aplicación
    operando1 = "";
    operando2 = "";
    operacion = "";

    nuevaOperacion = true;

}

/**
 * Función que sirve de parser para las pulsaciones de teclas de la calculadora
 * @param {String} valor El valor de la tecla pulsada
 * @returns {undefined}
 */
function resultado(valor) {

    // Comprobamos si la operación es una operación nueva o 
    // una continuación de una operación anterior
    if (nuevaOperacion) {

        // Inicializamos las varaibles
        operando1 = "";
        operando2 = "";
        operacion = "";

        // Desactivamos el flag de nueva operacion
        nuevaOperacion = false;
    }

    // Comprobamos si el botón pulsado es un número
    if (!isNaN(valor)) {

        // Si lo es, comprobamos si hemos pulsado con anterioridad un botón de operación
        if (operacion === "") {

            // Si no hemos pulsado una operación todos los números pulsados serán del primer operando
            operando1 += valor;
        }
        else
        {
            // Si tenemos una operación, todos los números son del segundo operando
            operando2 += valor;
        }
    }
    else {

        // Verificamos que al menos hemos introducido un operando antes de poder realizar una operación
        if (operando1 !== "")
        {
            // Comprobamos el valor del botón pulsado
            switch (valor)
            {


                // Si es el botón de negativo de un número
                case "+/-":
                {
                    // Asignamos la operación a la varible correspondiente
                    operacion = valor;

                    // Calculamos el resultaro
                    calcularResultado();

                    break;
                }
                // Si es el botón parte entera de un número
                case "[x]":
                    // Si es el botón de raiz cuadrada de un número
                case "√x":
                    // Si es el botón de inverso de un número
                case "1/x":
                    // Si es el botón de elevar al cuadrado
                case "²":
                {
                    // Comprobamos si hay una operación pendiente de realizar
                    if (operando1 !== "" && operando2 !== "")
                    {
                        // Si es así, calculamos el resultado de la misma
                        calcularResultado();
                    }

                    // Asignamos como operación el cuadrado del resultado
                    operacion = valor;

                    // Y realizamos al operación de potencia
                    calcularResultado();

                    break;
                }


                // Si es el botón de elevar a otro valor
                case "xʸ":
                {
                    // Comprobamos si hay una operación pendiente de realizar
                    if (operando1 !== "" && operando2 !== "")
                    {
                        // Si es así, calculamos el resultado de la misma
                        calcularResultado();
                    }

                    // Asignamos como operación de potencia del resultado
                    operacion = valor;
                    break;
                }


                // Si es el botón de punto decimal
                case ".":
                {
                    // Si lo es, hacemos la misma comprobación que arriba para averiguar 
                    // si el punto decimal corresponde al primer operando o al segundo
                    if (operacion !== "")
                    {
                        // Comprobamos que no se haya introducido anteriormente un punto decimal en el operador
                        if (operando2.toString().indexOf(".") === -1)
                        {
                            // Si es el primer decimal, lo concatenamos al operando
                            operando2 += valor;
                        }
                    }
                    else
                    {

                        // Comprobamos que no se haya introducido anteriormente un punto decimal en el operador
                        if (operando1.toString().indexOf(".") === -1)
                        {
                            // Si es el primer decimal, lo concatenamos al operando
                            operando1 += valor;
                        }
                    }
                    break;
                }

                // Si es el botón pulsdo es cualquier otro
                default:
                {
                    // Si no es un punto decimal, ni es un número, debe ser una operación. 
                    // Comprobamos si tenemos valor en los dos operadores
                    if (operando1 !== "" && operando2 !== "") {

                        // Si tenemos valores en los operandos, calculamos el resultado
                        calcularResultado();

                        // Comprobamos si la operación introducida es un igual
                        if (valor === "=")
                        {
                            // Si lo es activamos el flag de nueva operacion
                            nuevaOperacion = true;

                            // Reinicamos la operacion
                            operacion = "";
                        }
                        else
                        {
                            // Si la operación no es un igual, la almacenamos en la variable correspodniente
                            operacion = valor;
                        }

                    }
                    else
                    {
                        // Si no tenemos valores para los dos operadores, almacenamos la operación en la variable correspondiente
                        operacion = valor;
                    }

                    break;
                }
            }

        }
    }

    // Finalmente mostramos los datos por pantalla
    mostrarDatos();

}

/**
 * Función donde se realizan las operaciones de la calculadora
 * @returns {undefined}
 */
function calcularResultado() {

    // Comprobamos el valor de la operación con la que trabajaremos
    switch (operacion) {

        // Si la operacion es una suma
        case "+":
        {
            // Transformamos el valor de los operando a float y los sumamos entre sí
            // almacenando el resultado en la variable operando1 reiniciando el resto
            operando1 = (parseFloat(operando1) + parseFloat(operando2));
            operando2 = "";
            operacion = "";
            break;
        }

        // Si la operacion es una resta
        case "-":
        {
            // Transformamos el valor de los operando a float y los restamos entre sí
            // almacenando el resultado en la variable operando1 reiniciando el resto
            operando1 = (parseFloat(operando1) - parseFloat(operando2));
            operando2 = "";
            operacion = "";
            break;
        }

        // Si la operacion es una multiplicacion
        case "*":
        {
            // Transformamos el valor de los operando a float y los multiplicamos entre sí
            // almacenando el resultado en la variable operando1 reiniciando el resto
            operando1 = (parseFloat(operando1) * parseFloat(operando2));
            operando2 = "";
            operacion = "";
            break;
        }

        // Si la operacion es una división
        case "/":
        {
            // Verificamos si el segundo operando es un cero
            if (parseFloat(operando2) !== 0) {
                // Si no lo es, transformamos el valor de los operando a float y los dividmos entre sí
                // almacenando el resultado en la variable operando1 reiniciando el resto
                operando1 = (parseFloat(operando1) / parseFloat(operando2));
                operando2 = "";
                operacion = "";
            }
            else
            {
                // Si se está intentado dividir entre 0, mostramos un mensaje 
                // de error y reiniciamos las operaciones
                operando1 = "Error!";
                operando2 = "";
                operacion = "";
                nuevaOperacion = true;

            }
            break;
        }

        // Si la operacion es elevar al cuadrado
        case "²":
        {
            // Elevamos al cuadrado el valor del operando1 y reiniciamos el resto de las variables
            operando1 = Math.pow(parseFloat(operando1), 2);
            operando2 = "";
            operacion = "";
            break;
        }

        // Si la operacion es elevar a otro valor
        case "xʸ":
        {
            // Elevamos al valor del operando2 el valor del operando1 y reiniciamos el resto de las variables
            operando1 = Math.pow(parseFloat(operando1), parseFloat(operando2));
            operando2 = "";
            operacion = "";
            
            break;

        }

        // Si la operacion es realizar el inverso de un número
        case "1/x":
        {
            // Realizamos el inverso del operando1 y reiniciamos el resto de variables
            operando1 = (1 / parseFloat(operando1));
            operando2 = "";
            operacion = "";

            break;
        }

        // Si la operacion es realizar la raiz cuadrada de un número
        case "√x":
        {
            // Realizamos la raiz cuadrada del operando1 y reiniciamos el resto de variables
            operando1 = Math.sqrt(parseFloat(operando1));
            operando2 = "";
            operacion = "";

            break;
        }

        // Si la operacion es realizar la parte entera de un número
        case "[x]":
        {
            // Comprobamos si el valor del operando 1 es distinto de 0
            if (parseFloat(operando1) !== 0)
                // Si lo es comprobamos si tiene valor positivo
                if (parseFloat(operando1) > 0)
                {
                    // Si es así, devolvemos el resultado de la función floor sobre el operando1
                    operando1 = Math.floor(parseFloat(operando1));
                }
                else
                {
                    // Si no es así, devolvemos el resultado de la función ceil sobre el operando1
                    operando1 = Math.ceil(parseFloat(operando1));
                }
            else
            {
                // Si el operando1 es cero, le asignamos ese valor
                operando1 = 0;
            }

            // Reinicamos el resto de variables
            operando2 = "";
            operacion = "";


            break;
        }

        case "+/-":
        {
            // Comprobamos si el operando2 tiene algún valor
            if (operando2 === "")
            {
                // En este caso transformamos el operando1 a float y lo multiplicamos por -1                
                operando1 = (parseFloat(operando1) * -1);
            }
            else
            {
                // En este caso transformamos el operando2 a float y lo multiplicamos por -1                
                operando2 = (parseFloat(operando2) * -1);
            }

            // Reiniciamos la operación
            operacion = document.getElementById('operacion').innerHTML;

            break;
        }
    }

    // Comprobamos si el operando1 contiene un mensaje de error
    if (operando1 !== "Error!")
    {
        // Si no es así, redondeamos los valores de la operación para limitar los decimales a mostrar
        operando1 = Math.round(operando1 * 100) / 100;
    }
}


/**
 * Función que nos permite mostrar la información de los calculos en la pantalla
 * @returns {undefined} 
 */
function mostrarDatos() {

    // Recuperamos los objetos donde se muestra la información de las operaciones
    var display = document.getElementById("display");
    var ope = document.getElementById("operacion");

    // Comprobamos si tenemos valores para los dos operadores
    if (operando1 !== "" && operando2 !== "")
    {
        // Si es el caso, mostramos el segundo operador por pantalla
        display.innerHTML = operando2;
    }
    else
    {
        // Si solo tenemos un operador, lo mostramos en la pantalla
        display.innerHTML = operando1;
    }

    // Mostramos la operación a realizar
    ope.innerHTML = operacion;

}


/**
 * Función que nos permite simular la pulsación de la tecla 1
 * @returns {undefined} 
 */
function anyadir1() {
    resultado("1");
}

/**
 * Función que nos permite simular la pulsación de la tecla 2
 * @returns {undefined} 
 */
function anyadir2() {
    resultado("2");
}

/**
 * Función que nos permite simular la pulsación de la tecla 3
 * @returns {undefined} 
 */
function anyadir3() {
    resultado("3");
}

/**
 * Función que nos permite simular la pulsación de la tecla 4
 * @returns {undefined} 
 */
function anyadir4() {
    resultado("4");
}

/**
 * Función que nos permite simular la pulsación de la tecla 5
 * @returns {undefined} 
 */
function anyadir5() {
    resultado("5");
}

/**
 * Función que nos permite simular la pulsación de la tecla 6
 * @returns {undefined} 
 */
function anyadir6() {
    resultado("6");
}

/**
 * Función que nos permite simular la pulsación de la tecla 7
 * @returns {undefined} 
 */
function anyadir7() {
    resultado("7");
}

/**
 * Función que nos permite simular la pulsación de la tecla 8
 * @returns {undefined} 
 */
function anyadir8() {
    resultado("8");
}

/**
 * Función que nos permite simular la pulsación de la tecla 9
 * @returns {undefined} 
 */
function anyadir9() {
    resultado("9");
}


/**
 * Función que nos permite simular la pulsación de la tecla 0
 * @returns {undefined} 
 */
function anyadir0() {
    resultado("0");
}

/**
 * Función que nos permite simular la pulsación de la tecla decimal
 * @returns {undefined} 
 */
function anyadirPunto() {
    resultado(".");
}

/**
 * Función que nos permite simular la pulsación de la tecla de suma
 * @returns {undefined} 
 */
function suma() {
    resultado("+");
}

/**
 * Función que nos permite simular la pulsación de la tecla de resta
 * @returns {undefined} 
 */
function resta() {
    resultado("-");
}

/**
 * Función que nos permite simular la pulsación de la tecla de multiplicación
 * @returns {undefined} 
 */
function multiplicacion() {
    resultado("*");
}

/**
 * Función que nos permite simular la pulsación de la tecla de división
 * @returns {undefined} 
 */
function division() {
    resultado("/");
}

/**
 * Función que nos permite simular la pulsación de la tecla de resultado
 * @returns {undefined} 
 */
function igual() {
    resultado("=");
}

/**
 * Función que nos permite simular la pulsación de la tecla de cuadrado de un número
 * @returns {undefined} 
 */
function cuadrado() {
    resultado("²");
}

/**
 * Función que nos permite simular la pulsación de la tecla de potencia de un número
 * @returns {undefined} 
 */
function potencia() {
    resultado("xʸ");
}

/**
 * Función que nos permite simular la pulsación de la tecla de inverso de un número
 * @returns {undefined} 
 */
function inverso() {
    resultado("1/x");
}

/**
 * Función que nos permite simular la pulsación de la tecla de raiz cuadrada de un número
 * @returns {undefined} 
 */
function raiz() {
    resultado("√x");
}

/**
 * Función que nos permite simular la pulsación de la tecla de parte entera de un número
 * @returns {undefined} 
 */
function entera() {
    resultado("[x]");
}

/**
 * Función que nos permite simular la pulsación de la tecla de valor negativo de un número
 * @returns {undefined} 
 */
function neg() {
    resultado("+/-");
}

/**
 * Función que nos permite simular la pulsación de la tecla de limpieza de la calculadora
 * @returns {undefined} 
 */
function limpia() {

    // Limpiamos las variables
    operando1 = "";
    operando2 = "";
    operacion = "";

    // Mostramos los datos
    mostrarDatos();
}

/**
 * Función que nos permite crear un evento y asociarlo a una función
 * @param {document.element} elemento Elemento sobre el que se asociará el evento
 * @param {string} tipoEvento Tipo de evento a crear
 * @param {function} funcion Función asociada al evento
 * @returns {undefined}
 */
function  crearEvento(elemento, tipoEvento, funcion)
{
    // Comprobamos si al elemento se le puede añadir un EventListener, lo que 
    // indica que el navegador es compatible con los standards W3C
    if (tieneEventlistener)
    {
        // Asignamos el evento
        elemento.addEventListener(tipoEvento, funcion, false);
    }
    // De no ser así, comprobamos si se le puede adjuntar el un evento, lo que 
    // indica que el navegador es compatible con internet explorer
    else if (tieneAttachEvent)
    {
        // Puesto que al usar attachEvent perdemos la capacidad de acceder al 
        // objeto this dentro de la función que asignamos al evento, usamos el 
        // método call() para pasar el elemento como parámetro y asignarlo al 
        // objeto this de la función
        elemento.attachEvent("on" + tipoEvento, function () {
            funcion.call(elemento);
        });
    }
    // Finalmente si ninguno de los dos métodos anteriores funcionase, usamos 
    // el método tradicional para asignar eventos
    else
    {
        // Asignamos el evento por el método clásico
        elemento["on" + tipoEvento] = funcion;
    }
}