var webAuth = new auth0.WebAuth({
  domain: AUTH0_DOMAIN,
  clientID: AUTH0_CLIENT_ID,
  redirectUri: AUTH0_CALLBACK_URL,
  audience: 'https://' + AUTH0_DOMAIN + '/userinfo',
  responseType: 'token id_token',
  scope: 'openid email profile'
});

function setSession(authResult) {
  // Set the time that the Access Token will expire at
  var expiresAt = JSON.stringify(
    authResult.expiresIn * 1000 + new Date().getTime()
  );
  localStorage.setItem('access_token', authResult.accessToken);
  localStorage.setItem('id_token', authResult.idToken);
  localStorage.setItem('expires_at', expiresAt);
  localStorage.setItem('email', authResult.idTokenPayload.email);
  localStorage.setItem('name', authResult.idTokenPayload.name);
  localStorage.setItem('locale', authResult.idTokenPayload.locale);
  localStorage.setItem('picture', authResult.idTokenPayload.picture);

  console.log(authResult.idTokenPayload);
}

function login() {
	webAuth.authorize();
}

function logoutAndPrompt() {
  logout(login);
}

function logout(onLogout) {
  // Remove tokens and expiry time from localStorage
  localStorage.removeItem('access_token');
  localStorage.removeItem('id_token');
  localStorage.removeItem('expires_at');
  if (onLogout && typeof onLogout === "function") {
    onLogout();
  }
}

function isAuthenticated() {
  // Check whether the current time is past the
  // Access Token's expiry time
  var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
  return new Date().getTime() < expiresAt;
}

function toDashboard() {
	location.href = '/dashboard/overview';
}

function toHome() {
	location.href = '/';
}

function handleAuthentication(onFail, onSuccess) {
  webAuth.parseHash(function(err, authResult) {
    if (authResult && authResult.accessToken && authResult.idToken) {
      window.location.hash = '';
      setSession(authResult);
    }
    else if (err) {
      console.error("Error trying to log in! (" + err + ")");
    }

    if (isAuthenticated()) {
      if (onSuccess && typeof onSuccess === "function")
    	  onSuccess();
    }
    else if (onFail && typeof onFail === "function") {
    	onFail();
    }
  });
}
