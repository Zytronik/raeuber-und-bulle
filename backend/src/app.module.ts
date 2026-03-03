import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('PGHOST'),
        port: config.get<number>('PGPORT') || 5432,
        username: config.get<string>('PGUSER'),
        password: config.get<string>('PGPASSWORD'),
        database: config.get<string>('PGDATABASE'),
        autoLoadEntities: true,
        synchronize: true, // dev only
        ssl: { rejectUnauthorized: false }
      }),
    }),

    UserModule,
    AuthModule,
  ],
})
export class AppModule { }
