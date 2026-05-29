let config = {
    amperioMetro: 1.0,
    amperioVueltaMetro: 1.0,
    kiloamperioMetro: 1000.0,
    oersted: 79.5774715459
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
    
    // FASE 1: Normalización matemática a la unidad pivote (A/m)
    const factorOrigen = config[origen];
    const amBase = valor * factorOrigen;

    let log = `<strong>1. Normalización a la unidad base (Amperio por metro - A/m):</strong><br>`;
    log += `Fórmula: A/m = ${origen} * ${factorOrigen.toExponential(4)}<br>`;
    log += `Sustitución: A/m = ${valor} * ${factorOrigen.toExponential(4)} = <strong>${formatNum(amBase, p)} A/m</strong><br><br>`;

    log += `<strong>2. Conversión cruzada y desarrollo analítico hacia el resto del sistema:</strong><br>`;

    // FASE 2: Distribución y actualización síncrona en el DOM
    units.forEach(destino => {
        if (!inputs[destino]) return;

        const factorDestino = config[destino];
        const valorCalculado = amBase / factorDestino;
        const stringResultado = formatNum(valorCalculado, p);

        // Evita interferir con la caja donde escribe el usuario actualmente
        if (destino !== origen) {
            inputs[destino].value = stringResultado;
        }

        log += `${destino}: ${formatNum(amBase, p)} / ${factorDestino.toExponential(4)} = <strong>${stringResultado}</strong><br>`;
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
        <p>Análisis de Intensidad de Campo Magnético ($H$) con base en el <strong>Amperio por metro (A/m)</strong>:</p>
        <ul>
            <li>Hacia la unidad base: A/m = Cantidad leída * Factor de conversión en JSON.</li>
            <li>Desde la unidad base: Unidad Destino = A/m calculados / Factor de conversión en JSON.</li>
            <li><em>Identidad de Conducción:</em> 1 A/m es geométricamente equivalente a 1 At/m (Amperio-vuelta por metro). El número de espiras (vueltas) es una magnitud pura sin dimensión física.</li>
            <li><em>Conversión CGS:</em> El Oersted (Oe) es la unidad clásica del sistema CGS y se define a través de la relación constante de una corriente sobre un bucle. Un Oersted equivale exactamente a (1000/4π) A/m, modelado de forma precisa como 79.5774715459 A/m en las constantes.</li>
        </ul>`;
};

document.getElementById("saveJSON").onclick = () => {
    try {
        config = JSON.parse(document.getElementById("jsonEditor").value);
        alert("Matriz de constantes de campo magnético guardada con éxito.");
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