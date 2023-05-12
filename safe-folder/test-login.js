const sendLogin = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const payload = {
    email: email,
    password: password,
  };

  try {
    const response = await fetch("http://localhost:8080/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      if (response.status === 401) {
        return await sendRefreshToken();
      }
      throw new Error(`${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (err) {
    console.log(err.stack);
    displayErr();
  }
};

function sendRefreshToken() {}
function displayErr() {}
