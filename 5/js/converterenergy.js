let config = {
    joule: 1,
    kilojoule: 1000,
    megajoule: 1000000,
    kilocaloria: 4184,
    electronvoltio: 1.602176634e-19,
    vatioHora: 3600,
    kilovatioHora: 3600000,
    vatioSegundo: 1,
    caloriaNutricional: 4184,
    caloriaTermica: 4.184,
    unidadTermicaBritanica: 1054.350264448,
    ergio: 1e-7,
    termiaAmericana: 105480400,
    pieLibraFuerza: 1.3558179483314004
};

const inputs = {
    joule: document.getElementById('joule'),
    kilojoule: document.getElementById('kilojoule'),
    megajoule: document.getElementById('megajoule'),
    kilocaloria: document.getElementById('kilocaloria'),
    electronvoltio: document.getElementById('electronvoltio'),
    vatioHora: document.getElementById('vatioHora'),
    kilovatioHora: document.getElementById('kilovatioHora'),
    vatioSegundo: document.getElementById('vatioSegundo'),
    caloriaNutricional: document.getElementById('caloriaNutricional'),
    caloriaTermica: document.getElementById('caloriaTermica'),
    unidadTermicaBritanica: document.getElementById('unidadTermicaBritanica'),
    ergio: document.getElementById('ergio'),
    termiaAmericana: document.getElementById('termiaAmericana'),
    pieLibraFuerza: document.getElementById('pieLibraFuerza')
};

const pasosDiv = document.getElementById('pasos');
const precisionInput = document.getElementById('decimales');

// Escucha en tiempo real para las 14 entradas
Object.keys(inputs).forEach(key => {
    if (inputs[key]) {
        inputs[key].addEventListener('input', (e) => {
            convertir(key, parseFloat(e.target.value));
        });
    }
});

function convertir(origen, valor) {
    if (isNaN(valor)) {
        pasosDiv.innerHTML = "Ingrese un valor válido.";
        return;
    }

    const p = parseInt(precisionInput.value);
    
    // 1. Normalización a la unidad base: Joule (J)
    const factorOrigen = config[origen];
    const joules = valor * factorOrigen;

    let log = `<strong>1. Normalización a la unidad base (Joule):</strong><br>`;
    log += `Fórmula: J = ${origen} * ${factorOrigen}<br>`;
    const esJouleSub = (joules < 1e-4 && joules > 0) || joules >= 1e7;
    log += `Sustitución: J = ${valor} * ${factorOrigen} = ${esJouleSub ? joules.toExponential(p) : joules.toFixed(p)} J<br><br>`;

    log += `<strong>2. Conversión y desarrollo a las demás unidades:</strong><br>`;

    // 2. Cálculo cruzado distribuido al DOM y desglose de procedimiento paso a paso
    Object.keys(inputs).forEach(destino => {
        if (!inputs[destino]) return;

        const factorDestino = config[destino];
        const valorCalculado = joules / factorDestino;

        // Comprobación analítica inteligente para formatear decimales significativos
        const usarExponencial = (valorCalculado < 1e-4 && valorCalculado > 0) || valorCalculado >= 1e7;
        const stringResultado = usarExponencial ? valorCalculado.toExponential(p) : valorCalculado.toFixed(p);

        if (destino !== origen) {
            inputs[destino].value = stringResultado;
        }

        log += `${destino}: ${esJouleSub ? joules.toExponential(p) : joules.toFixed(p)} / ${factorDestino} = <strong>${stringResultado}</strong><br>`;
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
        <p>Tomando el <strong>Joule (J)</strong> como pivote de estandarización energética:</p>
        <ul>
            <li>Hacia la base: Joule = Valor * Factor de la Constante</li>
            <li>Desde la base: Unidad Destino = Joule / Factor de la Constante</li>
        </ul>
        <small>Nota de precisión: Cal representa Calorías Nutricionales (kcal) y cal representa Calorías Termoquímicas de laboratorio.</small>`;
};

document.getElementById("saveJSON").onclick = () => {
    try {
        config = JSON.parse(document.getElementById("jsonEditor").value);
        alert("Configuración de magnitudes de energía actualizada correctamente.");
        modales.json.style.display = "none";
    } catch(e) {
        alert("Error en la validación estructural del JSON");
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