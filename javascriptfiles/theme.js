(function (global) {
  const SUPABASE_API_KEY = 'sb_publishable_vZkQ0-GURH8AVI4N9NbsOQ_0XnIDyxS';
  const SUPABASE_URL = 'https://frczbpiyxbqvdrsgyvih.supabase.co';
  const themeColumns = {
    light: 'light',
    dark: 'dark',
    'liquid-glass': 'glass',
    custom: 'custom'
  };
  const themes = Object.fromEntries(
    Object.keys(themeColumns).map(name => [name, false])
  );
  themes.light = true;

  function applyTheme(themeName) {
    if (!Object.hasOwn(themeColumns, themeName)) {
      console.warn(`Theme "${themeName}" is not recognized.`);
      return;
    }

    Object.keys(themes).forEach(name => {
      themes[name] = name === themeName;
    });
    document.documentElement.setAttribute('data-theme', themeName);
  }

  async function applyThemeFromSupabase() {
    const query = new URLSearchParams({
      select: 'light,dark,glass,custom',
      order: 'date.desc',
      limit: '1'
    });

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/theme_select?${query}`, {
        headers: {
          apikey: SUPABASE_API_KEY,
          Authorization: `Bearer ${SUPABASE_API_KEY}`
        }
      });

      if (!response.ok) {
        throw new Error(`Supabase returned ${response.status}: ${await response.text()}`);
      }

      const [row] = await response.json();
      const selectedTheme = Object.entries(themeColumns).find(
        ([, column]) => row?.[column] === true
      )?.[0];

      if (!selectedTheme) {
        console.warn('No selected theme found in Supabase. Defaulting to light mode.');
        applyTheme('light');
        return;
      }

      applyTheme(selectedTheme);
    } catch (error) {
      console.error('Error fetching theme data from Supabase:', error);
      applyTheme('light');
    }
  }

  global.applyTheme = applyTheme;
  global.themeManager = {
    setLightMode: () => applyTheme('light'),
    setDarkMode: () => applyTheme('dark'),
    setGlassMode: () => applyTheme('liquid-glass'),
    setCustomMode: () => applyTheme('custom'),
    setThemeByName: applyTheme,
    getCurrentModes: () => ({ ...themes })
  };

  applyThemeFromSupabase();
})(typeof window !== 'undefined' ? window : globalThis);
