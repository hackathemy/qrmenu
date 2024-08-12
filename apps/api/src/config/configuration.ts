export default () => ({
  env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT),
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: {
      ca: process.env.DATABASE_CERT,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  aws: {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_DEFAULT_REGION,
    s3: {
      bucket: process.env.AWS_S3_BUCKET,
    },
  },
});
