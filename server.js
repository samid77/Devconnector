const express = require('express');
const app = express();

const port = process.env.PORT || 8008;
app.listen(port, () => {
    console.log(`Server started at port ${port}...`);
})
