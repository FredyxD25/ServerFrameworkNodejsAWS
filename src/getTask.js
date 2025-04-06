// Importamos el SDK de AWS para interactuar con DynamoDB
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Configuración con el nombre de la tabla
const DynamoConfig = require('../config/dynamoConfig');

// Exportamos la función principal
module.exports.getTask = async () => {
  try {
    // Configuración del escaneo completo de la tabla
    const params = {
      TableName: DynamoConfig.tableName,
      FilterExpression: "begins_with(SK, :taskPrefix)",
      ExpressionAttributeValues: {
        ":taskPrefix": "TASK#"
      }
    };

    // Ejecutamos el escaneo en la tabla
    const data = await dynamodb.scan(params).promise();

    // Retornamos la lista de tareas (Items)
    return {
      statusCode: 200,
      body: JSON.stringify({
        tareas: data.Items,
        count: data.Items.length
      }),
    };

  } catch (error) {
    // En caso de error, lo registramos y respondemos con un error 500
    console.error('Error al obtener tareas:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al obtener las tareas' }),
    };
  }
};
