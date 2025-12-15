import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3000',
      'http://frontend:3000',
      'https://grc-staging.newmehub.com',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Disposition'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false, // Allow extra properties that are not decorated (common for query params)
      skipMissingProperties: true, // Skip validation for missing properties
      transformOptions: {
        enableImplicitConversion: true, // Automatically convert primitive types
      },
      exceptionFactory: (errors) => {
        const messages = errors.map(error => {
          const constraints = Object.values(error.constraints || {});
          return constraints.length > 0 ? constraints[0] : `Validation failed for ${error.property}`;
        });
        return new BadRequestException(messages);
      },
    }),
  );

  // Global exception filter for validation errors
  app.useGlobalFilters(new ValidationExceptionFilter());

  // Global JWT guard (can be overridden with @Public() decorator)
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // Set global prefix for all routes
  app.setGlobalPrefix('api/v1');

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('GRC Platform API')
    .setDescription('The GRC Platform API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://0.0.0.0:${port}`);
}
bootstrap();