import type { Core } from '@strapi/strapi';

const allowedMediaTypes = [
  'image/*',
  'video/*',
  'audio/*',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.*',
  'text/plain',
  'text/csv',
];

const deniedTypes = [
  'image/svg+xml',
  'application/vnd.microsoft.portable-executable',
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-executable',
  'application/x-dosexec',
  'application/x-sh',
  'text/x-shellscript',
  'application/x-mach-binary',
];

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => {
  const region = env('AWS_REGION');
  const accessKeyId = env('AWS_ACCESS_KEY_ID');
  const secretAccessKey = env('AWS_ACCESS_SECRET') || env('AWS_ACCESS_SECRET_KEY') || env('AWS_SECRET_ACCESS_KEY');
  const bucket = env('AWS_BUCKET') || env('AWS_BUCKET_NAME');
  const cdnUrl = env('CDN_URL', 'https://d3l7d9gtq0bnch.cloudfront.net');

  return {
    'users-permissions': {
      config: {
        jwtManagement: 'refresh',
        sessions: {
          httpOnly: true,
        },
      },
    },
    upload: {
      config: {
        provider: 'aws-s3',
        providerOptions: {
          s3Options: {
            region,
            credentials: {
              accessKeyId,
              secretAccessKey,
            },
            params: {
              Bucket: bucket,
            },
          },
          httpOptions: {
            timeout: 30000,
          },
          baseUrl: cdnUrl,
          cdn: {
            url: cdnUrl,
          },
        },
        actionOptions: {
          upload: {
            beforeUpload(file: any) {
              file.url = `${cdnUrl}/${file.hash}${file.ext}`;
              return file;
            },
          },
          uploadStream: {},
          delete: {},
        },
        security: {
          allowedTypes: allowedMediaTypes,
          deniedTypes,
        },
      },
    },
    graphql: {
      config: {
        endpoint: '/graphql',
        shadowCRUD: true,
        playgroundAlways: false,
        depthLimit: 10,
        amountLimit: 100,
        apolloServer: {
          tracing: false,
        },
      },
    },
  };
};

export default config;
