  const express = require("express");
  let app = express();
  const pkg = require("express-blinker");
  app.use(
    pkg(__dirname, [
      {
        test: /.*/,
        etag: true,
        lastModified: false,
        cacheControl: true,
        expires: false,
        age: 600,
      },
    ])
  );
  app.listen(8893);