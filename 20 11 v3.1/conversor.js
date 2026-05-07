#!/usr/bin/env node

const PI = Math.PI; 
const FACTORES_CONVERSION = {
    longitud: {
        factors: { 'm': 1, 'km': 1000, 'cm': 0.01, 'mm': 0.001, 'μm': 1e-6, 'nm': 1e-9, 'mi': 1609.344, 'yd': 0.9144, 'ft': 0.3048, 'in': 0.0254 },
        labels: { 'm': 'Metro (m)', 'km': 'Kilómetro (km)', 'cm': 'Centímetro (cm)', 'mm': 'Milímetro (mm)', 'μm': 'Micrómetro (μm)', 'nm': 'Nanómetro (nm)', 'mi': 'Milla (mi)', 'yd': 'Yarda (yd)', 'ft': 'Pie (ft)', 'in': 'Pulgada (in)' }
    },
    presion: {
        factors: { 'Pa': 1, 'kPa': 1000, 'MPa': 1e6, 'atm': 101325, 'bar': 100000, 'Torr': 101325 / 760, 'mmHg': 133.322387415, 'psi': 6894.757293168361, 'mH2O': 9806.65 },
        labels: { 'Pa': 'Pascal (Pa)', 'kPa': 'Kilopascal (kPa)', 'MPa': 'Megapascal (MPa)', 'atm': 'Atmósfera (atm)', 'bar': 'Bar (bar)', 'Torr': 'Torr (Torr)', 'mmHg': 'Milímetro de Mercurio (mmHg)', 'psi': 'Libra/Pulgada² (psi)', 'mH2O': 'Columna de Agua (mH₂O)' }
    },
    temperatura: {
        units: ['K', 'C', 'F', 'R'],
        labels: { 'K': 'Kelvin (K)', 'C': 'Grados Celsius (°C)', 'F': 'Grados Fahrenheit (°F)', 'R': 'Rankine (°R)' },
        toKelvin: { 'K': (t) => t, 'C': (t) => t + 273.15, 'F': (t) => (t - 32) * (5 / 9) + 273.15, 'R': (t) => t * (5 / 9) },
        fromKelvin: { 'K': (t) => t, 'C': (t) => t - 273.15, 'F': (t) => (t - 273.15) * (9 / 5) + 32, 'R': (t) => t * (9 / 5) }
    },
    tiempo: {
        factors: { 's': 1, 'ms': 0.001, 'us': 1e-6, 'ns': 1e-9, 'min': 60, 'h': 3600, 'd': 86400, 'wk': 604800, 'mo': 2629800, 'a': 31557600, 'lustro': 157788000, 'decada': 315576000, 'siglo': 3155760000 },
        labels: { 's': 'Segundo (s)', 'ms': 'Milisegundo (ms)', 'us': 'Microsegundo (µs)', 'ns': 'Nanosegundo (ns)', 'min': 'Minuto (min)', 'h': 'Hora (h)', 'd': 'Día (d)', 'wk': 'Semana', 'mo': 'Mes (Promedio)', 'a': 'Año (Promedio)', 'lustro': 'Lustro', 'decada': 'Década', 'siglo': 'Siglo' }
    },
    masa: {
        factors: { 'kg': 1, 'g': 0.001, 'mg': 1e-6, 'ug': 1e-9, 't': 1000, 'lb': 0.45359237, 'oz': 0.028349523125, 'ton_short': 907.18474, 'st': 6.35029318 },
        labels: { 'kg': 'Kilogramo (kg)', 'g': 'Gramo (g)', 'mg': 'Miligramo (mg)', 'ug': 'Microgramo (µg)', 't': 'Tonelada Métrica (t)', 'lb': 'Libra (lb)', 'oz': 'Onza (oz)', 'ton_short': 'Tonelada Corta (ton US)', 'st': 'Stone (st)' }
    },
    volumen: {
        factors: { 'm3': 1000, 'cm3': 0.001, 'L': 1, 'mL': 0.001, 'ft3_us': 28.316846592, 'yd3_us': 764.554857984, 'gal_us': 3.785411784, 'qt_us': 0.946352946, 'pt_us': 0.473176473, 'cup_us': 0.2365882365, 'floz_us': 0.0295735295625, 'tbsp_us': 0.01478676478125, 'tsp_us': 0.00492892159375, 'in3_us': 0.016387064, 'gal_uk': 4.54609, 'qt_uk': 1.1365225, 'pt_uk': 0.56826125, 'floz_uk': 0.0284130625, 'tbsp_uk': 0.0177581640625, 'tsp_uk': 0.005919388020833333 },
        labels: { 'm3': 'Metro Cúbico (m³)', 'cm3': 'Centímetro Cúbico (cm³)', 'L': 'Litro (L)', 'mL': 'Mililitro (mL)', 'ft3_us': 'Pie Cúbico (US)', 'yd3_us': 'Yarda Cúbica (US)', 'gal_us': 'Galón (US)', 'qt_us': 'Cuarto (US)', 'pt_us': 'Pinta (US)', 'cup_us': 'Taza (US)', 'floz_us': 'Onza Líquida (US)', 'tbsp_us': 'Cucharada (US)', 'tsp_us': 'Cucharadita (US)', 'in3_us': 'Pulgada Cúbica (US)', 'gal_uk': 'Galón (Imperial)', 'qt_uk': 'Cuarto (Imperial)', 'pt_uk': 'Pinta (Imperial)', 'floz_uk': 'Onza Líquida (Imperial)', 'tbsp_uk': 'Cucharada (Imperial)', 'tsp_uk': 'Cucharadita (Imperial)' }
    },
    angulo: {
        factors: { 'degree': PI / 180, 'arcmin': PI / 10800, 'arcsec': PI / 648000, 'radian': 1, 'revolution': 2 * PI, 'gon': PI / 200, 'milliradian': 0.001 },
        labels: { 'degree': 'Grado Sexagesimal (°)', 'arcmin': "Minuto de Arco (')", 'arcsec': 'Segundo de Arco (")', 'radian': 'Radián (rad)', 'revolution': 'Revolución (rev)', 'gon': 'Grado Centesimal (gon)', 'milliradian': 'Milirradián (mrad)' }
    },
    area: {
        factors: { 'm2': 1, 'cm2': 0.0001, 'mm2': 0.000001, 'km2': 1000000, 'mi2': 2589988.110336, 'yd2': 0.83612736, 'ft2': 0.09290304, 'in2': 0.00064516, 'ha': 10000, 'ac': 4046.8564224 },
        labels: { 'm2': 'Metro Cuadrado (m²)', 'cm2': 'Centímetro Cuadrado (cm²)', 'mm2': 'Milímetro Cuadrado (mm²)', 'km2': 'Kilómetro Cuadrado (km²)', 'mi2': 'Milla Cuadrada (mi²)', 'yd2': 'Yarda Cuadrada (yd²)', 'ft2': 'Pie Cuadrado (ft²)', 'in2': 'Pulgada Cuadrada (in²)', 'ha': 'Hectárea (ha)', 'ac': 'Acre (ac)' }
    },
    energia: {
        factors: { 'J': 1.0, 'kJ': 1000.0, 'cal_th': 4.184, 'kcal': 4184.0, 'eV': 1.602176634e-19, 'Wh': 3600.0, 'kWh': 3600000.0, 'Ws': 1.0, 'Cal_nut': 4184.0, 'BTU': 1055.05585262, 'thm': 105505585.262, 'ft_lbf': 1.3558179483314004 },
        labels: { 'J': 'Joule (J)', 'kJ': 'Kilojoule (kJ)', 'cal_th': 'Caloría (Térmica)', 'kcal': 'Kilocaloría (kcal)', 'eV': 'Electronvoltio (eV)', 'Wh': 'Vatio-hora (Wh)', 'kWh': 'Kilovatio-hora (kWh)', 'Ws': 'Vatio-segundo (Ws)', 'Cal_nut': 'Caloría (Nutricional)', 'BTU': 'Unidad Térmica Británica (BTU)', 'thm': 'Termia (US)', 'ft_lbf': 'Pie-libra fuerza (ft-lbf)' }
    },
    almacenamiento: {
        K_BIN: 1024,
        k_METRIC: 1000,
        UNITS: [
            { id: 'bit', label: 'Bit', abbr: 'b', factor: 1, type: 'Base' },
            { id: 'nibble', label: 'Nibble', abbr: 'Nib', factor: 4, type: 'Base' },
            { id: 'kb', label: 'Kilobit', abbr: 'kb', factor: 1000, type: 'Métrica' },
            { id: 'Mb', label: 'Megabit', abbr: 'Mb', factor: 1000 ** 2, type: 'Métrica' },
            { id: 'Gb', label: 'Gigabit', abbr: 'Gb', factor: 1000 ** 3, type: 'Métrica' },
            { id: 'Tb', label: 'Terabit', abbr: 'Tb', factor: 1000 ** 4, type: 'Métrica' },
            { id: 'Pb', label: 'Petabit', abbr: 'Pb', factor: 1000 ** 5, type: 'Métrica' },
            { id: 'Eb', label: 'Exabit', abbr: 'Eb', factor: 1000 ** 6, type: 'Métrica' },
            { id: 'Kib', label: 'Kibibit', abbr: 'Kib', factor: 1024, type: 'Binaria' },
            { id: 'Mib', label: 'Mebibit', abbr: 'Mib', factor: 1024 ** 2, type: 'Binaria' },
            { id: 'Gib', label: 'Gibibit', abbr: 'Gib', factor: 1024 ** 3, type: 'Binaria' },
            { id: 'Tib', label: 'Tebibit', abbr: 'Tib', factor: 1024 ** 4, type: 'Binaria' },
            { id: 'Pib', label: 'Pebibit', abbr: 'Pib', factor: 1024 ** 5, type: 'Binaria' },
            { id: 'byte', label: 'Byte', abbr: 'B', factor: 8, type: 'Base' },
            { id: 'KB', label: 'Kilobyte', abbr: 'KB', factor: 8 * 1000, type: 'Métrica' },
            { id: 'MB', label: 'Megabyte', abbr: 'MB', factor: 8 * 1000 ** 2, type: 'Métrica' },
            { id: 'GB', label: 'Gigabyte', abbr: 'GB', factor: 8 * 1000 ** 3, type: 'Métrica' },
            { id: 'TB', label: 'Terabyte', abbr: 'TB', factor: 8 * 1000 ** 4, type: 'Métrica' },
            { id: 'PB', label: 'Petabyte', abbr: 'PB', factor: 8 * 1000 ** 5, type: 'Métrica' },
            { id: 'EB', label: 'Exabyte', abbr: 'EB', factor: 8 * 1000 ** 6, type: 'Métrica' },
            { id: 'KiB', label: 'Kibibyte', abbr: 'KiB', factor: 8 * 1024, type: 'Binaria' },
            { id: 'MiB', label: 'Mebibyte', abbr: 'MiB', factor: 8 * 1024 ** 2, type: 'Binaria' },
            { id: 'GiB', label: 'Gibibyte', abbr: 'GiB', factor: 8 * 1024 ** 3, type: 'Binaria' },
            { id: 'TiB', label: 'Tebibyte', abbr: 'TiB', factor: 8 * 1024 ** 4, type: 'Binaria' },
            { id: 'PiB', label: 'Pebibyte', abbr: 'PiB', factor: 8 * 1024 ** 5, type: 'Binaria' }
        ]
    },
    transferencia: {
        K_BIN: 1024,
        k_METRIC: 1000,
        UNITS: [
            { id: 'bps', label: 'bit por segundo', abbr: 'bps', factor: 1, type: 'Base' },
            { id: 'kbps', label: 'Kilobit por segundo', abbr: 'kbps', factor: 1000, type: 'Métrica' },
            { id: 'Mbps', label: 'Megabit por segundo', abbr: 'Mbps', factor: 1000 ** 2, type: 'Métrica' },
            { id: 'Gbps', label: 'Gigabit por segundo', abbr: 'Gbps', factor: 1000 ** 3, type: 'Métrica' },
            { id: 'Tbps', label: 'Terabit por segundo', abbr: 'Tbps', factor: 1000 ** 4, type: 'Métrica' },
            { id: 'Kibps', label: 'Kibibit por segundo', abbr: 'Kibps', factor: 1024, type: 'Binaria' },
            { id: 'Mibps', label: 'Mebibit por segundo', abbr: 'Mibps', factor: 1024 ** 2, type: 'Binaria' },
            { id: 'Gibps', label: 'Gibibit por segundo', abbr: 'Gibps', factor: 1024 ** 3, type: 'Binaria' },
            { id: 'B_s', label: 'Byte por segundo', abbr: 'B/s', factor: 8, type: 'Base' },
            { id: 'KB_s', label: 'Kilobyte por segundo', abbr: 'KB/s', factor: 8 * 1000, type: 'Métrica' },
            { id: 'MB_s', label: 'Megabyte por segundo', abbr: 'MB/s', factor: 8 * 1000 ** 2, type: 'Métrica' },
            { id: 'GB_s', label: 'Gigabyte por segundo', abbr: 'GB/s', factor: 8 * 1000 ** 3, type: 'Métrica' },
            { id: 'TB_s', label: 'Terabyte por segundo', abbr: 'TB/s', factor: 8 * 1000 ** 4, type: 'Métrica' },
            { id: 'KiB_s', label: 'Kibibyte por segundo', abbr: 'KiB/s', factor: 8 * 1024, type: 'Binaria' },
            { id: 'MiB_s', label: 'Mebibyte por segundo', abbr: 'MiB/s', factor: 8 * 1024 ** 2, type: 'Binaria' },
            { id: 'GiB_s', label: 'Gibibyte por segundo', abbr: 'GiB/s', factor: 8 * 1024 ** 3, type: 'Binaria' }
        ]
    },
    velocidad: {
        UNITS: [
            { id: 'ms', name: 'Metro por segundo', symbol: 'm/s', factor: 1.0 },
            { id: 'kmh', name: 'Kilómetro por hora', symbol: 'km/h', factor: 1 / 3.6 },
            { id: 'mmin', name: 'Metro por minuto', symbol: 'm/min', factor: 1 / 60.0 },
            { id: 'kn', name: 'Nudo', symbol: 'kn (Milla Náutica/h)', factor: 1852 / 3600.0 },
            { id: 'mph', name: 'Milla por hora', symbol: 'mph', factor: 1609.344 / 3600.0 },
            { id: 'fts', name: 'Pie por segundo', symbol: 'ft/s', factor: 0.3048 }
        ]
    },
    eficiencia: {
        MILE_TO_KM: 1.609344,
        US_GALLON_TO_LITER: 3.785411784,
        IMPERIAL_GALLON_TO_LITER: 4.54609,
        UNITS: {
            'km_per_l': { name: 'Kilómetro/Litro', symbol: 'km/L', factorToKMPL: 1, isInverse: false },
            'mpg_us': { name: 'Millas/Galón (US)', symbol: 'mpg (US)', factorToKMPL: (1.609344 / 3.785411784), isInverse: false },
            'mpg_imp': { name: 'Millas/Galón (Imperial)', symbol: 'mpg (Imp.)', factorToKMPL: (1.609344 / 4.54609), isInverse: false },
            'l_per_100km': { name: 'Litros/100 Kilómetros', symbol: 'L/100 km', factorToKMPL: 100, isInverse: true },
            'gal_per_100mi': { name: 'Galones (US)/100 Millas', symbol: 'gal/100 mi', factorToKMPL: (100 / (1.609344 / 3.785411784)), isInverse: true }
        }
    },
    fuerza: {
        factors: { 'N': 1, 'kN': 1000, 'lbf': 4.4482216152605, 'dyn': 0.00001, 'kgf': 9.80665 },
        labels: { 'N': 'Newton (N)', 'kN': 'Kilonewton (kN)', 'lbf': 'Libra-fuerza (lbf)', 'dyn': 'Dina (dyn)', 'kgf': 'Kilogramo-fuerza (kgf)' }
    },
    potencia: {
        factors: { 'W': 1, 'kW': 1000, 'MW': 1000000, 'HP': 745.6998715822702, 'CV': 735.49875, 'BTU_h': 0.2930710701722222 },
        labels: { 'W': 'Vatio (W)', 'kW': 'Kilovatio (kW)', 'MW': 'Megavatio (MW)', 'HP': 'Caballo de fuerza (HP)', 'CV': 'Caballo de vapor (CV)', 'BTU_h': 'BTU por hora (BTU/h)' }
    },
    torque: {
        factors: { 'Nm': 1, 'lb_ft': 1.3558179483314004, 'kgf_m': 9.80665, 'in_lb': 0.1129848290276167 },
        labels: { 'Nm': 'Newton-metro (N·m)', 'lb_ft': 'Libra-pie (lb·ft)', 'kgf_m': 'Kilogramo-metro (kgf·m)', 'in_lb': 'Pulgada-libra (in·lb)' }
    },
    aceleracion: {
        factors: { 'm_s2': 1, 'km_h2': 1 / 12960, 'ft_s2': 0.3048, 'g': 9.80665 },
        labels: { 'm_s2': 'Metro/segundo² (m/s²)', 'km_h2': 'Kilómetro/hora²', 'ft_s2': 'Pie/segundo²', 'g': 'Gravedad estándar (g)' }
    },
    electricidad: {
        factors: { 'V': 1, 'mV': 0.001, 'kV': 1000, 'A': 1, 'mA': 0.001, 'Ohm': 1, 'kOhm': 1000 },
        labels: { 'V': 'Voltio (V)', 'mV': 'Milivoltio (mV)', 'kV': 'Kilovoltio (kV)', 'A': 'Amperio (A)', 'mA': 'Miliamperio (mA)', 'Ohm': 'Ohmio (Ω)', 'kOhm': 'Kilohmio (kΩ)' }
    },
    frecuencia: {
        factors: { 'Hz': 1, 'kHz': 1e3, 'MHz': 1e6, 'GHz': 1e9, 'THz': 1e12, 'rad_s': 1 / (2 * PI), 'rpm': 1 / 60 },
        labels: { 'Hz': 'Hercio (Hz)', 'kHz': 'Kilohercio (kHz)', 'MHz': 'Megahercio (MHz)', 'GHz': 'Gigahercio (GHz)', 'THz': 'Terahercio (THz)', 'rad_s': 'Radián/segundo', 'rpm': 'RPM' }
    },
    diseno: {
        factors: { 'px': 1, 'pt': 4 / 3, 'pc': 16, 'in_print': 96, 'cm_print': 96 / 2.54 },
        labels: { 'px': 'Píxel (px)', 'pt': 'Punto (pt)', 'pc': 'Pica (pc)', 'in_print': 'Pulgada física', 'cm_print': 'Centímetro físico' }
    },
    iluminacion: {
        factors: { 'lx': 1, 'fc': 1 / 0.09290304, 'ph': 10000 },
        labels: { 'lx': 'Lux (lx)', 'fc': 'Foot-candle', 'ph': 'Phot' }
    },
    radiacion: {
        factors: { 'Sv': 1, 'mSv': 0.001, 'uSv': 1e-6, 'rem': 0.01, 'mrem': 0.00001 },
        labels: { 'Sv': 'Sievert (Sv)', 'mSv': 'Milisievert (mSv)', 'uSv': 'Microsievert (µv)', 'rem': 'Rem', 'mrem': 'Milirem' }
    },
    caudal: {
        factors: { 'L_s': 1, 'L_min': 1 / 60, 'm3_s': 1000, 'm3_h': 1 / 3.6, 'gpm': 3.785411784 / 60 },
        labels: { 'L_s': 'Litro/segundo', 'L_min': 'Litro/minuto', 'm3_s': 'Metro cúbico/segundo', 'm3_h': 'Metro cúbico/hora', 'gpm': 'Galón por minuto (US)' }
    },
    densidad: {
        factors: { 'kg_m3': 1, 'g_cm3': 1000, 'lb_ft3': 16.01846337396014, 'lb_in3': 27679.904710203105 },
        labels: { 'kg_m3': 'Kilogramo/metro cúbico', 'g_cm3': 'Gramo/centímetro cúbico', 'lb_ft3': 'Libra/pie cúbico', 'lb_in3': 'Libra/pulgada cúbica' }
    }
};

// ============================================================================
// CONEXIÓN UNIVERSAL (WEB + LINUX)
// ============================================================================

// 1navegador web
if (typeof window !== 'undefined') {
    window.FACTORES_CONVERSION = FACTORES_CONVERSION;
}

// 2CLI en la terminal de Linux
if (typeof process !== 'undefined' && typeof window === 'undefined') {
    const args = process.argv.slice(2);

    
    if (args.length < 3 || args.includes('-h') || args.includes('--help')) {
        console.log("\n=======================================================");
        console.log("🌌 DIGIHIGGS CLI - Herramienta de Conversión");
        console.log("=======================================================\n\n");
        console.log('=======================================================');               
        console.log('⚠️ IMPORTANTE: EL USO DE MAYÚSCULAS ES OBLIGATORIO');
        console.log(" 'b' (bit) no es lo mismo que 'B' (Byte).");
        console.log("'m' (mili) no es lo mismo que 'M' (Mega).");
        console.log('=======================================================\n\n');               
        console.log("Uso:");
        console.log("  digihiggs <valor> <origen> <destino>\n");
        console.log("Ejemplos de uso rápido:");
        console.log("  digihiggs 10 km m      ? Convierte 10 Kilómetros a Metros");
        console.log("  digihiggs 32 F C       ? Convierte 32 Fahrenheit a Celsius");
        console.log("  digihiggs 5 kg lb      ? Convierte 5 Kilogramos a Libras");
        console.log("  digihiggs 100 MB Gb    ? Convierte 100 Megabytes a Gigabits\n");
        console.log("Nota: Asegúrate de usar las abreviaturas exactas del código (ej. 'km', 'C', 'MB').");
        console.log("Manual y Guia de abreviaturas: https://github.com/Derxtp/Digihiggs.git \n")
        console.log("=======================================================\n");
        process.exit(0);
    }

    const valor = parseFloat(args[0]);
    const origen = args[1];
    const destino = args[2];
    let resultado = null;

    if (isNaN(valor)) {
        console.log("❌ Error: El valor ingresado debe ser un número válido.");
        process.exit(1);
    }

    const temp = FACTORES_CONVERSION.temperatura;
    
    
    if (temp.units.includes(origen) && temp.units.includes(destino)) {
        resultado = temp.fromKelvin[destino](temp.toKelvin[origen](valor));
    } else {
        for (const cat in FACTORES_CONVERSION) {
            if (FACTORES_CONVERSION[cat].factors && FACTORES_CONVERSION[cat].factors[origen] && FACTORES_CONVERSION[cat].factors[destino]) {
                const f = FACTORES_CONVERSION[cat].factors;
                resultado = (valor * f[origen]) / f[destino];
                break;
            }
        }
    }

    if (resultado !== null) {
        console.log(`✅ Digihiggs Resultado: ${valor} ${origen} = ${resultado.toFixed(8)} ${destino}`);
    } else {
        console.log("❌ Error: Unidad no reconocida o incompatibles. Ejecuta el script sin argumentos para ver la ayuda.");
    }
    process.exit(0);
}