let config = {
    nanovatio: 1e-9,
    microvatio: 1e-6,
    milivatio: 0.001,
    vatio: 1.0,
    kilovatio: 1000.0,
    megavatio: 1000000.0,
    gigavatio: 1000000000.0,
    teravatio: 1000000000000.0,
    caballoFuerza: 745.699872,
    caballoVapor: 735.49875,
    piesLibrasSeg: 1.355817948,
    btuHora: 0.29307107,
    caloriasSeg: 4.1868,
    kilocaloriasHora: 1.163,
    toneladaRefrigeracion: 3516.85284
};

const inputsLineales = Object.keys(config);
const inputsLogaritmicos = ['dbw', 'dbm'];

const inputs = {};
inputsLineales.forEach(unit => inputs[unit] = document.getElementById(unit));
inputsLogaritmicos.forEach(unit => inputs[unit] = document.getElementById(unit));

const pasosDiv = document.getElementById('pasos');
const precisionInput = document.getElementById('decimales');

// Escucha en tiempo real para todos los campos
Object.keys(inputs).forEach(key => {
    if (inputs[key]) {
        inputs[key].addEventListener('input', (e) => {
            convertir(key, parseFloat(e.target.value));
        });
    }
});

function formatNum(val, p) {
    if (val === 0) return "0";
    const esExp = (Math.abs(val) < 1e-4) || Math.abs(val) >= 1e6;
    return esExp ? val.toExponential(p) : val.toFixed(p);
}

function convertir(origen, valor) {
    if (isNaN(valor)) {
        pasosDiv.innerHTML = "Ingrese un valor numérico válido.";
        return;
    }

    const p = parseInt(precisionInput.value);
    let vatiosBase = 0;
    let log = `<strong>1. Normalización a la unidad base (Vatio - W):</strong><br>`;

    // --- FASE 1: Conversión de Origen a Vatios ---
    if (origen === 'dbw') {
        vatiosBase = Math.pow(10, valor / 10);
        log += `Fórmula logarítmica: W = 10^(dBW / 10)<br>`;
        log += `Sustitución: W = 10^(${valor} / 10) = <strong>${formatNum(vatiosBase, p)} W</strong><br><br>`;
    } else if (origen === 'dbm') {
        vatiosBase = Math.pow(10, (valor - 30) / 10);
        log += `Fórmula logarítmica: W = 10^((dBm - 30) / 10)<br>`;
        log += `Sustitución: W = 10^((${valor} - 30) / 10) = <strong>${formatNum(vatiosBase, p)} W</strong><br><br>`;
    } else {
        const factor = config[origen];
        vatiosBase = valor * factor;
        log += `Fórmula lineal: W = ${origen} * ${factor.toExponential()}<br>`;
        log += `Sustitución: W = ${valor} * ${factor.toExponential()} = <strong>${formatNum(vatiosBase, p)} W</strong><br><br>`;
    }

    log += `<strong>2. Conversión cruzada y desarrollo analítico:</strong><br>`;

    // --- FASE 2: Distribución y cálculo hacia los destinos ---
    // Bloque A: Salidas Lineales
    inputsLineales.forEach(destino => {
        if (!inputs[destino]) return;
        const factorDestino = config[destino];
        const valorCalculado = vatiosBase / factorDestino;
        const stringResultado = formatNum(valorCalculado, p);

        if (destino !== origen) inputs[destino].value = stringResultado;
        log += `${destino}: ${formatNum(vatiosBase, p)} / ${factorDestino.toExponential()} = <strong>${stringResultado}</strong><br>`;
    });

    // Bloque B: Salidas Logarítmicas (Protección metrológica anti-indeterminación)
    if (vatiosBase <= 0) {
        inputsLogaritmicos.forEach(destino => {
            if (destino !== origen) inputs[destino].value = "-∞";
        });
        log += `Unidades dBW/dBm: El valor base es ≤ 0, el resultado logarítmico tiende a <strong>-Indeterminado (-∞)</strong>.<br>`;
    } else {
        // Cálculo de dBW
        const valorDBW = 10 * Math.log10(vatiosBase);
        const stringDBW = valorDBW.toFixed(p);
        if (origen !== 'dbw') inputs['dbw'].value = stringDBW;
        log += `dbw: 10 * log10(${formatNum(vatiosBase, p)}) = <strong>${stringDBW} dBW</strong><br>`;

        // Cálculo de dBm
        const valorDBM = 10 * Math.log10(vatiosBase * 1000);
        const stringDBM = valorDBM.toFixed(p);
        if (origen !== 'dbm') inputs['dbm'].value = stringDBM;
        log += `dbm: 10 * log10(${formatNum(vatiosBase, p)} * 1000) = <strong>${stringDBM} dBm</strong><br>`;
    }

    pasosDiv.innerHTML = log;
}

// Ventanas Modales
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
        <p>Análisis dimensional de conversión con base en el <strong>Vatio (W)</strong>:</p>
        <ul>
            <li><strong>Sistemas Lineales:</strong> Valor Destino = W_base / Factor Constante en JSON.</li>
            <li><strong>Conversión Eléctrica (HP/CV):</strong> HP approx 745.7 W, CV approx 735.5 W.</li>
            <li><strong>Conversión Térmica (BTU/h):</strong> BTU/h approx 0.293 W.</li>
            <li><strong>Fórmulas de Telecomunicación (Logarítmicas):</strong>
                <br>dBW = 10 * log<sub>10</sub>Watts
                <br>dBm = dBW + 30
            </li>
        </ul>`;
};

document.getElementById("saveJSON").onclick = () => {
    try {
        config = JSON.parse(document.getElementById("jsonEditor").value);
        alert("Constantes mecánicas y logarítmicas de potencia actualizadas con éxito.");
        modales.json.style.display = "none";
    } catch(e) {
        alert("Error de sintaxis en el objeto JSON.");
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