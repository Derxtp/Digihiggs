let config = {
    radSeg: 1.0,
    radMin: 0.016666666666666666,
    radHora: 0.0002777777777777778,
    radDia: 0.000011574074074074074,
    degSeg: 0.017453292519943295,
    degMin: 0.0002908882086657216,
    degHora: 0.00000484813681109536,
    degDia: 2.0200570046230665e-7,
    rpm: 0.10471975511965977,
    bpm: 0.10471975511965977
};

const inputs = {};
const units = Object.keys(config);

// Inicialización automática del DOM
units.forEach(unit => {
    inputs[unit] = document.getElementById(unit);
});

const pasosDiv = document.getElementById('pasos');
const precisionInput = document.getElementById('decimales');

units.forEach(key => {
    if (inputs[key]) {
        inputs[key].addEventListener('input', (e) => {
            convertir(key, parseFloat(e.target.value));
        });
    }
});

function convertir(origen, valor) {
    if (isNaN(valor)) {
        pasosDiv.innerHTML = "Ingrese un valor numérico válido.";
        return;
    }

    const p = parseInt(precisionInput.value);
    
    // 1. Normalización a la unidad base: rad/s
    const factorOrigen = config[origen];
    const radSegBase = valor * factorOrigen;

    let log = `<strong>1. Normalización a la unidad base (rad/s):</strong><br>`;
    log += `Fórmula: rad/s = ${origen} * ${factorOrigen.toExponential(6)}<br>`;
    const usarExpBase = (radSegBase < 1e-4 && radSegBase > 0) || radSegBase >= 1e6;
    log += `Sustitución: rad/s = ${valor} * ${factorOrigen.toExponential(6)} = <strong>${usarExpBase ? radSegBase.toExponential(p) : radSegBase.toFixed(p)} rad/s</strong><br><br>`;

    log += `<strong>2. Conversión cruzada y desarrollo analítico:</strong><br>`;

    // 2. Distribución y renderizado hacia el DOM de manera síncrona
    units.forEach(destino => {
        if (!inputs[destino]) return;

        const factorDestino = config[destino];
        const valorCalculado = radSegBase / factorDestino;

        const usarExponencial = (valorCalculado < 1e-4 && valorCalculado > 0) || valorCalculado >= 1e6;
        const stringResultado = usarExponencial ? valorCalculado.toExponential(p) : valorCalculado.toFixed(p);

        if (destino !== origen) {
            inputs[destino].value = stringResultado;
        }

        log += `${destino}: ${usarExpBase ? radSegBase.toExponential(p) : radSegBase.toFixed(p)} / ${factorDestino.toExponential(5)} = <strong>${stringResultado}</strong><br>`;
    });

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
        <p>Tomando el <strong>radián por segundo (rad/s)</strong> como constante unificada:</p>
        <ul>
            <li>Hacia la base: rad/s = Cantidad de origen * Factor JSON</li>
            <li>Desde la base: Unidad Destino = rad/s calculados / Factor JSON</li>
            <li><em>Identidad Temporal de Ritmo:</em> 1 RPM = 1 BPM. Ambas representan un ciclo por minuto, traduciéndose de manera idéntica como $\\frac{2\\pi}{60}$ rad/s.</li>
        </ul>`;
};

document.getElementById("saveJSON").onclick = () => {
    try {
        config = JSON.parse(document.getElementById("jsonEditor").value);
        alert("Configuración de velocidad angular guardada de manera exitosa.");
        modales.json.style.display = "none";
    } catch(e) {
        alert("Error de sintaxis en el archivo JSON.");
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