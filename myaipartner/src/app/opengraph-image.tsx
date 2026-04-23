import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = {
  width: 1200,
  height: 630
};
export const contentType = 'image/png';

const siteUrl = 'https://myaipartner.co.za';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background:
            'linear-gradient(140deg, rgba(3,18,27,1) 0%, rgba(7,35,48,1) 55%, rgba(6,78,98,1) 100%)',
          color: 'white',
          padding: '56px 64px',
          border: '2px solid rgba(34,211,238,0.35)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '62%' }}>
          <div
            style={{
              fontSize: 24,
              letterSpacing: 6,
              color: 'rgb(165,243,252)',
              marginBottom: 20
            }}
          >
            MY AI PARTNER
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.05,
              marginBottom: 20
            }}
          >
            Architects of Intelligence
          </div>
          <div style={{ fontSize: 30, color: 'rgb(224,242,254)', lineHeight: 1.3 }}>
            AI consulting, strategy, automation, and software delivery for modern businesses.
          </div>
        </div>
        <div
          style={{
            width: 360,
            height: 360,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid rgba(34,211,238,0.55)',
            background: 'rgba(3,18,27,0.45)',
            boxShadow: '0 0 45px rgba(34,211,238,0.35)'
          }}
        >
          <img
            src={`${siteUrl}/logo.jpg`}
            alt="My AI Partner logo"
            width={300}
            height={300}
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>
    ),
    {
      ...size
    }
  );
}
