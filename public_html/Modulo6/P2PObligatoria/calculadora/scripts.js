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

/**
 * Función inicializadora de la aplicación. Será la encargada de asignar eventos e inicializar los valores por defecto
 * @returns {undefined}
 */
$(function () {

    // Agregamos a todos los elementos de la clase botón un un evento al hacer click en ellos
    $(".btn-primary").on("click", function () {
        // El evento es una función en la cual se pasará el valor del elemento a la función parser
        // la cual será la encargada de implementar la lógica de la aplicación
        parser(this.value);
    });


    // Limpiamos los eventos de los botones a los que vamos a crear nuevos eventos específicos
    $("#sumatoriocsv").off("click");
    $("#productocsv").off("click");
    $("#tom").off("click");
    $("#fromm").off("click");
    $("#clear").off("click");


    // Asignamos al elemento con id sumatoriocsv un evento que ejecutará la función peticióncsv al hacer click en él
    $("#sumatoriocsv").on("click", function () {

        // Se llama a la función pasando el parámetro "+" para que haga la suma de una serie de valores separados por comas
        peticioncsv("+");

    });

    // Asignamos al elemento con id productocsv un evento que ejecutará la función peticióncsv al hacer click en él
    $("#productocsv").on("click", function () {

        // Se llama a la función pasando el parámetro "*" para que haga el producto de una serie de valores separados por comas
        peticioncsv("*");
    });


    // Asignamos el evento al hacer click en el botón de enviar a memoria
    $("#tom").on("click", function () {
        memoria(true, $("#display").html());
    });

    // Asignamos el evento al hacer click en el botón de recuperar de memoria
    $("#fromm").on("click", function () {
        memoria(false, $("#display").html());
    });


    // Asignamos el evento al hacer click en el botón de limpiar resultados
    $("#clear").on("click", limpia);


    // Variable para almacenar el número máximo de caracteres que puede conener
    // la pantalla de la calculadora
    tamanyoDisplay = 10;


    // Inicializamos las variables necesarias para el funcionamiento de la aplicación
    operando1 = "";
    operando2 = "";
    operacion = "";

    // Definimos el valor de nuevaOperacion
    nuevaOperacion = true;

    // Iniciamos la variable nuevoNumero que nos permitirá saber si los dígitos 
    // introducidos deben ir al operando1 (false) o al operando2 (true)
    nuevoNumero = false;


    $("#display").draggable({
        helper: 'clone',
        revert: 'invalid'
    });

    $("#memoria").droppable({
        drop: function (event, ui) {
            alert($(ui.draggable).html());
            memoria(true, $(ui.draggable).html());
        }
    });


});

/**
 * Función que nos permite trasladar información hacia y desde la memoria de la calculadora
 * @param {bool} aMemoria True si enviamos la información a la memoria de la calculadora, False si la enviamos de la memoria a la calculadora
 * @param {String} valor El valor añadido a la memoria
 * @returns {undefined}
 */
function memoria(aMemoria, valor)
{
    // Comprobamos la operación a realizar
    if (aMemoria)
    {
        // Asignamos al elemento memoria el contenido del elemento display
        $("#memoria").html(valor);
    }
    else
    {
        // Comprobamos el contenido de la memoria debe introducirse en el operando1 o en el operando2
        if (!nuevoNumero)
        {
            // Si no es así, asignamos el valor de la memoria al operando1
            operando1 = $("#memoria").html();

            // Marcamos la operación como iniciada
            nuevaOperacion = false;


            // Marcamos el operando1 como introducido
            nuevoNumero = true;

        }
        else
        {
            // Si operando1 tuviese valor, pasaríamos el valor de la memoria al operando2
            operando2 = $("#memoria").html();
        }

        // Actualizamos el valor del display
        $("#display").html($("#memoria").html());

    }



}



/**
 * Función que sirve de parser para las pulsaciones de teclas de la calculadora
 * @param {String} valor El valor de la tecla pulsada
 * @returns {undefined}
 */
function parser(valor) {


    // Comprobamos si la operación es una operación nueva o 
    // una continuación de una operación anterior
    if (nuevaOperacion) {

        // Inicializamos las varaibles
        operando1 = "";
        operando2 = "";
        operacion = "";

        // Desactivamos el flag de nueva operacion
        nuevaOperacion = false;

        // Marcamos el operando1 como no introducido
        nuevoNumero = false;
    }

    // Comprobamos si el botón pulsado es un número
    if (!isNaN(valor)) {

        // Si lo es, comprobamos si debe introducirse en el operando1 o pertenece a un nuevo número y debe introducirse en el operando2
        if (!nuevoNumero) {

            // Comprobamos que el valor del primer operando no sobrepase el límite del display
            if (operando1.toString().length < tamanyoDisplay)
            {
                // Si no hemos pulsado una operación todos los números pulsados serán del primer operando
                operando1 += valor;
            }
        }
        else
        {
            // Comprobamos que el valor del segundo operando no sobrepase el límite del display
            if (operando2.toString().length < tamanyoDisplay)
            {

                // Si tenemos una operación, todos los números son del segundo operando
                operando2 += valor;
            }
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

                    // Calculamos el resultado
                    calcularResultado();

                    break;
                }
                // Si es el botón parte entera de un número
                case "[x]":
                    // Si es el botón de raiz cuadrada de un número
                case "√x":
                    // Si es el botón de cuadrado de un número
                case "x²":
                    // Si es el botón de inverso de un número
                case "1/x":
                    // Si es el botón de factorial de un número
                case "n!":
                    // Si es el caso de la potencia n de 2
                case "2 ͯ":
                    // Si es el botón de elevar al cuadrado
                case "²":
                {
                    // Comprobamos si hay una operación pendiente de realizar
                    if (operando1 !== "" && operando2 !== "")
                    {
                        // Si es así, calculamos el resultado de la misma
                        calcularResultado();
                    }

                    // Asignamos como operación el valor correspondiente
                    operacion = valor;

                    // Y realizamos la operación
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

                    // Marcamos el operando1 como introducido
                    nuevoNumero = true;

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

                            // Marcamos el operando1 como introducido
                            nuevoNumero = true;
                        }

                    }
                    else
                    {
                        // Si no tenemos valores para los dos operadores, almacenamos la operación en la variable correspondiente
                        operacion = valor;

                        // Marcamos el operando1 como introducido
                        nuevoNumero = true;
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

            // Marcamos el operando1 como introducido
            nuevoNumero = true;
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

            // Marcamos el operando1 como introducido
            nuevoNumero = true;
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

            // Marcamos el operando1 como introducido
            nuevoNumero = true;
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

                // Marcamos el operando1 como introducido
                nuevoNumero = true;
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

            // Marcamos el operando1 como introducido
            nuevoNumero = true;
            break;
        }

        // Si el caso es la potencia n de 2
        case "2 ͯ":
        {
            // Elevamos 2 al valor del operando1 y reiniciamos el resto de las variables
            operando1 = Math.pow(parseFloat(2), parseFloat(operando1));
            operando2 = "";
            operacion = "";

            // Marcamos el operando1 como introducido
            nuevoNumero = true;
            break;
        }

        case "x²":
        {
            // Elevamos el valor del operando1 a 2 y reiniciamos el resto de las variables
            operando1 = Math.pow(parseFloat(operando1), parseFloat(2));
            operando2 = "";
            operacion = "";

            // Marcamos el operando1 como introducido
            nuevoNumero = true;

            break;
        }


        // Si la operacion es elevar a otro valor
        case "xʸ":
        {
            // Elevamos al valor del operando2 el valor del operando1 y reiniciamos el resto de las variables
            operando1 = Math.pow(parseFloat(operando1), parseFloat(operando2));
            operando2 = "";
            operacion = "";

            // Marcamos el operando1 como introducido
            nuevoNumero = true;
            break;

        }

        // Si la operacion es realizar el inverso de un número
        case "1/x":
        {
            // Realizamos el inverso del operando1 y reiniciamos el resto de variables
            operando1 = (1 / parseFloat(operando1));
            operando2 = "";
            operacion = "";

            // Marcamos el operando1 como introducido
            nuevoNumero = true;
            break;
        }

        case "n!":
        {
            // Calculamos el factorial de la parte entera del operando1
            operando1 = factorial(parteEntera(parseFloat(operando1)));
            operando2 = "";
            operacion = "";

            // Marcamos el operando1 como introducido
            nuevoNumero = true;
            break;
        }


        // Si la operacion es realizar la raiz cuadrada de un número
        case "√x":
        {

            // Comprobamos que el número sobre el que se tiene que calcular la raíz cuadrada es positivo
            if (operando1 > 0)
            {
                // Si es positivo, realizamos la raiz cuadrada del operando1 y reiniciamos el resto de variables
                operando1 = Math.sqrt(parseFloat(operando1));
            }
            else
            {
                // Si el número es negativo, mostramos un error, puesto que la raíz 
                // cuadrada de un número negativo entra dentro del ámbito de los números irracionales
                // que no es la finalidad de la práctica
                operando1 = "Error!";

                // Al producirse un error, marcamos la siguiente como una nueva operación
                nuevaOperacion = true;
            }


            // Reiniciamos las variables del operando2 y de la operación
            operando2 = "";
            operacion = "";

            // Marcamos el operando1 como introducido
            nuevoNumero = true;
            break;
        }

        // Si la operacion es realizar la parte entera de un número
        case "[x]":
        {

            // Calculamos la parte entera del operando1 haciendo uso de la función correspondiente
            operando1 = parteEntera(parseFloat(operando1));

            // Reinicamos el resto de variables
            operando2 = "";
            operacion = "";

            // Marcamos el operando1 como introducido
            nuevoNumero = true;
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

            // Reiniciamos la operación recuperando la operación original que hay en el display de operaciones
            operacion = $("#operacion").html();

            break;
        }

        case "sumatoriocsv":
        {

            // Transformamos la cadena en un array partiéndola por las comas
            operando1 = operando1.split(",");

            // Inicializamos una variable para almacenar el resultado de las operaciones
            resultado = 0;

            // Iteramos por todos los valores del array
            for (var i = 0; i < operando1.length; i++)
            {

                // Sumamos a la variable resultado el valor de cada iteración del array
                resultado += parseFloat(operando1[i]);
            }

            // Volcamos el resultado a la variable operando1 para su posterior visualización
            operando1 = resultado;

            // Marcamos el operando1 como introducido
            nuevoNumero = true;

            break;
        }

        case "productocsv":
        {

            // Transformamos la cadena en un array partiéndola por las comas
            operando1 = operando1.split(",");

            // Inicializamos una variable para almacenar el resultado de las operaciones
            // Inicializamos la variable a 1 puesto que al amacenar multiplicaciones 
            // de iniciarla a 0 el resultado no variaría nunca
            resultado = 1;

            // Iteramos por todos los valores del array
            for (var i = 0; i < operando1.length; i++)
            {

                // Multiplicamos la variable resultado por el valor de cada iteración del array
                resultado *= parseFloat(operando1[i]);
            }


            // Volcamos el resultado a la variable operando1 para su posterior visualización
            operando1 = resultado;

            // Marcamos el operando1 como introducido
            nuevoNumero = true;

            break;

        }

    }

    // Comprobamos si el operando1 contiene un mensaje de error
    if (operando1 !== "Error!")
    {
        // Si no es así, redondeamos los valores de la operación para limitar los decimales a mostrar
        // Si el tamaño del resultado es mayor de que el tamaño del display, que es la capacidad de dígitos del display con punto,
        // redondeamos el resultado                

        if (operando1.toString().length > tamanyoDisplay)
        {
            // Redondeamos el resultado a una precisión de 7 para evitar que se salga el resultado del display
            operando1 = operando1.toPrecision(7);

        }
    }
}

/**
 * Función que nos permite mostrar la información de los calculos en la pantalla
 * @returns {undefined} 
 */
function mostrarDatos() {

    // Comprobamos si tenemos valores para los dos operadores
    if (operando1 !== "" && operando2 !== "")
    {
        // Si es el caso, mostramos el segundo operador por pantalla
        $("#display").html(operando2);
    }
    else
    {
        // Si solo tenemos un operador, lo mostramos en la pantalla
        $("#display").html(operando1);
    }

    // Mostramos la operación a realizar
    $("#operacion").html(operacion);

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
    nuevoNumero = false;

    // Mostramos los datos
    mostrarDatos();
}


/**
 * Función que nos permite calcular la parte entera de un número
 * @param {int|float} n El número del cual queremos calcular la parte entera
 * @returns {Number} int La parte entera del número
 */
function parteEntera(n)
{
    // Comprobamos si el valor del número es distinto de 0
    if (n !== 0)
        // Si lo es comprobamos si tiene valor positivo
        if (n > 0)
        {
            // Si es así, devolvemos el resultado de la función floor sobre el número 
            return Math.floor(n);
        }
        else
        {
            // Si no es así, devolvemos el resultado de la función ceil sobre el número 
            return -Math.ceil(n);
        }
    else
    {
        // Si el número es cero, devolvemos ese valor
        return 0;
    }
}


/**
 * Función que nos permite calcular el factorial de un número entero positivo 
 * haciendo uso de recursividad
 * @param {int} n El número del cual queremos calcular el factorial
 * @returns {Number} Un entero resultado del calculo del factorial
 */
function factorial(n)
{
    // Comprobamos si el valor del número es 1
    if (n === 0)
    {
        // Si es así, devolvemos el valor del número
        return 1;
    }
    else
    {
        // En caso contrario, devolvemos el valor del número multiplicado por 
        // el factorial de sí mismo menos 1
        return n * factorial(n - 1);
    }
}

/**
 * 
 * Función que nos permite hacer el usuario una petición de valores en formato csv y validar su formato
 * @param {type} op El tipo de operación que se va a realizar con los valores csv
 * @returns {undefined} 
 */
function peticioncsv(op)
{

    // Inicializamos una variable mensaje
    var mensaje = "";

    // Comprobamos la operación que se va a realizar con los valores
    switch (op)
    {
        // Si es una suma de valores
        case "+":
        {
            // Creamos un mensaje para mostrar al usuario
            mensaje = "Introduzca los valores a sumar separados por comas";


            break;
        }
        // Si es una multiplicación de valores
        case "*":
        {
            // Creamos un mensaje para mostrar al usuario
            mensaje = "Introduzca los valores a multiplicar separados por comas";

            break;
        }
    }

    // Mostramoe el mensaje al usuario proponiendole unos valores como ejemplo
    var valores = prompt(mensaje, "1, 2, 3, 4");

    // Comprobamos si el usuario ha introducido algún valor
    if (valores !== null)
    {

        // Creamos una expresión regular para validar los valores introducidos por el usuario
        // La expresión regular debe validar cualquier cantidad de numeros enteros o decimales, positivos o negativos separados por comas
        var patron = /^(((,)|(, )){0,1}(((\d)|(\-\d))(\.\d){0,1})){1,}$/i;

        // Validamos los valores del usuario contra la expresión regular
        if (patron.test(valores))
        {
            // Eliminamos los espacios en blanco de la cadena introducida por el usuario
            valores = valores.replace(/ /g, "");

            // Comprobamos si hay una operación pendiente, puesto que se puede realizar una operación csv como segundo operando
            if (operacion === "")
            {
                // Si no la hay, asignamos la operación a realizar dependiendo del parámetro pasado a la función
                if (op === "*")
                {
                    // Asignamos la operación 
                    operacion = "productocsv";
                }
                else
                {
                    // Asignamos la operación 
                    operacion = "sumatoriocsv";

                }

                // Si no hay operación este es el primer operando a introducir, por tanto volcamos los valores del usuario a la variable operando1
                operando1 = valores;

                // Llamamos a la función calcularResultado para que se encargue de realizar la operación
                calcularResultado();

                // Reiniciamos todas las variables a excepción de operando1 que es donde se guarda el resultado
                operacion = "";
                operando2 = "";
            }
            else
            {
                // Si ya hay una operación se ha realizado la operación csv como segundo operando
                // Almacenamos la operación en una variable auxiliar para no perderla
                auxOp = operacion;

                // Comprobamos la operación pasada como parámetros y asignamos la operación correspondiente
                if (op === "*")
                {
                    // Asignamos la operación 
                    operacion = "productocsv";
                }
                else
                {
                    // Asignamos la operación 
                    operacion = "sumatoriocsv";

                }

                // Almacenamos el valor del primer operando en una variable auxiliar
                aux = operando1;

                // Asignamos los valores introducidos por el usuario en el primer operando
                operando1 = valores;

                // Realizamos el calculo csv, guardando el resultado en la variable operando1 dentro de la función calcularResultado
                calcularResultado();

                // Asignamos el resultado al segundo operando
                operando2 = operando1;

                // Restauramos el valor del primer operando con el valor almacenado en la variable auxiliar
                operando1 = aux;

                // Restauramos el valor de la operación primigenia desde la variable auxiliar
                operacion = auxOp;
            }

            // Marcamos el operando1 como introducido
            nuevoNumero = true;

            // Marcamos la operación como iniciada si no lo estuviese
            nuevaOperacion = false;
        }
        else
        {
            // Si los valores introducidos por el usuario no pasan la validación mostramos un mensaje de error al usuario
            alert("La lista de valores introducida no se corresponde con el formato csv");

            // Reiniciamos los valores, y asiganmos una nueva operación. Además mostramos un mensaje de eror en el display
            operando1 = "Error!";
            operando2 = "";
            operacion = "";
            nuevaOperacion = true;
        }
    }
    else
    {

        // Si el usuario no ha introducido valores, reiniciamos los operandos y la operación
        // marcando además una nueva operación
        operando1 = "";
        operando2 = "";
        operacion = "";
        nuevaOperacion = true;
    }

    // Finalmente mostramos los datos por pantalla
    mostrarDatos();

}