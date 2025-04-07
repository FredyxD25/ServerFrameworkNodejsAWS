const AWS = require('aws-sdk');
const DynamoConfig = require('../../config/dynamoConfig');
const logError = require('../utils/logError');
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.putUserToTask = async (event) => {
  try {
    const { userId, taskId, rol, estadoTarea } = JSON.parse(event.body);

    if (!userId || !taskId || !rol || !estadoTarea) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Se requieren 'userId', 'taskId', 'rol' y 'estadoTarea'" }),
      };
    }

    // Actualiza la relación USER#id <-> TASK#id
    const relationParams = {
      TableName: DynamoConfig.tableName,
      Key: {
        PK: `USER#${userId}`,
        SK: `TASK#${taskId}`
      },
      UpdateExpression: 'set rol = :rol, estadoTarea = :estadoTarea, GSI1SK = :estadoTarea, fechaAsignacion = :fechaAsignacion',
      ExpressionAttributeValues: {
        ':rol': rol,
        ':estadoTarea': estadoTarea,
        ':fechaAsignacion': new Date().toISOString()
      },
      ConditionExpression: 'attribute_exists(PK) AND attribute_exists(SK)',
      ReturnValues: 'ALL_NEW'
    };

    const relationResult = await dynamodb.update(relationParams).promise();

    // Luego actualiza el número de usuarios asignados en la tarea
    const taskUpdateParams = {
      TableName: DynamoConfig.tableName,
      Key: {
        PK: `TASK#${taskId}`,
        SK: `TASK#${taskId}`
      },
      UpdateExpression: 'ADD usuariosAsignados :inc',
      ExpressionAttributeValues: {
        ':inc': 1
      },
      ReturnValues: 'UPDATED_NEW'
    };

    await dynamodb.update(taskUpdateParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Relación y conteo de usuarios actualizados correctamente',
        data: relationResult.Attributes
      }),
    };

  } catch (error) {
    return logError(error);
  }
};
