import type { Schema, Struct } from '@strapi/strapi';

export interface ContentRelationBannerRelation extends Struct.ComponentSchema {
  collectionName: 'components_content_relation_banner_relations';
  info: {
    displayName: 'Banner Relation';
    icon: 'book';
  };
  attributes: {
    banner: Schema.Attribute.Relation<'oneToOne', 'api::banner.banner'>;
  };
}

export interface ContentRelationCapabilitiesRelation
  extends Struct.ComponentSchema {
  collectionName: 'components_content_relation_capabilities_relations';
  info: {
    displayName: 'Capabilities Relation';
    icon: 'collapse';
  };
  attributes: {
    ourCapabilities: Schema.Attribute.Relation<
      'oneToMany',
      'api::our-capabilitie.our-capabilitie'
    >;
    title: Schema.Attribute.Component<'shared.title', false>;
  };
}

export interface ContentRelationContentRelation extends Struct.ComponentSchema {
  collectionName: 'components_content_relation_content_relations';
  info: {
    displayName: 'Content Relation';
    icon: 'book';
  };
  attributes: {
    content: Schema.Attribute.Relation<
      'oneToOne',
      'api::title-description.title-description'
    >;
  };
}

export interface ContentRelationCtaRelation extends Struct.ComponentSchema {
  collectionName: 'components_content_relation_cta_relations';
  info: {
    displayName: 'CTA Relation';
    icon: 'discuss';
  };
  attributes: {
    cta: Schema.Attribute.Relation<'oneToOne', 'api::cta.cta'>;
  };
}

export interface ContentRelationPromoRelation extends Struct.ComponentSchema {
  collectionName: 'components_content_relation_promo_relations';
  info: {
    displayName: 'Promo Relation';
    icon: 'bold';
  };
  attributes: {
    promos: Schema.Attribute.Relation<'oneToMany', 'api::promo.promo'>;
  };
}

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

export interface FeatureBody extends Struct.ComponentSchema {
  collectionName: 'components_feature_bodies';
  info: {
    displayName: 'Body';
    icon: 'crown';
  };
  attributes: {
    description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    title: Schema.Attribute.String;
  };
}

export interface FeatureCapabilities extends Struct.ComponentSchema {
  collectionName: 'components_feature_capabilities';
  info: {
    displayName: 'Capabilities';
    icon: 'book';
  };
  attributes: {
    description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    link: Schema.Attribute.Component<'shared.link', false>;
    subLinks: Schema.Attribute.Component<'shared.link', true>;
    title: Schema.Attribute.String;
  };
}

export interface FeatureContent extends Struct.ComponentSchema {
  collectionName: 'components_feature_contents';
  info: {
    displayName: 'Content';
    icon: 'check';
  };
  attributes: {
    body: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
  };
}

export interface FeaturePromo extends Struct.ComponentSchema {
  collectionName: 'components_feature_promos';
  info: {
    displayName: 'Promo';
    icon: 'archive';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    subTitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    variant: Schema.Attribute.Enumeration<
      [
        'about_us_content',
        'our_vision_mission',
        'we_are_addact',
        'stacked_image_bottom',
      ]
    > &
      Schema.Attribute.DefaultTo<'about_us_content'>;
  };
}

export interface PageStructurePage extends Struct.ComponentSchema {
  collectionName: 'components_page_structure_pages';
  info: {
    displayName: 'Page';
    icon: 'apps';
  };
  attributes: {
    PageHeading: Schema.Attribute.Component<'feature.base-heading', false>;
    seo: Schema.Attribute.Component<'site-settings.seo', false>;
  };
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_links';
  info: {
    description: '';
    displayName: 'Link';
    icon: 'link';
  };
  attributes: {
    href: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500000;
      }> &
      Schema.Attribute.DefaultTo<'/'>;
    icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Read Now'>;
    subDisc: Schema.Attribute.Text;
    target: Schema.Attribute.Enumeration<
      ['_self', '_blank', '_parent', '_top']
    > &
      Schema.Attribute.DefaultTo<'_self'>;
  };
}

export interface SharedTitle extends Struct.ComponentSchema {
  collectionName: 'components_shared_titles';
  info: {
    displayName: 'Title';
  };
  attributes: {
    tag: Schema.Attribute.Enumeration<['H1', 'H2', 'H3', 'H4', 'H5', 'H6']>;
    title: Schema.Attribute.String;
  };
}

export interface SiteSettingsBrandAssets extends Struct.ComponentSchema {
  collectionName: 'components_site_settings_brand_assets';
  info: {
    description: 'Logos and favicon for Addact';
    displayName: 'Brand Assets';
    icon: 'landscape';
  };
  attributes: {
    favicon: Schema.Attribute.Media<'images'>;
    footerLogo: Schema.Attribute.Media<'images'>;
    headerLogo: Schema.Attribute.Media<'images'>;
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

export interface SiteSettingsSiteInfo extends Struct.ComponentSchema {
  collectionName: 'components_site_settings_site_infos';
  info: {
    description: 'Global company info, copyright, and social channels';
    displayName: 'Site Info & Social Links';
    icon: 'information';
  };
  attributes: {
    copyrightText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'\u00A9 2026 Addact Technologies. All Rights Reserved.'>;
    socialLinks: Schema.Attribute.Component<'site-settings.social-link', true>;
    supportEmail: Schema.Attribute.Email &
      Schema.Attribute.DefaultTo<'info@addact.net'>;
  };
}

export interface SiteSettingsSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_site_settings_social_links';
  info: {
    description: 'Social media platform and URL';
    displayName: 'Social Link';
    icon: 'link';
  };
  attributes: {
    platform: Schema.Attribute.Enumeration<
      ['LinkedIn', 'Twitter / X', 'Instagram', 'Facebook', 'YouTube', 'GitHub']
    > &
      Schema.Attribute.DefaultTo<'LinkedIn'>;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SiteSettingsThemeColors extends Struct.ComponentSchema {
  collectionName: 'components_site_settings_theme_colors';
  info: {
    description: 'Brand & UI color palette for Addact website';
    displayName: 'Theme Colors';
    icon: 'paint-brush';
  };
  attributes: {
    brandBlue: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#3C4CFF'>;
    cardBackground: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'#FFFFFF'>;
    darkBackground: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'#0F0F0F'>;
    lightBackground: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'#F4F4F4'>;
    textMuted: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#2E2E2E'>;
    textPrimary: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'#000000'>;
  };
}

export interface SiteSettingsTypographyLayout extends Struct.ComponentSchema {
  collectionName: 'components_site_settings_typography_layouts';
  info: {
    description: 'Global fonts and layout settings';
    displayName: 'Typography & Layout';
    icon: 'bold';
  };
  attributes: {
    bodyFont: Schema.Attribute.Enumeration<
      ['Poppins', 'Montserrat', 'Geist', 'Inter', 'Roboto']
    > &
      Schema.Attribute.DefaultTo<'Poppins'>;
    containerMaxWidth: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'1600px'>;
    defaultBorderRadius: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'16px'>;
    headingFont: Schema.Attribute.Enumeration<
      ['Montserrat', 'Poppins', 'Geist', 'Inter', 'Roboto']
    > &
      Schema.Attribute.DefaultTo<'Montserrat'>;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'content-relation.banner-relation': ContentRelationBannerRelation;
      'content-relation.capabilities-relation': ContentRelationCapabilitiesRelation;
      'content-relation.content-relation': ContentRelationContentRelation;
      'content-relation.cta-relation': ContentRelationCtaRelation;
      'content-relation.promo-relation': ContentRelationPromoRelation;
      'feature.base-heading': FeatureBaseHeading;
      'feature.body': FeatureBody;
      'feature.capabilities': FeatureCapabilities;
      'feature.content': FeatureContent;
      'feature.promo': FeaturePromo;
      'page-structure.page': PageStructurePage;
      'shared.link': SharedLink;
      'shared.title': SharedTitle;
      'site-settings.brand-assets': SiteSettingsBrandAssets;
      'site-settings.seo': SiteSettingsSeo;
      'site-settings.site-info': SiteSettingsSiteInfo;
      'site-settings.social-link': SiteSettingsSocialLink;
      'site-settings.theme-colors': SiteSettingsThemeColors;
      'site-settings.typography-layout': SiteSettingsTypographyLayout;
    }
  }
}
