const express = require("express");
const app = express();
const { exec, execSync } = require('child_process');
const port = process.env.SERVER_PORT || process.env.PORT || 3000;        
const NEZHA_SERVER = process.env.NEZHA_SERVER || '';     
const NEZHA_PORT = process.env.NEZHA_PORT || '';  
const NEZHA_KEY = process.env.NEZHA_KEY || '';
const ARGO_AUTH = process.env.ARGO_AUTH || 'eyJhIjoiZWQ1ZDBiOTEzZTQyYTEyNmJiZDI3OTY0Nzg4MjUzMzEiLCJ0IjoiMjJhYzJiMjEtODkzMC00MWQ1LWJmYTktNDc2NTYwZDkwMTgzIiwicyI6Ik4yVTJPV0ZsTjJJdE5qVmpZaTAwWlRjMUxXSTNOV010TTJFME56Sm1ZelEyTW1GaCJ9';


app.get("/", function(req, res) {
  res.send("Hello world!");
});


  let NEZHA_TLS = '';
  if (NEZHA_SERVER && NEZHA_PORT && NEZHA_KEY) {
    const tlsPorts = ['443', '8443', '2096', '2087', '2083', '2053'];
    if (tlsPorts.includes(NEZHA_PORT)) {
      NEZHA_TLS = '--tls';
    } else {
      NEZHA_TLS = '';
    }
  const command = `nohup ./swith -s ${NEZHA_SERVER}:${NEZHA_PORT} -p ${NEZHA_KEY} ${NEZHA_TLS} >/dev/null 2>&1 &`;
  try {
    exec(command);
    console.log('swith is running');

    setTimeout(() => {
      runWeb();
    }, 2000);
  } catch (error) {
    console.error(`swith running error: ${error}`);
  }
} else {
  console.log('NEZHA variable is empty, skip running');
  runWeb();
}

function runWeb() {
  const command1 = `nohup ./cat -c ./mouse.json >/dev/null 2>&1 &`;
  exec(command1, (error) => {
    if (error) {
      console.error(`web running error: ${error}`);
    } else {
      console.log('web is running');

      setTimeout(() => {
        runServer();
      }, 2000);
    }
  });
}


function runServer() {
  let command2 = '';
  if (ARGO_AUTH.match(/^[A-Z0-9a-z=]{120,250}$/)) {
    command2 = `nohup ./dog tunnel --edge-ip-version auto --no-autoupdate --protocol http2 run --token ${ARGO_AUTH} >/dev/null 2>&1 &`;
  } else {
    command2 = `nohup ./dog tunnel --edge-ip-version auto --config tunnel.yml run >/dev/null 2>&1 &`;
  }

  exec(command2, (error) => {
    if (error) {
      console.error(`server running error: ${error}`);
    } else {
      console.log('server is running');
    }
  });
}

app.listen(port, () => console.log(`App is listening on port ${port}!`));
