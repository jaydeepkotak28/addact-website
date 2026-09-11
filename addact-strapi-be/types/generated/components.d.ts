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

export interface MediaRelationVideoRelation extends Struct.ComponentSchema {
  collectionName: 'components_media_relation_video_relations';
  info: {
    displayName: 'Video Relation';
    icon: 'magic';
  };
  attributes: {
    videoListings: Schema.Attribute.Relation<
      'oneToMany',
      'api::video-listing.video-listing'
    >;
  };
}

export interface MediaIFrame extends Struct.ComponentSchema {
  collectionName: 'components_media_i_frames';
  info: {
    displayName: 'IFrame';
    icon: 'headphone';
  };
  attributes: {
    description: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    link: Schema.Attribute.Component<'shared.link', false>;
    richtext: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    title: Schema.Attribute.String;
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

export interface SharedCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_cards';
  info: {
    description: 'Featured card inside navigation menu or CTAs';
    displayName: 'Card';
    icon: 'picture';
  };
  attributes: {
    description: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    link: Schema.Attribute.Component<'shared.link', false>;
    title: Schema.Attribute.String;
  };
}

export interface SharedFooterColumn extends Struct.ComponentSchema {
  collectionName: 'components_shared_footer_columns';
  info: {
    description: 'Column of links in footer';
    displayName: 'Footer Column';
    icon: 'list-ul';
  };
  attributes: {
    links: Schema.Attribute.Component<'shared.link', true>;
    title: Schema.Attribute.String;
  };
}

export interface SharedLayer1 extends Struct.ComponentSchema {
  collectionName: 'components_shared_layer_1s';
  info: {
    description: 'Navigation Main Menu Layer 1';
    displayName: 'Layer 1';
    icon: 'layer-group';
  };
  attributes: {
    card: Schema.Attribute.Component<'shared.card', false>;
    isCardShow: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    isNavHide: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String;
    link: Schema.Attribute.Component<'shared.link', false>;
    subLayers: Schema.Attribute.Component<'shared.layer-2', true>;
  };
}

export interface SharedLayer2 extends Struct.ComponentSchema {
  collectionName: 'components_shared_layer_2s';
  info: {
    description: 'Navigation Submenu Layer 2';
    displayName: 'Layer 2';
    icon: 'layer-group';
  };
  attributes: {
    card: Schema.Attribute.Component<'shared.card', false>;
    isCardShow: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    isNavHide: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String;
    link: Schema.Attribute.Component<'shared.link', false>;
    subLayers: Schema.Attribute.Component<'shared.layer-3', true>;
  };
}

export interface SharedLayer3 extends Struct.ComponentSchema {
  collectionName: 'components_shared_layer_3s';
  info: {
    description: 'Navigation Submenu Layer 3';
    displayName: 'Layer 3';
    icon: 'layer-group';
  };
  attributes: {
    card: Schema.Attribute.Component<'shared.card', false>;
    isCardShow: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    isNavHide: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String;
    link: Schema.Attribute.Component<'shared.link', false>;
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

export interface SharedOfficeAddress extends Struct.ComponentSchema {
  collectionName: 'components_shared_office_addresses';
  info: {
    description: 'Regional office address, contact information, phone, email, and location';
    displayName: 'Office Address';
    icon: 'building';
  };
  attributes: {
    address: Schema.Attribute.Text;
    description: Schema.Attribute.Text;
    email: Schema.Attribute.Email;
    icon: Schema.Attribute.Media<'images'>;
    mapLink: Schema.Attribute.String;
    officeName: Schema.Attribute.String;
    phone: Schema.Attribute.String;
    region: Schema.Attribute.Enumeration<
      ['global', 'usa', 'australia', 'india', 'uk', 'netherlands']
    > &
      Schema.Attribute.DefaultTo<'global'>;
    urlKeyword: Schema.Attribute.String;
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
      'media-relation.video-relation': MediaRelationVideoRelation;
      'media.i-frame': MediaIFrame;
      'page-structure.page': PageStructurePage;
      'shared.card': SharedCard;
      'shared.footer-column': SharedFooterColumn;
      'shared.layer-1': SharedLayer1;
      'shared.layer-2': SharedLayer2;
      'shared.layer-3': SharedLayer3;
      'shared.link': SharedLink;
      'shared.office-address': SharedOfficeAddress;
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
