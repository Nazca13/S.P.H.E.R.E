/* ==========================================================================
   S.P.H.E.R.E — ENTITY NETWORK GRAPH DATA
   Influencers, Platforms, and Intent/Concept Nodes
   ========================================================================== */

const rawNodes = [
    // ── Influencers & Persons ──
    { id: 'arief', name: 'Arief Muhammad', type: 'person', category: 'Macro Influencer', color: '#ec4899', radius: 24,
      platforms: { linkedin: true, tiktok: true, instagram: true, x: true, youtube: true },
      influence: '98 / 100', followers: '12.4M',
      bio: 'Entrepreneur & Tech Enthusiast with multi-channel coverage across all major platforms. Core brand ambassador and high-velocity virality node.' },

    { id: 'tirta', name: 'Dr. Tirta', type: 'person', category: 'Thought Leader & KOL', color: '#a855f7', radius: 22,
      platforms: { linkedin: true, tiktok: true, instagram: true, x: true, youtube: false },
      influence: '89 / 100', followers: '6.8M',
      bio: 'Health & Business Analyst with strong presence on X and TikTok. Known for viral commentary on brand controversies.' },

    { id: 'folkative', name: 'Folkative', type: 'person', category: 'Media Portal', color: '#ec4899', radius: 22,
      platforms: { linkedin: false, tiktok: true, instagram: true, x: true, youtube: false },
      influence: '94 / 100', followers: '9.1M',
      bio: 'Gen-Z Trending News & Pop Culture Media Channel. Highest engagement rate in the youth demographic.' },

    { id: 'gadgetin', name: 'GadgetIn (David)', type: 'person', category: 'Tech Reviewer', color: '#3b82f6', radius: 24,
      platforms: { linkedin: true, tiktok: true, instagram: true, x: false, youtube: true },
      influence: '91 / 100', followers: '17.2M',
      bio: 'Top Indonesian Hardware & Smartphone Tech Reviewer. Dominant in YouTube long-form reviews and most influential in tech segment.' },

    { id: 'raditya', name: 'Raditya Dika', type: 'person', category: 'Creator & Finance', color: '#a855f7', radius: 20,
      platforms: { linkedin: false, tiktok: true, instagram: true, x: true, youtube: true },
      influence: '82 / 100', followers: '8.5M',
      bio: 'Comedian, Director & Personal Finance Advocate.' },

    { id: 'jerome', name: 'Jerome Polin', type: 'person', category: 'Edu & Lifestyle', color: '#8b5cf6', radius: 20,
      platforms: { linkedin: true, tiktok: true, instagram: true, x: true, youtube: true },
      influence: '80 / 100', followers: '7.9M',
      bio: 'Education Advocate & Math Content Creator with a highly engaged youth audience.' },

    { id: 'jess', name: 'Jess No Limit', type: 'person', category: 'Gaming & Lifestyle', color: '#f59e0b', radius: 21,
      platforms: { linkedin: false, tiktok: true, instagram: true, x: false, youtube: true },
      influence: '85 / 100', followers: '19.8M',
      bio: 'Esports personality and gaming content creator. Dominant among Gen-Z gaming segment.' },

    { id: 'user_complaint', name: '@techreviewer_id', type: 'person', category: 'Critic / User', color: '#f43f5e', radius: 15,
      platforms: { linkedin: false, tiktok: false, instagram: false, x: true, youtube: false },
      influence: '44 / 100', followers: '82K',
      bio: 'Author of viral battery drain & performance complaint thread. Crisis signal origin node.' },

    // ── Social Platform Nodes ──
    { id: 'plat_linkedin',  name: 'LinkedIn',    type: 'platform', category: 'Professional Network', color: '#0a66c2', radius: 20 },
    { id: 'plat_tiktok',   name: 'TikTok',      type: 'platform', category: 'Short-Form Video',     color: '#69c9d0', radius: 20 },
    { id: 'plat_instagram', name: 'Instagram',  type: 'platform', category: 'Visual & Reels',        color: '#e1306c', radius: 20 },
    { id: 'plat_x',        name: 'X (Twitter)', type: 'platform', category: 'Microblogging',         color: '#c0c8d8', radius: 20 },
    { id: 'plat_youtube',  name: 'YouTube',      type: 'platform', category: 'Long-Form Video',      color: '#ff0000', radius: 20 },

    // ── Topic & Intent Knowledge Nodes ──
    { id: 'c_dopamine_pavlov', name: 'Viral Conditioning Loop', type: 'topic', category: 'Virality Psychology', color: '#ec4899', radius: 26,
      bio: 'Dopamine-mediated Pavlovian loop driving compulsive content engagement.' },
    { id: 'c_nucleus',       name: 'Nucleus Accumbens',       type: 'topic', category: 'Neuro Trigger',     color: '#a855f7', radius: 18 },
    { id: 'c_motivation',    name: 'Purchase Motivation',     type: 'topic', category: 'User Intent',       color: '#a855f7', radius: 16 },
    { id: 'c_implicit_mem',  name: 'Brand Memory Encoding',  type: 'topic', category: 'Memory Model',      color: '#8b5cf6', radius: 20 },
    { id: 'c_dopamine',      name: 'Dopamine Response',       type: 'topic', category: 'Neuro Engagement',  color: '#a855f7', radius: 22 },
    { id: 'c_operant',       name: 'Operant Conditioning',    type: 'topic', category: 'Behavior Strategy', color: '#8b5cf6', radius: 24 },
    { id: 'c_neutral_stimuli', name: 'Pavlovian Brand Signal', type: 'topic', category: 'Ad Learning',     color: '#f59e0b', radius: 22 },
    { id: 'c_explicit_mem',  name: 'Brand Awareness',         type: 'topic', category: 'Brand Recall',     color: '#10b981', radius: 18 },
    { id: 'c_implicit_vital', name: 'Implicit Brand Learning', type: 'topic', category: 'Retention',       color: '#10b981', radius: 20 },
    { id: 'c_subconscious_mem', name: 'Subconscious Ad Recall', type: 'topic', category: 'Ad Impulse',   color: '#10b981', radius: 20 },
    { id: 'c_learn_seq',     name: 'Habit Formation',         type: 'topic', category: 'UX Habit',         color: '#10b981', radius: 16 },
    { id: 'c_prototypes',    name: 'Role Model Effect',        type: 'topic', category: 'KOL Effect',       color: '#10b981', radius: 22 },
    { id: 'c_modelling',     name: 'Influencer Modelling',    type: 'topic', category: 'Influencer Impact', color: '#10b981', radius: 22 },
    { id: 'c_nonverbal',     name: 'Nonverbal Cues',          type: 'topic', category: 'Video Signals',    color: '#a855f7', radius: 14 },
    { id: 'c_mirror',        name: 'Mirror Neurons',          type: 'topic', category: 'Social Empathy',   color: '#a855f7', radius: 14 },
    { id: 'c_explicit_base', name: 'Explicit Memory',         type: 'topic', category: 'Brand Recall',     color: '#a855f7', radius: 14 },

    // ── Brand Node ──
    { id: 'brand_x', name: 'BrandX', type: 'topic', category: 'Monitored Brand', color: '#06b6d4', radius: 28,
      bio: 'Primary monitored brand entity. Central hub for all sentiment and mention flows.' },
];

const rawLinks = [
    // BrandX central connections
    { source: 'brand_x', target: 'plat_x' },
    { source: 'brand_x', target: 'plat_instagram' },
    { source: 'brand_x', target: 'plat_tiktok' },
    { source: 'brand_x', target: 'plat_youtube' },
    { source: 'brand_x', target: 'c_dopamine_pavlov' },
    { source: 'brand_x', target: 'user_complaint' },

    // Arief
    { source: 'arief', target: 'plat_linkedin' },
    { source: 'arief', target: 'plat_tiktok' },
    { source: 'arief', target: 'plat_instagram' },
    { source: 'arief', target: 'plat_x' },
    { source: 'arief', target: 'plat_youtube' },
    { source: 'arief', target: 'c_dopamine_pavlov' },
    { source: 'arief', target: 'brand_x' },

    // Tirta
    { source: 'tirta', target: 'plat_linkedin' },
    { source: 'tirta', target: 'plat_tiktok' },
    { source: 'tirta', target: 'plat_instagram' },
    { source: 'tirta', target: 'plat_x' },
    { source: 'tirta', target: 'c_operant' },
    { source: 'tirta', target: 'c_implicit_mem' },

    // Folkative
    { source: 'folkative', target: 'plat_tiktok' },
    { source: 'folkative', target: 'plat_instagram' },
    { source: 'folkative', target: 'plat_x' },
    { source: 'folkative', target: 'c_dopamine_pavlov' },
    { source: 'folkative', target: 'brand_x' },

    // GadgetIn
    { source: 'gadgetin', target: 'plat_linkedin' },
    { source: 'gadgetin', target: 'plat_tiktok' },
    { source: 'gadgetin', target: 'plat_instagram' },
    { source: 'gadgetin', target: 'plat_youtube' },
    { source: 'gadgetin', target: 'c_modelling' },
    { source: 'gadgetin', target: 'brand_x' },

    // Raditya
    { source: 'raditya', target: 'plat_tiktok' },
    { source: 'raditya', target: 'plat_instagram' },
    { source: 'raditya', target: 'plat_x' },
    { source: 'raditya', target: 'plat_youtube' },
    { source: 'raditya', target: 'c_prototypes' },

    // Jerome
    { source: 'jerome', target: 'plat_linkedin' },
    { source: 'jerome', target: 'plat_tiktok' },
    { source: 'jerome', target: 'plat_instagram' },
    { source: 'jerome', target: 'plat_x' },
    { source: 'jerome', target: 'plat_youtube' },
    { source: 'jerome', target: 'c_learn_seq' },

    // Jess
    { source: 'jess', target: 'plat_tiktok' },
    { source: 'jess', target: 'plat_instagram' },
    { source: 'jess', target: 'plat_youtube' },
    { source: 'jess', target: 'c_modelling' },

    // Complaint node
    { source: 'user_complaint', target: 'plat_x' },
    { source: 'user_complaint', target: 'c_operant' },

    // Concept topology
    { source: 'c_motivation', target: 'c_dopamine_pavlov' },
    { source: 'c_nucleus', target: 'c_dopamine_pavlov' },
    { source: 'c_dopamine_pavlov', target: 'c_neutral_stimuli' },
    { source: 'c_dopamine_pavlov', target: 'c_dopamine' },
    { source: 'c_dopamine_pavlov', target: 'c_operant' },
    { source: 'c_neutral_stimuli', target: 'c_dopamine' },
    { source: 'c_neutral_stimuli', target: 'c_operant' },
    { source: 'c_neutral_stimuli', target: 'c_implicit_vital' },
    { source: 'c_dopamine', target: 'c_operant' },
    { source: 'c_dopamine', target: 'c_implicit_vital' },
    { source: 'c_implicit_mem', target: 'c_dopamine_pavlov' },
    { source: 'c_implicit_mem', target: 'c_operant' },
    { source: 'c_implicit_mem', target: 'c_implicit_vital' },
    { source: 'c_implicit_mem', target: 'c_nonverbal' },
    { source: 'c_implicit_mem', target: 'c_prototypes' },
    { source: 'c_operant', target: 'c_implicit_vital' },
    { source: 'c_operant', target: 'c_learn_seq' },
    { source: 'c_implicit_vital', target: 'c_subconscious_mem' },
    { source: 'c_subconscious_mem', target: 'c_learn_seq' },
    { source: 'c_explicit_mem', target: 'c_subconscious_mem' },
    { source: 'c_explicit_mem', target: 'c_explicit_base' },
    { source: 'c_prototypes', target: 'c_modelling' },
    { source: 'c_prototypes', target: 'c_mirror' },
    { source: 'c_mirror', target: 'c_prototypes' },
];
