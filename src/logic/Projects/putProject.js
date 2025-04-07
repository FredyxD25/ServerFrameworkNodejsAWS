const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const DynamoConfig = require('../../../config/dynamoConfig');

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.putProject = async (event) => {
  try {
    const body = JSON.parse(event.body);

    const { projectId } = event.pathParameters; // projectId desde la URL
    const createdAt = new Date().toISOString();

    const {
      nombre,
      descripcion,
      creadorId
    } = body;

    const params = {
      TableName: DynamoConfig.tableName,
      Item: {
        PK: `PROJECT#${projectId}`,
        SK: `METADATA#${projectId}`,
        projectId,
        createdAt,
        nombre,
        descripcion,
        creadorId,

        // GSI para consultas por usuario
        GSI1PK: `USER#${creadorId}`,
        GSI1SK: `PROYECTO#${projectId}`
      }
    };

    await dynamodb.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Proyecto creado exitosamente",
        projectId
      })
    };
  } catch (error) {
    console.error("Error al crear proyecto:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error interno al crear el proyecto"
      })
    };
  }
};

