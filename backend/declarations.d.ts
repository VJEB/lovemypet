// declarations.d.ts
declare module 'swagger-jsdoc' {
    interface SwaggerOptions {
      definition: {
        openapi: string;
        info: {
          title: string;
          version: string;
          description?: string;
        };
        servers?: { url: string }[];
        components?: {
          schemas?: {
            [key: string]: {
              type: string;
              properties?: { [key: string]: any };
            };
          };
        };
      };
      apis: string[];
    }
  
    function swaggerJSDoc(options: SwaggerOptions): any;
    export default swaggerJSDoc;
  }
  
  declare module 'swagger-ui-express' {
    import { RequestHandler } from 'express';
    export const serve: RequestHandler[];
    export function setup(spec: any): RequestHandler;
  }