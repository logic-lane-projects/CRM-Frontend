export function SplitDateTime(dateString: string): { date: string; time: string } {
    const dateObject = new Date(dateString);

    if (isNaN(dateObject.getTime())) {
        throw new Error("Invalid date string format");
    }

    const date = dateObject.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const time = dateObject.toTimeString().split(' ')[0]; // Formato HH:MM:SS

    return { date, time };
}

export function FormatDate(inputDate: string): string {
    const months = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];

    const [year, month, day] = inputDate.split("-").map(Number);

    if (!year || !month || !day) {
        throw new Error("Invalid date format. Expected YYYY-MM-DD.");
    }

    const shortYear = year.toString().slice(-2); // Obtener los últimos dos dígitos del año
    const shortMonth = months[month - 1]; // Meses son indexados desde 0
    const formattedDate = `${day} ${shortMonth} ${shortYear}`;

    return formattedDate;
}

export function FormatDateHistory(inputDate: string): string {
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    const [year, month, day] = inputDate.split("-").map(Number);

    if (!year || !month || !day) {
        throw new Error("Invalid date format. Expected YYYY-MM-DD.");
    }

    const shortYear = year; // Obtener los últimos dos dígitos del año
    const shortMonth = months[month - 1]; // Meses son indexados desde 0
    const formattedDate = `${day} ${shortMonth} ${shortYear}`;

    return formattedDate;
}

export function FormatTime(inputTime: string): string {
    const [hour, minute, secounds] = inputTime.split(":").map(String);

    if (!hour || !minute || !secounds) {
        console.log(`Eror: ${hour},${minute},${secounds}`)
    }

    const format = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;

    return format;
}