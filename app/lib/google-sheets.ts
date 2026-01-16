import { google } from 'googleapis';

/**
 * Guarda un email en Google Sheets
 * @param email - Email a guardar
 * @returns Promise<boolean> - true si se guardó exitosamente, false en caso contrario
 */
export async function saveEmailToSheets(email: string): Promise<boolean> {
  try {
    // Obtener credenciales desde variables de entorno
    const credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const sheetName = (process.env.GOOGLE_SHEET_NAME || 'Sheet1').trim(); // Por defecto 'Sheet1', limpia espacios

    if (!credentialsJson || !spreadsheetId) {
      console.error('Google Sheets credentials not configured');
      return false;
    }

    // Parsear las credenciales JSON
    // Next.js puede leer JSON multi-línea, pero es mejor en una línea
    let credentials;
    try {
      // Limpiar posibles espacios/indentación extra
      const cleanedJson = credentialsJson.trim().replace(/\n\s+/g, ' ').replace(/\s+/g, ' ');
      credentials = JSON.parse(cleanedJson);
    } catch (err) {
      console.error('Invalid GOOGLE_SERVICE_ACCOUNT_CREDENTIALS JSON format:', err);
      return false;
    }

    // Autenticar con Service Account
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Escapar el nombre de la hoja si tiene espacios o caracteres especiales
    // Google Sheets requiere comillas simples cuando el nombre tiene espacios
    const escapedSheetName = sheetName.includes(' ') || sheetName.includes("'") 
      ? `'${sheetName.replace(/'/g, "''")}'` // Escapar comillas simples duplicándolas
      : sheetName;

    // Verificar si el email ya existe en la columna A
    try {
      const existingData = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${escapedSheetName}!A:A`, // Solo columna A (emails)
      });

      const existingEmails = existingData.data.values || [];
      // Verificar si el email ya existe (comparar en lowercase para evitar duplicados por mayúsculas)
      const emailExists = existingEmails.some((row: string[]) => 
        row[0]?.toLowerCase().trim() === email.toLowerCase().trim()
      );

      if (emailExists) {
        console.log(`Email ${email} already exists in sheet, skipping.`);
        return true; // Retornar true porque técnicamente "ya está guardado"
      }
    } catch (error) {
      // Si hay error al leer (ej: hoja vacía), continuar y agregar el email
      console.warn('Could not check existing emails, proceeding to add:', error);
    }

    // Preparar los datos a insertar (solo fecha, no timestamp completo)
    const dateOnly = new Date().toISOString().split('T')[0]; // Formato: YYYY-MM-DD
    const values = [[email, dateOnly]];

    // Append los datos a la hoja
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${escapedSheetName}!A:B`, // Columnas A (Email) y B (Fecha)
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values,
      },
    });

    return true;
  } catch (error) {
    console.error('Error saving email to Google Sheets:', error);
    return false;
  }
}
