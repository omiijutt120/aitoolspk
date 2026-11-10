import { JsonLd } from '@/lib/seo';
import { isPublishable, isoDuration, siteVideo } from '@/lib/site-video';

/**
 * The site's own explainer video, with the structured data that describes it.
 *
 * Renders nothing unless `site-video.ts` holds a complete record, so the page
 * never claims a video that does not exist. When it does render, the embed and
 * the VideoObject come from the same record: same id, same length, same date,
 * same description. The transcript sits in a disclosure so the page is readable
 * and searchable without playing the video.
 */
export function SiteVideo() {
  if (!isPublishable(siteVideo)) return null;

  return (
    <section
      className="container home-video"
      aria-labelledby="home-video-heading"
    >
      <div className="home-section-heading">
        <div>
          <p className="store-eyebrow">HOW THIS SITE WORKS</p>
          <h2 id="home-video-heading">{siteVideo.title}</h2>
          <p>{siteVideo.description}</p>
        </div>
      </div>
      <div className="home-video-frame">
        <iframe
          src={`https://www.youtube.com/embed/${siteVideo.id}`}
          title={siteVideo.title}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <details className="home-video-transcript">
        <summary>Read the transcript</summary>
        {siteVideo.transcript.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </details>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'VideoObject',
          name: siteVideo.title,
          description: siteVideo.description,
          uploadDate: siteVideo.uploadDate,
          duration: isoDuration(siteVideo.durationSeconds),
          embedUrl: `https://www.youtube.com/embed/${siteVideo.id}`,
          thumbnailUrl: `https://i.ytimg.com/vi/${siteVideo.id}/maxresdefault.jpg`,
        }}
      />
    </section>
  );
}
