let config = {
    kilometro: 1000,
    metro: 1,
    centimetro: 0.01,
    milimetro: 0.001,
    micrometro: 0.000001,
    nanometro: 0.000000001,
    angstrom: 1e-10,
    unidadX: 1.0021e-13,    
    milla: 1609.344,
    yarda: 0.9144,
    pie: 0.3048,
    pulgada: 0.0254,
    millaNautica: 1852
};

const inputs = {
    kilometro: document.getElementById('kilometro'),
    metro: document.getElementById('metro'),
    centimetro: document.getElementById('centimetro'),
    milimetro: document.getElementById('milimetro'),
    micrometro: document.getElementById('micrometro'),
    nanometro: document.getElementById('nanometro'),
    angstrom: document.getElementById('angstrom'),
    unidadX: document.getElementById('unidadX'),    
    milla: document.getElementById('milla'),
    yarda: document.getElementById('yarda'),
    pie: document.getElementById('pie'),
    pulgada: document.getElementById('pulgada'),
    millaNautica: document.getElementById('millaNautica')
};

const pasosDiv = document.getElementById('pasos');
const precisionInput = document.getElementById('decimales');

// Evento para entradas en tiempo real
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
    
    // 1. Normalizar a la unidad base: METRO
    // Operación: metros = valor_origen * factor_origen_en_metros
    const factorOrigen = config[origen];
    const metros = valor * factorOrigen;

    let log = `<strong>1. Normalización a la unidad base (Metro):</strong><br>`;
    log += `Fórmula: m = ${origen} * ${factorOrigen}<br>`;
    log += `Sustitución: m = ${valor} * ${factorOrigen} = ${metros.toFixed(p)} m<br><br>`;

    log += `<strong>2. Conversión y desarrollo a las demás unidades:</strong><br>`;

    // 2. Calcular y actualizar el resto de unidades
    Object.keys(inputs).forEach(destino => {
        const factorDestino = config[destino];
        // Operación: valor_destino = metros / factor_destino_en_metros
        const valorCalculado = metros / factorDestino;

        // Actualizar la interfaz (excepto el input activo para no interrumpir la escritura)
        if (destino !== origen) {
            inputs[destino].value = valorCalculado.toFixed(p);
        }

        // Agregar línea de desarrollo matemático para el contenedor
        log += `${destino}: ${metros.toFixed(p)} / ${factorDestino} = <strong>${valorCalculado.toFixed(p)}</strong><br>`;
    });

    pasosDiv.innerHTML = log;
}

// Gestión de Ventanas Modales
const modales = {
    json: document.getElementById("modalJSON"),
    formulas: document.getElementById("modalFormulas")
};

document.getElementById("btnConfig").onclick = () => {
    modales.json.style.display = "block";
    document.getElementById("jsonEditor").value = JSON.stringify(config, null, 2);
};

/* Modal de fórmulas de longitud (metro) */
document.getElementById("btnFormulas").onclick = () => {
    modales.formulas.style.display = "block";
    document.getElementById("listaFormulas").innerHTML = `
        <p>Tomando el <strong>Metro (m)</strong> como eje de la constante:</p>
        <ul>
            <li>Hacia Metros: m = Valor * Factor</li>
            <li>Desde Metros: Destino = m / Factor</li>
        </ul>
        <small>Consulte el botón 'Parámetros' para verificar el valor exacto de los factores.</small>`;
};

document.getElementById("saveJSON").onclick = () => {
    try {
        config = JSON.parse(document.getElementById("jsonEditor").value);
        alert("Configuración de longitudes actualizada localmente");
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