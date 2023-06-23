/** @type { import('@storybook/react').Preview } */

import "./plugins/fontawesome-free/css/all.min.css";
import "./plugins/icheck-bootstrap/icheck-bootstrap.min.css";
import "./plugins/jqvmap/jqvmap.min.css";
import "./plugins/overlayScrollbars/css/OverlayScrollbars.min.css";
import "./plugins/summernote/summernote-bs4.css";
import "./plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css";
import "./plugins/adminlte.min.css";

const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
