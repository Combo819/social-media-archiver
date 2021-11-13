import 'nextra-theme-docs/style.css';
import Prism from 'prism-react-renderer/prism'
(typeof global !== "undefined" ? global : window).Prism = Prism
export default function Nextra({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
