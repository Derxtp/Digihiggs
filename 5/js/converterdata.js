let config = {
    bit: 1,
    nibble: 4,
    kilobit: 1000,
    megabit: 1000000,
    gigabit: 1000000000,
    terabit: 1000000000000,
    petabit: 1000000000000000,
    exabit: 1000000000000000000,
    kibibit: 1024,
    mebibit: 1048576,
    gigibit: 1073741824,
    tebibit: 1099511627776,
    pebibit: 1125899906842624,
    byte: 8,
    kilobyte: 8000,
    megabyte: 8000000,
    gigabyte: 8000000000,
    terabyte: 8000000000000,
    petabyte: 8000000000000000,
    exabyte: 8000000000000000000,
    kibibyte: 8192,
    mebibyte: 8388608,
    gibibyte: 8589934592,
    tebibyte: 8796093022208,
    pebibyte: 9007199254740992
};

const inputs = {};
const units = Object.keys(config);

// Mapeo automático del DOM para las 25 cajas de texto
units.forEach(unit => {
    inputs[unit] = document.getElementById(unit);
});

const pasosDiv = document.getElementById('pasos');
const precisionInput = document.getElementById('decimales');

// Escucha en tiempo real distribuyendo los eventos
units.forEach(key => {
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
    
    // 1. Estandarización a la unidad pivot: bit (b)
    const factorOrigen = config[origen];
    const totalBits = valor * factorOrigen;

    let log = `<strong>1. Normalización a la unidad base (bit):</strong><br>`;
    log += `Fórmula: bits = ${origen} * ${factorOrigen}<br>`;
    const usarExpBase = (totalBits >= 1e7 || (totalBits < 1e-4 && totalBits > 0));
    log += `Sustitución: bits = ${valor} * ${factorOrigen} = ${usarExpBase ? totalBits.toExponential(p) : totalBits.toFixed(p)} b<br><br>`;

    log += `<strong>2. Conversión cruzada y desarrollo analítico:</strong><br>`;

    // 2. Iteración y distribución de resultados al DOM con renderizado procedimental
    units.forEach(destino => {
        if (!inputs[destino]) return;

        const factorDestino = config[destino];
        const valorCalculado = totalBits / factorDestino;

        // Formateo inteligente anti-truncado para escalas exponenciales
        const usarExponencial = (valorCalculado < 1e-4 && valorCalculado > 0) || valorCalculado >= 1e7;
        const stringResultado = usarExponencial ? valorCalculado.toExponential(p) : valorCalculado.toFixed(p);

        if (destino !== origen) {
            inputs[destino].value = stringResultado;
        }

        log += `${destino}: ${usarExpBase ? totalBits.toExponential(p) : totalBits.toFixed(p)} / ${factorDestino} = <strong>${stringResultado}</strong><br>`;
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
        <p>Tomando el <strong>bit (b)</strong> como pivote metrológico universal:</p>
        <ul>
            <li>Hacia la base: bits = Cantidad de la Unidad * Factor del JSON</li>
            <li>Desde la base: Unidad Destino = bits Calculados / Factor del JSON</li>
        </ul>
        <small>Recordatorio metrológico: Las normas IEC/IEEE dictan que las variantes con prefijo 'bi' (KiB, Kib) operan bajo potencias binarias (1024), mientras que el estándar decimal (KB, kb) opera estrictamente en base 10 (1000).</small>`;
};

document.getElementById("saveJSON").onclick = () => {
    try {
        config = JSON.parse(document.getElementById("jsonEditor").value);
        alert("Constantes del sistema actualizadas de manera exitosa.");
        modales.json.style.display = "none";
    } catch(e) {
        alert("Error de sintaxis en la cadena JSON.");
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