const { v4: uuidv4 } = require('uuid');


function UserItem({ nombre, correo }) {
  const userId = uuidv4();
  const createdAt = new Date().toISOString();

  return {
    PK: `USER#${userId}`,
    SK: `METADATA#${userId}`,
    createdAt,

    nombre,
    correo,
  };
}

module.exports = UserItem;