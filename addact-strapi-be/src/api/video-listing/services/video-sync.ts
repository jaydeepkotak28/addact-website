import type { Core } from '@strapi/strapi';

/**
 * Synchronizes a video entry (draft and/or published rows)
 * to the Videos page's media-relation.video-relation component in exact sequence.
 */
export async function syncVideoToVideosPage(strapi: Core.Strapi, docId: string) {
  try {
    const knex = strapi.db.connection;

    // 1. Get the Videos page relation cmp_ids (draft & published)
    const pageCmps = await knex('pages_cmps')
      .join('pages', 'pages.id', 'pages_cmps.entity_id')
      .where('pages.internal_name', 'Videos')
      .andWhere('pages_cmps.component_type', 'media-relation.video-relation')
      .select('pages_cmps.cmp_id', 'pages.published_at');

    if (!pageCmps || pageCmps.length === 0) return;

    const draftRel = pageCmps.find((p: any) => p.published_at === null);
    const pubRel = pageCmps.find((p: any) => p.published_at !== null);

    // 2. Fetch video_listings rows for this document_id
    const videoRows = await knex('video_listings').where({ document_id: docId });
    if (!videoRows || videoRows.length === 0) return;

    for (const v of videoRows) {
      const isPub = v.published_at !== null;
      const targetRelId = isPub ? pubRel?.cmp_id : draftRel?.cmp_id;

      if (!targetRelId) continue;

      const existing = await knex('components_media_relation_video0138c_video_listings_lnk')
        .where({
          video_relation_id: targetRelId,
          video_listing_id: v.id,
        })
        .first();

      if (!existing) {
        const maxOrdRow = await knex('components_media_relation_video0138c_video_listings_lnk')
          .where({ video_relation_id: targetRelId })
          .max('video_listing_ord as max_ord')
          .first();

        const nextOrd = (parseFloat(maxOrdRow?.max_ord) || 0) + 1;

        await knex('components_media_relation_video0138c_video_listings_lnk').insert({
          video_relation_id: targetRelId,
          video_listing_id: v.id,
          video_listing_ord: nextOrd,
        });

        strapi.log.info(
          `[Video Auto-Select] Linked video "${v.internal_name || docId}" (ID: ${v.id}, Ord: ${nextOrd}) to Videos page.`
        );
      }
    }
  } catch (err) {
    strapi.log.error('[Video Auto-Select Error]', err);
  }
}

/**
 * Removes video relation links when a video is deleted.
 */
export async function removeVideoFromVideosPage(strapi: Core.Strapi, docId: string) {
  try {
    const knex = strapi.db.connection;
    await knex('components_media_relation_video0138c_video_listings_lnk')
      .whereIn('video_listing_id', function (this: any) {
        this.select('id').from('video_listings').where({ document_id: docId });
      })
      .del();
    strapi.log.info(`[Video Auto-Select] Removed links for deleted video ${docId}.`);
  } catch (err) {
    strapi.log.error('[Video Auto-Select Delete Error]', err);
  }
}
