/*
 * Builds the two query/keyword deliverables from one typed table each, so the
 * CSV cannot drift from the site: every target URL is checked against the
 * exported sitemap and every recommended title against the width Google shows.
 *
 * Usage: node scripts/seo/build-query-reports.mjs   (after `npm run build`)
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { categories } from '../../src/lib/categories.ts';

const sitemapFile = 'out/sitemap.xml';
if (!existsSync(sitemapFile))
  throw new Error('Run `npm run build` first: out/sitemap.xml is missing');

const sitemap = readFileSync(sitemapFile, 'utf8');
const sitemapPaths = new Set(
  [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => new URL(match[1]).pathname
  )
);

const NOT_SUPPLIED = 'not supplied';

/* ------------------------------------------------------------------ *
 * SEO_KEYWORD_MAP.csv - section 8.2 of the brief.
 * GSC numbers are URL-level rows from the supplied Pages export, quoted
 * exactly; a query-level volume is never invented.
 * ------------------------------------------------------------------ */
const keywordRows = [
  {
    cluster: 'Core commercial',
    primary_keyword: 'AI tools in Pakistan',
    secondary_intents:
      'buy AI subscriptions Pakistan; AI tools Pakistan; digital tools Pakistan',
    target_url: '/',
    page_type: 'homepage',
    competing_internal_urls: '/tools/; /price-index/; /category/ai-chat/',
    gsc_impressions: 120,
    gsc_clicks: 3,
    gsc_ctr: '2.50%',
    gsc_avg_position: 5.12,
    current_ranking_url: 'not supplied (Pages dimension withheld)',
    content_gap:
      "Homepage and /price-index/ now both carry 'AI tool prices in Pakistan' in the title, so two URLs target one phrase; the price index owns the price intent and the homepage does not yet own 'tools & subscriptions'.",
    recommended_title: 'AI tools & subscriptions in Pakistan | AiToolsPk',
    recommended_h1:
      'AI tool prices in Pakistan. Compare every plan. (unchanged)',
    next_action:
      "Hold until the price index has been recrawled: it already converts at 2.50% CTR. If both URLs still compete for the price phrase, retarget the homepage title and drop 'prices' from the H1.",
    evidence_source: 'supplied Pages row; live 200 response',
    approval_required: 'yes - visible H1 change',
  },
  {
    cluster: 'AI price discovery',
    primary_keyword: 'AI tool prices in Pakistan',
    secondary_intents:
      'AI subscription price Pakistan; AI tools price list PKR; AI subscriptions PKR',
    target_url: '/price-index/',
    page_type: 'price index',
    competing_internal_urls:
      '/; /tools/; 108 /plans/ collection pages; /blog/ai-subscription-price-change-pakistan/',
    gsc_impressions: 827,
    gsc_clicks: 0,
    gsc_ctr: '0%',
    gsc_avg_position: 6.88,
    current_ranking_url: 'not supplied (Pages dimension withheld)',
    content_gap:
      "Title used the site's internal name ('price index') and named neither the query nor the currency; the snippet never said the figures are seller quotes; no method or freshness statement.",
    recommended_title: 'AI tool prices in Pakistan 2026: 108 tools in PKR',
    recommended_h1: 'Every listed price, one index. (unchanged)',
    next_action:
      'Applied on this branch: title, description, quote-date sentence, #method section, fourth anchor. Measure CTR after recrawl; do not add more keywords before that read.',
    evidence_source:
      'supplied Pages row; built HTML title/description measured; live row still pre-fix',
    approval_required: 'no - shipped in this branch, pending deploy approval',
  },
  {
    cluster: 'ChatGPT',
    primary_keyword: 'ChatGPT Plus price in Pakistan',
    secondary_intents:
      'ChatGPT price Pakistan; ChatGPT subscription Pakistan; buy ChatGPT Plus Pakistan; ChatGPT Plus PKR',
    target_url: '/plans/chatgpt/',
    page_type: 'collection',
    competing_internal_urls:
      '/blog/chatgpt-plus-kitne-ka-hai-pakistan/; /blog/chatgpt-vs-claude-plans-pakistan/; /guides/chatgpt-claude-gemini-plan-comparison-pakistan/; /price-index/; /plans/api/',
    gsc_impressions: 20,
    gsc_clicks: 0,
    gsc_ctr: '0%',
    gsc_avg_position: 6.85,
    current_ranking_url: 'not supplied (Pages dimension withheld)',
    content_gap:
      '52 listings with 20 impressions: the 10 November site: probe returned this URL under the pre-9-November title, so Google has not reprocessed it. The homepage card sits 18th of 27.',
    recommended_title: 'ChatGPT price in Pakistan 2026: 52 plans | AiToolsPk',
    recommended_h1: 'ChatGPT plans & prices in Pakistan (unchanged)',
    next_action:
      'Deploy, then URL Inspection -> Request Indexing. Moving the homepage card is merchandising, not SEO: owner decision.',
    evidence_source:
      'supplied Pages row; docs/seo/INDEX_AND_QUERY_COVERAGE_2026-11-10.md',
    approval_required: 'no (metadata unchanged); deploy approval yes',
  },
  {
    cluster: 'Claude',
    primary_keyword: 'Claude Pro price in Pakistan',
    secondary_intents:
      'Claude subscription Pakistan; Claude price PKR; Claude API price Pakistan',
    target_url: '/plans/claude/',
    page_type: 'collection',
    competing_internal_urls:
      '/plans/api/; /guides/chatgpt-claude-gemini-plan-comparison-pakistan/; /blog/chatgpt-vs-claude-plans-pakistan/',
    gsc_impressions: NOT_SUPPLIED,
    gsc_clicks: NOT_SUPPLIED,
    gsc_ctr: NOT_SUPPLIED,
    gsc_avg_position: NOT_SUPPLIED,
    current_ranking_url: 'not supplied',
    content_gap:
      "40 catalogue rows carry this brand but only 5 are non-API plans on this page; 35 API-credit rows are pooled into /plans/api/ under the generic title 'API price in Pakistan', so 'Claude API price Pakistan' has no page of its own.",
    recommended_title: 'Claude price in Pakistan 2026: 5 plans | AiToolsPk',
    recommended_h1: 'Claude plans & prices in Pakistan (unchanged)',
    next_action:
      'Do not split the API rows yet: credit terms are unverified. If /plans/api/ earns brand-level API queries after recrawl, add brand sections there first.',
    evidence_source: 'built HTML; data/catalog.json grouping',
    approval_required: 'no change proposed',
  },
  {
    cluster: 'Gemini',
    primary_keyword: 'Gemini Pro price in Pakistan',
    secondary_intents:
      'Google AI plan Pakistan; Gemini subscription PKR; Google AI Pro Pakistan',
    target_url: '/plans/gemini/',
    page_type: 'collection',
    competing_internal_urls:
      '/plans/google/; /plans/api/; /guides/chatgpt-claude-gemini-plan-comparison-pakistan/',
    gsc_impressions: NOT_SUPPLIED,
    gsc_clicks: NOT_SUPPLIED,
    gsc_ctr: NOT_SUPPLIED,
    gsc_avg_position: NOT_SUPPLIED,
    current_ranking_url: 'not supplied',
    content_gap:
      'Largest single collection (40 plans) and absent from the 10 November index probe. Google-brand demand is split with /plans/google/ (31 rows: One, Drive, Workspace), which is a different product, not a duplicate.',
    recommended_title: 'Gemini price in Pakistan 2026: 40 plans | AiToolsPk',
    recommended_h1: 'Gemini plans & prices in Pakistan (unchanged)',
    next_action:
      'Request indexing. Keep /plans/google/ and /plans/gemini/ distinct: cross-link only where the related-collection block already surfaces one.',
    evidence_source:
      'built HTML; docs/seo/INDEX_AND_QUERY_COVERAGE_2026-11-10.md',
    approval_required: 'no (metadata unchanged)',
  },
  {
    cluster: 'AI video',
    primary_keyword: 'AI video tools in Pakistan',
    secondary_intents:
      'Runway price Pakistan; Kling AI Pakistan; AI video generator PKR; Veo plans Pakistan',
    target_url: '/category/video/',
    page_type: 'category hub',
    competing_internal_urls:
      '/plans/runway/; /plans/kling/; /plans/capcut/; /plans/gemini/; /guides/compare-video-audio-ai-credits/',
    gsc_impressions: NOT_SUPPLIED,
    gsc_clicks: NOT_SUPPLIED,
    gsc_ctr: NOT_SUPPLIED,
    gsc_avg_position: NOT_SUPPLIED,
    current_ranking_url: 'not supplied',
    content_gap:
      "The old title was 'Video & Audio in Pakistan | AiToolsPk' (41 chars): no 'tools', no 'price', no 'AI'. Veo rows sit under /plans/gemini/, not in this hub.",
    recommended_title:
      'Video and audio tools in Pakistan: PKR price list | AiToolsPk',
    recommended_h1: 'Video & audio tools, in PKR.',
    next_action:
      'Applied on this branch: title and description rewritten; the H1 keeps its existing wording. No new category. Recheck after indexing improves, since the hub has no measured query rows.',
    evidence_source:
      'built HTML title and H1 measured before and after the change',
    approval_required: 'no - shipped in this branch, pending deploy approval',
  },
  {
    cluster: 'AI voice',
    primary_keyword: 'ElevenLabs price in Pakistan',
    secondary_intents:
      'AI voice generator plans Pakistan; ElevenLabs subscription PKR; text to speech Pakistan',
    target_url: '/plans/elevenlabs/',
    page_type: 'collection',
    competing_internal_urls:
      '/category/video/; /guides/compare-video-audio-ai-credits/; /blog/elevenlabs-voiceover-script-budget/',
    gsc_impressions: NOT_SUPPLIED,
    gsc_clicks: NOT_SUPPLIED,
    gsc_ctr: NOT_SUPPLIED,
    gsc_avg_position: NOT_SUPPLIED,
    current_ranking_url: 'not supplied',
    content_gap:
      '16 plans; voice has no hub of its own because it shares /category/video/. No voice query row was supplied, so demand is unproven.',
    recommended_title:
      'ElevenLabs price in Pakistan 2026: 16 plans | AiToolsPk',
    recommended_h1: 'ElevenLabs plans & prices in Pakistan (unchanged)',
    next_action:
      'No structural change. Export queries containing "voice", "tts" and "voiceover" before deciding whether a voice hub is justified.',
    evidence_source: 'built HTML; catalogue counts',
    approval_required: 'no change proposed',
  },
  {
    cluster: 'Design',
    primary_keyword: 'AI image generator plans Pakistan',
    secondary_intents:
      'Leonardo AI Pakistan; Canva Pro price Pakistan; Midjourney price Pakistan; AI design tools PKR',
    target_url: '/category/design/',
    page_type: 'category hub',
    competing_internal_urls:
      '/plans/canva/; /plans/leonardo/; /plans/adobe/; /plans/midjourney/; /guides/canva-pro-pakistan-buying-checklist/',
    gsc_impressions: NOT_SUPPLIED,
    gsc_clicks: NOT_SUPPLIED,
    gsc_ctr: NOT_SUPPLIED,
    gsc_avg_position: NOT_SUPPLIED,
    current_ranking_url: 'not supplied',
    content_gap:
      "The old title was 'Design in Pakistan | AiToolsPk' (30 chars): it named neither the tools nor the prices. The hub is the only page that could answer 'AI image generator plans Pakistan'.",
    recommended_title:
      'Design and branding tools in Pakistan: PKR prices | AiToolsPk',
    recommended_h1: 'Design tools, in PKR. (unchanged)',
    next_action:
      'Applied on this branch: title and description rewritten. The measured Adobe row below shows the collection pages, not the hub, are earning impressions, so expect relevance rather than clicks from this change.',
    evidence_source:
      'built HTML title and H1 measured before and after the change',
    approval_required: 'no - shipped in this branch, pending deploy approval',
  },
  {
    cluster: 'Design (Adobe, measured)',
    primary_keyword: 'Adobe Creative Cloud price Pakistan',
    secondary_intents:
      'Adobe subscription PKR; Adobe 1 year Pakistan; Adobe Creative Cloud plans',
    target_url: '/plans/adobe/',
    page_type: 'collection',
    competing_internal_urls:
      '/category/design/; /price-index/; /guides/creative-tool-licenses-client-work/',
    gsc_impressions: 16,
    gsc_clicks: 0,
    gsc_ctr: '0%',
    gsc_avg_position: 22.31,
    current_ranking_url: 'not supplied (Pages dimension withheld)',
    content_gap:
      'Average position 22.31 is page 3: the page is eligible but not competitive. Title and snippet already name brand, duration and price, so the gap is authority and internal anchors, not copy.',
    recommended_title: 'Adobe price in Pakistan 2026: 17 plans | AiToolsPk',
    recommended_h1: 'Adobe plans & prices in Pakistan (unchanged)',
    next_action:
      'No rewrite. Add contextual links from the creative-licensing guide and measure position after recrawl.',
    evidence_source: 'supplied Pages row; built HTML',
    approval_required: 'no (metadata unchanged)',
  },
  {
    cluster: 'Writing',
    primary_keyword: 'Grammarly Premium price Pakistan',
    secondary_intents:
      'QuillBot price Pakistan; grammar checker subscription Pakistan; AI writing tools PKR',
    target_url: '/plans/grammarly/',
    page_type: 'collection',
    competing_internal_urls:
      '/category/writing/; /plans/quillbot/; /price-index/',
    gsc_impressions: NOT_SUPPLIED,
    gsc_clicks: NOT_SUPPLIED,
    gsc_ctr: NOT_SUPPLIED,
    gsc_avg_position: NOT_SUPPLIED,
    current_ranking_url: 'not supplied',
    content_gap:
      "Thin cluster: 2 Grammarly plans and 1 QuillBot plan. The old hub title was 'Writing in Pakistan | AiToolsPk' (31 chars) and named neither grammar nor prices.",
    recommended_title: 'Writing and grammar tools with PKR prices | AiToolsPk',
    recommended_h1: 'Writing tools, in PKR. (unchanged)',
    next_action:
      'No collection-level change. The hub title was rewritten on this branch; do not add writing tools or articles until a query row shows demand.',
    evidence_source:
      'built HTML title measured before and after; catalogue counts',
    approval_required: 'no - shipped in this branch, pending deploy approval',
  },
  {
    cluster: 'Writing hub',
    primary_keyword: 'AI writing tools Pakistan',
    secondary_intents:
      'grammar checker subscription Pakistan; paraphrasing tool PKR; QuillBot price Pakistan',
    target_url: '/category/writing/',
    page_type: 'category hub',
    competing_internal_urls:
      '/plans/grammarly/; /plans/quillbot/; /price-index/',
    gsc_impressions: NOT_SUPPLIED,
    gsc_clicks: NOT_SUPPLIED,
    gsc_ctr: NOT_SUPPLIED,
    gsc_avg_position: NOT_SUPPLIED,
    current_ranking_url: 'not supplied',
    content_gap:
      "2 collections behind the hub: Grammarly and QuillBot. The old title was 'Writing in Pakistan | AiToolsPk' (31 chars) and named neither grammar nor prices, so the weakest hub on the site looked like a placeholder.",
    recommended_title: 'Writing and grammar tools with PKR prices | AiToolsPk',
    recommended_h1: 'Writing tools, in PKR.',
    next_action:
      'Applied on this branch: hub title and description rewritten. Two collections cannot support a second writing page, so the hub routes to them rather than expanding.',
    evidence_source:
      'built HTML title and H1 measured before and after; data/catalog.json grouping',
    approval_required: 'no - shipped in this branch, pending deploy approval',
  },
  {
    cluster: 'Developer',
    primary_keyword: 'AI coding tools Pakistan',
    secondary_intents:
      'Lovable Pro Pakistan; Replit Core Pakistan; Cursor price Pakistan; AI API credits Pakistan',
    target_url: '/category/coding/',
    page_type: 'category hub',
    competing_internal_urls:
      '/plans/api/; /plans/lovable/; /plans/replit/; /plans/cursor/; /guides/subscriptions-vs-api-credits/',
    gsc_impressions: NOT_SUPPLIED,
    gsc_clicks: NOT_SUPPLIED,
    gsc_ctr: NOT_SUPPLIED,
    gsc_avg_position: NOT_SUPPLIED,
    current_ranking_url: 'not supplied',
    content_gap:
      "'API price in Pakistan 2026: 122 plans' is one page for 122 mixed-brand credit packs, so brand-level API queries have no landing page. The old hub title was 'Coding in Pakistan | AiToolsPk' (30 chars) and said nothing about developer tooling.",
    recommended_title:
      'Coding and developer tools in Pakistan: PKR prices | AiToolsPk',
    recommended_h1: 'Coding tools, in PKR. (unchanged)',
    next_action:
      'Applied on this branch: hub title and description rewritten. A per-brand API split is deferred until credit terms are verified, because an unverified credit page is exactly the page this site must not publish.',
    evidence_source:
      'built HTML title measured before and after; data/catalog.json grouping',
    approval_required: 'no - shipped in this branch, pending deploy approval',
  },
  {
    cluster: 'AI chat',
    primary_keyword: 'AI chat subscriptions Pakistan',
    secondary_intents:
      'AI assistant price Pakistan; Claude plan Pakistan; Perplexity plan PKR',
    target_url: '/category/ai-chat/',
    page_type: 'category hub',
    competing_internal_urls:
      '/plans/chatgpt/; /plans/claude/; /plans/gemini/; /plans/perplexity/; /price-index/',
    gsc_impressions: NOT_SUPPLIED,
    gsc_clicks: NOT_SUPPLIED,
    gsc_ctr: NOT_SUPPLIED,
    gsc_avg_position: NOT_SUPPLIED,
    current_ranking_url: 'not supplied',
    content_gap:
      "9 collections behind the hub. The old title was 'AI Chat in Pakistan | AiToolsPk' (31 chars) and carried neither the word 'subscriptions' nor a currency.",
    recommended_title:
      'AI chat subscriptions in Pakistan: PKR price list | AiToolsPk',
    recommended_h1: 'AI chat tools, in PKR.',
    next_action:
      'Applied on this branch: title and description rewritten. Brand-level demand is answered better by the collection pages, so this hub routes rather than competes.',
    evidence_source:
      'built HTML title and H1 measured before and after; data/catalog.json grouping',
    approval_required: 'no - shipped in this branch, pending deploy approval',
  },
  {
    cluster: 'Productivity',
    primary_keyword: 'productivity tools Pakistan',
    secondary_intents:
      'Notion price Pakistan; online course subscription PKR; document tools Pakistan',
    target_url: '/category/productivity/',
    page_type: 'category hub',
    competing_internal_urls:
      '/plans/notion/; /plans/google/; /plans/coursera/; /price-index/',
    gsc_impressions: NOT_SUPPLIED,
    gsc_clicks: NOT_SUPPLIED,
    gsc_ctr: NOT_SUPPLIED,
    gsc_avg_position: NOT_SUPPLIED,
    current_ranking_url: 'not supplied',
    content_gap:
      "16 collections: documents, learning, meeting and social plans. The old title was 'Productivity in Pakistan | AiToolsPk' (32 chars) and gave no reason to prefer it over the home page.",
    recommended_title:
      'Productivity tools in Pakistan: PKR price list | AiToolsPk',
    recommended_h1: 'Productivity tools, in PKR.',
    next_action:
      'Applied on this branch: title and description rewritten. The mix is too broad to own one head term, so treat the hub as navigation and let the collections rank.',
    evidence_source:
      'built HTML title and H1 measured before and after; data/catalog.json grouping',
    approval_required: 'no - shipped in this branch, pending deploy approval',
  },
  {
    cluster: 'Security',
    primary_keyword: 'VPN price in Pakistan',
    secondary_intents:
      'NordVPN price Pakistan; Surfshark subscription PKR; antivirus price Pakistan',
    target_url: '/category/security/',
    page_type: 'category hub',
    competing_internal_urls:
      '/plans/nordvpn/; /plans/surfshark/; /plans/express/; /plans/kaspersky/; /price-index/',
    gsc_impressions: NOT_SUPPLIED,
    gsc_clicks: NOT_SUPPLIED,
    gsc_ctr: NOT_SUPPLIED,
    gsc_avg_position: NOT_SUPPLIED,
    current_ranking_url: 'not supplied',
    content_gap:
      "13 collections, almost all VPN brands plus one antivirus pack. The old title was 'Security in Pakistan | AiToolsPk' (30 chars) and named no product type.",
    recommended_title:
      'Privacy and security tools in Pakistan: PKR prices | AiToolsPk',
    recommended_h1: 'Security tools, in PKR.',
    next_action:
      'Applied on this branch: title and description rewritten. No brand row was supplied for this hub, so do not add trust or logging claims that the catalogue cannot verify.',
    evidence_source:
      'built HTML title and H1 measured before and after; data/catalog.json grouping',
    approval_required: 'no - shipped in this branch, pending deploy approval',
  },
  {
    cluster: 'Entertainment',
    primary_keyword: 'entertainment subscriptions Pakistan',
    secondary_intents:
      'streaming subscription PKR; Spotify price Pakistan; gaming subscription Pakistan',
    target_url: '/category/entertainment/',
    page_type: 'category hub',
    competing_internal_urls:
      '/plans/netflix/; /plans/spotify/; /plans/youtube/; /blog/streaming-plans-pakistan-netflix-prime-spotify/',
    gsc_impressions: NOT_SUPPLIED,
    gsc_clicks: NOT_SUPPLIED,
    gsc_ctr: NOT_SUPPLIED,
    gsc_avg_position: NOT_SUPPLIED,
    current_ranking_url: 'not supplied',
    content_gap:
      "15 collections across streaming, music, gaming and social plans. The old title was 'Entertainment in Pakistan | AiToolsPk' (33 chars) and named no product type.",
    recommended_title:
      'Entertainment subscriptions in Pakistan: PKR prices | AiToolsPk',
    recommended_h1: 'Entertainment tools, in PKR.',
    next_action:
      'Applied on this branch: title and description rewritten. Netflix is the only measured cluster in this hub (Q7); this page must not become a second Netflix landing page.',
    evidence_source:
      'built HTML title and H1 measured before and after; data/catalog.json grouping',
    approval_required: 'no - shipped in this branch, pending deploy approval',
  },
  {
    cluster: 'Software licences',
    primary_keyword: 'software licenses Pakistan',
    secondary_intents:
      'Microsoft 365 price Pakistan; Autodesk subscription PKR; TradingView plan Pakistan',
    target_url: '/category/software/',
    page_type: 'category hub',
    competing_internal_urls:
      '/plans/microsoft/; /plans/autodesk/; /plans/tradingview/; /plans/aws/; /price-index/',
    gsc_impressions: NOT_SUPPLIED,
    gsc_clicks: NOT_SUPPLIED,
    gsc_ctr: NOT_SUPPLIED,
    gsc_avg_position: NOT_SUPPLIED,
    current_ranking_url: 'not supplied',
    content_gap:
      "24 collections: the only hub that paginates. The old title was 'Software in Pakistan | AiToolsPk' (28 chars) and said nothing about licences or editions.",
    recommended_title:
      'Software licenses in Pakistan: prices and editions | AiToolsPk',
    recommended_h1: 'Software tools, in PKR.',
    next_action:
      'Applied on this branch: title and description rewritten; page 2 keeps the short paginated title so it stays inside the SERP cut. Licence scope stays unverified per collection.',
    evidence_source:
      'built HTML title and H1 measured before and after; data/catalog.json grouping',
    approval_required: 'no - shipped in this branch, pending deploy approval',
  },
  {
    cluster: 'Amazon selling',
    primary_keyword: 'Amazon FBA tools Pakistan',
    secondary_intents: 'Helium 10 price Pakistan; Amazon seller tools PKR',
    target_url: '/category/amazon-fba/',
    page_type: 'category hub',
    competing_internal_urls: '/plans/helium-10/; /price-index/',
    gsc_impressions: NOT_SUPPLIED,
    gsc_clicks: NOT_SUPPLIED,
    gsc_ctr: NOT_SUPPLIED,
    gsc_avg_position: NOT_SUPPLIED,
    current_ranking_url: 'not supplied',
    content_gap:
      "One collection (Helium 10). The old title was 'Amazon FBA & E-commerce Tools in Pakistan | AiToolsPk' (54 chars) and the H1 rendered 'Tools tools'.",
    recommended_title:
      'Amazon FBA tools in Pakistan: PKR price list | AiToolsPk',
    recommended_h1: 'Amazon FBA & e-commerce tools, in PKR.',
    next_action:
      'Applied on this branch: title rewritten and the doubled "tools" removed from the H1. Do not add e-commerce tools just to fill the hub.',
    evidence_source:
      'built HTML title and H1 measured before and after; data/catalog.json grouping',
    approval_required: 'no - shipped in this branch, pending deploy approval',
  },
  {
    cluster: 'AI image generation',
    primary_keyword: 'AI image generation plans Pakistan',
    secondary_intents:
      'Midjourney subscription PKR; AI art tool price Pakistan',
    target_url: '/category/ai-image-generation/',
    page_type: 'category hub',
    competing_internal_urls:
      '/plans/midjourney/; /category/design/; /price-index/',
    gsc_impressions: NOT_SUPPLIED,
    gsc_clicks: NOT_SUPPLIED,
    gsc_ctr: NOT_SUPPLIED,
    gsc_avg_position: NOT_SUPPLIED,
    current_ranking_url: 'not supplied',
    content_gap:
      "One collection (Midjourney), which overlaps /category/design/. The old title was 'AI Image Generation in Pakistan | AiToolsPk' (40 chars) and carried no price signal.",
    recommended_title:
      'AI image generation plans in Pakistan: PKR prices | AiToolsPk',
    recommended_h1: 'AI image generation tools, in PKR.',
    next_action:
      'Applied on this branch: title rewritten with the price signal. Decide later whether this hub or /category/design/ should own image generation; do not merge them without link data.',
    evidence_source:
      'built HTML title and H1 measured before and after; data/catalog.json grouping',
    approval_required: 'no - shipped in this branch, pending deploy approval',
  },
  {
    cluster: 'Creative resources',
    primary_keyword: 'stock media subscriptions Pakistan',
    secondary_intents:
      'Envato Elements PKR; template subscription Pakistan; stock video price Pakistan',
    target_url: '/category/creative-resources/',
    page_type: 'category hub',
    competing_internal_urls: '/plans/envato/; /category/design/; /price-index/',
    gsc_impressions: NOT_SUPPLIED,
    gsc_clicks: NOT_SUPPLIED,
    gsc_ctr: NOT_SUPPLIED,
    gsc_avg_position: NOT_SUPPLIED,
    current_ranking_url: 'not supplied',
    content_gap:
      "One collection (Envato Elements). The old title was 'Design & Creative Resources in Pakistan | AiToolsPk' (48 chars) and the H1 rendered 'Resources tools'.",
    recommended_title:
      'Stock media and templates: PKR prices in Pakistan | AiToolsPk',
    recommended_h1: 'Design & creative resources, in PKR.',
    next_action:
      'Applied on this branch: title rewritten and the clumsy H1 fixed. A one-collection hub is a routing page, not a content opportunity.',
    evidence_source:
      'built HTML title and H1 measured before and after; data/catalog.json grouping',
    approval_required: 'no - shipped in this branch, pending deploy approval',
  },
  {
    cluster: 'YouTube creator tools',
    primary_keyword: 'YouTube SEO tools Pakistan',
    secondary_intents: 'vidIQ price Pakistan; YouTube keyword tool PKR',
    target_url: '/category/youtube-seo/',
    page_type: 'category hub',
    competing_internal_urls: '/plans/vidiq/; /category/video/; /price-index/',
    gsc_impressions: NOT_SUPPLIED,
    gsc_clicks: NOT_SUPPLIED,
    gsc_ctr: NOT_SUPPLIED,
    gsc_avg_position: NOT_SUPPLIED,
    current_ranking_url: 'not supplied',
    content_gap:
      "One collection (vidIQ). The old title was 'YouTube SEO & Creator Tools in Pakistan | AiToolsPk' (53 chars) and the H1 rendered 'Tools tools'.",
    recommended_title:
      'YouTube SEO tools in Pakistan: PKR price list | AiToolsPk',
    recommended_h1: 'YouTube SEO & creator tools, in PKR.',
    next_action:
      'Applied on this branch: title rewritten and the doubled "tools" removed from the H1. No search-volume tool claims: the catalogue lists plans, not traffic guarantees.',
    evidence_source:
      'built HTML title and H1 measured before and after; data/catalog.json grouping',
    approval_required: 'no - shipped in this branch, pending deploy approval',
  },
  {
    cluster: 'Comparison',
    primary_keyword: 'ChatGPT vs Claude Pakistan',
    secondary_intents:
      'Gemini vs ChatGPT; ChatGPT vs Claude vs Gemini plans; which AI subscription Pakistan',
    target_url: '/guides/chatgpt-claude-gemini-plan-comparison-pakistan/',
    page_type: 'guide',
    competing_internal_urls:
      '/blog/chatgpt-vs-claude-plans-pakistan/; /blog/gemini-vs-chatgpt-research-pakistan/; /blog/canva-pro-vs-capcut-pro-pakistan/',
    gsc_impressions: NOT_SUPPLIED,
    gsc_clicks: NOT_SUPPLIED,
    gsc_ctr: NOT_SUPPLIED,
    gsc_avg_position: NOT_SUPPLIED,
    current_ranking_url: 'not supplied',
    content_gap:
      'Three comparison URLs overlap: the guide covers all three brands, the blog posts cover two-brand and research-workflow intent. No page declares which is primary for the head term.',
    recommended_title:
      'ChatGPT vs Claude vs Gemini Plans in Pakistan | AiToolsPk',
    recommended_h1: 'ChatGPT vs Claude vs Gemini Plans in Pakistan (unchanged)',
    next_action:
      'Make this guide the primary result for the head term; keep the two posts workflow-specific and link up to the guide where it reads naturally (guide already links down to all three collections).',
    evidence_source: 'built HTML; internal link graph measured',
    approval_required: 'no (linking only)',
  },
  {
    cluster: 'Buyer safety',
    primary_keyword: 'safe AI subscription seller Pakistan',
    secondary_intents:
      'shared vs private access; seller warranty meaning; how to verify an AI subscription seller',
    target_url: '/guides/choosing-ai-subscriptions-pakistan/',
    page_type: 'guide',
    competing_internal_urls:
      '/guides/private-shared-workspace-access/; /guides/seller-warranty-vs-vendor-warranty/; /blog/ai-subscription-seller-verify-pakistan/; /faq/',
    gsc_impressions: NOT_SUPPLIED,
    gsc_clicks: NOT_SUPPLIED,
    gsc_ctr: NOT_SUPPLIED,
    gsc_avg_position: NOT_SUPPLIED,
    current_ranking_url: 'not supplied',
    content_gap:
      'The two most specific safety guides link to no collection page (5 links each, all navigational), so they cannot pass a reader to a buying page.',
    recommended_title:
      'How to choose an AI subscription in Pakistan | AiToolsPk',
    recommended_h1: 'How to choose an AI subscription in Pakistan (unchanged)',
    next_action:
      'Owner decision: add one contextual collection link per safety guide. Not applied - an earlier instruction was not to force commercial links into guides.',
    evidence_source: 'built HTML link extraction',
    approval_required: 'yes - editorial change',
  },
  {
    cluster: 'Entertainment',
    primary_keyword: 'Netflix price in Pakistan',
    secondary_intents:
      'Netflix plan Pakistan; Netflix subscription PKR; streaming plans Pakistan',
    target_url: '/plans/netflix/',
    page_type: 'collection',
    competing_internal_urls:
      '/blog/streaming-plans-pakistan-netflix-prime-spotify/; /category/entertainment/; /plans/amazon-prime/; /plans/spotify/',
    gsc_impressions: 434,
    gsc_clicks: 1,
    gsc_ctr: '0.23%',
    gsc_avg_position: 11.44,
    current_ranking_url: 'not supplied (Pages dimension withheld)',
    content_gap:
      "62 Netflix queries, 378 impressions, 1 click. The snippet already leads with 'from PKR 400, typically PKR 758', so the snippet is not the gap; average position 11.44 is page 2.",
    recommended_title: 'Netflix price in Pakistan 2026: 5 plans | AiToolsPk',
    recommended_h1: 'Netflix plans & prices in Pakistan (unchanged)',
    next_action:
      'No snippet change. The lever is ranking: the streaming article already links here, and the 34 unsubmitted link targets in docs/OFFSITE_SUBMISSION_PACK.md are the other half.',
    evidence_source: 'supplied Pages row; built HTML title/description',
    approval_required: 'no change proposed',
  },
  {
    cluster: 'Entertainment (wink, measured)',
    primary_keyword: 'wink price Pakistan',
    secondary_intents: 'Wink video editor subscription PKR; Wink app plans',
    target_url: '/plans/wink/',
    page_type: 'collection',
    competing_internal_urls:
      '/category/entertainment/; /category/video/; /price-index/',
    gsc_impressions: 11,
    gsc_clicks: 2,
    gsc_ctr: '18.18%',
    gsc_avg_position: 7.27,
    current_ranking_url: 'not supplied (Pages dimension withheld)',
    content_gap:
      "Best CTR on the site (2 of 11) with the lowest volume. The title renders 'wink price in Pakistan 2026' in lower case because the catalogue brand string is lower case; that is a data-quality question, not a copy decision.",
    recommended_title: 'Wink price in Pakistan 2026: 4 plans | AiToolsPk',
    recommended_h1: 'wink plans & prices in Pakistan (unchanged)',
    next_action:
      'Confirm the official capitalisation with the seller before changing it: the site must not invent a brand spelling.',
    evidence_source: 'supplied Pages row; built HTML',
    approval_required: 'yes - brand casing needs a source',
  },
  {
    cluster: 'Buyer safety (FAQ, measured)',
    primary_keyword: 'AI subscription questions Pakistan',
    secondary_intents:
      'are these official subscriptions; what does seller warranty cover; how to order',
    target_url: '/faq/',
    page_type: 'FAQ',
    competing_internal_urls:
      '/guides/choosing-ai-subscriptions-pakistan/; /how-to-order/; /terms/; /contact/',
    gsc_impressions: 12,
    gsc_clicks: 0,
    gsc_ctr: '0%',
    gsc_avg_position: 11.42,
    current_ranking_url: 'not supplied (Pages dimension withheld)',
    content_gap:
      "The old title was 'Frequently asked questions | AiToolsPk' (38 chars) and named no topic, so a multi-question page competed with no query in particular.",
    recommended_title:
      'AI subscription FAQ: PKR prices, access, warranty | AiToolsPk',
    recommended_h1: 'The details, explained. (unchanged)',
    next_action:
      'Applied on this branch: title rewritten around the three things the page answers. The page answers real questions and should not be split into per-question pages without demand evidence.',
    evidence_source:
      'supplied Pages row; built HTML title measured before and after',
    approval_required: 'no - shipped in this branch, pending deploy approval',
  },
  {
    cluster: 'Hinglish price questions',
    primary_keyword: 'AI subscription kitne ka hai Pakistan',
    secondary_intents:
      'ChatGPT Plus kitne ka hai; sasti AI subscription Pakistan; bina credit card AI subscription',
    target_url: '/blog/chatgpt-plus-kitne-ka-hai-pakistan/',
    page_type: 'article',
    competing_internal_urls:
      '/blog/sasti-ai-subscription-pakistan/; /blog/bina-credit-card-ai-subscription-pakistan/; /blog/freelancer-monthly-ai-kharcha-pakistan/; /plans/chatgpt/; /price-index/',
    gsc_impressions: NOT_SUPPLIED,
    gsc_clicks: NOT_SUPPLIED,
    gsc_ctr: NOT_SUPPLIED,
    gsc_avg_position: NOT_SUPPLIED,
    current_ranking_url: 'not supplied',
    content_gap:
      "Eight Roman-Urdu articles already exist, but no query row containing 'kitne', 'sasti' or 'bina' was supplied, so demand is unproven. This article answers the ChatGPT variant, not the general phrase.",
    recommended_title: 'ChatGPT Plus kitne ka hai Pakistan mein? | AiToolsPk',
    recommended_h1: 'ChatGPT Plus kitne ka hai Pakistan mein? (unchanged)',
    next_action:
      'Export queries matching those tokens before commissioning more Hinglish articles; do not scale on assumption.',
    evidence_source: 'built HTML; supplied export contains no such rows',
    approval_required: 'no change proposed',
  },
];

/* ------------------------------------------------------------------ *
 * GSC_QUERY_INVESTIGATION.csv - section 6 of the brief.
 * ------------------------------------------------------------------ */
const scanSummary =
  '0 matches in 7,959 built/source files (out/, data/, src/, public/, scripts/); 0 across 188 sitemap URLs after stripping tags and scripts; 0 in raw HTML of the same URLs; 0 in git history; 0 in the ai-tools-pak clone (515 files); 0 in sampled aitoolspak.com pages';

const queryRows = [
  {
    row_id: 'Q1',
    query_group: 'Code-like identifiers (aggregate)',
    pattern_or_example: '^ai[0-9]+$',
    queries: 236,
    impressions: 884,
    clicks: 0,
    ctr: '0%',
    landing_page: 'unknown',
    landing_page_status:
      'Cannot be identified: the Pages dimension of the export was not supplied',
    source_and_rendered_evidence: scanSummary,
    root_cause:
      'Not emitted by this codebase. Catalogue identifiers are PK-[A-F0-9]{12}, never ai+digits. Consistent with (a) the domain hosting a different site before 19 October 2026 and (b) Google serving a loosely related page as a fallback for a query with almost no matching demand.',
    remediation:
      'No page was created for these strings (no intent to satisfy). Identifier-shaped text is now removed from every indexable page and blocked by check:export, so this site cannot leak one in future.',
    status: 'Diagnosed as not self-generated; landing page still open',
    closes_with:
      'Owner exports Pages.csv filtered to these queries, or URL Inspection on the candidate URLs',
  },
  {
    row_id: 'Q2',
    query_group: 'Code-like identifiers (example)',
    pattern_or_example: 'ai27538',
    queries: 'part of Q1',
    impressions: NOT_SUPPLIED,
    clicks: NOT_SUPPLIED,
    ctr: NOT_SUPPLIED,
    landing_page: 'unknown',
    landing_page_status: 'Example row only; counts and page not supplied',
    source_and_rendered_evidence: scanSummary,
    root_cause: 'Same as Q1',
    remediation: 'Same as Q1',
    status: 'Example logged for the record',
    closes_with: 'Same as Q1',
  },
  {
    row_id: 'Q3',
    query_group: 'Code-like identifiers (example)',
    pattern_or_example: 'ai54581',
    queries: 'part of Q1',
    impressions: NOT_SUPPLIED,
    clicks: NOT_SUPPLIED,
    ctr: NOT_SUPPLIED,
    landing_page: 'unknown',
    landing_page_status: 'Example row only; counts and page not supplied',
    source_and_rendered_evidence: scanSummary,
    root_cause: 'Same as Q1',
    remediation: 'Same as Q1',
    status: 'Example logged for the record',
    closes_with: 'Same as Q1',
  },
  {
    row_id: 'Q4',
    query_group: 'Code-like identifiers (example)',
    pattern_or_example: 'ai24130',
    queries: 'part of Q1',
    impressions: NOT_SUPPLIED,
    clicks: NOT_SUPPLIED,
    ctr: NOT_SUPPLIED,
    landing_page: 'unknown',
    landing_page_status: 'Example row only; counts and page not supplied',
    source_and_rendered_evidence: scanSummary,
    root_cause: 'Same as Q1',
    remediation: 'Same as Q1',
    status: 'Example logged for the record',
    closes_with: 'Same as Q1',
  },
  {
    row_id: 'Q5',
    query_group: 'Code-like identifiers (example)',
    pattern_or_example: 'ai38985',
    queries: 'part of Q1',
    impressions: NOT_SUPPLIED,
    clicks: NOT_SUPPLIED,
    ctr: NOT_SUPPLIED,
    landing_page: 'unknown',
    landing_page_status: 'Example row only; counts and page not supplied',
    source_and_rendered_evidence: scanSummary,
    root_cause: 'Same as Q1',
    remediation: 'Same as Q1',
    status: 'Example logged for the record',
    closes_with: 'Same as Q1',
  },
  {
    row_id: 'Q6',
    query_group: 'Code-like identifiers (example)',
    pattern_or_example: 'ai10750',
    queries: 'part of Q1',
    impressions: NOT_SUPPLIED,
    clicks: NOT_SUPPLIED,
    ctr: NOT_SUPPLIED,
    landing_page: 'unknown',
    landing_page_status: 'Example row only; counts and page not supplied',
    source_and_rendered_evidence: scanSummary,
    root_cause: 'Same as Q1',
    remediation: 'Same as Q1',
    status: 'Example logged for the record',
    closes_with: 'Same as Q1',
  },
  {
    row_id: 'Q7',
    query_group: 'Netflix price intent (aggregate)',
    pattern_or_example: 'netflix, netflix plan, netflix price pakistan',
    queries: 62,
    impressions: 378,
    clicks: 1,
    ctr: '0.26% (derived from the supplied rows)',
    landing_page: '/plans/netflix/',
    landing_page_status:
      'Probable, not proven: the page row is supplied (434 impressions, 1 click, 0.23%, position 11.44) but the query-to-page map is not',
    source_and_rendered_evidence:
      'Page exists, is canonical, is in the sitemap, and its title/description answer the price query with a from-PKR figure and a typical figure',
    root_cause:
      'The page is indexed and eligible but sits at average position 11.44 (page 2), so impressions are earned and clicks are not. The snippet is not the constraint: it already leads with the price answer.',
    remediation:
      'No snippet rewrite. The 10 November audit already replaced the pre-9-November title; recrawl is pending. Ranking levers are authority and internal anchors, not more copy.',
    status: 'Explained; no on-page defect found',
    closes_with:
      'Re-export after recrawl to confirm the new title is being read, and the offsite pack for authority',
  },
  {
    row_id: 'Q8',
    query_group: 'Netflix price intent (example)',
    pattern_or_example: 'netflix plan',
    queries: 'part of Q7',
    impressions: NOT_SUPPLIED,
    clicks: NOT_SUPPLIED,
    ctr: NOT_SUPPLIED,
    landing_page: '/plans/netflix/',
    landing_page_status:
      'Probable; the brief names this query as the one with impressions',
    source_and_rendered_evidence:
      'Title: "Netflix price in Pakistan 2026: 5 plans | AiToolsPk"; description names 1 month, from PKR 400 and typical PKR 758',
    root_cause: 'Same as Q7',
    remediation: 'Same as Q7',
    status: 'Example logged for the record',
    closes_with: 'Same as Q7',
  },
  {
    row_id: 'Q9',
    query_group: 'Everything else (residual)',
    pattern_or_example: 'not supplied',
    queries: NOT_SUPPLIED,
    impressions: 249,
    clicks: NOT_SUPPLIED,
    ctr: NOT_SUPPLIED,
    landing_page: 'not supplied',
    landing_page_status: 'Not supplied',
    source_and_rendered_evidence:
      'Balancing figure only: 1,511 chart impressions minus 884 (Q1) minus 378 (Q7); not a measured row',
    root_cause:
      'Unanalysable without the rows. The residual cannot be attributed to a query or a page.',
    remediation:
      'Do not act on this figure. Export the full Queries and Pages tables before the next round.',
    status: 'Open - blocked on the export',
    closes_with: 'Owner supplies Queries.csv (last 3 months)',
  },
];

/* ------------------------------------------------------------------ */

const csv = (rows) => {
  const header = Object.keys(rows[0]);
  const lines = rows.map((row) =>
    header
      .map((key) => {
        const value = String(row[key] ?? '');
        return /[",\n]/.test(value)
          ? `"${value.replaceAll('"', '""')}"`
          : value;
      })
      .join(',')
  );
  return [header.join(','), ...lines].join('\n') + '\n';
};

const errors = [];
const seenPrimary = new Set();
// Category hubs are the pages whose <title>/<h1> now live in src/lib/categories.ts,
// so the map records what the branch actually renders rather than a retyped copy.
const categoryByPath = new Map(
  categories.map((category) => [`/category/${category.slug}/`, category])
);
for (const row of keywordRows) {
  if (row.page_type === 'category hub') {
    const category = categoryByPath.get(row.target_url);
    if (!category) {
      errors.push(`category hub row has no category record: ${row.target_url}`);
    } else {
      row.recommended_title = `${category.title} | AiToolsPk`;
      row.recommended_h1 = category.h1;
    }
  }
  if (!sitemapPaths.has(row.target_url))
    errors.push(`target not in sitemap: ${row.target_url}`);
  if (row.recommended_title.length > 65)
    errors.push(
      `title ${row.recommended_title.length} chars: ${row.recommended_title}`
    );
  // The browser suite holds audited landing pages to 60 rendered characters,
  // which is stricter than the 65-character cut, so hubs must clear it too.
  if (row.page_type === 'category hub' && row.recommended_title.length > 60)
    errors.push(
      `hub title ${row.recommended_title.length} chars: ${row.recommended_title}`
    );
  if (seenPrimary.has(row.primary_keyword))
    errors.push(`duplicate primary keyword: ${row.primary_keyword}`);
  seenPrimary.add(row.primary_keyword);
  for (const url of row.competing_internal_urls.split(';').map((s) => s.trim()))
    if (!sitemapPaths.has(url) && !/^\d+ /.test(url))
      errors.push(`competing URL not in sitemap: ${url} (${row.cluster})`);
}

mkdirSync('reports', { recursive: true });
const keywordCsv = csv(keywordRows);
const queryCsv = csv(queryRows);
// A spreadsheet on Windows reads UTF-8 without a BOM as ANSI, so a typographic
// dash becomes mojibake in the cell. Keep these files plain ASCII instead.
for (const [name, body] of [
  ['SEO_KEYWORD_MAP.csv', keywordCsv],
  ['GSC_QUERY_INVESTIGATION.csv', queryCsv],
]) {
  const dirty = [...body].filter((char) => char.charCodeAt(0) > 126);
  if (dirty.length)
    errors.push(`${name}: ${dirty.length} non-ASCII characters`);
}
writeFileSync('reports/SEO_KEYWORD_MAP.csv', keywordCsv);
writeFileSync('reports/GSC_QUERY_INVESTIGATION.csv', queryCsv);

console.log({
  keywordRows: keywordRows.length,
  queryRows: queryRows.length,
  distinctClusters: new Set(keywordRows.map((r) => r.cluster)).size,
  measuredRows: keywordRows.filter((r) => typeof r.gsc_impressions === 'number')
    .length,
  errors,
});
if (errors.length) process.exit(1);
