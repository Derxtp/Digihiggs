let config = {
    gravimetrico: {
        jKg: 1.0,
        mjKg: 1000000.0,
        kjKg: 1000.0,
        whKg: 3600.0,
        kwhKg: 3600000.0,
        kcalg: 4186800.0
    },
    volumetrico: {
        jM3: 1.0,
        mjM3: 1000000.0,
        btuFt3: 37258.9458,
        whL: 3600000.0,
        kcalM3: 4186.8
    }
};

const inputs = {};
const pasosDiv = document.getElementById('pasos');
const precisionInput = document.getElementById('decimales');

// Inicialización de escuchas por tipo de magnitud
['gravimetrico', 'volumetrico'].forEach(bloque => {
    Object.keys(config[bloque]).forEach(unit => {
        inputs[unit] = document.getElementById(unit);
        if (inputs[unit]) {
            inputs[unit].addEventListener('input', (e) => {
                convertir(bloque, unit, parseFloat(e.target.value));
            });
        }
    });
});

function formatNum(val, p) {
    if (val === 0) return "0";
    const esExp = (Math.abs(val) < 1e-4) || Math.abs(val) >= 1e6;
    return esExp ? val.toExponential(p) : val.toFixed(p);
}

function convertir(bloque, origen, valor) {
    if (isNaN(valor)) {
        pasosDiv.innerHTML = "Ingrese un valor numérico válido.";
        return;
    }

    const p = parseInt(precisionInput.value);
    const factorOrigen = config[bloque][origen];
    const baseCalculada = valor * factorOrigen;
    const unidadBaseTexto = bloque === 'gravimetrico' ? 'J/kg' : 'J/m³';

    // Limpiar el bloque opuesto por consistencia física dimensional
    const bloqueOpuesto = bloque === 'gravimetrico' ? 'volumetrico' : 'gravimetrico';
    Object.keys(config[bloqueOpuesto]).forEach(unit => {
        if (inputs[unit]) inputs[unit].value = "";
    });

    let log = `<strong>1. Normalización al pivote base del bloque (${unidadBaseTexto}):</strong><br>`;
    log += `Fórmula: Base = ${origen} * ${factorOrigen.toExponential(4)}<br>`;
    log += `Sustitución: Base = ${valor} * ${factorOrigen.toExponential(4)} = <strong>${formatNum(baseCalculada, p)} ${unidadBaseTexto}</strong><br><br>`;

    log += `<strong>2. Conversión y desarrollo de equivalencias en el bloque:</strong><br>`;

    // Distribución síncrona dentro de la misma naturaleza de magnitud
    Object.keys(config[bloque]).forEach(destino => {
        if (!inputs[destino]) return;

        const factorDestino = config[bloque][destino];
        const valorCalculado = baseCalculada / factorDestino;
        const stringResultado = formatNum(valorCalculado, p);

        if (destino !== origen) {
            inputs[destino].value = stringResultado;
        }

        log += `${destino}: ${formatNum(baseCalculada, p)} / ${factorDestino.toExponential(4)} = <strong>${stringResultado}</strong><br>`;
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
        <p>Este sistema se segmenta autónomamente en dos universos debido a restricciones dimensionales:</p>
        <ul>
            <li><strong>Bloque Gravimétrico (Base: J/kg):</strong> Mide la energía contenida por unidad de masa. Nota: Wh/kg = 3600 J/kg, kcal/g = 4,186,800 J/kg.</li>
            <li><strong>Bloque Volumétrico (Base: J/m³):</strong> Mide la energía contenida por unidad de volumen. Nota: Wh/L = 3,600,000  J/m³, BTU/ft³ approx 37258.95 J/m³.</li>
            <li><em>Regla del Sistema:</em> La alteración de un bloque suspende temporalmente los campos del bloque opuesto al no existir una densidad de sustancia especificada.</li>
        </ul>`;
};

document.getElementById("saveJSON").onclick = () => {
    try {
        config = JSON.parse(document.getElementById("jsonEditor").value);
        alert("Constantes de densidad gravimétrica y volumétrica modificadas.");
        modales.json.style.display = "none";
    } catch(e) {
        alert("Error de estructura en el archivo JSON.");
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