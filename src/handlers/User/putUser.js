const AWS = require("aws-sdk");
const DynamoConfig = require('../../../config/dynamoConfig');

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.putUser = async (event) => {
  try {
    const body = JSON.parse(event.body);

    const { userId } = event.pathParameters; // projectId desde la URL
    const createdAt = new Date().toISOString();

    const {nombre,correo} = body;

    const params = {
      TableName: DynamoConfig.tableName,
      Item: {
        PK: `USER#${userId}`,
        SK: `METADATA#${userId}`,
        userId,
        createdAt,

        nombre,
        correo,
      }
    };

    await dynamodb.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Usuario actualizado exitosamente",
        userId
      })
    };
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error interno al actualizar el usuario"
      })
    };
  }
};

