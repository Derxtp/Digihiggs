let config = {
    kilogramo: 1,
    gramo: 0.001,
    miligramo: 0.000001,
    microgramo: 0.000000001,
    toneladaMetrica: 1000,
    libra: 0.45359237,
    onza: 0.028349523125,
    toneladaCorta: 907.18474,
    stone: 6.35029318
};

const inputs = {
    kilogramo: document.getElementById('kilogramo'),
    gramo: document.getElementById('gramo'),
    miligramo: document.getElementById('miligramo'),
    microgramo: document.getElementById('microgramo'),
    toneladaMetrica: document.getElementById('toneladaMetrica'),
    libra: document.getElementById('libra'),
    onza: document.getElementById('onza'),
    toneladaCorta: document.getElementById('toneladaCorta'),
    stone: document.getElementById('stone')
};

const pasosDiv = document.getElementById('pasos');
const precisionInput = document.getElementById('decimales');

// Evento para entradas en tiempo real
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
    
    // 1. Normalizar a la unidad base: KILOGRAMO (kg)
    const factorOrigen = config[origen];
    const kilos = valor * factorOrigen;

    let log = `<strong>1. Normalización a la unidad base (Kilogramo):</strong><br>`;
    log += `Fórmula: kg = ${origen} * ${factorOrigen}<br>`;
    log += `Sustitución: kg = ${valor} * ${factorOrigen} = ${kilos.toExponential(p)} kg<br><br>`;

    log += `<strong>2. Conversión y desarrollo a las demás unidades:</strong><br>`;

    // 2. Calcular y actualizar el resto de unidades
    Object.keys(inputs).forEach(destino => {
        const factorDestino = config[destino];
        const valorCalculado = kilos / factorDestino;

        // Formatear visualización para evitar "0.00" en números subatómicos o microscópicos
        const formatoCientifico = (valorCalculado < 1e-4 && valorCalculado > 0);
        const stringResultado = formatoCientifico ? valorCalculado.toExponential(p) : valorCalculado.toFixed(p);

        if (destino !== origen) {
            inputs[destino].value = stringResultado;
        }

        log += `${destino}: ${kilos.toExponential(p)} / ${factorDestino} = <strong>${stringResultado}</strong><br>`;
    });

    pasosDiv.innerHTML = log;
}

// Gestión de Ventanas Modales
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
        <p>Tomando el <strong>Kilogramo (kg)</strong> como pivote de la constante:</p>
        <ul>
            <li>Convertir a Kilogramos: kg = Valor * Factor</li>
            <li>Desde Kilogramos: Destino = kg / Factor</li>
        </ul>
        <small>Valores de masa calculados dinámicamente según estándares internacionales del SI.</small>`;
};

document.getElementById("saveJSON").onclick = () => {
    try {
        config = JSON.parse(document.getElementById("jsonEditor").value);
        alert("Configuración de masa actualizada con éxito");
        modales.json.style.display = "none";
    } catch(e) {
        alert("Error en el formato JSON");
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