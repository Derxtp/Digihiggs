let config = {
    metroCubicSeg: 1.0,
    metroCubicMin: 0.016666666666666666,
    metroCubicHora: 0.0002777777777777778,
    litroSeg: 0.001,
    litroMin: 0.000016666666666666667,
    litroHora: 2.7777777777777778e-7,
    pieCubicSeg: 0.028316846592,
    pieCubicMin: 0.0004719474432,
    galonSeg: 0.003785411784,
    galonMin: 0.0000630901964,
    galonHora: 1.0515032733333334e-6,
    barrilDia: 1.8401307283333333e-6,
    barrilHora: 4.416313748e-5,
    millonPieCubicDia: 0.32774128
};

const inputs = {};
const units = Object.keys(config);

// Mapeo automático de elementos del DOM
units.forEach(unit => {
    inputs[unit] = document.getElementById(unit);
});

const pasosDiv = document.getElementById('pasos');
const precisionInput = document.getElementById('decimales');

// Escucha activa de tecleo en tiempo real
units.forEach(key => {
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
    
    // FASE 1: Normalización matemática al pivote central (m³/s)
    const factorOrigen = config[origen];
    const m3sBase = valor * factorOrigen;

    let log = `<strong>1. Normalización a la unidad base (m³/s):</strong><br>`;
    log += `Fórmula: m³/s = ${origen} * ${factorOrigen.toExponential(5)}<br>`;
    log += `Sustitución: m³/s = ${valor} * ${factorOrigen.toExponential(5)} = <strong>${formatNum(m3sBase, p)} m³/s</strong><br><br>`;

    log += `<strong>2. Conversión cruzada y desarrollo analítico hacia el resto del sistema:</strong><br>`;

    // FASE 2: Cálculo y actualización síncrona en el DOM
    units.forEach(destino => {
        if (!inputs[destino]) return;

        const factorDestino = config[destino];
        const valorCalculado = m3sBase / factorDestino;
        const stringResultado = formatNum(valorCalculado, p);

        // Evitar que el campo donde escribe el usuario parpadee o se altere
        if (destino !== origen) {
            inputs[destino].value = stringResultado;
        }

        log += `${destino}: ${formatNum(m3sBase, p)} / ${factorDestino.toExponential(5)} = <strong>${stringResultado}</strong><br>`;
    });

    pasosDiv.innerHTML = log;
}

// Control de Ventanas Modales
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
        <p>Análisis dimensional hidráulico con base en el <strong>Metro cúbico por segundo (m³/s)</strong>:</p>
        <ul>
            <li>Hacia el eje: m³/s = Cantidad leída * Factor de conversión en JSON.</li>
            <li>Desde el eje: Unidad Destino = m³/s calculados / Factor de conversión en JSON.</li>
            <li><em>Equivalencia de Fluidos Métrica:</em> m³/s = 1000 L/s.</li>
            <li><em>Equivalencia de Fluidos de Hidrocarburos:</em> Barril (bbl) = 42 galones americanos approx 0.1589 m³.</li>
            <li><em>Caudal de Gases Industriales (MMSCFD):</em> Representa un millón de pies cúbicos estándar por día medidos 
            a condiciones normales de presión (generalmente 14.7 PSI) 
            y temperatura (generalmente 60°F).</li>
        </ul>`;
};

document.getElementById("saveJSON").onclick = () => {
    try {
        config = JSON.parse(document.getElementById("jsonEditor").value);
        alert("Matriz de constantes de flujo volumétrico actualizada.");
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