let config = {
    centimetroSegundo: 0.01,
    metroSegundo: 1,
    kilometroHora: 0.2777777777777778,
    millaHora: 0.44704,
    pieSegundo: 0.3048,
    nudo: 0.5144444444444445,
    mach: 340.29
};

const inputs = {
    centimetroSegundo: document.getElementById('centimetroSegundo'),
    metroSegundo: document.getElementById('metroSegundo'),
    kilometroHora: document.getElementById('kilometroHora'),
    millaHora: document.getElementById('millaHora'),
    pieSegundo: document.getElementById('pieSegundo'),
    nudo: document.getElementById('nudo'),
    mach: document.getElementById('mach')
};

const pasosDiv = document.getElementById('pasos');
const precisionInput = document.getElementById('decimales');

// Escucha activa en tiempo real para todos los campos de velocidad
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
    
    // 1. Normalización metrológica a la unidad base: m/s
    const factorOrigen = config[origen];
    const metroSegundos = valor * factorOrigen;

    let log = `<strong>1. Normalización a la unidad base (Metro por segundo):</strong><br>`;
    log += `Fórmula: m/s = ${origen} * ${factorOrigen}<br>`;
    const usarExpBase = (metroSegundos < 1e-4 && metroSegundos > 0);
    log += `Sustitución: m/s = ${valor} * ${factorOrigen} = ${usarExpBase ? metroSegundos.toExponential(p) : metroSegundos.toFixed(p)} m/s<br><br>`;

    log += `<strong>2. Conversión y desarrollo a las demás escalas:</strong><br>`;

    // 2. Cálculo cruzado distribuido al DOM y renderizado del procedimiento
    Object.keys(inputs).forEach(destino => {
        if (!inputs[destino]) return;

        const factorDestino = config[destino];
        const valorCalculado = metroSegundos / factorDestino;

        // Comprobación inteligente de límites numéricos para formatear decimales significativos
        const usarExponencial = (valorCalculado < 1e-4 && valorCalculado > 0) || valorCalculado >= 1e7;
        const stringResultado = usarExponencial ? valorCalculado.toExponential(p) : valorCalculado.toFixed(p);

        if (destino !== origen) {
            inputs[destino].value = stringResultado;
        }

        log += `${destino}: ${usarExpBase ? metroSegundos.toExponential(p) : metroSegundos.toFixed(p)} / ${factorDestino} = <strong>${stringResultado}</strong><br>`;
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
        <p>Tomando el <strong>Metro por segundo (m/s)</strong> como pivote de control de velocidad:</p>
        <ul>
            <li>Hacia la base: m/s = Valor * Factor Constante</li>
            <li>Desde la base: Unidad Destino = m/s / Factor Constante</li>
        </ul>
        <small>Nota de calibración: El factor de la unidad Mach está fijado sobre la velocidad del sonido en condiciones estándar de la atmósfera terrestre (340.29 m/s).</small>`;
};

document.getElementById("saveJSON").onclick = () => {
    try {
        config = JSON.parse(document.getElementById("jsonEditor").value);
        alert("Configuración de constantes de velocidad actualizada con éxito.");
        modales.json.style.display = "none";
    } catch(e) {
        alert("Error en el formato estructural del JSON");
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