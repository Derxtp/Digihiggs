let config = {
    tesla: 1.0,
    militesla: 0.001,
    microtesla: 0.000001,
    nanotesla: 1e-9,
    gauss: 0.0001,
    gamma: 1e-9
};

const inputs = {};
const units = Object.keys(config);

// Mapeo dinámico de elementos de la interfaz
units.forEach(unit => {
    inputs[unit] = document.getElementById(unit);
});

const pasosDiv = document.getElementById('pasos');
const precisionInput = document.getElementById('decimales');

// Escucha activa de pulsaciones en tiempo real
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
    
    // FASE 1: Normalización matemática a la unidad pivote (Tesla - T)
    const factorOrigen = config[origen];
    const teslaBase = valor * factorOrigen;

    let log = `<strong>1. Normalización a la unidad base (Tesla - T):</strong><br>`;
    log += `Fórmula: T = ${origen} * ${factorOrigen.toExponential()}<br>`;
    log += `Sustitución: T = ${valor} * ${factorOrigen.toExponential()} = <strong>${formatNum(teslaBase, p)} T</strong><br><br>`;

    log += `<strong>2. Conversión cruzada y desarrollo analítico hacia el resto del sistema:</strong><br>`;

    // FASE 2: Distribución y actualización síncrona en el DOM
    units.forEach(destino => {
        if (!inputs[destino]) return;

        const factorDestino = config[destino];
        const valorCalculado = teslaBase / factorDestino;
        const stringResultado = formatNum(valorCalculado, p);

        // Evita interferir con la caja donde escribe el usuario actualmente
        if (destino !== origen) {
            inputs[destino].value = stringResultado;
        }

        log += `${destino}: ${formatNum(teslaBase, p)} / ${factorDestino.toExponential()} = <strong>${stringResultado}</strong><br>`;
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
        <p>Análisis de densidad de flujo electromagnético con base en el <strong>Tesla (T)</strong>:</p>
        <ul>
            <li>Hacia la unidad base: Teslas = Cantidad leída * Factor de conversión en JSON.</li>
            <li>Desde la unidad base: Unidad Destino = Teslas calculados / Factor de conversión en JSON.</li>
            <li><em>Sistemas de Unidades:</em> El Tesla pertenece al SI y se define como un Weber por metro cuadrado (Wb/m<sup>2</sup>). El Gauss (G) pertenece al sistema CGS.</li>
            <li><em>Identidad con Gauss:</em> 1T = 10,000 G (usado comúnmente en la calibración de imanes y resonancias magnéticas).</li>
            <li><em>Identidad con Gamma:</em> La unidad Gamma (gamma) se utiliza de manera histórica en estudios geomagnéticos de la Tierra y equivale exactamente a 1 nT (10<sup>-9</sup> T).</li>
        </ul>`;
};

document.getElementById("saveJSON").onclick = () => {
    try {
        config = JSON.parse(document.getElementById("jsonEditor").value);
        alert("Matriz de constantes de inducción magnética guardada con éxito.");
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