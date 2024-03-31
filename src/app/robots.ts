import { MetadataRoute } from 'next';
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/settings/notifications/', 
        '/settings/profile/', 
        '/settings/payouts/',
        '/order-confirmation/',
        '/track/edit/',
        '/track/upload/',
        '/tracks/',
        '/tracks/drafts/'
      ],
    },
  }
}