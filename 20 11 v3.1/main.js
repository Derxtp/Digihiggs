const DB = window.FACTORES_CONVERSION;

function createResultCard(label, unitId, converterType, themeColor) {
    return `
        <div id="card-${converterType}-${unitId}" class="result-card bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 transition-all duration-200 flex flex-col justify-between">
            <div>
                <p class="text-sm font-medium text-${themeColor}-600">${label}</p>
                <p id="output-${converterType}-${unitId}" class="text-xl font-bold text-gray-900 mt-1 break-words">0.00</p>
            </div>
            
            <!-- ESTE ES EL CONTENEDOR QUE FALTABA -->
            <div id="desarrollo-${converterType}-${unitId}" class="mt-3 pt-3 border-t border-${themeColor}-200 text-xs font-mono text-gray-500 hidden">
            </div>
        </div>
    `;
}

// ==============================================================================================================

function initializeLengthConverter() {
    const sourceUnitSelect = document.getElementById('sourceUnit-longitud');
    const resultsGrid = document.getElementById('resultsGrid-longitud');
    const precisionSelect = document.getElementById('precision-longitud');
    
    for (const unit in DB.longitud.factors) {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = DB.longitud.labels[unit];
        sourceUnitSelect.appendChild(option);
        resultsGrid.innerHTML += createResultCard(DB.longitud.labels[unit], unit, 'longitud', 'indigo');
    }
    for (let i = 0; i <= 8; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} decimales`;
        precisionSelect.appendChild(option);
    }
    precisionSelect.value = 8;
    sourceUnitSelect.value = 'm';
    convertLength();
}

function convertLength() {
    const value = parseFloat(document.getElementById('inputValue-longitud').value) || 0;
    const sourceUnit = document.getElementById('sourceUnit-longitud').value;
    const precision = parseInt(document.getElementById('precision-longitud').value, 10);
    const valueInMeters = value * DB.longitud.factors[sourceUnit];

    for (const targetUnit in DB.longitud.factors) {
        const result = valueInMeters / DB.longitud.factors[targetUnit];
        const formattedResult = (targetUnit === sourceUnit) ? value.toString() : result.toLocaleString(undefined, { maximumFractionDigits: precision });
        document.getElementById(`output-longitud-${targetUnit}`).textContent = formattedResult;

        
        const factorOrigen = DB.longitud.factors[sourceUnit];
        const factorDestino = DB.longitud.factors[targetUnit];
        const desarrolloElement = document.getElementById(`desarrollo-longitud-${targetUnit}`);
        
        if (desarrolloElement) {
            if (targetUnit === sourceUnit) {
                desarrolloElement.classList.add('hidden');
            } else {
                desarrolloElement.classList.remove('hidden');
                desarrolloElement.innerHTML = `
                    <span class="text-indigo-400 font-semibold mb-1 block">Procedimiento:</span>
                    <div>1) ${value} × ${factorOrigen} = ${valueInMeters}</div>
                    <div>2) ${valueInMeters} ÷ ${factorDestino} = <span class="font-bold text-gray-700">${formattedResult}</span></div>
                `;
            }
        }

        const card = document.getElementById(`card-longitud-${targetUnit}`);
        const isSource = targetUnit === sourceUnit;
        card.classList.toggle('bg-indigo-50', isSource);
        card.classList.toggle('border-indigo-400', isSource);
        card.classList.toggle('bg-gray-50', !isSource);
        card.classList.toggle('border-gray-200', !isSource);
    }
}
// ==============================================================================================================

function initializePressureConverter() {
    const sourceUnitSelect = document.getElementById('sourceUnit-presion');
    const resultsGrid = document.getElementById('resultsGrid-presion');
    const precisionSelect = document.getElementById('precision-presion');
    for (const unit in DB.presion.factors) {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = DB.presion.labels[unit];
        sourceUnitSelect.appendChild(option);
        resultsGrid.innerHTML += createResultCard(DB.presion.labels[unit], unit, 'presion', 'red');
    }
    for (let i = 0; i <= 8; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} decimales`;
        precisionSelect.appendChild(option);
    }
    precisionSelect.value = 8;
    sourceUnitSelect.value = 'Pa';
    convertPressure();
}

function convertPressure() {
    const value = parseFloat(document.getElementById('inputValue-presion').value) || 0;
    const sourceUnit = document.getElementById('sourceUnit-presion').value;
    const precision = parseInt(document.getElementById('precision-presion').value, 10);
    
    const valueInPascals = value * DB.presion.factors[sourceUnit];

    for (const targetUnit in DB.presion.factors) {
        const result = valueInPascals / DB.presion.factors[targetUnit];
        const formattedResult = (targetUnit === sourceUnit) ? value.toString() : result.toLocaleString(undefined, { maximumFractionDigits: precision });
        document.getElementById(`output-presion-${targetUnit}`).textContent = formattedResult;

        const factorOrigen = DB.presion.factors[sourceUnit];
        const factorDestino = DB.presion.factors[targetUnit];
        const desarrolloElement = document.getElementById(`desarrollo-presion-${targetUnit}`);
        
        if (desarrolloElement) {
            if (targetUnit === sourceUnit) {
                desarrolloElement.classList.add('hidden');
            } else {
                desarrolloElement.classList.remove('hidden');
                desarrolloElement.innerHTML = `
                    <span class="text-red-400 font-semibold mb-1 block">Procedimiento:</span>
                    <div>1) ${value} × ${factorOrigen} = ${valueInPascals}</div>
                    <div>2) ${valueInPascals} ÷ ${factorDestino} = <span class="font-bold text-gray-700">${formattedResult}</span></div>
                `;
            }
        }

        const card = document.getElementById(`card-presion-${targetUnit}`);
        if (card) {
            const isSource = targetUnit === sourceUnit;
            card.classList.toggle('bg-red-50', isSource);
            card.classList.toggle('border-red-400', isSource);
            card.classList.toggle('bg-gray-50', !isSource);
            card.classList.toggle('border-gray-200', !isSource);
        }
    }
}
// ==============================================================================================================

function initializeTemperatureConverter() {
    const sourceUnitSelect = document.getElementById('sourceUnit-temperatura');
    const resultsGrid = document.getElementById('resultsGrid-temperatura');
    const precisionSelect = document.getElementById('precision-temperatura');
    DB.temperatura.units.forEach(unit => {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = DB.temperatura.labels[unit];
        sourceUnitSelect.appendChild(option);
        resultsGrid.innerHTML += createResultCard(DB.temperatura.labels[unit], unit, 'temperatura', 'amber');
    });
    for (let i = 0; i <= 8; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} decimales`;
        precisionSelect.appendChild(option);
    }
    precisionSelect.value = 8;
    sourceUnitSelect.value = 'C';
    convertTemperature();
}

function convertTemperature() {
    const value = parseFloat(document.getElementById('inputValue-temperatura').value) || 0;
    const sourceUnit = document.getElementById('sourceUnit-temperatura').value;
    const precision = parseInt(document.getElementById('precision-temperatura').value, 10);
    const valueInKelvin = DB.temperatura.toKelvin[sourceUnit](value);
    
    DB.temperatura.units.forEach(targetUnit => {
        const result = DB.temperatura.fromKelvin[targetUnit](valueInKelvin);
        const formattedResult = (targetUnit === sourceUnit) ? value.toString() : result.toFixed(precision);
        document.getElementById(`output-temperatura-${targetUnit}`).textContent = formattedResult;

        const desarrolloElement = document.getElementById(`desarrollo-temperatura-${targetUnit}`);
        if (desarrolloElement) {
            if (targetUnit === sourceUnit) {
                desarrolloElement.classList.add('hidden');
            } else {
                desarrolloElement.classList.remove('hidden');
                desarrolloElement.innerHTML = `
                    <span class="text-amber-400 font-semibold mb-1 block">Procedimiento:</span>
                    <div>1) Convertir a Kelvin = ${valueInKelvin.toFixed(4)}</div>
                    <div>2) Kelvin a destino = <span class="font-bold text-gray-700">${formattedResult}</span></div>
                `;
            }
        }

        const card = document.getElementById(`card-temperatura-${targetUnit}`);
        const isSource = targetUnit === sourceUnit;
        card.classList.toggle('bg-amber-50', isSource);
        card.classList.toggle('border-amber-400', isSource);
        card.classList.toggle('bg-gray-50', !isSource);
        card.classList.toggle('border-gray-200', !isSource);
    });
}
// ==============================================================================================================

function initializeTimeConverter() {
    const sourceUnitSelect = document.getElementById('sourceUnit-tiempo');
    const resultsGrid = document.getElementById('resultsGrid-tiempo');
    const precisionSelect = document.getElementById('precision-tiempo');
    for (const unit in DB.tiempo.factors) {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = DB.tiempo.labels[unit];
        sourceUnitSelect.appendChild(option);
        resultsGrid.innerHTML += createResultCard(DB.tiempo.labels[unit], unit, 'tiempo', 'orange');
    }
    for (let i = 0; i <= 8; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} decimales`;
        precisionSelect.appendChild(option);
    }
    precisionSelect.value = 8;
    sourceUnitSelect.value = 's';
    convertTime();
}

function convertTime() {
    const value = parseFloat(document.getElementById('inputValue-tiempo').value) || 0;
    const sourceUnit = document.getElementById('sourceUnit-tiempo').value;
    const precision = parseInt(document.getElementById('precision-tiempo').value, 10);
    const valueInSeconds = value * DB.tiempo.factors[sourceUnit];

    for (const targetUnit in DB.tiempo.factors) {
        const result = valueInSeconds / DB.tiempo.factors[targetUnit];
        const formattedResult = (targetUnit === sourceUnit) ? value.toString() : result.toLocaleString(undefined, { maximumFractionDigits: precision });
        document.getElementById(`output-tiempo-${targetUnit}`).textContent = formattedResult;

        const factorOrigen = DB.tiempo.factors[sourceUnit];
        const factorDestino = DB.tiempo.factors[targetUnit];
        const desarrolloElement = document.getElementById(`desarrollo-tiempo-${targetUnit}`);
        
        if (desarrolloElement) {
            if (targetUnit === sourceUnit) {
                desarrolloElement.classList.add('hidden');
            } else {
                desarrolloElement.classList.remove('hidden');
                desarrolloElement.innerHTML = `
                    <span class="text-orange-400 font-semibold mb-1 block">Procedimiento:</span>
                    <div>1) ${value} × ${factorOrigen} = ${valueInSeconds}</div>
                    <div>2) ${valueInSeconds} ÷ ${factorDestino} = <span class="font-bold text-gray-700">${formattedResult}</span></div>
                `;
            }
        }
        

        const card = document.getElementById(`card-tiempo-${targetUnit}`);
        const isSource = targetUnit === sourceUnit;
        card.classList.toggle('bg-orange-50', isSource);
        card.classList.toggle('border-orange-400', isSource);
        card.classList.toggle('bg-gray-50', !isSource);
        card.classList.toggle('border-gray-200', !isSource);
    }
}
// ==============================================================================================================

function initializeMassConverter() {
    const sourceUnitSelect = document.getElementById('sourceUnit-masa');
    const resultsGrid = document.getElementById('resultsGrid-masa');
    const precisionSelect = document.getElementById('precision-masa');
    for (const unit in DB.masa.factors) {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = DB.masa.labels[unit];
        sourceUnitSelect.appendChild(option);
        resultsGrid.innerHTML += createResultCard(DB.masa.labels[unit], unit, 'masa', 'green');
    }
    for (let i = 0; i <= 8; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} decimales`;
        precisionSelect.appendChild(option);
    }
    precisionSelect.value = 8;
    sourceUnitSelect.value = 'kg';
    convertMass();
}

function convertMass() {
    const value = parseFloat(document.getElementById('inputValue-masa').value) || 0;
    const sourceUnit = document.getElementById('sourceUnit-masa').value;
    const precision = parseInt(document.getElementById('precision-masa').value, 10);
    const valueInKilograms = value * DB.masa.factors[sourceUnit];

    for (const targetUnit in DB.masa.factors) {
        const result = valueInKilograms / DB.masa.factors[targetUnit];
        const formattedResult = (targetUnit === sourceUnit) ? value.toString() : result.toLocaleString(undefined, { maximumFractionDigits: precision });
        document.getElementById(`output-masa-${targetUnit}`).textContent = formattedResult;

        
        const factorOrigen = DB.masa.factors[sourceUnit];
        const factorDestino = DB.masa.factors[targetUnit];
        const desarrolloElement = document.getElementById(`desarrollo-masa-${targetUnit}`);
        
        if (desarrolloElement) {
            if (targetUnit === sourceUnit) {
                desarrolloElement.classList.add('hidden');
            } else {
                desarrolloElement.classList.remove('hidden');
                desarrolloElement.innerHTML = `
                    <span class="text-green-400 font-semibold mb-1 block">Procedimiento:</span>
                    <div>1) ${value} × ${factorOrigen} = ${valueInKilograms}</div>
                    <div>2) ${valueInKilograms} ÷ ${factorDestino} = <span class="font-bold text-gray-700">${formattedResult}</span></div>
                `;
            }
        }
        

        const card = document.getElementById(`card-masa-${targetUnit}`);
        const isSource = targetUnit === sourceUnit;
        card.classList.toggle('bg-green-50', isSource);
        card.classList.toggle('border-green-400', isSource);
        card.classList.toggle('bg-gray-50', !isSource);
        card.classList.toggle('border-gray-200', !isSource);
    }
}
// ==============================================================================================================

function initializeVolumeConverter() {
    const sourceUnitSelect = document.getElementById('sourceUnit-volumen');
    const resultsGrid = document.getElementById('resultsGrid-volumen');
    const precisionSelect = document.getElementById('precision-volumen');
    for (const unit in DB.volumen.factors) {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = DB.volumen.labels[unit];
        sourceUnitSelect.appendChild(option);
        resultsGrid.innerHTML += createResultCard(DB.volumen.labels[unit], unit, 'volumen', 'teal');
    }
    for (let i = 0; i <= 8; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} decimales`;
        precisionSelect.appendChild(option);
    }
    precisionSelect.value = 8;
    sourceUnitSelect.value = 'L';
    convertVolume();
}

function convertVolume() {
    const value = parseFloat(document.getElementById('inputValue-volumen').value) || 0;
    const sourceUnit = document.getElementById('sourceUnit-volumen').value;
    const precision = parseInt(document.getElementById('precision-volumen').value, 10);
    const valueInLiters = value * DB.volumen.factors[sourceUnit];

    for (const targetUnit in DB.volumen.factors) {
        const result = valueInLiters / DB.volumen.factors[targetUnit];
        const formattedResult = (targetUnit === sourceUnit) ? value.toString() : result.toLocaleString(undefined, { maximumFractionDigits: precision });
        document.getElementById(`output-volumen-${targetUnit}`).textContent = formattedResult;

        
        const factorOrigen = DB.volumen.factors[sourceUnit];
        const factorDestino = DB.volumen.factors[targetUnit];
        const desarrolloElement = document.getElementById(`desarrollo-volumen-${targetUnit}`);
        
        if (desarrolloElement) {
            if (targetUnit === sourceUnit) {
                desarrolloElement.classList.add('hidden');
            } else {
                desarrolloElement.classList.remove('hidden');
                desarrolloElement.innerHTML = `
                    <span class="text-teal-400 font-semibold mb-1 block">Procedimiento:</span>
                    <div>1) ${value} × ${factorOrigen} = ${valueInLiters}</div>
                    <div>2) ${valueInLiters} ÷ ${factorDestino} = <span class="font-bold text-gray-700">${formattedResult}</span></div>
                `;
            }
        }
        

        const card = document.getElementById(`card-volumen-${targetUnit}`);
        const isSource = targetUnit === sourceUnit;
        card.classList.toggle('bg-teal-50', isSource);
        card.classList.toggle('border-teal-400', isSource);
        card.classList.toggle('bg-gray-50', !isSource);
        card.classList.toggle('border-gray-200', !isSource);
    }
}
// ==============================================================================================================

function initializeAngleConverter() {
    const sourceUnitSelect = document.getElementById('sourceUnit-anguloplano');
    const resultsGrid = document.getElementById('resultsGrid-anguloplano');
    const precisionSelect = document.getElementById('precision-anguloplano');
    for (const unit in DB.angulo.factors) {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = DB.angulo.labels[unit];
        sourceUnitSelect.appendChild(option);
        resultsGrid.innerHTML += createResultCard(DB.angulo.labels[unit], unit, 'anguloplano', 'indigo');
    }
    for (let i = 0; i <= 8; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} decimales`;
        precisionSelect.appendChild(option);
    }
    precisionSelect.value = 8;
    sourceUnitSelect.value = 'degree';
    convertAngle();
}

function convertAngle() {
    const value = parseFloat(document.getElementById('inputValue-anguloplano').value) || 0;
    const sourceUnit = document.getElementById('sourceUnit-anguloplano').value;
    const precision = parseInt(document.getElementById('precision-anguloplano').value, 10);
    const valueInRadians = value * DB.angulo.factors[sourceUnit];

    for (const targetUnit in DB.angulo.factors) {
        const result = valueInRadians / DB.angulo.factors[targetUnit];
        const formattedResult = (targetUnit === sourceUnit) ? value.toString() : result.toLocaleString(undefined, { maximumFractionDigits: precision });
        document.getElementById(`output-anguloplano-${targetUnit}`).textContent = formattedResult;

        
        const factorOrigen = DB.angulo.factors[sourceUnit];
        const factorDestino = DB.angulo.factors[targetUnit];
        const desarrolloElement = document.getElementById(`desarrollo-anguloplano-${targetUnit}`);
        
        if (desarrolloElement) {
            if (targetUnit === sourceUnit) {
                desarrolloElement.classList.add('hidden');
            } else {
                desarrolloElement.classList.remove('hidden');
                desarrolloElement.innerHTML = `
                    <span class="text-indigo-400 font-semibold mb-1 block">Procedimiento:</span>
                    <div>1) ${value} × ${factorOrigen} = ${valueInRadians.toFixed(6)}</div>
                    <div>2) ${valueInRadians.toFixed(6)} ÷ ${factorDestino} = <span class="font-bold text-gray-700">${formattedResult}</span></div>
                `;
            }
        }
        

        const card = document.getElementById(`card-anguloplano-${targetUnit}`);
        const isSource = targetUnit === sourceUnit;
        card.classList.toggle('bg-indigo-50', isSource);
        card.classList.toggle('border-indigo-400', isSource);
        card.classList.toggle('bg-gray-50', !isSource);
        card.classList.toggle('border-gray-200', !isSource);
    }
}
// ==============================================================================================================

function initializeAreaConverter() {
    const sourceUnitSelect = document.getElementById('sourceUnit-area');
    const resultsGrid = document.getElementById('resultsGrid-area');
    const precisionSelect = document.getElementById('precision-area');
    for (const unit in DB.area.factors) {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = DB.area.labels[unit];
        sourceUnitSelect.appendChild(option);
        resultsGrid.innerHTML += createResultCard(DB.area.labels[unit], unit, 'area', 'cyan');
    }
    for (let i = 0; i <= 8; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} decimales`;
        precisionSelect.appendChild(option);
    }
    precisionSelect.value = 8;
    sourceUnitSelect.value = 'm2';
    convertArea();
}

function convertArea() {
    const value = parseFloat(document.getElementById('inputValue-area').value) || 0;
    const sourceUnit = document.getElementById('sourceUnit-area').value;
    const precision = parseInt(document.getElementById('precision-area').value, 10);
    const valueInMeters2 = value * DB.area.factors[sourceUnit];

    for (const targetUnit in DB.area.factors) {
        const result = valueInMeters2 / DB.area.factors[targetUnit];
        const formattedResult = (targetUnit === sourceUnit) ? value.toString() : result.toLocaleString(undefined, { maximumFractionDigits: precision });
        document.getElementById(`output-area-${targetUnit}`).textContent = formattedResult;

        
        const factorOrigen = DB.area.factors[sourceUnit];
        const factorDestino = DB.area.factors[targetUnit];
        const desarrolloElement = document.getElementById(`desarrollo-area-${targetUnit}`);
        
        if (desarrolloElement) {
            if (targetUnit === sourceUnit) {
                desarrolloElement.classList.add('hidden');
            } else {
                desarrolloElement.classList.remove('hidden');
                desarrolloElement.innerHTML = `
                    <span class="text-cyan-400 font-semibold mb-1 block">Procedimiento:</span>
                    <div>1) ${value} × ${factorOrigen} = ${valueInMeters2}</div>
                    <div>2) ${valueInMeters2} ÷ ${factorDestino} = <span class="font-bold text-gray-700">${formattedResult}</span></div>
                `;
            }
        }
        

        const card = document.getElementById(`card-area-${targetUnit}`);
        const isSource = targetUnit === sourceUnit;
        card.classList.toggle('bg-cyan-50', isSource);
        card.classList.toggle('border-cyan-400', isSource);
        card.classList.toggle('bg-gray-50', !isSource);
        card.classList.toggle('border-gray-200', !isSource);
    }
}
// ==============================================================================================================

function initializeEnergyConverter() {
    const sourceUnitSelect = document.getElementById('sourceUnit-energia');
    const resultsGrid = document.getElementById('resultsGrid-energia');
    const precisionSelect = document.getElementById('precision-energia');
    for (const unit in DB.energia.factors) {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = DB.energia.labels[unit];
        sourceUnitSelect.appendChild(option);
        resultsGrid.innerHTML += createResultCard(DB.energia.labels[unit], unit, 'energia', 'yellow');
    }
    for (let i = 0; i <= 8; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} decimales`;
        precisionSelect.appendChild(option);
    }
    precisionSelect.value = 8;
    sourceUnitSelect.value = 'J';
    convertEnergy();
}

function convertEnergy() {
    const value = parseFloat(document.getElementById('inputValue-energia').value) || 0;
    const sourceUnit = document.getElementById('sourceUnit-energia').value;
    const precision = parseInt(document.getElementById('precision-energia').value, 10);
    const valueInJoules = value * DB.energia.factors[sourceUnit];

    for (const targetUnit in DB.energia.factors) {
        const result = valueInJoules / DB.energia.factors[targetUnit];
        const formattedResult = (targetUnit === sourceUnit) ? value.toString() : result.toLocaleString(undefined, { maximumFractionDigits: precision });
        document.getElementById(`output-energia-${targetUnit}`).textContent = formattedResult;

        
        const factorOrigen = DB.energia.factors[sourceUnit];
        const factorDestino = DB.energia.factors[targetUnit];
        const desarrolloElement = document.getElementById(`desarrollo-energia-${targetUnit}`);
        
        if (desarrolloElement) {
            if (targetUnit === sourceUnit) {
                desarrolloElement.classList.add('hidden');
            } else {
                desarrolloElement.classList.remove('hidden');
                desarrolloElement.innerHTML = `
                    <span class="text-yellow-400 font-semibold mb-1 block">Procedimiento:</span>
                    <div>1) ${value} × ${factorOrigen} = ${valueInJoules}</div>
                    <div>2) ${valueInJoules} ÷ ${factorDestino} = <span class="font-bold text-gray-700">${formattedResult}</span></div>
                `;
            }
        }
        

        const card = document.getElementById(`card-energia-${targetUnit}`);
        const isSource = targetUnit === sourceUnit;
        card.classList.toggle('bg-yellow-50', isSource);
        card.classList.toggle('border-yellow-400', isSource);
        card.classList.toggle('bg-gray-50', !isSource);
        card.classList.toggle('border-gray-200', !isSource);
    }
}
// ==============================================================================================================

function initializeDataStorageConverter() {
    const sourceUnitSelect = document.getElementById('sourceUnit-almacenamiento');
    const outputGrid = document.getElementById('resultsGrid-almacenamiento');
    const precisionSelect = document.getElementById('precision-almacenamiento');
    
    let optionsHtml = '';
    DB.almacenamiento.UNITS.forEach(unit => {
        optionsHtml += `<option value="${unit.id}" ${unit.id === 'byte' ? 'selected' : ''}>${unit.label} (${unit.abbr})</option>`;
    });
    sourceUnitSelect.innerHTML = optionsHtml;

    let outputHtml = '';
    DB.almacenamiento.UNITS.forEach(unit => { 
        outputHtml += createResultCard(`${unit.label} (${unit.abbr})`, unit.id, 'almacenamiento', 'blue');
    });

    outputGrid.innerHTML = outputHtml;

    for (let i = 0; i <= 8; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} decimales`;
        precisionSelect.appendChild(option);
    }
    precisionSelect.value = 8;

    convertDataStorage();
}

function convertDataStorage() {
    const valueStr = document.getElementById('inputValue-almacenamiento').value;
    const sourceId = document.getElementById('sourceUnit-almacenamiento').value;
    const precision = parseInt(document.getElementById('precision-almacenamiento').value, 10);
    const sourceValue = parseFloat(valueStr);

    if (isNaN(sourceValue) || sourceValue < 0) {
        DB.almacenamiento.UNITS.forEach(unit => {
            document.getElementById(`output-almacenamiento-${unit.id}`).textContent = '0';
            const cardElement = document.getElementById(`card-almacenamiento-${unit.id}`);
            cardElement.classList.remove('border-blue-700', 'bg-blue-50');
            cardElement.classList.add('border-gray-400', 'bg-gray-100');
            
            const desarrolloElement = document.getElementById(`desarrollo-almacenamiento-${unit.id}`);
            if (desarrolloElement) desarrolloElement.classList.add('hidden');
        });
        return;
    }
    
    const sourceUnit = DB.almacenamiento.UNITS.find(unit => unit.id === sourceId);
    if (!sourceUnit) return;

    const bits = sourceValue * sourceUnit.factor;

    DB.almacenamiento.UNITS.forEach(targetUnit => {
        const targetValue = bits / targetUnit.factor;
        let formattedValue = (targetUnit.id === sourceId) ? sourceValue.toString() : targetValue.toFixed(precision);
        if (precision > 0 && bits !== 0) {
            formattedValue = formattedValue.replace(/\.?0+$/, '');
        }
        document.getElementById(`output-almacenamiento-${targetUnit.id}`).textContent = formattedValue;

        
        const desarrolloElement = document.getElementById(`desarrollo-almacenamiento-${targetUnit.id}`);
        if (desarrolloElement) {
            if (targetUnit.id === sourceId) {
                desarrolloElement.classList.add('hidden');
            } else {
                desarrolloElement.classList.remove('hidden');
                desarrolloElement.innerHTML = `
                    <span class="text-blue-400 font-semibold mb-1 block">Procedimiento:</span>
                    <div>1) ${sourceValue} × ${sourceUnit.factor} = ${bits} (Bits base)</div>
                    <div>2) ${bits} ÷ ${targetUnit.factor} = <span class="font-bold text-gray-700">${formattedValue}</span></div>
                `;
            }
        }
        

        const cardElement = document.getElementById(`card-almacenamiento-${targetUnit.id}`);
        const isSource = targetUnit.id === sourceId;
        cardElement.classList.toggle('border-blue-400', isSource);
        cardElement.classList.toggle('bg-blue-50', isSource);
        cardElement.classList.toggle('border-gray-200', !isSource);
        cardElement.classList.toggle('bg-gray-50', !isSource);
    });
}
// ==============================================================================================================

function convertSpeed() {
    const inputValue = parseFloat(document.getElementById('inputValue-velocidad').value);
    const sourceUnitId = document.getElementById('sourceUnit-velocidad').value;
    const precision = parseInt(document.getElementById('precision-velocidad').value, 10);

    const sourceUnit = DB.velocidad.UNITS.find(u => u.id === sourceUnitId);
    
    if (isNaN(inputValue) || inputValue < 0) {
        DB.velocidad.UNITS.forEach(unit => {
            document.getElementById(`output-velocidad-${unit.id}`).textContent = 'Inválido';
            const desarrolloElement = document.getElementById(`desarrollo-velocidad-${unit.id}`);
            if (desarrolloElement) desarrolloElement.classList.add('hidden');
        });
        return;
    }

    const valueInMetersPerSecond = inputValue * sourceUnit.factor;

    DB.velocidad.UNITS.forEach(targetUnit => {
        const convertedValue = valueInMetersPerSecond / targetUnit.factor;
        const formattedResult = (targetUnit.id === sourceUnitId) ? inputValue.toString() : convertedValue.toLocaleString(undefined, { maximumFractionDigits: precision });
        document.getElementById(`output-velocidad-${targetUnit.id}`).textContent = formattedResult;

        
        const desarrolloElement = document.getElementById(`desarrollo-velocidad-${targetUnit.id}`);
        if (desarrolloElement) {
            if (targetUnit.id === sourceUnitId) {
                desarrolloElement.classList.add('hidden');
            } else {
                desarrolloElement.classList.remove('hidden');
                desarrolloElement.innerHTML = `
                    <span class="text-indigo-400 font-semibold mb-1 block">Procedimiento:</span>
                    <div>1) ${inputValue} × ${sourceUnit.factor} = ${valueInMetersPerSecond}</div>
                    <div>2) ${valueInMetersPerSecond} ÷ ${targetUnit.factor} = <span class="font-bold text-gray-700">${formattedResult}</span></div>
                `;
            }
        }
        

        const card = document.getElementById(`card-velocidad-${targetUnit.id}`);
        const isSource = targetUnit.id === sourceUnitId;
        card.classList.toggle('bg-indigo-50', isSource);
        card.classList.toggle('border-indigo-400', isSource);
        card.classList.toggle('bg-gray-50', !isSource);
        card.classList.toggle('border-gray-200', !isSource);
    });
}

function initializeSpeedConverter() {
    const sourceUnitSelect = document.getElementById('sourceUnit-velocidad');
    const resultsGrid = document.getElementById('resultsGrid-velocidad');
    const precisionSelect = document.getElementById('precision-velocidad');
    
    DB.velocidad.UNITS.forEach(unit => {
        const option = document.createElement('option');
        option.value = unit.id;
        option.textContent = `${unit.name} (${unit.symbol})`;
        sourceUnitSelect.appendChild(option);
    });

    resultsGrid.innerHTML = DB.velocidad.UNITS.map(unit => createResultCard(`${unit.name} (${unit.symbol})`, unit.id, 'velocidad', 'indigo')).join('');

    for (let i = 0; i <= 8; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} decimales`;
        precisionSelect.appendChild(option);
    }
    precisionSelect.value = 8;

    sourceUnitSelect.value = 'ms';
    convertSpeed();
}
// ==============================================================================================================

function convertFuelEfficiency() {
    const inputEl = document.getElementById('inputValue-eficiencia');
    const selectEl = document.getElementById('selectUnit-eficiencia');
    const precision = parseInt(document.getElementById('precision-eficiencia').value, 10);

    const inputValue = parseFloat(inputEl.value);
    const sourceKey = selectEl.value;
    const sourceUnit = DB.eficiencia.UNITS[sourceKey];

    if (isNaN(inputValue) || inputValue <= 0) {
        Object.keys(DB.eficiencia.UNITS).forEach(key => {
            const outputEl = document.getElementById(`output-eficiencia-${key}`);
            if (outputEl) outputEl.textContent = 'Inválido';
            const desarrolloElement = document.getElementById(`desarrollo-eficiencia-${key}`);
            if (desarrolloElement) desarrolloElement.classList.add('hidden');
        });
        return;
    }

    let baseKMPLValue = sourceUnit.isInverse ? sourceUnit.factorToKMPL / inputValue : inputValue * sourceUnit.factorToKMPL;
    
    Object.entries(DB.eficiencia.UNITS).forEach(([targetKey, targetUnit]) => {
        const result = targetUnit.isInverse ? targetUnit.factorToKMPL / baseKMPLValue : baseKMPLValue / targetUnit.factorToKMPL;
        const formattedResult = (targetKey === sourceKey) ? inputValue.toString() : result.toFixed(precision);
        document.getElementById(`output-eficiencia-${targetKey}`).textContent = formattedResult;
        
        
        const desarrolloElement = document.getElementById(`desarrollo-eficiencia-${targetKey}`);
        if (desarrolloElement) {
            if (targetKey === sourceKey) {
                desarrolloElement.classList.add('hidden');
            } else {
                desarrolloElement.classList.remove('hidden');
                desarrolloElement.innerHTML = `
                    <span class="text-teal-400 font-semibold mb-1 block">Procedimiento:</span>
                    <div>1) Factor base KM/L = ${baseKMPLValue.toFixed(4)}</div>
                    <div>2) Cálculo con inversa = <span class="font-bold text-gray-700">${formattedResult}</span></div>
                `;
            }
        }
        

        const card = document.getElementById(`card-eficiencia-${targetKey}`);
        const isSource = targetKey === sourceKey;
        card.classList.toggle('bg-teal-50', isSource);
        card.classList.toggle('border-teal-400', isSource);
        card.classList.toggle('bg-gray-50', !isSource);
        card.classList.toggle('border-gray-200', !isSource);
    });
}

function initializeFuelEfficiencyConverter() {
    const selectEl = document.getElementById('selectUnit-eficiencia');
    const resultsGrid = document.getElementById('resultsGrid-eficiencia');
    const precisionSelect = document.getElementById('precision-eficiencia');

    const fragment = document.createDocumentFragment();
    Object.entries(DB.eficiencia.UNITS).forEach(([key, unit]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = unit.name + ` (${unit.symbol})`;
        fragment.appendChild(option);
    });
    selectEl.appendChild(fragment);

    resultsGrid.innerHTML = Object.entries(DB.eficiencia.UNITS).map(([key, unit]) => createResultCard(`${unit.name} (${unit.symbol})`, key, 'eficiencia', 'teal')).join('');

    for (let i = 0; i <= 8; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} decimales`;
        precisionSelect.appendChild(option);
    }
    precisionSelect.value = 8;

    selectEl.value = 'l_per_100km';
    convertFuelEfficiency();
}
// ==============================================================================================================

function initializeForceConverter() {
    const sourceUnitSelect = document.getElementById('sourceUnit-fuerza');
    const resultsGrid = document.getElementById('resultsGrid-fuerza');
    const precisionSelect = document.getElementById('precision-fuerza');
    
    for (const unit in DB.fuerza.factors) {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = DB.fuerza.labels[unit];
        sourceUnitSelect.appendChild(option);
        resultsGrid.innerHTML += createResultCard(DB.fuerza.labels[unit], unit, 'fuerza', 'red'); 
    }
    for (let i = 0; i <= 8; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} decimales`;
        precisionSelect.appendChild(option);
    }
    precisionSelect.value = 8;
    sourceUnitSelect.value = 'N'; 
    convertForce();
}

function convertForce() {
    const value = parseFloat(document.getElementById('inputValue-fuerza').value) || 0;
    const sourceUnit = document.getElementById('sourceUnit-fuerza').value;
    const precision = parseInt(document.getElementById('precision-fuerza').value, 10);
    const valueInNewtons = value * DB.fuerza.factors[sourceUnit];

    for (const targetUnit in DB.fuerza.factors) {
        const result = valueInNewtons / DB.fuerza.factors[targetUnit];
        const formattedResult = (targetUnit === sourceUnit) ? value.toString() : result.toLocaleString(undefined, { maximumFractionDigits: precision });
        document.getElementById(`output-fuerza-${targetUnit}`).textContent = formattedResult;

        
        const factorOrigen = DB.fuerza.factors[sourceUnit];
        const factorDestino = DB.fuerza.factors[targetUnit];
        const desarrolloElement = document.getElementById(`desarrollo-fuerza-${targetUnit}`);
        
        if (desarrolloElement) {
            if (targetUnit === sourceUnit) {
                desarrolloElement.classList.add('hidden');
            } else {
                desarrolloElement.classList.remove('hidden');
                desarrolloElement.innerHTML = `
                    <span class="text-red-400 font-semibold mb-1 block">Procedimiento:</span>
                    <div>1) ${value} × ${factorOrigen} = ${valueInNewtons}</div>
                    <div>2) ${valueInNewtons} ÷ ${factorDestino} = <span class="font-bold text-gray-700">${formattedResult}</span></div>
                `;
            }
        }
        

        const card = document.getElementById(`card-fuerza-${targetUnit}`);
        const isSource = targetUnit === sourceUnit;
        card.classList.toggle('bg-red-50', isSource);
        card.classList.toggle('border-red-400', isSource);
        card.classList.toggle('bg-gray-50', !isSource);
        card.classList.toggle('border-gray-200', !isSource);
    }
}
// ==============================================================================================================

function initializePowerConverter() {
    const sourceUnitSelect = document.getElementById('sourceUnit-potencia');
    const resultsGrid = document.getElementById('resultsGrid-potencia');
    const precisionSelect = document.getElementById('precision-potencia');
    
    for (const unit in DB.potencia.factors) {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = DB.potencia.labels[unit];
        sourceUnitSelect.appendChild(option);
        resultsGrid.innerHTML += createResultCard(DB.potencia.labels[unit], unit, 'potencia', 'yellow'); 
    }
    for (let i = 0; i <= 8; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} decimales`;
        precisionSelect.appendChild(option);
    }
    precisionSelect.value = 8;
    sourceUnitSelect.value = 'W'; 
    convertPower();
}

function convertPower() {
    const value = parseFloat(document.getElementById('inputValue-potencia').value) || 0;
    const sourceUnit = document.getElementById('sourceUnit-potencia').value;
    const precision = parseInt(document.getElementById('precision-potencia').value, 10);
    const valueInWatts = value * DB.potencia.factors[sourceUnit];

    for (const targetUnit in DB.potencia.factors) {
        const result = valueInWatts / DB.potencia.factors[targetUnit];
        const formattedResult = (targetUnit === sourceUnit) ? value.toString() : result.toLocaleString(undefined, { maximumFractionDigits: precision });
        document.getElementById(`output-potencia-${targetUnit}`).textContent = formattedResult;

        
        const factorOrigen = DB.potencia.factors[sourceUnit];
        const factorDestino = DB.potencia.factors[targetUnit];
        const desarrolloElement = document.getElementById(`desarrollo-potencia-${targetUnit}`);
        
        if (desarrolloElement) {
            if (targetUnit === sourceUnit) {
                desarrolloElement.classList.add('hidden');
            } else {
                desarrolloElement.classList.remove('hidden');
                desarrolloElement.innerHTML = `
                    <span class="text-yellow-400 font-semibold mb-1 block">Procedimiento:</span>
                    <div>1) ${value} × ${factorOrigen} = ${valueInWatts}</div>
                    <div>2) ${valueInWatts} ÷ ${factorDestino} = <span class="font-bold text-gray-700">${formattedResult}</span></div>
                `;
            }
        }
        

        const card = document.getElementById(`card-potencia-${targetUnit}`);
        const isSource = targetUnit === sourceUnit;
        card.classList.toggle('bg-yellow-50', isSource);
        card.classList.toggle('border-yellow-400', isSource);
        card.classList.toggle('bg-gray-50', !isSource);
        card.classList.toggle('border-gray-200', !isSource);
    }
}
// ==============================================================================================================

function initializeTorqueConverter() {
    const sourceUnitSelect = document.getElementById('sourceUnit-torque');
    const resultsGrid = document.getElementById('resultsGrid-torque');
    const precisionSelect = document.getElementById('precision-torque');
    
    for (const unit in DB.torque.factors) {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = DB.torque.labels[unit];
        sourceUnitSelect.appendChild(option);
        resultsGrid.innerHTML += createResultCard(DB.torque.labels[unit], unit, 'torque', 'purple'); 
    }
    for (let i = 0; i <= 8; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} decimales`;
        precisionSelect.appendChild(option);
    }
    precisionSelect.value = 4; 
    sourceUnitSelect.value = 'Nm'; 
    convertTorque();
}

function convertTorque() {
    const value = parseFloat(document.getElementById('inputValue-torque').value) || 0;
    const sourceUnit = document.getElementById('sourceUnit-torque').value;
    const precision = parseInt(document.getElementById('precision-torque').value, 10);
    const valueInNm = value * DB.torque.factors[sourceUnit];

    for (const targetUnit in DB.torque.factors) {
        const result = valueInNm / DB.torque.factors[targetUnit];
        const formattedResult = (targetUnit === sourceUnit) ? value.toString() : result.toLocaleString(undefined, { maximumFractionDigits: precision });
        document.getElementById(`output-torque-${targetUnit}`).textContent = formattedResult;

        
        const factorOrigen = DB.torque.factors[sourceUnit];
        const factorDestino = DB.torque.factors[targetUnit];
        const desarrolloElement = document.getElementById(`desarrollo-torque-${targetUnit}`);
        
        if (desarrolloElement) {
            if (targetUnit === sourceUnit) {
                desarrolloElement.classList.add('hidden');
            } else {
                desarrolloElement.classList.remove('hidden');
                desarrolloElement.innerHTML = `
                    <span class="text-purple-400 font-semibold mb-1 block">Procedimiento:</span>
                    <div>1) ${value} × ${factorOrigen} = ${valueInNm}</div>
                    <div>2) ${valueInNm} ÷ ${factorDestino} = <span class="font-bold text-gray-700">${formattedResult}</span></div>
                `;
            }
        }
        

        const card = document.getElementById(`card-torque-${targetUnit}`);
        const isSource = targetUnit === sourceUnit;
        card.classList.toggle('bg-purple-50', isSource);
        card.classList.toggle('border-purple-400', isSource);
        card.classList.toggle('bg-gray-50', !isSource);
        card.classList.toggle('border-gray-200', !isSource);
    }
}
// ==============================================================================================================

function initializeAceleracionConverter() {
    const sourceUnitSelect = document.getElementById('sourceUnit-aceleracion');
    const resultsGrid = document.getElementById('resultsGrid-aceleracion');
    const precisionSelect = document.getElementById('precision-aceleracion');
    
    for (const unit in DB.aceleracion.factors) {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = DB.aceleracion.labels[unit];
        sourceUnitSelect.appendChild(option);
        resultsGrid.innerHTML += createResultCard(DB.aceleracion.labels[unit], unit, 'aceleracion', 'purple'); 
    }
    for (let i = 0; i <= 8; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} decimales`;
        precisionSelect.appendChild(option);
    }
    precisionSelect.value = 4; 
    sourceUnitSelect.value = 'm_s2'; 
    convertAceleracion();
}

function convertAceleracion() {
    const value = parseFloat(document.getElementById('inputValue-aceleracion').value) || 0;
    const sourceUnit = document.getElementById('sourceUnit-aceleracion').value;
    const precision = parseInt(document.getElementById('precision-aceleracion').value, 10);
    const valueInBase = value * DB.aceleracion.factors[sourceUnit];

    for (const targetUnit in DB.aceleracion.factors) {
        const result = valueInBase / DB.aceleracion.factors[targetUnit];
        const formattedResult = (targetUnit === sourceUnit) ? value.toString() : result.toLocaleString(undefined, { maximumFractionDigits: precision });
        document.getElementById(`output-aceleracion-${targetUnit}`).textContent = formattedResult;

        
        const factorOrigen = DB.aceleracion.factors[sourceUnit];
        const factorDestino = DB.aceleracion.factors[targetUnit];
        const desarrolloElement = document.getElementById(`desarrollo-aceleracion-${targetUnit}`);
        
        if (desarrolloElement) {
            if (targetUnit === sourceUnit) {
                desarrolloElement.classList.add('hidden');
            } else {
                desarrolloElement.classList.remove('hidden');
                desarrolloElement.innerHTML = `
                    <span class="text-purple-400 font-semibold mb-1 block">Procedimiento:</span>
                    <div>1) ${value} × ${factorOrigen} = ${valueInBase}</div>
                    <div>2) ${valueInBase} ÷ ${factorDestino} = <span class="font-bold text-gray-700">${formattedResult}</span></div>
                `;
            }
        }
        

        const card = document.getElementById(`card-aceleracion-${targetUnit}`);
        const isSource = targetUnit === sourceUnit;
        card.classList.toggle('bg-purple-50', isSource);
        card.classList.toggle('border-purple-400', isSource);
        card.classList.toggle('bg-gray-50', !isSource);
        card.classList.toggle('border-gray-200', !isSource);
    }
}
// ==============================================================================================================

function initializeElectricidadConverter() {
    const sourceUnitSelect = document.getElementById('sourceUnit-electricidad');
    const resultsGrid = document.getElementById('resultsGrid-electricidad');
    const precisionSelect = document.getElementById('precision-electricidad');
    
    for (const unit in DB.electricidad.factors) {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = DB.electricidad.labels[unit];
        sourceUnitSelect.appendChild(option);
        resultsGrid.innerHTML += createResultCard(DB.electricidad.labels[unit], unit, 'electricidad', 'purple'); 
    }
    for (let i = 0; i <= 8; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} decimales`;
        precisionSelect.appendChild(option);
    }
    precisionSelect.value = 4; 
    sourceUnitSelect.value = 'V'; 
    convertElectricidad();
}

function convertElectricidad() {
    const value = parseFloat(document.getElementById('inputValue-electricidad').value) || 0;
    const sourceUnit = document.getElementById('sourceUnit-electricidad').value;
    const precision = parseInt(document.getElementById('precision-electricidad').value, 10);
    const valueInBase = value * DB.electricidad.factors[sourceUnit];

    for (const targetUnit in DB.electricidad.factors) {
        const result = valueInBase / DB.electricidad.factors[targetUnit];
        const formattedResult = (targetUnit === sourceUnit) ? value.toString() : result.toLocaleString(undefined, { maximumFractionDigits: precision });
        document.getElementById(`output-electricidad-${targetUnit}`).textContent = formattedResult;

        
        const factorOrigen = DB.electricidad.factors[sourceUnit];
        const factorDestino = DB.electricidad.factors[targetUnit];
        const desarrolloElement = document.getElementById(`desarrollo-electricidad-${targetUnit}`);
        
        if (desarrolloElement) {
            if (targetUnit === sourceUnit) {
                desarrolloElement.classList.add('hidden');
            } else {
                desarrolloElement.classList.remove('hidden');
                desarrolloElement.innerHTML = `
                    <span class="text-purple-400 font-semibold mb-1 block">Procedimiento:</span>
                    <div>1) ${value} × ${factorOrigen} = ${valueInBase}</div>
                    <div>2) ${valueInBase} ÷ ${factorDestino} = <span class="font-bold text-gray-700">${formattedResult}</span></div>
                `;
            }
        }
        

        const card = document.getElementById(`card-electricidad-${targetUnit}`);
        const isSource = targetUnit === sourceUnit;
        card.classList.toggle('bg-purple-50', isSource);
        card.classList.toggle('border-purple-400', isSource);
        card.classList.toggle('bg-gray-50', !isSource);
        card.classList.toggle('border-gray-200', !isSource);
    }
}
// ==============================================================================================================

function initializeFrecuenciaConverter() {
    const sourceUnitSelect = document.getElementById('sourceUnit-frecuencia');
    const resultsGrid = document.getElementById('resultsGrid-frecuencia');
    const precisionSelect = document.getElementById('precision-frecuencia');
    
    for (const unit in DB.frecuencia.factors) {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = DB.frecuencia.labels[unit];
        sourceUnitSelect.appendChild(option);
        resultsGrid.innerHTML += createResultCard(DB.frecuencia.labels[unit], unit, 'frecuencia', 'purple'); 
    }
    for (let i = 0; i <= 8; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} decimales`;
        precisionSelect.appendChild(option);
    }
    precisionSelect.value = 4; 
    sourceUnitSelect.value = 'Hz'; 
    convertFrecuencia();
}

function convertFrecuencia() {
    const value = parseFloat(document.getElementById('inputValue-frecuencia').value) || 0;
    const sourceUnit = document.getElementById('sourceUnit-frecuencia').value;
    const precision = parseInt(document.getElementById('precision-frecuencia').value, 10);
    const valueInBase = value * DB.frecuencia.factors[sourceUnit];

    for (const targetUnit in DB.frecuencia.factors) {
        const result = valueInBase / DB.frecuencia.factors[targetUnit];
        const formattedResult = (targetUnit === sourceUnit) ? value.toString() : result.toLocaleString(undefined, { maximumFractionDigits: precision });
        document.getElementById(`output-frecuencia-${targetUnit}`).textContent = formattedResult;

        
        const factorOrigen = DB.frecuencia.factors[sourceUnit];
        const factorDestino = DB.frecuencia.factors[targetUnit];
        const desarrolloElement = document.getElementById(`desarrollo-frecuencia-${targetUnit}`);
        
        if (desarrolloElement) {
            if (targetUnit === sourceUnit) {
                desarrolloElement.classList.add('hidden');
            } else {
                desarrolloElement.classList.remove('hidden');
                desarrolloElement.innerHTML = `
                    <span class="text-purple-400 font-semibold mb-1 block">Procedimiento:</span>
                    <div>1) ${value} × ${factorOrigen} = ${valueInBase}</div>
                    <div>2) ${valueInBase} ÷ ${factorDestino} = <span class="font-bold text-gray-700">${formattedResult}</span></div>
                `;
            }
        }
        

        const card = document.getElementById(`card-frecuencia-${targetUnit}`);
        const isSource = targetUnit === sourceUnit;
        card.classList.toggle('bg-purple-50', isSource);
        card.classList.toggle('border-purple-400', isSource);
        card.classList.toggle('bg-gray-50', !isSource);
        card.classList.toggle('border-gray-200', !isSource);
    }
}

// ==============================================================================================================

function initializeDisenoConverter() {
    const sourceUnitSelect = document.getElementById('sourceUnit-diseno');
    const resultsGrid = document.getElementById('resultsGrid-diseno');
    const precisionSelect = document.getElementById('precision-diseno');
    
    for (const unit in DB.diseno.factors) {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = DB.diseno.labels[unit];
        sourceUnitSelect.appendChild(option);
        resultsGrid.innerHTML += createResultCard(DB.diseno.labels[unit], unit, 'diseno', 'purple'); 
    }
    for (let i = 0; i <= 8; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} decimales`;
        precisionSelect.appendChild(option);
    }
    precisionSelect.value = 4; 
    sourceUnitSelect.value = 'px'; 
    convertDiseno();
}

function convertDiseno() {
    const value = parseFloat(document.getElementById('inputValue-diseno').value) || 0;
    const sourceUnit = document.getElementById('sourceUnit-diseno').value;
    const precision = parseInt(document.getElementById('precision-diseno').value, 10);
    const valueInBase = value * DB.diseno.factors[sourceUnit];

    for (const targetUnit in DB.diseno.factors) {
        const result = valueInBase / DB.diseno.factors[targetUnit];
        const formattedResult = (targetUnit === sourceUnit) ? value.toString() : result.toLocaleString(undefined, { maximumFractionDigits: precision });
        document.getElementById(`output-diseno-${targetUnit}`).textContent = formattedResult;

        
        const factorOrigen = DB.diseno.factors[sourceUnit];
        const factorDestino = DB.diseno.factors[targetUnit];
        const desarrolloElement = document.getElementById(`desarrollo-diseno-${targetUnit}`);
        
        if (desarrolloElement) {
            if (targetUnit === sourceUnit) {
                desarrolloElement.classList.add('hidden');
            } else {
                desarrolloElement.classList.remove('hidden');
                desarrolloElement.innerHTML = `
                    <span class="text-purple-400 font-semibold mb-1 block">Procedimiento:</span>
                    <div>1) ${value} × ${factorOrigen} = ${valueInBase}</div>
                    <div>2) ${valueInBase} ÷ ${factorDestino} = <span class="font-bold text-gray-700">${formattedResult}</span></div>
                `;
            }
        }
        

        const card = document.getElementById(`card-diseno-${targetUnit}`);
        const isSource = targetUnit === sourceUnit;
        card.classList.toggle('bg-purple-50', isSource);
        card.classList.toggle('border-purple-400', isSource);
        card.classList.toggle('bg-gray-50', !isSource);
        card.classList.toggle('border-gray-200', !isSource);
    }
}

// ==============================================================================================================

function initializeIluminacionConverter() {
    const sourceUnitSelect = document.getElementById('sourceUnit-iluminacion');
    const resultsGrid = document.getElementById('resultsGrid-iluminacion');
    const precisionSelect = document.getElementById('precision-iluminacion');
    
    for (const unit in DB.iluminacion.factors) {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = DB.iluminacion.labels[unit];
        sourceUnitSelect.appendChild(option);
        resultsGrid.innerHTML += createResultCard(DB.iluminacion.labels[unit], unit, 'iluminacion', 'purple'); 
    }
    for (let i = 0; i <= 8; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} decimales`;
        precisionSelect.appendChild(option);
    }
    precisionSelect.value = 4; 
    sourceUnitSelect.value = 'lx'; 
    convertIluminacion();
}

function convertIluminacion() {
    const value = parseFloat(document.getElementById('inputValue-iluminacion').value) || 0;
    const sourceUnit = document.getElementById('sourceUnit-iluminacion').value;
    const precision = parseInt(document.getElementById('precision-iluminacion').value, 10);
    const valueInBase = value * DB.iluminacion.factors[sourceUnit];

    for (const targetUnit in DB.iluminacion.factors) {
        const result = valueInBase / DB.iluminacion.factors[targetUnit];
        const formattedResult = (targetUnit === sourceUnit) ? value.toString() : result.toLocaleString(undefined, { maximumFractionDigits: precision });
        document.getElementById(`output-iluminacion-${targetUnit}`).textContent = formattedResult;

        
        const factorOrigen = DB.iluminacion.factors[sourceUnit];
        const factorDestino = DB.iluminacion.factors[targetUnit];
        const desarrolloElement = document.getElementById(`desarrollo-iluminacion-${targetUnit}`);
        
        if (desarrolloElement) {
            if (targetUnit === sourceUnit) {
                desarrolloElement.classList.add('hidden');
            } else {
                desarrolloElement.classList.remove('hidden');
                desarrolloElement.innerHTML = `
                    <span class="text-purple-400 font-semibold mb-1 block">Procedimiento:</span>
                    <div>1) ${value} × ${factorOrigen} = ${valueInBase}</div>
                    <div>2) ${valueInBase} ÷ ${factorDestino} = <span class="font-bold text-gray-700">${formattedResult}</span></div>
                `;
            }
        }
        

        const card = document.getElementById(`card-iluminacion-${targetUnit}`);
        const isSource = targetUnit === sourceUnit;
        card.classList.toggle('bg-purple-50', isSource);
        card.classList.toggle('border-purple-400', isSource);
        card.classList.toggle('bg-gray-50', !isSource);
        card.classList.toggle('border-gray-200', !isSource);
    }
}

// ==============================================================================================================

function initializeRadiacionConverter() {
    const sourceUnitSelect = document.getElementById('sourceUnit-radiacion');
    const resultsGrid = document.getElementById('resultsGrid-radiacion');
    const precisionSelect = document.getElementById('precision-radiacion');
    
    for (const unit in DB.radiacion.factors) {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = DB.radiacion.labels[unit];
        sourceUnitSelect.appendChild(option);
        resultsGrid.innerHTML += createResultCard(DB.radiacion.labels[unit], unit, 'radiacion', 'purple'); 
    }
    for (let i = 0; i <= 8; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} decimales`;
        precisionSelect.appendChild(option);
    }
    precisionSelect.value = 4; 
    sourceUnitSelect.value = 'Sv'; 
    convertRadiacion();
}

function convertRadiacion() {
    const value = parseFloat(document.getElementById('inputValue-radiacion').value) || 0;
    const sourceUnit = document.getElementById('sourceUnit-radiacion').value;
    const precision = parseInt(document.getElementById('precision-radiacion').value, 10);
    const valueInBase = value * DB.radiacion.factors[sourceUnit];

    for (const targetUnit in DB.radiacion.factors) {
        const result = valueInBase / DB.radiacion.factors[targetUnit];
        const formattedResult = (targetUnit === sourceUnit) ? value.toString() : result.toLocaleString(undefined, { maximumFractionDigits: precision });
        document.getElementById(`output-radiacion-${targetUnit}`).textContent = formattedResult;

        
        const factorOrigen = DB.radiacion.factors[sourceUnit];
        const factorDestino = DB.radiacion.factors[targetUnit];
        const desarrolloElement = document.getElementById(`desarrollo-radiacion-${targetUnit}`);
        
        if (desarrolloElement) {
            if (targetUnit === sourceUnit) {
                desarrolloElement.classList.add('hidden');
            } else {
                desarrolloElement.classList.remove('hidden');
                desarrolloElement.innerHTML = `
                    <span class="text-purple-400 font-semibold mb-1 block">Procedimiento:</span>
                    <div>1) ${value} × ${factorOrigen} = ${valueInBase}</div>
                    <div>2) ${valueInBase} ÷ ${factorDestino} = <span class="font-bold text-gray-700">${formattedResult}</span></div>
                `;
            }
        }
        

        const card = document.getElementById(`card-radiacion-${targetUnit}`);
        const isSource = targetUnit === sourceUnit;
        card.classList.toggle('bg-purple-50', isSource);
        card.classList.toggle('border-purple-400', isSource);
        card.classList.toggle('bg-gray-50', !isSource);
        card.classList.toggle('border-gray-200', !isSource);
    }
}

// ==============================================================================================================

function initializeCaudalConverter() {
    const sourceUnitSelect = document.getElementById('sourceUnit-caudal');
    const resultsGrid = document.getElementById('resultsGrid-caudal');
    const precisionSelect = document.getElementById('precision-caudal');
    
    for (const unit in DB.caudal.factors) {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = DB.caudal.labels[unit];
        sourceUnitSelect.appendChild(option);
        resultsGrid.innerHTML += createResultCard(DB.caudal.labels[unit], unit, 'caudal', 'purple'); 
    }
    for (let i = 0; i <= 8; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} decimales`;
        precisionSelect.appendChild(option);
    }
    precisionSelect.value = 4; 
    sourceUnitSelect.value = 'L_s'; 
    convertCaudal();
}

function convertCaudal() {
    const value = parseFloat(document.getElementById('inputValue-caudal').value) || 0;
    const sourceUnit = document.getElementById('sourceUnit-caudal').value;
    const precision = parseInt(document.getElementById('precision-caudal').value, 10);
    const valueInBase = value * DB.caudal.factors[sourceUnit];

    for (const targetUnit in DB.caudal.factors) {
        const result = valueInBase / DB.caudal.factors[targetUnit];
        const formattedResult = (targetUnit === sourceUnit) ? value.toString() : result.toLocaleString(undefined, { maximumFractionDigits: precision });
        document.getElementById(`output-caudal-${targetUnit}`).textContent = formattedResult;

        
        const factorOrigen = DB.caudal.factors[sourceUnit];
        const factorDestino = DB.caudal.factors[targetUnit];
        const desarrolloElement = document.getElementById(`desarrollo-caudal-${targetUnit}`);
        
        if (desarrolloElement) {
            if (targetUnit === sourceUnit) {
                desarrolloElement.classList.add('hidden');
            } else {
                desarrolloElement.classList.remove('hidden');
                desarrolloElement.innerHTML = `
                    <span class="text-purple-400 font-semibold mb-1 block">Procedimiento:</span>
                    <div>1) ${value} × ${factorOrigen} = ${valueInBase}</div>
                    <div>2) ${valueInBase} ÷ ${factorDestino} = <span class="font-bold text-gray-700">${formattedResult}</span></div>
                `;
            }
        }
        

        const card = document.getElementById(`card-caudal-${targetUnit}`);
        const isSource = targetUnit === sourceUnit;
        card.classList.toggle('bg-purple-50', isSource);
        card.classList.toggle('border-purple-400', isSource);
        card.classList.toggle('bg-gray-50', !isSource);
        card.classList.toggle('border-gray-200', !isSource);
    }
}
// ==============================================================================================================

function initializeDensidadConverter() {
    const sourceUnitSelect = document.getElementById('sourceUnit-densidad');
    const resultsGrid = document.getElementById('resultsGrid-densidad');
    const precisionSelect = document.getElementById('precision-densidad');
    
    for (const unit in DB.densidad.factors) {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = DB.densidad.labels[unit];
        sourceUnitSelect.appendChild(option);
        resultsGrid.innerHTML += createResultCard(DB.densidad.labels[unit], unit, 'densidad', 'purple'); 
    }
    for (let i = 0; i <= 8; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} decimales`;
        precisionSelect.appendChild(option);
    }
    precisionSelect.value = 4; 
    sourceUnitSelect.value = 'kg_m3'; 
    convertDensidad();
}

function convertDensidad() {
    const value = parseFloat(document.getElementById('inputValue-densidad').value) || 0;
    const sourceUnit = document.getElementById('sourceUnit-densidad').value;
    const precision = parseInt(document.getElementById('precision-densidad').value, 10);
    const valueInBase = value * DB.densidad.factors[sourceUnit];

    for (const targetUnit in DB.densidad.factors) {
        const result = valueInBase / DB.densidad.factors[targetUnit];
        const formattedResult = (targetUnit === sourceUnit) ? value.toString() : result.toLocaleString(undefined, { maximumFractionDigits: precision });
        document.getElementById(`output-densidad-${targetUnit}`).textContent = formattedResult;

        
        const factorOrigen = DB.densidad.factors[sourceUnit];
        const factorDestino = DB.densidad.factors[targetUnit];
        const desarrolloElement = document.getElementById(`desarrollo-densidad-${targetUnit}`);
        
        if (desarrolloElement) {
            if (targetUnit === sourceUnit) {
                desarrolloElement.classList.add('hidden');
            } else {
                desarrolloElement.classList.remove('hidden');
                desarrolloElement.innerHTML = `
                    <span class="text-purple-400 font-semibold mb-1 block">Procedimiento:</span>
                    <div>1) ${value} × ${factorOrigen} = ${valueInBase}</div>
                    <div>2) ${valueInBase} ÷ ${factorDestino} = <span class="font-bold text-gray-700">${formattedResult}</span></div>
                `;
            }
        }
        

        const card = document.getElementById(`card-densidad-${targetUnit}`);
        const isSource = targetUnit === sourceUnit;
        card.classList.toggle('bg-purple-50', isSource);
        card.classList.toggle('border-purple-400', isSource);
        card.classList.toggle('bg-gray-50', !isSource);
        card.classList.toggle('border-gray-200', !isSource);
    }
}
// ==============================================================================================================














// --- INICIALIZACIÓN GENERAL ---
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const toggleButton = document.getElementById('sidebar-toggle');

    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            sidebar.classList.toggle('-translate-x-full');
        });
    }

    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('bg-indigo-700', 'text-white');
        } else {
            link.classList.remove('bg-indigo-700', 'text-white');
        }
    });

    if (document.getElementById('resultsGrid-longitud')) {
        initializeLengthConverter();
        document.getElementById('inputValue-longitud').addEventListener('input', convertLength);
        document.getElementById('precision-longitud').addEventListener('change', convertLength);
        document.getElementById('sourceUnit-longitud').addEventListener('change', convertLength);
    }
    if (document.getElementById('resultsGrid-presion')) {
        initializePressureConverter();
        document.getElementById('inputValue-presion').addEventListener('input', convertPressure);
        document.getElementById('precision-presion').addEventListener('change', convertPressure);
        document.getElementById('sourceUnit-presion').addEventListener('change', convertPressure);
    }
    if (document.getElementById('resultsGrid-temperatura')) {
        initializeTemperatureConverter();
        document.getElementById('inputValue-temperatura').addEventListener('input', convertTemperature);
        document.getElementById('precision-temperatura').addEventListener('change', convertTemperature);
        document.getElementById('sourceUnit-temperatura').addEventListener('change', convertTemperature);
    }
    if (document.getElementById('resultsGrid-tiempo')) {
        initializeTimeConverter();
        document.getElementById('inputValue-tiempo').addEventListener('input', convertTime);
        document.getElementById('precision-tiempo').addEventListener('change', convertTime);
        document.getElementById('sourceUnit-tiempo').addEventListener('change', convertTime);
    }
    if (document.getElementById('resultsGrid-masa')) {
        initializeMassConverter();
        document.getElementById('inputValue-masa').addEventListener('input', convertMass);
        document.getElementById('precision-masa').addEventListener('change', convertMass);
        document.getElementById('sourceUnit-masa').addEventListener('change', convertMass);
    }
    if (document.getElementById('resultsGrid-volumen')) {
        initializeVolumeConverter();
        document.getElementById('inputValue-volumen').addEventListener('input', convertVolume);
        document.getElementById('precision-volumen').addEventListener('change', convertVolume);
        document.getElementById('sourceUnit-volumen').addEventListener('change', convertVolume);
    }
    if (document.getElementById('resultsGrid-anguloplano')) {
        initializeAngleConverter();
        document.getElementById('inputValue-anguloplano').addEventListener('input', convertAngle);
        document.getElementById('precision-anguloplano').addEventListener('change', convertAngle);
        document.getElementById('sourceUnit-anguloplano').addEventListener('change', convertAngle);
    }
    if (document.getElementById('resultsGrid-area')) {
        initializeAreaConverter();
        document.getElementById('inputValue-area').addEventListener('input', convertArea);
        document.getElementById('precision-area').addEventListener('change', convertArea);
        document.getElementById('sourceUnit-area').addEventListener('change', convertArea);
    }
    if (document.getElementById('resultsGrid-energia')) {
        initializeEnergyConverter();
        document.getElementById('inputValue-energia').addEventListener('input', convertEnergy);
        document.getElementById('precision-energia').addEventListener('change', convertEnergy);
        document.getElementById('sourceUnit-energia').addEventListener('change', convertEnergy);
    }
    if (document.getElementById('resultsGrid-almacenamiento')) {
        initializeDataStorageConverter();
        document.getElementById('inputValue-almacenamiento').addEventListener('input', convertDataStorage);
        document.getElementById('precision-almacenamiento').addEventListener('change', convertDataStorage);
        document.getElementById('sourceUnit-almacenamiento').addEventListener('change', convertDataStorage);
    }
    if (document.getElementById('resultsGrid-velocidad')) {
        initializeSpeedConverter();
        document.getElementById('inputValue-velocidad').addEventListener('input', convertSpeed);
        document.getElementById('precision-velocidad').addEventListener('change', convertSpeed);
        document.getElementById('sourceUnit-velocidad').addEventListener('change', convertSpeed);
    }
    if (document.getElementById('resultsGrid-eficiencia')) {
        initializeFuelEfficiencyConverter();
        document.getElementById('inputValue-eficiencia').addEventListener('input', convertFuelEfficiency);
        document.getElementById('precision-eficiencia').addEventListener('change', convertFuelEfficiency);
        document.getElementById('selectUnit-eficiencia').addEventListener('change', convertFuelEfficiency);
    }
    if (document.getElementById('resultsGrid-fuerza')) {
        initializeForceConverter();
        document.getElementById('inputValue-fuerza').addEventListener('input', convertForce);
        document.getElementById('precision-fuerza').addEventListener('change', convertForce);
        document.getElementById('sourceUnit-fuerza').addEventListener('change', convertForce);
    }
    if (document.getElementById('resultsGrid-potencia')) {
        initializePowerConverter();
        document.getElementById('inputValue-potencia').addEventListener('input', convertPower);
        document.getElementById('precision-potencia').addEventListener('change', convertPower);
        document.getElementById('sourceUnit-potencia').addEventListener('change', convertPower);
    }
    if (document.getElementById('resultsGrid-torque')) {
        initializeTorqueConverter();
        document.getElementById('inputValue-torque').addEventListener('input', convertTorque);
        document.getElementById('precision-torque').addEventListener('change', convertTorque);
        document.getElementById('sourceUnit-torque').addEventListener('change', convertTorque);
    }
    if (document.getElementById('resultsGrid-aceleracion')) {
        initializeAceleracionConverter();
        document.getElementById('inputValue-aceleracion').addEventListener('input', convertAceleracion);
        document.getElementById('precision-aceleracion').addEventListener('change', convertAceleracion);
        document.getElementById('sourceUnit-aceleracion').addEventListener('change', convertAceleracion);
    }
    if (document.getElementById('resultsGrid-electricidad')) {
        initializeElectricidadConverter();
        document.getElementById('inputValue-electricidad').addEventListener('input', convertElectricidad);
        document.getElementById('precision-electricidad').addEventListener('change', convertElectricidad);
        document.getElementById('sourceUnit-electricidad').addEventListener('change', convertElectricidad);
    }
    if (document.getElementById('resultsGrid-frecuencia')) {
        initializeFrecuenciaConverter();
        document.getElementById('inputValue-frecuencia').addEventListener('input', convertFrecuencia);
        document.getElementById('precision-frecuencia').addEventListener('change', convertFrecuencia);
        document.getElementById('sourceUnit-frecuencia').addEventListener('change', convertFrecuencia);
    }
    if (document.getElementById('resultsGrid-diseno')) {
        initializeDisenoConverter();
        document.getElementById('inputValue-diseno').addEventListener('input', convertDiseno);
        document.getElementById('precision-diseno').addEventListener('change', convertDiseno);
        document.getElementById('sourceUnit-diseno').addEventListener('change', convertDiseno);
    }
    if (document.getElementById('resultsGrid-iluminacion')) {
        initializeIluminacionConverter();
        document.getElementById('inputValue-iluminacion').addEventListener('input', convertIluminacion);
        document.getElementById('precision-iluminacion').addEventListener('change', convertIluminacion);
        document.getElementById('sourceUnit-iluminacion').addEventListener('change', convertIluminacion);
    }
    if (document.getElementById('resultsGrid-radiacion')) {
        initializeRadiacionConverter();
        document.getElementById('inputValue-radiacion').addEventListener('input', convertRadiacion);
        document.getElementById('precision-radiacion').addEventListener('change', convertRadiacion);
        document.getElementById('sourceUnit-radiacion').addEventListener('change', convertRadiacion);
    }

    if (document.getElementById('resultsGrid-caudal')) {
        initializeCaudalConverter();
        document.getElementById('inputValue-caudal').addEventListener('input', convertCaudal);
        document.getElementById('precision-caudal').addEventListener('change', convertCaudal);
        document.getElementById('sourceUnit-caudal').addEventListener('change', convertCaudal);
    }

    if (document.getElementById('resultsGrid-densidad')) {
        initializeDensidadConverter();
        document.getElementById('inputValue-densidad').addEventListener('input', convertDensidad);
        document.getElementById('precision-densidad').addEventListener('change', convertDensidad);
        document.getElementById('sourceUnit-densidad').addEventListener('change', convertDensidad);
    }
});