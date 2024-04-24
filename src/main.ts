import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

const start = async () => {
  try {
    const app = await NestFactory.create(AppModule);
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.GRPC,
      options: {
        package: 'users',
        protoPath: join('src', '/protos/users.proto'),
        url: 'localhost:50051',
      },
    });
    await app.startAllMicroservices();

    const PORT = process.env.PORT || 3003;

    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix('/api');
    app.use(cookieParser());

    const config = new DocumentBuilder()
      .setTitle('Test project')
      .setDescription('RES API')
      .setVersion('1.0.0')
      .addTag('Nestjs, Postgres, TypeOrm, Redis')
      .build();

    app.enableCors();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    app.listen(PORT, () => {
      console.log(`Server is running ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
