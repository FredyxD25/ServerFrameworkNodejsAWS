const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.updateTask = async (event) => {
  try {
    const { id } = event.pathParameters;
    const { title, description } = JSON.parse(event.body);
    const updatedAt = new Date().toISOString();

    const params = {
      TableName: 'TablaPrueba',
      Key: { id },
      UpdateExpression: 'set title = :title, description = :desc, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':title': title,
        ':desc': description,
        ':updatedAt': updatedAt,
      },
      ReturnValues: 'ALL_NEW',
    };

    const result = await dynamodb.update(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Tarea actualizada correctamente', tarea: result.Attributes }),
    };

  } catch (error) {
    console.error('Error al actualizar tarea:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al actualizar la tarea' }),
    };
  }
};
