export default function App({ Component, pageProps }) {
  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          background-color: #f5f5f3;
          color: #2c2c2a;
          line-height: 1.6;
        }
        
        html {
          color-scheme: light;
        }
        
        @media (prefers-color-scheme: dark) {
          html {
            color-scheme: dark;
          }
          body {
            background-color: #1a1a19;
            color: #f5f5f3;
          }
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
