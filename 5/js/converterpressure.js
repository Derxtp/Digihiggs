let config = {
    pascal: 1,
    megapascal: 1000000,
    kilopascal: 1000,
    kilogramoCentimetroCuadrado: 98066.5,
    atmosferaEstandar: 101325,
    bar: 100000,
    milimetroMercurio: 133.322387415,
    libraPulgadaCuadrada: 6894.757293168,
    columnaAgua: 9.80665,
    torricelli: 133.322368421
};

const inputs = {
    pascal: document.getElementById('pascal'),
    megapascal: document.getElementById('megapascal'),
    kilopascal: document.getElementById('kilopascal'),
    kilogramoCentimetroCuadrado: document.getElementById('kilogramoCentimetroCuadrado'),
    atmosferaEstandar: document.getElementById('atmosferaEstandar'),
    bar: document.getElementById('bar'),
    milimetroMercurio: document.getElementById('milimetroMercurio'),
    libraPulgadaCuadrada: document.getElementById('libraPulgadaCuadrada'),
    columnaAgua: document.getElementById('columnaAgua'),
    torricelli: document.getElementById('torricelli')
};

const pasosDiv = document.getElementById('pasos');
const precisionInput = document.getElementById('decimales');

// Escucha activa en tiempo real para todos los campos de presión
Object.keys(inputs).forEach(key => {
    inputs[key].addEventListener('input', (e) => {
        convertir(key, parseFloat(e.target.value));
    });
});

function convertir(origen, valor) {
    if (isNaN(valor)) {
        pasosDiv.innerHTML = "Ingrese un valor válido.";
        return;
    }

    const p = parseInt(precisionInput.value);
    
    // 1. Normalización a la unidad base: Pascal (Pa)
    const factorOrigen = config[origen];
    const pascales = valor * factorOrigen;

    let log = `<strong>1. Normalización a la unidad base (Pascal):</strong><br>`;
    log += `Fórmula: Pa = ${origen} * ${factorOrigen}<br>`;
    log += `Sustitución: Pa = ${valor} * ${factorOrigen} = ${pascales.toExponential(p)} Pa<br><br>`;

    log += `<strong>2. Conversión y desarrollo a las demás unidades:</strong><br>`;

    // 2. Cálculo cruzado de equivalencias y renderizado en pantalla
    Object.keys(inputs).forEach(destino => {
        const factorDestino = config[destino];
        const valorCalculado = pascales / factorDestino;

        // Comprobación inteligente para activar notación científica en valores subatómicos o muy altos
        const usarExponencial = (valorCalculado < 1e-4 && valorCalculado > 0) || valorCalculado >= 1e7;
        const stringResultado = usarExponencial ? valorCalculado.toExponential(p) : valorCalculado.toFixed(p);

        if (destino !== origen) {
            inputs[destino].value = stringResultado;
        }

        log += `${destino}: ${pascales.toExponential(p)} / ${factorDestino} = <strong>${stringResultado}</strong><br>`;
    });

    pasosDiv.innerHTML = log;
}

// Control y apertura de Ventanas Modales
const modales = {
    json: document.getElementById("modalJSON"),
    formulas: document.getElementById("modalFormulas")
};

document.getElementById("btnConfig").onclick = () => {
    modales.json.style.display = "block";
    document.getElementById("jsonEditor").value = JSON.stringify(config, null, 2);
};

document.getElementById("btnFormulas").onclick = () => {
    modales.formulas.style.display = "block";
    document.getElementById("listaFormulas").innerHTML = `
        <p>Tomando el <strong>Pascal (Pa)</strong> como pivote central de calibración metrológica:</p>
        <ul>
            <li>Hacia la base: Pa = Valor * Factor de Constante</li>
            <li>Desde la base: Resultado = Pa / Factor de Constante</li>
        </ul>
        <small>Nota técnica: La Columna de Agua está calculada de forma convencional a una temperatura de 4 °C.</small>`;
};

document.getElementById("saveJSON").onclick = () => {
    try {
        config = JSON.parse(document.getElementById("jsonEditor").value);
        alert("Configuración de presión actualizada con éxito localmente");
        modales.json.style.display = "none";
    } catch(e) {
        alert("Error en el formato estructural del archivo JSON");
    }
};

window.onclick = (event) => {
    if (event.target.className === "modal") {
        modales.json.style.display = "none";
        modales.formulas.style.display = "none";
    }
};

document.querySelectorAll(".close").forEach(btn => {
    btn.onclick = () => {
        modales.json.style.display = "none";
        modales.formulas.style.display = "none";
    };
});