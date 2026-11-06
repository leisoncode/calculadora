const pantalla = document.getElementById("pantalla");
const teclas = document.querySelector(".teclas");

const simbolos = { "+": "+", "-": "−", "*": "×", "/": "÷" };

let actual = "0";
let anterior = null;
let operador = null;
let expresion = "";
let escribiendo = true;
let terminado = false;

function mostrar() {
  let texto;

  if (terminado) {
    texto = expresion + " " + actual;
  } else if (escribiendo) {
    texto = (expresion === "" ? "" : expresion + " ") + actual;
  } else {
    texto = expresion;
  }

  pantalla.textContent = texto;
  pantalla.scrollLeft = pantalla.scrollWidth;
}

function operar(a, b, op) {
  if (op === "+") {
    return a + b;
  }
  if (op === "-") {
    return a - b;
  }
  if (op === "*") {
    return a * b;
  }
  if (b === 0) {
    return null;
  }
  return a / b;
}

function terminarConError() {
  expresion = expresion + " " + actual + " =";
  actual = "Error";
  anterior = null;
  operador = null;
  escribiendo = false;
  terminado = true;
}

function agregarNumero(valor) {
  if (terminado) {
    limpiar();
  }

  if (!escribiendo) {
    actual = "0";
    escribiendo = true;
  }

  if (valor === ".") {
    if (!actual.includes(".")) {
      actual += ".";
    }
    return;
  }

  actual = actual === "0" ? valor : actual + valor;
}

function elegirOperador(op) {
  if (actual === "Error") {
    return;
  }

  if (terminado) {
    anterior = parseFloat(actual);
    expresion = actual + " " + simbolos[op];
    operador = op;
    escribiendo = false;
    terminado = false;
    return;
  }

  if (operador !== null && !escribiendo) {
    operador = op;
    expresion = expresion.slice(0, -1) + simbolos[op];
    return;
  }

  if (operador !== null) {
    const resultado = operar(anterior, parseFloat(actual), operador);

    if (resultado === null) {
      terminarConError();
      return;
    }

    anterior = parseFloat(resultado.toFixed(10));
    expresion = expresion + " " + actual + " " + simbolos[op];
  } else {
    anterior = parseFloat(actual);
    expresion = actual + " " + simbolos[op];
  }

  operador = op;
  escribiendo = false;
}

function calcular() {
  if (operador === null || !escribiendo) {
    return;
  }

  const resultado = operar(anterior, parseFloat(actual), operador);

  if (resultado === null) {
    terminarConError();
    return;
  }

  expresion = expresion + " " + actual + " =";
  actual = String(parseFloat(resultado.toFixed(10)));
  anterior = null;
  operador = null;
  escribiendo = false;
  terminado = true;
}

function limpiar() {
  actual = "0";
  anterior = null;
  operador = null;
  expresion = "";
  escribiendo = true;
  terminado = false;
}

function borrar() {
  if (terminado || !escribiendo) {
    return;
  }

  if (actual.length <= 1 || (actual.length === 2 && actual.startsWith("-"))) {
    actual = "0";
  } else {
    actual = actual.slice(0, -1);
  }
}

teclas.addEventListener("click", function (evento) {
  const boton = evento.target.closest("button");

  if (boton === null) {
    return;
  }

  const valor = boton.dataset.valor;
  const accion = boton.dataset.accion;

  if (accion === "limpiar") {
    limpiar();
  } else if (accion === "borrar") {
    borrar();
  } else if (accion === "calcular") {
    calcular();
  } else if ("+-*/".includes(valor)) {
    elegirOperador(valor);
  } else {
    agregarNumero(valor);
  }

  mostrar();
});

mostrar();