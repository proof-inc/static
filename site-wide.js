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
  localStorage.setItem('user_id', authResult.idTokenPayload.sub);

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
  localStorage.removeItem('user_id');
  if (onLogout && typeof onLogout === "function") {
    onLogout();
  }
}

function getUserId() {
  return localStorage.getItem('user_id');
}

function getUserIdHash() {
  return getUserId().hashCode();
}

function getEmail() {
  return localStorage.getItem('email');
}

function getName() {
  return localStorage.getItem('name');
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

// TODO: vervangen met veilige hash
String.prototype.hashCode = function(){
  var hash = 0;
  if (this.length == 0) return hash;
  for (i = 0; i < this.length; i++) {
    char = this.charCodeAt(i);
    hash = ((hash<<5)-hash)+char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}
