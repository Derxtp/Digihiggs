let config = {
    newton: 1,
    kilonewton: 1000,
    meganewton: 1000000,
    kilogramoFuerza: 9.80665,
    kilopondio: 9.80665,
    libraFuerza: 4.44822161526,
    dina: 1e-5
};

const inputs = {
    newton: document.getElementById('newton'),
    kilonewton: document.getElementById('kilonewton'),
    meganewton: document.getElementById('meganewton'),
    kilogramoFuerza: document.getElementById('kilogramoFuerza'),
    kilopondio: document.getElementById('kilopondio'),
    libraFuerza: document.getElementById('libraFuerza'),
    dina: document.getElementById('dina')
};

const pasosDiv = document.getElementById('pasos');
const precisionInput = document.getElementById('decimales');

// Escucha en tiempo real para todos los campos de fuerza
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
    
    // 1. Normalización a la unidad base: Newton (N)
    const factorOrigen = config[origen];
    const newtons = valor * factorOrigen;

    let log = `<strong>1. Normalización a la unidad base (Newton):</strong><br>`;
    log += `Fórmula: N = ${origen} * ${factorOrigen}<br>`;
    const usarExpBase = (newtons < 1e-4 && newtons > 0) || newtons >= 1e7;
    log += `Sustitución: N = ${valor} * ${factorOrigen} = ${usarExpBase ? newtons.toExponential(p) : newtons.toFixed(p)} N<br><br>`;

    log += `<strong>2. Conversión y desarrollo a las demás escalas:</strong><br>`;

    // 2. Cálculo cruzado distribuido al DOM y renderizado paso a paso
    Object.keys(inputs).forEach(destino => {
        if (!inputs[destino]) return;

        const factorDestino = config[destino];
        const valorCalculado = newtons / factorDestino;

        // Formateador analítico dinámico para evitar la pérdida de decimales significativos
        const usarExponencial = (valorCalculado < 1e-4 && valorCalculado > 0) || valorCalculado >= 1e7;
        const stringResultado = usarExponencial ? valorCalculado.toExponential(p) : valorCalculado.toFixed(p);

        if (destino !== origen) {
            inputs[destino].value = stringResultado;
        }

        log += `${destino}: ${usarExpBase ? newtons.toExponential(p) : newtons.toFixed(p)} / ${factorDestino} = <strong>${stringResultado}</strong><br>`;
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
        <p>Tomando el <strong>Newton (N)</strong> como unidad estándar y pivote central:</p>
        <ul>
            <li>Hacia la base: Newton = Valor * Factor Constante</li>
            <li>Desde la base: Unidad Destino = Newton / Factor Constante</li>
        </ul>
        <small>Nota científica: El Kilogramo-fuerza (kgf) y el Kilopondio (kp) comparten idéntica equivalencia según la aceleración estándar de la gravedad g = 9.80665 m/s².</small>`;
};

document.getElementById("saveJSON").onclick = () => {
    try {
        config = JSON.parse(document.getElementById("jsonEditor").value);
        alert("Configuración de constantes de fuerza actualizada localmente.");
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