const AWS = require('aws-sdk');
const DynamoConfig = require('../../../config/dynamoConfig');

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.postUserToTask = async (event) => {
  try {
    const { userId, taskId, rol } = JSON.parse(event.body);

    if (!userId || !taskId || !rol) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Se requieren 'userId', 'taskId' y 'rol'" }),
      };
    }

    const relacion = {
      PK: `USER#${userId}`,
      SK: `TASK#${taskId}`,
      GSI1PK: `USER#${userId}`,
      GSI1SK: estadoTarea,
      entityType: 'USER_TASK_RELATION',
      rol,
      fechaAsignacion: new Date().toISOString()
    };

    const params = {
      TableName: DynamoConfig.tableName,
      Item: relacion,
      ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)' // evita duplicados
    };

    await dynamodb.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Usuario asignado a la tarea correctamente',
        data: relacion
      }),
    };

  } catch (error) {
    return logError(error);
  }
};
