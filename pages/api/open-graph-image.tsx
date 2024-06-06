/* eslint-disable @next/next/no-img-element */
import { Resvg } from '@resvg/resvg-js';
import { getAbsoluteURL } from 'lib/router-utils';
import theme from 'lib/theme';
import { NextApiRequest, NextApiResponse } from 'next';
import satori from 'satori';
import { siteConfig } from 'site.config';

const style = (style: React.CSSProperties) => style;

const stack = (style: React.CSSProperties = {}): React.CSSProperties => ({
  gap: '8px',
  flexDirection: 'column',
  alignItems: 'flex-start',
  ...style,
  display: 'flex',
});

const isString = (value: unknown): value is string => typeof value === 'string';

const styles = {
  container: style({
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    padding: '72px',
    color: theme.colors.cyan[200],
    width: 1200,
    height: 630,
    justifyContent: 'space-between',
  }),
  topContainer: style({
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  }),
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { title, date, readingTime, tags } = req.query;

  const computedTags = isString(tags) ? tags.split(',') : [];
  const hasTags = computedTags.length > 0;

  const inter = await fetch('https://api.fontsource.org/v1/fonts/inter/latin-600-normal.ttf').then(
    (res) => res.arrayBuffer(),
  );

  const svg = await satori(
    <div style={styles.container}>
      <div style={styles.topContainer}>
        <div style={stack()}>
          {date && readingTime && (
            <p style={{ fontSize: theme.fontSizes['2xl'], fontWeight: 'bold' }}>
              {date} — {readingTime}
            </p>
          )}
        </div>

        <div style={stack({ gap: '12px' })}>
          <h1
            style={{
              color: theme.colors.cyan[600],
              fontSize: hasTags ? '80px' : '90px',
              lineHeight: hasTags ? '112px' : '126px',

              minHeight: hasTags ? '112px' : '126px',
              maxHeight: hasTags ? '224px' : '252px',

              overflow: 'hidden',
              wordWrap: 'break-word',
            }}
          >
            {title}
          </h1>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {computedTags.map((tag) => (
              <div key={tag} style={{ opacity: 0.8, display: 'flex', fontSize: '20px' }}>
                <span style={{ color: theme.colors.cyan[600] }}>#</span>
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={style({
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          paddingLeft: '12px',
          marginTop: '64px',
        })}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            border: '4px solid',
            borderColor: theme.colors.cyan[600],
            overflow: 'hidden',
          }}
        >
          <img
            alt={`${siteConfig.name} (${siteConfig.nickname})`}
            src={getAbsoluteURL('/static/images/vanenshi-headshot.jpeg')}
            width={50}
            height={50}
            style={{ objectFit: 'contain', borderRadius: '50%' }}
          />
        </div>
        <p style={{ fontSize: '20px' }}>Written by {siteConfig.name}</p>
      </div>

      <div
        style={{
          color: 'black',
          position: 'absolute',
          bottom: '0px',
          right: '0',
          borderTopLeftRadius: '20px',
          fontWeight: 'semibold',
          fontSize: '24px',
          background: theme.colors.cyan[600],
          padding: '8px 16px',
        }}
      >
        {siteConfig.siteUrl}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: inter,
          weight: 400,
          style: 'normal',
        },
      ],
    },
  );

  const resvg = new Resvg(svg, {
    background: theme.colors.neutral[900],
    fitTo: {
      mode: 'width',
      value: 2400,
    },
  });

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  res.setHeader('Cache-Control', 's-maxage=31536000, stale-while-revalidate');
  res.setHeader('Content-Type', 'image/png');
  res.status(200).end(pngBuffer);
}
