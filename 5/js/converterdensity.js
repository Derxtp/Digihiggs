let config = {
    kilogramoMetroCubico: 1,
    gramoCentimetroCubico: 1000,
    gramoMililitro: 1000,
    gramoLitro: 1,
    onzaGalonUS: 7.48915170729,
    onzaGalonUK: 6.23602329144,
    onzaPulgadaCubica: 1729.99404397,
    libraPieCubico: 16.018463374,
    libraPulgadaCubica: 27679.9047102,
    libraGalon: 119.826427317
};

const inputs = {
    kilogramoMetroCubico: document.getElementById('kilogramoMetroCubico'),
    gramoCentimetroCubico: document.getElementById('gramoCentimetroCubico'),
    gramoMililitro: document.getElementById('gramoMililitro'),
    gramoLitro: document.getElementById('gramoLitro'),
    onzaGalonUS: document.getElementById('onzaGalonUS'),
    onzaGalonUK: document.getElementById('onzaGalonUK'),
    onzaPulgadaCubica: document.getElementById('onzaPulgadaCubica'),
    libraPieCubico: document.getElementById('libraPieCubico'),
    libraPulgadaCubica: document.getElementById('libraPulgadaCubica'),
    libraGalon: document.getElementById('libraGalon')
};

const pasosDiv = document.getElementById('pasos');
const precisionInput = document.getElementById('decimales');

// Sincronización en tiempo real para todos los campos de densidad
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
    
    // 1. Normalización metrológica a la unidad base: kg/m³
    const factorOrigen = config[origen];
    const kgm3 = valor * factorOrigen;

    let log = `<strong>1. Normalización a la unidad base (kg/m³):</strong><br>`;
    log += `Fórmula: kg/m³ = ${origen} * ${factorOrigen}<br>`;
    log += `Sustitución: kg/m³ = ${valor} * ${factorOrigen} = ${kgm3.toFixed(p)} kg/m³<br><br>`;

    log += `<strong>2. Conversión y desarrollo a las demás escalas:</strong><br>`;

    // 2. Cálculo cruzado distribuido al DOM y desglose procedimental paso a paso
    Object.keys(inputs).forEach(destino => {
        if (!inputs[destino]) return;

        const factorDestino = config[destino];
        const valorCalculado = kgm3 / factorDestino;

        // Comprobación analítica para prevenir truncado de datos microscópicos
        const usarExponencial = (valorCalculado < 1e-4 && valorCalculado > 0) || valorCalculado >= 1e7;
        const stringResultado = usarExponencial ? valorCalculado.toExponential(p) : valorCalculado.toFixed(p);

        if (destino !== origen) {
            inputs[destino].value = stringResultado;
        }

        log += `${destino}: ${kgm3.toFixed(p)} / ${factorDestino} = <strong>${stringResultado}</strong><br>`;
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
        <p>Tomando el <strong>Kilogramo por Metro Cúbico (kg/m³)</strong> como constante pivotante de calibración:</p>
        <ul>
            <li>Hacia la base: kg/m³ = Cantidad * Factor Constante</li>
            <li>Desde la base: Resultado = kg/m³ / Factor Constante</li>
        </ul>
        <small>Las constantes para los sistemas anglosajones se calculan utilizando el estándar exacto de libras Avoirdupois.</small>`;
};

document.getElementById("saveJSON").onclick = () => {
    try {
        config = JSON.parse(document.getElementById("jsonEditor").value);
        alert("Configuración de constantes de densidad guardada localmente.");
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