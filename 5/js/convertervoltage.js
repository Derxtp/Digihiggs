let config = {
    nanovoltio: 1e-9,
    microvoltio: 1e-6,
    milivoltio: 0.001,
    voltio: 1.0,
    kilovoltio: 1000.0,
    megavoltio: 1000000.0,
    gigavoltio: 1000000000.0,
    teravoltio: 1000000000000.0
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
    
    // FASE 1: Normalización matemática al pivote central (Voltio - V)
    const factorOrigen = config[origen];
    const voltsBase = valor * factorOrigen;

    let log = `<strong>1. Normalización a la unidad base (Voltio - V):</strong><br>`;
    log += `Fórmula: V = ${origen} * ${factorOrigen.toExponential()}<br>`;
    log += `Sustitución: V = ${valor} * ${factorOrigen.toExponential()} = <strong>${formatNum(voltsBase, p)} V</strong><br><br>`;

    log += `<strong>2. Conversión cruzada y desarrollo analítico hacia el resto del sistema:</strong><br>`;

    // FASE 2: Cálculo y actualización síncrona de los campos destino
    units.forEach(destino => {
        if (!inputs[destino]) return;

        const factorDestino = config[destino];
        const valorCalculado = voltsBase / factorDestino;
        const stringResultado = formatNum(valorCalculado, p);

        // Protege el campo activo donde escribe el usuario para evitar saltos del cursor
        if (destino !== origen) {
            inputs[destino].value = stringResultado;
        }

        log += `${destino}: ${formatNum(voltsBase, p)} / ${factorDestino.toExponential()} = <strong>${stringResultado}</strong><br>`;
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
        <p>Análisis dimensional de potencial eléctrico con base en el <strong>Voltio (V)</strong>:</p>
        <ul>
            <li>Hacia el pivote: Voltios = Cantidad leída * Factor del prefijo SI.</li>
            <li>Desde el pivote: Unidad Destino = Voltios calculados / Factor del prefijo SI.</li>
            <li><em>Escala de Submúltiplos:</em> 1 nV = 1e-9 V, 1 µV = 1e-6 V, 1 mV = 0.001 V.</li>
            <li><em>Escala de Múltiplos:</em> 1 kV = 1,000 V, 1 MV = 1e6 V, 1 GV = 1e9 V, 1 TV = 1e12 V.</li>
        </ul>`;
};

document.getElementById("saveJSON").onclick = () => {
    try {
        config = JSON.parse(document.getElementById("jsonEditor").value);
        alert("Matriz de constantes de prefijos de voltaje modificada con éxito.");
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