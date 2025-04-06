# ServerFrameworkNodejsAWS

**Comando para ejecutar scritps en powershell**
Set-ExecutionPolicy Unrestricted -Scope Process
serverless deploy --verbose

1. Crear un Grupo IAM y un usuario con credenciales

    User name,Password,Console sign-in URL
    serverless-prueba,N3bL5X5(,https://fredymain.signin.aws.amazon.com/console

    Access key
        AKIASJ5LGXUYU3763DKE
    Secret access key
        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

2. Descargar: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

3. cmd
    aws --version
    aws configure
    llenar usando Access Key, Secrect Access Key, us-east-1 y json

4. Utilzar framework Severless https://www.serverless.com/

    Set-ExecutionPolicy Unrestricted -Scope Process --> Crear Exepcion en la consola de windows
    npm install -g serverless
    npm install aws-sdk

    Verificar:
        serverless --version

    iniciar:
        serverless
    seleccionar: 
        AWS / Node.js / HTTP API
        ![alt text](image.png)

5. Comprobar configuracion
    deploy:
        **Acceder a la carpeta de configuracion**
            cd .\aws-lambda\ 
            serverless deploy --verbose

------------------
----ConexionDB----
------------------

1. Accseder a severless.yml
    https://www.serverless.com/framework/docs/providers/aws/guide/resources
    
2. Configurar

3. Crear carpeta src y modificar yml

4. crear "crearTarea.js"

5. **Crear node modules (Ejecutar siempre que se abra en un nuevo compilador)**
    npm i uuid

6. Crear paquetes json
    npm init -y
-------------------------------------------------
------------**Logs en tiempo real**--------------
-------------------------------------------------
    debugear :v
        serverless logs -f updateTask --tail
    
    eliminar y crear lambda
        serverless remove
        serverless deploy --verbose

    en el codigo colocar
        console.log(tasks)

    En amazon entrar a cloud watch

---Ejemplo PK y SK keys-----

{
  "id": "PROYECTO#123",
  "sortKey": "TAREA#001",
  "nombre": "Armar backend",
  "usuarioAsignado": "fredy"
}

    