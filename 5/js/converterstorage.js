let config = {
    bit: 0.125,
    nibble: 0.5,
    byte: 1,
    kibibyte: 1024,
    mebibyte: 1048576,
    gibibyte: 1073741824,
    tebibyte: 1099511627776,
    pebibyte: 1125899906842624,
    kilobyte: 1000,
    megabyte: 1000000,
    gigabyte: 1000000000,
    terabyte: 1000000000000,
    petabyte: 1000000000000000,
    exabyte: 1000000000000000000
};

const inputs = {
    bit: document.getElementById('bit'),
    nibble: document.getElementById('nibble'),
    byte: document.getElementById('byte'),
    kibibyte: document.getElementById('kibibyte'),
    mebibyte: document.getElementById('mebibyte'),
    gibibyte: document.getElementById('gibibyte'),
    tebibyte: document.getElementById('tebibyte'),
    pebibyte: document.getElementById('pebibyte'),
    kilobyte: document.getElementById('kilobyte'),
    megabyte: document.getElementById('megabyte'),
    gigabyte: document.getElementById('gigabyte'),
    terabyte: document.getElementById('terabyte'),
    petabyte: document.getElementById('petabyte'),
    exabyte: document.getElementById('exabyte')
};

const pasosDiv = document.getElementById('pasos');
const precisionInput = document.getElementById('decimales');

// Escucha activa en tiempo real para las 14 entradas
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
    
    // 1. Normalización metrológica a la unidad base: Byte (B)
    const factorOrigen = config[origen];
    const bytes = valor * factorOrigen;

    let log = `<strong>1. Normalización a la unidad base (Byte):</strong><br>`;
    log += `Fórmula: Bytes = ${origen} * ${factorOrigen}<br>`;
    const usarExpBase = (bytes >= 1e7 || (bytes < 1e-4 && bytes > 0));
    log += `Sustitución: Bytes = ${valor} * ${factorOrigen} = ${usarExpBase ? bytes.toExponential(p) : bytes.toFixed(p)} B<br><br>`;

    log += `<strong>2. Conversión y desarrollo a las demás escalas de datos:</strong><br>`;

    // 2. Cálculo cruzado distribuido al DOM y renderizado procedimental
    Object.keys(inputs).forEach(destino => {
        if (!inputs[destino]) return;

        const factorDestino = config[destino];
        const valorCalculado = bytes / factorDestino;

        // Comprobación inteligente de límites numéricos para formatear decimales significativos
        const usarExponencial = (valorCalculado < 1e-4 && valorCalculado > 0) || valorCalculado >= 1e7;
        const stringResultado = usarExponencial ? valorCalculado.toExponential(p) : valorCalculado.toFixed(p);

        if (destino !== origen) {
            inputs[destino].value = stringResultado;
        }

        log += `${destino}: ${usarExpBase ? bytes.toExponential(p) : bytes.toFixed(p)} / ${factorDestino} = <strong>${stringResultado}</strong><br>`;
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
        <p>Tomando el <strong>Byte (B)</strong> como pivote de control metrológico:</p>
        <ul>
            <li>Hacia la base: Bytes = Valor * Factor de la Constante</li>
            <li>Desde la base: Resultado = Bytes / Factor de la Constante</li>
        </ul>
        <small>Nota técnica: Las unidades basadas en prefijos 'bi' (KiB, MiB, etc.) corresponden al estándar binario de base 2 (1024), mientras que KB, MB, etc., se calculan bajo la norma del SI en base 10 (1000).</small>`;
};

document.getElementById("saveJSON").onclick = () => {
    try {
        config = JSON.parse(document.getElementById("jsonEditor").value);
        alert("Configuración de constantes de almacenamiento actualizada.");
        modales.json.style.display = "none";
    } catch(e) {
        alert("Error en la estructura del archivo JSON");
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