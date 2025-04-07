const AWS = require('aws-sdk');
const { v4 } = require('uuid');
const DynamoConfig = require('../../../config/dynamoConfig');

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.postProject = async (event) => {
  try {
    const { nombre, descripcion, creadorId } = JSON.parse(event.body);

    if (!nombre || !creadorId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Los campos 'nombre' y 'creadorId' son obligatorios." }),
      };
    }

    const createdAt = new Date().toISOString();
    const projectId = v4();

    const proyecto = {
      PK: `PROJECT#${projectId}`,
      SK: `METADATA#${projectId}`,

      
      projectId,
      nombre,
      descripcion,
      creadorId,
      createdAt,

      // Para consultas por usuario creador
      GSI1PK: `USER#${creadorId}`,
      GSI1SK: `PROYECTO#${projectId}`
    };

    const params = {
      TableName: DynamoConfig.tableName,
      Item: proyecto
    };

    await dynamodb.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Proyecto creado exitosamente', projectId }),
    };

  } catch (error) {
    console.error('Error al crear proyecto:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' }),
    };
  }
};
