# ServerFrameworkNodejsAWS

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

    Verificar:
        serverless --version

    iniciar:
        serverless
    seleccionar: 
        AWS / Node.js / HTTP API
        ![alt text](image.png)
    