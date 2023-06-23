import express from 'express';

const app =  express();
//port 8080 is an internal keycloak port
const base ="/realms/fullcycle/protocol/openid-connect";
const externalPort = `http://localhost:8024${base}`;
const internalPort = `http://keycloak:8080${base}`;

app.get('/',(req,res) => {
    console.log("initiate login ..")
    res.send("Hi there !!!");
});

app.get('/login',(req,res) => {
    console.log("initiate login ..")
    const params = new URLSearchParams({
        client_id: "fullcycle-code-flow",
        redirect_uri: "http://192.168.2.136:3000/callback",
        response_type: "code",
        scope: "openid"
    });

    const url = `${externalPort}/auth?${params.toString()}`;
    console.log("Auth Server: "+url);
    res.redirect(url);
});

app.get('/callback',async (req,res) => {
    console.log("callback req.auth.code: "+ req.query.code as string);
    const params = new URLSearchParams({
        client_id: "fullcycle-code-flow",
        redirect_uri: "http://192.168.2.136:3000/callback",
        grant_type: 'authorization_code',
        code: req.query.code as string
    });

    const url = `${internalPort}/token?${params.toString()}`;

    const resp = await fetch(url,{
        method: "POST",
        headers: {"Content-Type":"application/x-www-form-urlencoded"},
        body: params.toString()
    });

    const result = await resp.json();
    console.log(result)

    res.json(result);
});

app.listen(3000, () => {
    console.log('listening on port 3000')
});
