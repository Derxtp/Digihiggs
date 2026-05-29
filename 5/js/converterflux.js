let config = {
    weber: 1.0,
    miliweber: 0.001,
    microweber: 0.000001,
    maxwell: 1e-8,
    kilomaxwell: 0.00001
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
    const esExp = (Math.abs(val) < 1e-3) || Math.abs(val) >= 1e8;
    return esExp ? val.toExponential(p) : val.toFixed(p);
}

function convertir(origen, valor) {
    if (isNaN(valor)) {
        pasosDiv.innerHTML = "Ingrese un valor numérico válido.";
        return;
    }

    const p = parseInt(precisionInput.value);
    
    // FASE 1: Normalización matemática al pivote central (Weber - Wb)
    const factorOrigen = config[origen];
    const weberBase = valor * factorOrigen;

    let log = `<strong>1. Normalización a la unidad base (Weber - Wb):</strong><br>`;
    log += `Fórmula: Wb = ${origen} * ${factorOrigen.toExponential()}<br>`;
    log += `Sustitución: Wb = ${valor} * ${factorOrigen.toExponential()} = <strong>${formatNum(weberBase, p)} Wb</strong><br><br>`;

    log += `<strong>2. Conversión cruzada y desarrollo analítico hacia el resto del sistema:</strong><br>`;

    // FASE 2: Cálculo y actualización síncrona de los campos destino
    units.forEach(destino => {
        if (!inputs[destino]) return;

        const factorDestino = config[destino];
        const valorCalculado = weberBase / factorDestino;
        const stringResultado = formatNum(valorCalculado, p);

        // Protege la caja donde escribe el usuario para evitar saltos del cursor
        if (destino !== origen) {
            inputs[destino].value = stringResultado;
        }

        log += `${destino}: ${formatNum(weberBase, p)} / ${factorDestino.toExponential()} = <strong>${stringResultado}</strong><br>`;
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
        <p>Análisis de Flujo Magnético ($\Phi$) con base en el <strong>Weber (Wb)</strong>:</p>
        <ul>
            <li>Hacia la unidad base: Webers = Cantidad leída * Factor de conversión en JSON.</li>
            <li>Desde la unidad base: Unidad Destino = Webers calculados / Factor de conversión en JSON.</li>
            <li><em>Definición del SI:</em> El Weber (Wb) representa matemáticamente el flujo que, al atravesar un circuito de una sola espira, produce en esta una fuerza electromotriz de 1 voltio si se reduce a cero de forma uniforme en 1 segundo (1 Wb = 1 V * s).</li>
            <li><em>Relación CGS (Maxwell):</em> El Maxwell (Mx) mide líneas individuales de flujo de fuerza. Un Weber es un paquete masivo equivalente a 10<sup>8</sup> Mx (cien millones Mx). Por ello, su factor constante en el archivo JSON se define con alta precisión como 1e-8.</li>
            <li><em>Múltiplos CGS:</em> El kilomaxwell (kMx) es idéntico a 1,000 Mx, lo que equivale matemáticamente a 10<sup>-5</sup> Wb.</li>
        </ul>`;
};

document.getElementById("saveJSON").onclick = () => {
    try {
        config = JSON.parse(document.getElementById("jsonEditor").value);
        alert("Matriz de constantes de flujo magnético modificada con éxito.");
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