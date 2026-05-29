let config = {
    metroCubico: 1,
    centimetroCubico: 1e-6,
    decimetroCubico: 0.001,
    litro: 0.001,
    mililitro: 1e-6,
    pieCubico: 0.028316846592,
    yardaCubica: 0.764554857984,
    pulgadaCubica: 0.000016387064,
    barrilUS: 0.119240471196,
    galonUS: 0.003785411784,
    cuartoUS: 0.000946352946,
    pintaUS: 0.000473176473,
    tazaUS: 0.0002365882365,
    onzaLiquidaUS: 0.00002957352956,
    cucharadaUS: 0.00001478676478,
    cucharaditaUS: 0.00000492892159,
    barrilImperial: 0.16365924,
    galonImperial: 0.00454609,
    cuartoImperial: 0.0011365225,
    pintaImperial: 0.00056826125,
    tazaImperial: 0.000284130625,
    onzaLiquidaImperial: 0.0000284130625,
    cucharadaImperial: 0.00001420653125,
    cucharaditaImperial: 0.00000473551041,
    goJapones: 0.00018039,
    shoJapones: 0.0018039,
    toJapones: 0.018039,
    kokuJapones: 0.18039
};

const inputs = {
    metroCubico: document.getElementById('metroCubico'),
    centimetroCubico: document.getElementById('centimetroCubico'),
    decimetroCubico: document.getElementById('decimetroCubico'),
    litro: document.getElementById('litro'),
    mililitro: document.getElementById('mililitro'),
    pieCubico: document.getElementById('pieCubico'),
    yardaCubica: document.getElementById('yardaCubica'),
    pulgadaCubica: document.getElementById('pulgadaCubica'),
    barrilUS: document.getElementById('barrilUS'),
    galonUS: document.getElementById('galonUS'),
    cuartoUS: document.getElementById('cuartoUS'),
    pintaUS: document.getElementById('pintaUS'),
    tazaUS: document.getElementById('tazaUS'),
    onzaLiquidaUS: document.getElementById('onzaLiquidaUS'),
    cucharadaUS: document.getElementById('cucharadaUS'),
    cucharaditaUS: document.getElementById('cucharaditaUS'),
    barrilImperial: document.getElementById('barrilImperial'),
    galonImperial: document.getElementById('galonImperial'),
    cuartoImperial: document.getElementById('cuartoImperial'),
    pintaImperial: document.getElementById('pintaImperial'),
    tazaImperial: document.getElementById('tazaImperial'),
    onzaLiquidaImperial: document.getElementById('onzaLiquidaImperial'),
    cucharadaImperial: document.getElementById('cucharadaImperial'),
    cucharaditaImperial: document.getElementById('cucharaditaImperial'),
    goJapones: document.getElementById('goJapones'),
    shoJapones: document.getElementById('shoJapones'),
    toJapones: document.getElementById('toJapones'),
    kokuJapones: document.getElementById('kokuJapones')
};

const pasosDiv = document.getElementById('pasos');
const precisionInput = document.getElementById('decimales');

// Sincronización en tiempo real para las 28 entradas
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
    
    // 1. Normalización metrológica a la unidad base (Metro Cúbico)
    const factorOrigen = config[origen];
    const m3 = valor * factorOrigen;

    let log = `<strong>1. Normalización a la unidad base (Metro Cúbico):</strong><br>`;
    log += `Fórmula: m³ = ${origen} * ${factorOrigen}<br>`;
    log += `Sustitución: m³ = ${valor} * ${factorOrigen} = ${m3.toExponential(p)} m³<br><br>`;

    log += `<strong>2. Conversión y desarrollo a las demás unidades:</strong><br>`;

    // 2. Calcular y distribuir los valores al DOM
    Object.keys(inputs).forEach(destino => {
        if (!inputs[destino]) return;
        
        const factorDestino = config[destino];
        const valorCalculado = m3 / factorDestino;

        // Comprobación inteligente para no aplastar valores microscópicos a ceros planos
        const usarExponencial = (valorCalculado < 1e-4 && valorCalculado > 0) || valorCalculado >= 1e12;
        const stringResultado = usarExponencial ? valorCalculado.toExponential(p) : valorCalculado.toFixed(p);

        if (destino !== origen) {
            inputs[destino].value = stringResultado;
        }

        log += `${destino}: ${m3.toExponential(p)} / ${factorDestino} = <strong>${stringResultado}</strong><br>`;
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
        <p>Tomando el <strong>Metro Cúbico (m³)</strong> como constante pivote de calibración:</p>
        <ul>
            <li>Hacia la base: m³ = Cantidad * Factor Constante</li>
            <li>Desde la base: Resultado = m³ / Factor Constante</li>
        </ul>
        <small>Sistemas integrados: S.I., Anglosajón Comercial (US), Imperial Británico (UK) y Tradicional Japonés (Shakkanhō).</small>`;
};

document.getElementById("saveJSON").onclick = () => {
    try {
        config = JSON.parse(document.getElementById("jsonEditor").value);
        alert("Configuración de volumen guardada localmente.");
        modales.json.style.display = "none";
    } catch(e) {
        alert("Error en la sintaxis estructural del JSON");
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