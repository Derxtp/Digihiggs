let config = {
    celsiusToKelvin: 273.15,
    celsiusToFahrenheitMult: 1.8,
    celsiusToFahrenheitAdd: 32,
    celsiusToRankineMult: 1.8,
    celsiusToRankineAdd: 491.67
};

const inputs = {
    celsius: document.getElementById('celsius'),
    fahrenheit: document.getElementById('fahrenheit'),
    kelvin: document.getElementById('kelvin'),
    rankine: document.getElementById('rankine')
};

const pasosDiv = document.getElementById('pasos');
const precisionInput = document.getElementById('decimales');

// Evento para inputs en tiempo real -----------------------------
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
    let c; // Usaremos Celsius como unidad base interna

    // 1. Normalizar a Celsius y mostrar primer paso
    let log = `<strong>1. Normalización a Celsius:</strong><br>`;
    
    switch(origen) {
        case 'celsius': 
            c = valor; 
            log += `Valor ya está en Celsius: ${c}°C`;
            break;
        case 'fahrenheit': 
            c = (valor - config.celsiusToFahrenheitAdd) / config.celsiusToFahrenheitMult;
            log += `C = (${valor} - ${config.celsiusToFahrenheitAdd}) / ${config.celsiusToFahrenheitMult} = ${c.toFixed(p)}°C`;
            break;
        case 'kelvin': 
            c = valor - config.celsiusToKelvin;
            log += `C = ${valor} - ${config.celsiusToKelvin} = ${c.toFixed(p)}°C`;
            break;
        case 'rankine': 
            c = (valor - config.celsiusToRankineAdd) / config.celsiusToRankineMult;
            log += `C = (${valor} - ${config.celsiusToRankineAdd}) / ${config.celsiusToRankineMult} = ${c.toFixed(p)}°C`;
            break;
    }

    // 2. Calcular el resto desde Celsius
    const f = (c * config.celsiusToFahrenheitMult) + config.celsiusToFahrenheitAdd;
    const k = c + config.celsiusToKelvin;
    const r = (c * config.celsiusToRankineMult) + config.celsiusToRankineAdd;

    // 3. Actualizar inputs (evitando el que el usuario está escribiendo)
    if (origen !== 'celsius') inputs.celsius.value = c.toFixed(p);
    if (origen !== 'fahrenheit') inputs.fahrenheit.value = f.toFixed(p);
    if (origen !== 'kelvin') inputs.kelvin.value = k.toFixed(p);
    if (origen !== 'rankine') inputs.rankine.value = r.toFixed(p);

    // 4. Mostrar desarrollo completo
    log += `<br><br><strong>2. Conversión a otras unidades:</strong><br>`;
    log += `F = (${c.toFixed(p)} * ${config.celsiusToFahrenheitMult}) + ${config.celsiusToFahrenheitAdd} = ${f.toFixed(p)}°F<br>`;
    log += `K = ${c.toFixed(p)} + ${config.celsiusToKelvin} = ${k.toFixed(p)} K<br>`;
    log += `R = (${c.toFixed(p)} * ${config.celsiusToRankineMult}) + ${config.celsiusToRankineAdd} = ${r.toFixed(p)}°R`;
    
    pasosDiv.innerHTML = log;
}

// Gestión de Modales -----------------------------------------------
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
        <ul>
            <li>F = (C * 1.8) + 32</li>
            <li>K = C + 273.15</li>
            <li>R = (C * 1.8) + 491.67</li>
            <li>C = (F - 32) / 1.8</li>
        </ul>`;
};

document.getElementById("saveJSON").onclick = () => {
    try {
        config = JSON.parse(document.getElementById("jsonEditor").value);
        alert("Configuración actualizada localmente");
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