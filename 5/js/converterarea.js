let config = {
    metroCuadrado: 1,
    centimetroCuadrado: 0.0001,
    milimetroCuadrado: 0.000001,
    kilometroCuadrado: 1000000,
    millaCuadrada: 2589988.110336,
    yardaCuadrada: 0.83612736,
    pieCuadrada: 0.09290304,
    pulgadaCuadrada: 0.00064516,
    hectarea: 10000,
    acre: 4046.8564224
};

const inputs = {
    metroCuadrado: document.getElementById('metroCuadrado'),
    centimetroCuadrado: document.getElementById('centimetroCuadrado'),
    milimetroCuadrado: document.getElementById('milimetroCuadrado'),
    kilometroCuadrado: document.getElementById('kilometroCuadrado'),
    millaCuadrada: document.getElementById('millaCuadrada'),
    yardaCuadrada: document.getElementById('yardaCuadrada'),
    pieCuadrada: document.getElementById('pieCuadrada'),
    pulgadaCuadrada: document.getElementById('pulgadaCuadrada'),
    hectarea: document.getElementById('hectarea'),
    acre: document.getElementById('acre')
};

const pasosDiv = document.getElementById('pasos');
const precisionInput = document.getElementById('decimales');

// Escucha en tiempo real para todos los campos de área
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
    
    // 1. Normalización a la unidad base: Metro Cuadrado (m²)
    const factorOrigen = config[origen];
    const metros2 = valor * factorOrigen;

    let log = `<strong>1. Normalización a la unidad base (Metro Cuadrado):</strong><br>`;
    log += `Fórmula: m² = ${origen} * ${factorOrigen}<br>`;
    log += `Sustitución: m² = ${valor} * ${factorOrigen} = ${metros2.toFixed(p)} m²<br><br>`;

    log += `<strong>2. Conversión y desarrollo a las demás unidades:</strong><br>`;

    // 2. Calcular equivalencias cruzadas en las demás unidades
    Object.keys(inputs).forEach(destino => {
        const factorDestino = config[destino];
        const valorCalculado = metros2 / factorDestino;

        // Si el valor es muy pequeño pero mayor a cero, usamos formato exponencial para no perder precisión
        const usarCientifico = (valorCalculado < 1e-4 && valorCalculado > 0);
        const stringResultado = usarCientifico ? valorCalculado.toExponential(p) : valorCalculado.toFixed(p);

        if (destino !== origen) {
            inputs[destino].value = stringResultado;
        }

        log += `${destino}: ${metros2.toFixed(p)} / ${factorDestino} = <strong>${stringResultado}</strong><br>`;
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
        <p>Tomando el <strong>Metro Cuadrado (m²)</strong> como pivote de la constante:</p>
        <ul>
            <li>Convertir a m²: m² = Valor * Factor</li>
            <li>Convertir desde m²: Destino = m² / Factor</li>
        </ul>
        <small>Los factores imperiales y agrarios están sincronizados con las directrices internacionales del SI.</small>`;
};

document.getElementById("saveJSON").onclick = () => {
    try {
        config = JSON.parse(document.getElementById("jsonEditor").value);
        alert("Configuración de áreas actualizada con éxito");
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