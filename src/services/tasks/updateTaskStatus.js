const AWS = require('aws-sdk');
const DynamoConfig = require('../../../config/dynamoConfig');
const logError = require('../../utils/logError');
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.updateTaskStatus = async (event) => {
  try {
    const { projectId, taskId } = event.pathParameters;
    const { estado } = JSON.parse(event.body);

    if (!projectId || !taskId || !estado) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Se requieren projectId, taskId y estado',
        }),
      };
    }

    // 1. Actualizar el estado en la tarea principal (proyecto)
    const updateTaskParams = {
      TableName: DynamoConfig.tableName,
      Key: {
        PK: `PROJECT#${projectId}`,
        SK: `TASK#${taskId}`,
      },
      UpdateExpression: 'SET estado = :estado',
      ExpressionAttributeValues: {
        ':estado': estado,
      },
      ReturnValues: 'ALL_NEW',
    };

    const updatedTask = await dynamodb.update(updateTaskParams).promise();

    // 2. Actualizar en cada USER#<userId> la relación USER_TASK (opcional)
    const usuarios = updatedTask.Attributes.usuarios || [];

    const updateUserTasks = usuarios.map((userId) => ({
      Update: {
        TableName: DynamoConfig.tableName,
        Key: {
          PK: `USER#${userId}`,
          SK: `TASK#${taskId}`,
        },
        UpdateExpression: 'SET estado = :estado',
        ExpressionAttributeValues: {
          ':estado': estado,
        },
      },
    }));

    if (updateUserTasks.length > 0) {
      await dynamodb.transactWrite({
        TransactItems: updateUserTasks,
      }).promise();
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Estado de la tarea actualizado correctamente',
        updatedTask: updatedTask.Attributes,
      }),
    };

  } catch (error) {
    return logError(error);
  }
};
