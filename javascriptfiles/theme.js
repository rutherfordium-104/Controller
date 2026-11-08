(function (global) {
  const SUPABASE_API_KEY = 'sb_publishable_vZkQ0-GURH8AVI4N9NbsOQ_0XnIDyxS';
  const SUPABASE_URL = 'https://frczbpiyxbqvdrsgyvih.supabase.co';
  const supabaseClient = global.supabase.createClient(SUPABASE_URL, SUPABASE_API_KEY);
  const themes = new Set(['light', 'dark', 'liquid-glass', 'custom']);
  const storageKey = 'selectedTheme';

  global.supabaseClient = supabaseClient;

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    global.localStorage.setItem(storageKey, theme);
  }

  async function saveTheme(theme) {
    const { data: { session }, error: userError } = await supabaseClient.auth.getSession();
    if (userError) {
      console.error('Error checking signed-in user:', userError.message);
      return;
    }
    if (!session?.user) return;

    const { error } = await supabaseClient
      .from('theme_select')
      .upsert({ user_id: session.user.id, theme }, { onConflict: 'user_id' });

    if (error) console.error('Error saving theme:', error.message);
  }

  async function loadTheme(userId) {
    const { data, error } = await supabaseClient
      .from('theme_select')
      .select('theme')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error loading theme:', error.message);
      return;
    }

    if (data && themes.has(data.theme)) {
      setTheme(data.theme);
      return;
    }

    const savedTheme = global.localStorage.getItem(storageKey);
    const theme = themes.has(savedTheme) ? savedTheme : 'light';
    const { error: saveError } = await supabaseClient
      .from('theme_select')
      .upsert({ user_id: userId, theme }, { onConflict: 'user_id' });

    if (saveError) {
      console.error('Error creating theme preference:', saveError.message);
      return;
    }

    setTheme(theme);
  }

  function applyTheme(theme) {
    if (!themes.has(theme)) return;

    setTheme(theme);
    void saveTheme(theme);
  }

  global.applyTheme = applyTheme;

  const savedTheme = global.localStorage.getItem(storageKey);
  if (themes.has(savedTheme)) {
    setTheme(savedTheme);
  } else {
    setTheme('light');
  }

  supabaseClient.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error('Error checking session:', error.message);
      return;
    }
    if (data.session?.user) void loadTheme(data.session.user.id);
  });

  supabaseClient.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      global.setTimeout(() => void loadTheme(session.user.id), 0);
    }
  });
})(window);
