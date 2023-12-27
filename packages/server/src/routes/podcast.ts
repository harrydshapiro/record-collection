import { Router } from "express";

export const podcastRouter = Router();

podcastRouter.use("*", (req, res) => {
  res.set("Content-Type", "application/rss+xml");
  res.send(`<rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:sy="http://purl.org/rss/1.0/modules/syndication/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:podcast="https://podcastindex.org/namespace/1.0" version="2.0">
  <channel>
  <atom:link rel="self" type="application/atom+xml" href="https://subscribers.transistor.fm/f683ac20700d03" title="MP3 Audio"/>
  <title>song.haus</title>
  <generator>Transistor (https://transistor.fm)</generator>
  <description>songhausmates kiki</description>
  <copyright>© 2023 song.haus</copyright>
  <podcast:locked owner="team@song.haus">no</podcast:locked>
  <language>en</language>
  <pubDate>Wed, 27 Dec 2023 09:38:38 -0500</pubDate>
  <lastBuildDate>Wed, 27 Dec 2023 09:42:04 -0500</lastBuildDate>
  <link>https://song.haus</link>
  <image>
  <url>https://images.transistor.fm/file/transistor/images/show/48066/full_1703687902-artwork.jpg</url>
  <title>song.haus</title>
  <link>https://song.haus</link>
  </image>
  <itunes:type>episodic</itunes:type>
  <itunes:author>song.haus</itunes:author>
  <itunes:image href="https://images.transistor.fm/file/transistor/images/show/48066/full_1703687902-artwork.jpg"/>
  <itunes:summary>songhausmates kiki</itunes:summary>
  <itunes:subtitle>songhausmates kiki.</itunes:subtitle>
  <itunes:keywords/>
  <itunes:owner>
  <itunes:name>Harry Shapiro</itunes:name>
  </itunes:owner>
  <itunes:complete>No</itunes:complete>
  <itunes:explicit>No</itunes:explicit>
  <itunes:block>Yes</itunes:block>
  <podcast:block>yes</podcast:block>
  <item>
  <title>Songhaus Unwrapped</title>
  <itunes:episode>1</itunes:episode>
  <podcast:episode>1</podcast:episode>
  <itunes:title>Songhaus Unwrapped</itunes:title>
  <itunes:episodeType>full</itunes:episodeType>
  <itunes:block>Yes</itunes:block>
  <guid isPermaLink="false">ff1cf746-d829-460d-bdc2-53f16ec09d79</guid>
  <description>
  <![CDATA[ <p>After Spotify wrapped up song.hausmates' top songs in 2023, it was time to unwrap the stories behind them. </p><p>We found our songs through friends and algorithms. They conjured emotions we yearned for and reflected those we were saddled with. The artists represented range from Mazzy Star to Fred Again, their popularity from "I'm not sure how I even found them" to "I literally cannot escape them," and their Blake Shelton-ness from "they are not Blake Shelton" to "they are Blake Shelton."</p><p>On a serious note... it was a joy to listen to all you gush about what you love in your music. Thank you so much to all who submitted. We hope y'all enjoy!</p><p>- the song.haus team (aka Harry &amp; Sarah)</p> ]]>
  </description>
  <content:encoded>
  <![CDATA[ <p>After Spotify wrapped up song.hausmates' top songs in 2023, it was time to unwrap the stories behind them. </p><p>We found our songs through friends and algorithms. They conjured emotions we yearned for and reflected those we were saddled with. The artists represented range from Mazzy Star to Fred Again, their popularity from "I'm not sure how I even found them" to "I literally cannot escape them," and their Blake Shelton-ness from "they are not Blake Shelton" to "they are Blake Shelton."</p><p>On a serious note... it was a joy to listen to all you gush about what you love in your music. Thank you so much to all who submitted. We hope y'all enjoy!</p><p>- the song.haus team (aka Harry &amp; Sarah)</p> ]]>
  </content:encoded>
  <pubDate>Wed, 27 Dec 2023 09:38:38 -0500</pubDate>
  <author>song.haus</author>
  <enclosure url="https://media.transistor.fm/a8602932/6c6ae10c.mp3?sid=f683ac20700d03" length="32273182" type="audio/mpeg"/>
  <itunes:author>song.haus</itunes:author>
  <itunes:duration>1009</itunes:duration>
  <itunes:summary>
  <![CDATA[ <p>After Spotify wrapped up song.hausmates' top songs in 2023, it was time to unwrap the stories behind them. </p><p>We found our songs through friends and algorithms. They conjured emotions we yearned for and reflected those we were saddled with. The artists represented range from Mazzy Star to Fred Again, their popularity from "I'm not sure how I even found them" to "I literally cannot escape them," and their Blake Shelton-ness from "they are not Blake Shelton" to "they are Blake Shelton."</p><p>On a serious note... it was a joy to listen to all you gush about what you love in your music. Thank you so much to all who submitted. We hope y'all enjoy!</p><p>- the song.haus team (aka Harry &amp; Sarah)</p> ]]>
  </itunes:summary>
  <itunes:keywords/>
  <itunes:explicit>No</itunes:explicit>
  </item>
  </channel>
  </rss>`);
});
