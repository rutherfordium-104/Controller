(function (global) {

    const SUPABASE_API_KEY = 'sb_publishable_vZkQ0-GURH8AVI4N9NbsOQ_0XnIDyxS';
    const SUPABASE_URL = 'https://frczbpiyxbqvdrsgyvih.supabase.co/rest/v1/';

    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_API_KEY);

  let themes = {
    light: true,
    dark: false,
    glass: false,
    custom: false
  };

  async function applyThemeFromSupabase() {
    const { data, error } = await supabaseClient
      .from('theme_select')
      .select('light, dark, glass, custom')
      .order('date', { ascending: false })
      .limit(1)
      .maybeSingle();

      if (error) {
        console.error('Error fetching theme data from Supabase:', error);
        return;
      }

      const selectedTheme = Object.keys(themes).find(
        name => data?.[name] === true
      );

    if (!selectedTheme) {
      console.warn('No theme data found in Supabase. Defaulting to light mode.');
      return;
    }

    Object.keys(themes).forEach(name => {
      themes[name] = (name === selectedTheme);
    });

    document.documentElement.setAttribute('data-theme', selectedTheme);
    
    const themeData = data?.[0];
    if (themeData) {
      document.documentElement.style.setProperty('--background-color', themeData.background_color);
      document.documentElement.style.setProperty('--text-color', themeData.text_color);
      document.documentElement.style.setProperty('--primary-color', themeData.primary_color);
          
          document.documentElement.setAttribute('data-theme', themeName);
        }
      };


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

}); (typeof window !== 'undefined' ? window : globalThis);
