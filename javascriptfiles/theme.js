(function (global) {
  const SUPABASE_API_KEY = 'sb_publishable_vZkQ0-GURH8AVI4N9NbsOQ_0XnIDyxS';
  const SUPABASE_URL = 'https://frczbpiyxbqvdrsgyvih.supabase.co';

  const themes = {
    light: true,
    dark: false,
    custom: false,
    glass: false
  }

  async function grabTheme() {
    const { data, error } = await supabaseClient
      .schema('public')
      .from('theme_select')
      .select('*')

    if (error) {
      console.error('Error fetching theme:', error.message);
      return;
    }


  const recorded = {
    light: theme_selectRows[3],
    dark: theme_selectRows[4],
    glass: theme_selectRows[5],
    custom: theme_selectRows[6]
  }
}

  async function applyTheme() {
    if (recorded.light && recorded.light.is_active === true) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    if (recorded.dark && recorded.light.is_active === true) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    if (recorded.glass && recorded.glass.is_active === true) {
      document.documentElement.setAttribute('data-theme', 'glass');
    }
    if (recorded.custom && recorded.custom.is_active === true) {
      document.documentElement.setAttribute('data-theme', 'custom');
    }
  }
})
