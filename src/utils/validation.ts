export function validarRut(rut: string): boolean {
  const valorLimpio = rut.replace(/[.-]/g, '').toUpperCase();

  if (!/^[0-9]{7,8}[0-9K]$/.test(valorLimpio)) {
    return false;
  }

  const cuerpo = valorLimpio.slice(0, -1);
  const dv = valorLimpio.slice(-1);

  let suma = 0;
  let factor = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i)) * factor;
    factor = (factor === 7) ? 2 : factor + 1;
  }

  const dvCalculado = 11 - (suma % 11);
  const dvCalculadoStr = (dvCalculado === 11) ? '0' : ((dvCalculado === 10) ? 'K' : dvCalculado.toString());

  return dvCalculadoStr === dv;
}

/**
 * Calcula la edad aproximada de una persona basándose en su RUT chileno
 * Utiliza la fórmula de regresión lineal: año_nacimiento = RUT * 3.34e-6 + 1932.26
 * Esta es una aproximación estadística basada en el orden correlativo de asignación de RUTs
 */
export function calcularEdadDesdeRut(rut: string): number {
  const valorLimpio = rut.replace(/[.-]/g, '').toUpperCase();
  const rutNumerico = parseInt(valorLimpio.slice(0, -1));
  
  // Fórmula de regresión lineal obtenida de análisis estadístico
  const slope = 3.3363697569700348e-06;
  const intercept = 1932.2573852507373;
  
  const fechaNacimiento = rutNumerico * slope + intercept;
  const anoNacimiento = Math.floor(fechaNacimiento);
  
  const anoActual = new Date().getFullYear();
  const edadAproximada = anoActual - anoNacimiento;
  
  return edadAproximada;
}

/**
 * Valida que el RUT sea válido y que la persona tenga entre 18 y 99 años
 */
export function validarRutConEdad(rut: string): { valido: boolean; mensaje?: string; edad?: number } {
  // Primero validar formato y dígito verificador
  if (!validarRut(rut)) {
    return { valido: false, mensaje: 'El RUT ingresado no es válido.' };
  }
  
  // Calcular edad aproximada
  const edad = calcularEdadDesdeRut(rut);
  
  // Validar rango de edad
  if (edad < 18) {
    return { 
      valido: false, 
      mensaje: `Debes ser mayor de 18 años para registrarte. Edad aproximada: ${edad} años.`,
      edad 
    };
  }
  
  if (edad > 99) {
    return { 
      valido: false, 
      mensaje: `El RUT ingresado parece inválido. Edad aproximada: ${edad} años.`,
      edad 
    };
  }
  
  return { valido: true, edad };
}

export function validarCorreo(correo: string): boolean {
  const expresionRegular = /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
  return expresionRegular.test(correo);
}

export function autoFormatRut(rut: string): string {
  const valorLimpio = rut.replace(/[^0-9kK]/g, '').toUpperCase();

  if (valorLimpio.length < 2) return valorLimpio;

  const cuerpo = valorLimpio.slice(0, -1);
  const dv = valorLimpio.slice(-1);

  let cuerpoFormateado = '';
  let j = 1;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    cuerpoFormateado = cuerpo.charAt(i) + cuerpoFormateado;
    if (j % 3 === 0 && j < cuerpo.length) {
      cuerpoFormateado = '.' + cuerpoFormateado;
    }
    j++;
  }

  return `${cuerpoFormateado}-${dv}`;
}
