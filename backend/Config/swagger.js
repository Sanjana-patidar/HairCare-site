import swaggerJsDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Documentation",
            version: "1.0.0",
            description: "Haircare API Documentation",
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Local server"
            },
        ],

        // 👇 YE ADD KARNA HAI
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: ["./Route/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

export default swaggerSpec;