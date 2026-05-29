let config = {
    newtonCoulomb: 1.0,
    kilonewtonCoulomb: 1000.0,
    meganewtonCoulomb: 1000000.0,
    voltioMetro: 1.0,
    voltioCentimetro: 100.0,
    voltioMilimetro: 1000.0,
    kilovoltioMetro: 1000.0,
    kilovoltioCentimetro: 100000.0,
    megavoltioMetro: 1000000.0
};

const inputs = {};
const units = Object.keys(config);

// Mapeo automático de los elementos del DOM
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
    const esExp = (Math.abs(val) < 1e-3) || Math.abs(val) >= 1e6;
    return esExp ? val.toExponential(p) : val.toFixed(p);
}

function convertir(origen, valor) {
    if (isNaN(valor)) {
        pasosDiv.innerHTML = "Ingrese un valor numérico válido.";
        return;
    }

    const p = parseInt(precisionInput.value);
    
    // FASE 1: Normalización matemática al pivote central (N/C)
    const factorOrigen = config[origen];
    const ncBase = valor * factorOrigen;

    let log = `<strong>1. Normalización a la unidad base (Newton por Coulomb - N/C):</strong><br>`;
    log += `Fórmula: N/C = ${origen} * ${factorOrigen.toExponential()}<br>`;
    log += `Sustitución: N/C = ${valor} * ${factorOrigen.toExponential()} = <strong>${formatNum(ncBase, p)} N/C</strong><br><br>`;

    log += `<strong>2. Conversión cruzada y desarrollo analítico hacia el resto del sistema:</strong><br>`;

    // FASE 2: Cálculo y actualización síncrona de los campos destino
    units.forEach(destino => {
        if (!inputs[destino]) return;

        const factorDestino = config[destino];
        const valorCalculado = ncBase / factorDestino;
        const stringResultado = formatNum(valorCalculado, p);

        // Protege el campo activo donde escribe el usuario para evitar saltos del cursor
        if (destino !== origen) {
            inputs[destino].value = stringResultado;
        }

        log += `${destino}: ${formatNum(ncBase, p)} / ${factorDestino.toExponential()} = <strong>${stringResultado}</strong><br>`;
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
        <p>Análisis de intensidades del Campo Eléctrico con base en el <strong>Newton por Coulomb (N/C)</strong>:</p>
        <ul>
            <li>Hacia el pivote: N/C = Cantidad leída * Factor de conversión JSON.</li>
            <li>Desde el pivote: Unidad Destino = N/C calculados / Factor de conversión JSON.</li>
            <li><em>Identidad Metrológica Fundamental:</em> 1 N/C es mecánicamente idéntico a 1 V/m. Por ello, sus transformaciones son simétricas.</li>
            <li><em>Conversión por longitud:</em> Al reducirse el denominador espacial (de metros a centímetros o milímetros), la densidad de las líneas de campo por unidad de distancia se multiplica proporcionalmente (ej. 1 V/cm = 100 V/m = 100 N/C).</li>
        </ul>`;
};

document.getElementById("saveJSON").onclick = () => {
    try {
        config = JSON.parse(document.getElementById("jsonEditor").value);
        alert("Matriz de constantes de campo eléctrico modificada con éxito.");
        modales.json.style.display = "none";
    } catch(e) {
        alert("Error de sintaxis en el formato del objeto JSON.");
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