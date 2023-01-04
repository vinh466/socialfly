import envVars from "./declarations/config/envVars";
import server from "./server";


server.listen(envVars.port, () => {
    console.log('Server started on port', envVars.port);
});