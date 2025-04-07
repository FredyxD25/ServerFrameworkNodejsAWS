const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const DynamoConfig = require('../../../config/dynamoConfig');
const logError = require('../../utils/buildTaskItem');
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.postTasksByProject = async (event) => {
  try {
    const { projectId, title, description, usuarioAsignado, dueDate, status = 'PENDING' } = JSON.parse(event.body);

    if (!projectId || !title || !usuarioAsignado) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Se requieren 'projectId', 'title' y 'usuarioAsignado'",
        }),
      };
    }

    const taskId = uuidv4();
    const createdAt = new Date().toISOString();

    const params = {
      TableName: DynamoConfig.tableName,
      Item: {
        // Claves principales
        PK: `PROJECT#${projectId}`,
        SK: `TASK#${taskId}`,
        entityType: 'TASK_PROJECT_RELATION',

        // Datos de la tarea
        taskId,
        projectId,
        title,
        description,
        usuarioAsignado,
        dueDate,
        status,
        createdAt,

        // Claves secundarias para búsquedas
        GSI1PK: `USER#${usuarioAsignado}`,
        GSI1SK: `STATUS#${status}`,
      },
    };

    await dynamodb.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Tarea creada correctamente',
        taskId,
        projectId,
      }),
    };

  } catch (error) {
    return logError(error);
  }
};
