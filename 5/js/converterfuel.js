let config = {
    kmLitro: 1,
    kmGalonUsa: 3.785411784,
    litro10km: 10,
    litro100km: 100,
    millasLitro: 1.609344,
    mpgUsa: 0.42514370749,
    mpgImperial: 0.35400618993,
    galonMillaUsa: 2.352145833,
    galonMillaUk: 2.824810531,
    galon100MillaUk: 282.4810531
};

const inputs = {
    kmLitro: document.getElementById('kmLitro'),
    kmGalonUsa: document.getElementById('kmGalonUsa'),
    litro10km: document.getElementById('litro10km'),
    litro100km: document.getElementById('litro100km'),
    millasLitro: document.getElementById('millasLitro'),
    mpgUsa: document.getElementById('mpgUsa'),
    mpgImperial: document.getElementById('mpgImperial'),
    galonMillaUsa: document.getElementById('galonMillaUsa'),
    galonMillaUk: document.getElementById('galonMillaUk'),
    galon100MillaUk: document.getElementById('galon100MillaUk')
};

// Definimos cuáles unidades son de tipo CONSUMO (Inversamente proporcionales a km/L)
const unidadesConsumo = ['litro10km', 'litro100km', 'galonMillaUsa', 'galonMillaUk', 'galon100MillaUk'];

const pasosDiv = document.getElementById('pasos');
const precisionInput = document.getElementById('decimales');

Object.keys(inputs).forEach(key => {
    if (inputs[key]) {
        inputs[key].addEventListener('input', (e) => {
            convertir(key, parseFloat(e.target.value));
        });
    }
});

function convertir(origen, valor) {
    if (isNaN(valor) || valor <= 0) {
        pasosDiv.innerHTML = "Ingrese un valor numérico mayor a 0.";
        return;
    }

    const p = parseInt(precisionInput.value);
    let kmLBase = 0;

    let log = `<strong>1. Normalización a la unidad base (Kilómetro por litro - km/L):</strong><br>`;

    // Determinación del camino de conversión hacia el pivote base (km/L)
    if (origen === 'kmLitro') {
        kmLBase = valor;
        log += `Unidad ya se encuentra en la base: <strong>${kmLBase.toFixed(p)} km/L</strong><br><br>`;
    } else if (unidadesConsumo.includes(origen)) {
        // Relación Inversa: km/L = Constante / Valor
        kmLBase = config[origen] / valor;
        log += `Fórmula (Inversa): km/L = ${config[origen]} / ${origen}<br>`;
        log += `Sustitución: km/L = ${config[origen]} / ${valor} = <strong>${kmLBase.toFixed(p)} km/L</strong><br><br>`;
    } else {
        // Relación Directa: km/L = Valor * Factor (para kilómetros por galón o millas por unidad)
        if (origen === 'kmGalonUsa') {
            kmLBase = valor / config[origen];
            log += `Fórmula: km/L = kmGalonUsa / ${config[origen]}<br>`;
        } else {
            kmLBase = valor * config[origen];
            log += `Fórmula: km/L = ${origen} * ${config[origen]}<br>`;
        }
        log += `Sustitución: km/L = <strong>${kmLBase.toFixed(p)} km/L</strong><br><br>`;
    }

    log += `<strong>2. Conversión cruzada y desarrollo a las demás unidades:</strong><br>`;

    // Cálculo y renderizado procedimental para el resto de los campos
    Object.keys(inputs).forEach(destino => {
        if (!inputs[destino]) return;

        let valorCalculado = 0;
        let operacionTexto = "";

        if (destino === 'kmLitro') {
            valorCalculado = kmLBase;
            operacionTexto = `Equivalencia base directa`;
        } else if (unidadesConsumo.includes(destino)) {
            // Desde km/L a Consumo -> Inversión: Destino = Constante / km/L
            valorCalculado = config[destino] / kmLBase;
            operacionTexto = `${config[destino]} / ${kmLBase.toFixed(p)}`;
        } else {
            // Desde km/L a Eficiencia -> Directo
            if (destino === 'kmGalonUsa') {
                valorCalculado = kmLBase * config[destino];
                operacionTexto = `${kmLBase.toFixed(p)} * ${config[destino]}`;
            } else {
                valorCalculado = kmLBase / config[destino];
                operacionTexto = `${kmLBase.toFixed(p)} / ${config[destino]}`;
            }
        }

        const stringResultado = valorCalculado.toFixed(p);

        if (destino !== origen) {
            inputs[destino].value = stringResultado;
        }

        log += `${destino}: ${operacionTexto} = <strong>${stringResultado}</strong><br>`;
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
        <p>Este sistema opera bajo un entorno de <strong>proporcionalidad mixta</strong> utilizando el <strong>km/L</strong> como pivote metrológico:</p>
        <ul>
            <li><strong>Unidades de Rendimiento (Eficiencia):</strong> Relación lineal directa. Mayor combustible rinde más distancia (ej. MPG).</li>
            <li><strong>Unidades de Consumo (Gasto):</strong> Relación lineal inversa. Representa el volumen requerido para cubrir una distancia fija (ej. L/100 km).</li>
            <li><em>Fórmula de Inversión Fundamental:</em> L/100 km = 100 / (km/L)</li>
        </ul>
        <small>Nota de calibración: El galón americano está configurado en 3.7854 Litros y el galón imperial británico en 4.5460 Litros.</small>`;
};

document.getElementById("saveJSON").onclick = () => {
    try {
        config = JSON.parse(document.getElementById("jsonEditor").value);
        alert("Configuración de variables físicas de combustible actualizada.");
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