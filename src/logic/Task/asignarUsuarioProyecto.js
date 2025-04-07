const AWS = require('aws-sdk');
const DynamoConfig = require('../../../config/dynamoConfig');

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.asignarUsuarioAProyecto = async (event) => {
  try {
    const { userId, projectId, rol = 'colaborador' } = JSON.parse(event.body);

    if (!userId || !projectId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Se requieren 'userId' y 'projectId'" }),
      };
    }

    const relacion = {
      PK: `USER#${userId}`,
      SK: `PROJECT#${projectId}`,
      rol,
      fechaAsignacion: new Date().toISOString()
    };

    const params = {
      TableName: DynamoConfig.tableName,
      Item: relacion
    };

    await dynamodb.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Usuario asignado al proyecto correctamente', ...relacion }),
    };

  } catch (error) {
    console.error('Error al asignar usuario al proyecto:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' }),
    };
  }
};
