// import { get } from 'env-var';

// export enum AppEnv {
//   DEVELOPMENT = 'development',
//   PRODUCTION = 'production',
//   TEST = 'test',
// }

// export class ServerConfig {
//   public static readonly PORT: number = get('PORT').required().asPortNumber();

//   public static readonly JWT_ACCESS_SECRET: string = get('JWT_ACCESS_SECRET')
//     .required()
//     .asString();

//   public static readonly JWT_ACCESS_TTL_IN_MINUTES: number = get(
//     'JWT_ACCESS_TTL_IN_MINUTES',
//   )
//     .default(15)
//     .required()
//     .asInt();
// }
