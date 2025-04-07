function logError(error) {

    if (error.code === 'ConditionalCheckFailedException') {
    console.error('La relacion ya existe', error);
        return {
            statusCode: 409,
            body: JSON.stringify({ error: 'La relación ya existe' }),
        };
    } else if (error.name === 'ValidationException') {
    console.error('Datos inválidos', error);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Datos inválidos' }),
        };
    } else {
    console.error('Error interno del servidor', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error interno del servidor' }),
        };
    }
}

module.exports = logError;
