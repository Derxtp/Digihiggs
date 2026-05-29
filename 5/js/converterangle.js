let config = {
    radian: 1,
    gradoSexagesimal: 0.017453292519943295,
    minutoArco: 0.0002908882086657216,
    segundoArco: 0.00000484813681109536,
    revolucion: 6.283185307179586,
    giro: 6.283185307179586,
    ciclo: 6.283185307179586,
    gradoCentesimal: 0.015707963267948967,
    milirradian: 0.001,
    signo: 0.5235987755982988
};

const inputs = {
    radian: document.getElementById('radian'),
    gradoSexagesimal: document.getElementById('gradoSexagesimal'),
    minutoArco: document.getElementById('minutoArco'),
    segundoArco: document.getElementById('segundoArco'),
    revolucion: document.getElementById('revolucion'),
    giro: document.getElementById('giro'),
    ciclo: document.getElementById('ciclo'),
    gradoCentesimal: document.getElementById('gradoCentesimal'),
    milirradian: document.getElementById('milirradian'),
    signo: document.getElementById('signo')
};

const pasosDiv = document.getElementById('pasos');
const precisionInput = document.getElementById('decimales');

// Vinculación en tiempo real de los campos angulares
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
    
    // 1. Normalización metrológica a la unidad base (Radián)
    const factorOrigen = config[origen];
    const radianes = valor * factorOrigen;

    let log = `<strong>1. Normalización a la unidad base (Radián):</strong><br>`;
    log += `Fórmula: rad = ${origen} * ${factorOrigen}<br>`;
    log += `Sustitución: rad = ${valor} * ${factorOrigen} = ${radianes.toFixed(p)} rad<br><br>`;

    log += `<strong>2. Conversión y desarrollo a las demás escalas:</strong><br>`;

    // 2. Cálculo cruzado y renderizado
    Object.keys(inputs).forEach(destino => {
        const factorDestino = config[destino];
        const valorCalculado = radianes / factorDestino;

        // Formateador dinámico para evitar truncar valores subatómicos de minutos/segundos de arco
        const usarExponencial = (valorCalculado < 1e-4 && valorCalculado > 0);
        const stringResultado = usarExponencial ? valorCalculado.toExponential(p) : valorCalculado.toFixed(p);

        if (destino !== origen) {
            inputs[destino].value = stringResultado;
        }

        log += `${destino}: ${radianes.toFixed(p)} / ${factorDestino} = <strong>${stringResultado}</strong><br>`;
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
        <p>Tomando el <strong>Radián (rad)</strong> como unidad de control matemático:</p>
        <ul>
            <li>Hacia radianes: rad = Valor * Factor Constante</li>
            <li>Desde radianes: Destino = rad / Factor Constante</li>
        </ul>
        <small>El cálculo integra constantes circulares basadas en la constante matemática pi ($\u03C0$).</small>`;
};

document.getElementById("saveJSON").onclick = () => {
    try {
        config = JSON.parse(document.getElementById("jsonEditor").value);
        alert("Configuración de ángulos actualizada localmente.");
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