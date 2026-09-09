import type { Schema, Struct } from '@strapi/strapi';

export interface FeatureBaseHeading extends Struct.ComponentSchema {
  collectionName: 'components_feature_base_headings';
  info: {
    displayName: 'Base Heading';
    icon: 'collapse';
  };
  attributes: {
    pageTitle: Schema.Attribute.String & Schema.Attribute.Required;
    slug: Schema.Attribute.String & Schema.Attribute.Unique;
  };
}

export interface SiteSettingsSeo extends Struct.ComponentSchema {
  collectionName: 'components_site_settings_seos';
  info: {
    displayName: 'SEO';
    icon: 'book';
  };
  attributes: {
    canonicalURL: Schema.Attribute.Text;
    languageTag: Schema.Attribute.Enumeration<['en']>;
    metaDescription: Schema.Attribute.Text;
    metaRobots: Schema.Attribute.Enumeration<
      ['index', 'follow', 'noindex', 'nofollow']
    >;
    metaTitle: Schema.Attribute.Text;
    ogDescription: Schema.Attribute.Text;
    ogImage: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    ogTitle: Schema.Attribute.Text;
    structuredData: Schema.Attribute.JSON;
    twitterCardTitle: Schema.Attribute.Text;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'feature.base-heading': FeatureBaseHeading;
      'site-settings.seo': SiteSettingsSeo;
    }
  }
}
