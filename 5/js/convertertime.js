let config = {
    segundo: 1,
    milesimaSegundo: 0.001,
    minuto: 60,
    hora: 3600,
    dia: 86400,
    nanosegundo: 0.000000001,
    microsegundo: 0.000001,
    semana: 604800,
    mes: 2629746,
    ano: 31556952,
    lustro: 157784760,
    decada: 315569520,
    siglo: 3155695200,
    milenio: 31556952000
};

const inputs = {
    segundo: document.getElementById('segundo'),
    milesimaSegundo: document.getElementById('milesimaSegundo'),
    minuto: document.getElementById('minuto'),
    hora: document.getElementById('hora'),
    dia: document.getElementById('dia'),
    nanosegundo: document.getElementById('nanosegundo'),
    microsegundo: document.getElementById('microsegundo'),
    semana: document.getElementById('semana'),
    mes: document.getElementById('mes'),
    ano: document.getElementById('ano'),
    lustro: document.getElementById('lustro'),
    decada: document.getElementById('decada'),
    siglo: document.getElementById('siglo'),
    milenio: document.getElementById('milenio')
};

const pasosDiv = document.getElementById('pasos');
const precisionInput = document.getElementById('decimales');

// Vinculación de eventos en tiempo real
Object.keys(inputs).forEach(key => {
    inputs[key].addEventListener('input', (e) => {
        convertir(key, parseFloat(e.target.value));
    });
});

function convertir(origen, valor) {
    if (isNaN(valor)) {
        pasosDiv.innerHTML = "Ingrese un valor válido.";
        return;
    }

    const p = parseInt(precisionInput.value);
    
    // 1. Normalización metrológica a la unidad base (Segundo)
    const factorOrigen = config[origen];
    const segundos = valor * factorOrigen;

    let log = `<strong>1. Normalización a la unidad base (Segundo):</strong><br>`;
    log += `Fórmula: s = ${origen} * ${factorOrigen}<br>`;
    log += `Sustitución: s = ${valor} * ${factorOrigen} = ${segundos.toExponential(p)} s<br><br>`;

    log += `<strong>2. Conversión y desarrollo a las demás unidades:</strong><br>`;

    // 2. Procesar y actualizar el mapa de elementos
    Object.keys(inputs).forEach(destino => {
        const factorDestino = config[destino];
        const valorCalculado = segundos / factorDestino;

        // Si el número es excesivamente pequeño o grande, se despliega en formato exponencial para salvar la precisión
        const usarExponencial = (valorCalculado < 1e-4 && valorCalculado > 0) || valorCalculado >= 1e12;
        const stringResultado = usarExponencial ? valorCalculado.toExponential(p) : valorCalculado.toFixed(p);

        if (destino !== origen) {
            inputs[destino].value = stringResultado;
        }

        log += `${destino}: ${segundos.toExponential(p)} / ${factorDestino} = <strong>${stringResultado}</strong><br>`;
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
        <p>Tomando el <strong>Segundo (s)</strong> como eje de la constante:</p>
        <ul>
            <li>Convertir a Segundos: s = Valor * Factor</li>
            <li>Desde Segundos: Destino = s / Factor</li>
        </ul>
        <small>Los cálculos de escalas mayores (Mes a Milenio) se computan empleando la aproximación astronómica 
        del año juliano medio de 365.25 días para garantizar 
        precisión cienfífica absoluta sin desfasar años bisiestos.</small>`;
};

document.getElementById("saveJSON").onclick = () => {
    try {
        config = JSON.parse(document.getElementById("jsonEditor").value);
        alert("Configuración de tiempo actualizada con éxito");
        modales.json.style.display = "none";
    } catch(e) {
        alert("Error en el formato JSON");
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