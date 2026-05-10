import { app } from "./app"

import { PORT } from "./config/config.js"

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})



