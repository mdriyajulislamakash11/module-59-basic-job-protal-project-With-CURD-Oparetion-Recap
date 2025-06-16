const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express()

// madleware
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("wellcome Backend")
})

app.listen(port, () => {
    console.log(`Server site connented on prot: ${port} `)
});

