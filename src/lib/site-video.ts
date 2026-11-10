/**
 * The site's own explainer video, when one exists.
 *
 * Left `null` on purpose. Nothing renders from this file until a real video is
 * uploaded to a platform that serves an embeddable player, and every field below
 * describes that video as it actually is: the length is the real length, the
 * upload date is the real one, and the transcript is what the speakers say.
 *
 * The rule this protects: a VideoObject is a claim that a video exists on the
 * page, with a thumbnail, a duration and a date. Marking up a video that is not
 * there — or embedding someone else's product video to look as though the site
 * publishes video — would be a false claim, and search engines treat invented
 * video markup as spam. So the homepage section and its structured data appear
 * only when this record is filled in, and they describe exactly this video.
 *
 * To publish one: upload the recording, then replace `null` with the record.
 *
 * @example
 * export const siteVideo: SiteVideo | null = {
 *   id: 'dQw4w9WgXcQ',                 // the 11-character YouTube video id
 *   title: 'How the AiToolsPk price index works',
 *   description: 'A one-minute walkthrough of how seller quotes are captured, dated and checked.',
 *   uploadDate: '2026-11-15',          // the real upload date, ISO 8601
 *   durationSeconds: 68,               // the real running time
 *   transcript: [                      // what is actually said, line by line
 *     'Every price on this site is a seller quote, not a vendor list price.',
 *   ],
 * };
 */
export type SiteVideo = {
  /** The platform's video id; YouTube ids are 11 characters. */
  id: string;
  title: string;
  description: string;
  /** Real upload date, `YYYY-MM-DD`. */
  uploadDate: string;
  /** Real running time, in seconds. */
  durationSeconds: number;
  /** What the speakers actually say, so the page carries the words too. */
  transcript: string[];
};

export const siteVideo: SiteVideo | null = null;

/** ISO 8601 duration for VideoObject, e.g. 68 seconds → "PT1M8S". */
export function isoDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `PT${m ? `${m}M` : ''}${s ? `${s}S` : m ? '' : '0S'}`;
}

/** Is the record complete enough to describe a video truthfully? */
export function isPublishable(video: SiteVideo | null): video is SiteVideo {
  return Boolean(
    video &&
      /^[A-Za-z0-9_-]{11}$/.test(video.id) &&
      video.title.trim() &&
      video.description.trim() &&
      /^\d{4}-\d{2}-\d{2}$/.test(video.uploadDate) &&
      Number.isInteger(video.durationSeconds) &&
      video.durationSeconds > 0 &&
      video.transcript.some((line) => line.trim())
  );
}
