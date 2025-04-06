const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const DynamoConfig = require('../config/dynamoConfig');

// Actualiza una tarea existente usando su taskId y proyectoId
module.exports.updateTask = async (event) => {
  try {
    const { id } = event.pathParameters; // taskId desde la URL
    const body = JSON.parse(event.body);

    const { title, description, status, dueDate } = body;

    // Validar campos obligatorios
    if (!title || !description || !status) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Faltan campos requeridos: title, description, status"
        }),
      };
    }

    // Se espera que el body también traiga el ID del proyecto (relación PK)
    const { proyectoId } = body;

    if (!proyectoId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Falta el campo 'proyectoId'" }),
      };
    }

    // Parámetros para actualizar la tarea
    const params = {
      TableName: DynamoConfig.tableName,
      Key: {
        PK: `PROJECT#${proyectoId}`,
        SK: `TASK#${id}`
      },
      UpdateExpression: "set #title = :title, #description = :description, #status = :status, #dueDate = :dueDate",
      ExpressionAttributeNames: {
        "#title": "title",
        "#description": "description",
        "#status": "status",
        "#dueDate": "dueDate"
      },
      ExpressionAttributeValues: {
        ":title": title,
        ":description": description,
        ":status": status,
        ":dueDate": dueDate || null
      },
      ReturnValues: "UPDATED_NEW"
    };

    const result = await dynamodb.update(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Tarea actualizada correctamente",
        updatedAttributes: result.Attributes
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };

  } catch (error) {
    console.error('Error al actualizar tarea:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' }),
    };
  }
};