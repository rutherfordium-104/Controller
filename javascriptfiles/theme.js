(function (global) {
    const SUPABASE_API_KEY = 'sb_key_7L0QUjvbOrbfKT_Gs89g__MXAX9Oi';
    const SUPABASE_URL = 'https://frczbpiyxbqvdrsgyvih.supabase.co/rest/v1/';

    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_API_KEY);

  let themes = {
    light: true,
    dark: false,
    glass: false,
    custom: false
  };

  function applyThemeFromSupabase(themeName) {
    supabaseClient
      .from('theme_select')
      .select('*')
      .eq(themeName, true)
      .then(response => {
        if (response.error) {
          console.error(`Error fetching ${themeName} theme:`, response.error);
          return;
        }
        
        const themeData = response.data?.[0];
        if (themeData) {
          document.documentElement.style.setProperty('--background-color', themeData.background_color);
          document.documentElement.style.setProperty('--text-color', themeData.text_color);
          document.documentElement.style.setProperty('--primary-color', themeData.primary_color);
          
          document.documentElement.setAttribute('data-theme', themeName);
        }
      });
  }

  function activeMode(selectedTheme) {
    if (themes.hasOwnProperty(selectedTheme)) {
      Object.keys(themes).forEach(theme => {
        themes[theme] = (theme === selectedTheme);
      });
      applyThemeFromSupabase(selectedTheme);
    } else {
      console.warn(`Theme "${selectedTheme}" is not recognized.`);
    }
  }

  global.themeManager = {
    setLightMode: () => activeMode('light'),
    setDarkMode: () => activeMode('dark'),
    setGlassMode: () => activeMode('glass'),
    setCustomMode: () => activeMode('custom'),
    setThemeByName: (name) => activeMode(name),
    getCurrentModes: () => ({ ...themes }),
    getSupabaseConfig: () => ({ url: SUPABASE_URL, key: SUPABASE_API_KEY })
  };

  const startingTheme = Object.keys(themes).find(key => themes[key] === true) || 'light';
  applyThemeFromSupabase(startingTheme);

})(typeof window !== 'undefined' ? window : globalThis);
