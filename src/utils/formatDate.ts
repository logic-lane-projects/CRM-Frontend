export default function formatFecha(fechaISO: string | Date | null | undefined): string {
    if (!fechaISO) return "Sin fecha"; 
  
    const fecha = fechaISO instanceof Date ? fechaISO : new Date(fechaISO);
    if (isNaN(fecha.getTime())) return "Fecha inválida"; 
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const anio = String(fecha.getFullYear());
  
    return `${dia}/${mes}/${anio}`;
  }
  