const SUPABASE_API_KEY = 'sb_publishable_vZkQ0-GURH8AVI4N9NbsOQ_0XnIDyxS';
const SUPABASE_URL = 'https://frczbpiyxbqvdrsgyvih.supabase.co';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_API_KEY);

async function signUp(email, password, username) {
    const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {data: {username} }
     });

    if (error) throw error;
    return data;
}

async function signIn(email, password) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
    });

    if (error) throw error;
    return data;
}
async function signOut() {
    const { error } = await supabaseClient.auth.signOut();

    if (error) throw error;
}

const authForm = document.getElementById('authForm');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const authMessage = document.getElementById('authMessage');

function showAuthMessage(message, isError = false) {
    authMessage.textContent = message;
    authMessage.dataset.state = isError ? 'error' : 'success';
}

authForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    showAuthMessage('Signing in...');

    try {
        const data = await signIn(emailInput.value.trim(), passwordInput.value);
        showAuthMessage(`Signed in as ${data.user.email}.`);
    } catch (error) {
        showAuthMessage(error.message, true);
    }
});

document.getElementById('signUpButton').addEventListener('click', async () => {
    showAuthMessage('Creating account...');

    try {
        const data = await signUp(
            emailInput.value.trim(),
            passwordInput.value,
            usernameInput.value.trim()
        );
        showAuthMessage(data.session
            ? 'Account created and signed in.'
            : 'Account created. Check your email to confirm it before signing in.');
    } catch (error) {
        showAuthMessage(error.message, true);
    }
});

document.getElementById('signOutButton').addEventListener('click', async () => {
    try {
        await signOut();
        showAuthMessage('Signed out.');
    } catch (error) {
        showAuthMessage(error.message, true);
    }
});

