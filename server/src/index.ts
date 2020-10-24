import express from 'express';

const app = express(),
      port = 3000;

app.get('/', (_req, res) => {
   res.json({
      pong: new Date(),
   });
});

app.listen(port, () => {
   console.log(`Listening on port ${port}`);
});
