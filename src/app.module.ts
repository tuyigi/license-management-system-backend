import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/authentication/auth.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { LicensesModule } from './modules/licenses/licenses.module';
import { LicenseRequestModule } from './modules/license-requests/license-request.module';
import { ReportsModule } from './modules/reports/reports.module';
import { VendorsModule } from './modules/vendors/vendors.module';
import { LdapAuthenticationModule } from './modules/ldap-authentication/ldap-authentication.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: `${process.env.DB_HOST}`,
      port: parseInt(`${process.env.DB_PORT}`),
      password: `${process.env.DB_PASSWORD}`,
      username: `${process.env.DB_USERNAME}`,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      database: `${process.env.DB_NAME}`,
      synchronize: true,
      logging: true,
    }),
    UsersModule,
    AuthModule,
    OrganizationsModule,
    LicensesModule,
    LicenseRequestModule,
    ReportsModule,
    VendorsModule,
    LdapAuthenticationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
