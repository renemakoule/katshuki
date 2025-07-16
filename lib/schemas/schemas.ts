/**
 * Ce fichier centralise les schémas de sortie JSON attendus de l'IA.
 * L'utilisation de schémas garantit que la sortie de l'IA est prévisible, structurée et directement utilisable par notre application.
 */

// Schéma pour les propositions de design générées par l'IA.
// Utilisé pour les logos, flyers, et autres assets visuels.
export const DESIGN_PROPOSAL_SCHEMA = `
{
  "proposals": [
    {
      "style_archetype": "string (ex: 'Minimalisme Ludique', 'Néo-Brutalisme Digital')",
      "reasoning": "string (brève justification stratégique du choix de ce style)",
      "imagePrompt": "string (prompt en anglais, très détaillé et optimisé pour DALL-E 3, intégrant les leviers de réalisme)",
      "suggestions": [
        "string (conseil actionnable 1)",
        "string (conseil actionnable 2)"
      ]
    }
  ]
}
`;

// Schéma pour un Curriculum Vitae (CV) généré par l'IA.
// Le contenu est en Markdown pour permettre un formatage riche (gras, listes, etc.).
export const CV_SCHEMA = JSON.stringify(
  {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'Curriculum Vitae',
    description: 'Schema for a professionally formatted Curriculum Vitae (CV).',
    type: 'object',
    properties: {
      personalInfo: {
        type: 'object',
        properties: {
          fullName: { type: 'string' },
          contact: {
            type: 'object',
            properties: {
              email: { type: 'string', format: 'email' },
              phone: { type: 'string' },
              linkedin: { type: 'string', format: 'uri' },
            },
            required: ['fullName', 'email'],
          },
        },
      },
      professionalSummary: {
        type: 'string',
        description: 'A compelling professional summary of 2-4 sentences.',
      },
      workExperience: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            jobTitle: { type: 'string' },
            company: { type: 'string' },
            location: { type: 'string' },
            dates: { type: 'string', description: 'e.g., Jan 2020 - Present' },
            responsibilities: {
              type: 'array',
              items: { type: 'string' },
            },
          },
          required: ['jobTitle', 'company', 'dates', 'responsibilities'],
        },
      },
      education: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            degree: { type: 'string' },
            institution: { type: 'string' },
            dates: { type: 'string' },
          },
          required: ['degree', 'institution', 'dates'],
        },
      },
      skills: {
        type: 'array',
        items: { type: 'string' },
        description: 'List of key technical and soft skills.',
      },
    },
    required: [
      'personalInfo',
      'professionalSummary',
      'workExperience',
      'education',
      'skills',
    ],
  },
  null,
  2
);

// Schema for a social media post
export const SOCIAL_POST_SCHEMA = JSON.stringify(
  {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'Social Media Post',
    description: 'Schema for a well-structured social media post.',
    type: 'object',
    properties: {
      postText: {
        type: 'string',
        description: 'The main content of the post, optimized for the target platform.',
      },
      hashtags: {
        type: 'array',
        items: { type: 'string' },
        description: 'An array of relevant and trending hashtags.',
      },
      imageSuggestion: {
        type: 'string',
        description: 'A detailed description of a suggested image to accompany the post.',
      },
    },
    required: ['postText', 'hashtags'],
  },
  null,
  2
);

// Schema for a cover letter or other professional letters
export const LETTER_SCHEMA = JSON.stringify(
  {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'Professional Letter',
    description: 'Schema for a professional letter (e.g., cover letter, internship application).',
    type: 'object',
    properties: {
      recipientName: { type: 'string', description: 'e.g., Hiring Manager' },
      recipientCompany: { type: 'string' },
      date: { type: 'string', format: 'date' },
      letterBody: {
        type: 'string',
        description: 'The full text of the letter, structured in paragraphs with proper formatting.',
      },
      closing: { type: 'string', description: 'e.g., Sincerely, Regards,' },
      senderName: { type: 'string' },
    },
    required: ['letterBody', 'closing', 'senderName'],
  },
  null,
  2
);

// Schema for a product sheet
export const PRODUCT_SHEET_SCHEMA = JSON.stringify(
  {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'Product Sheet',
    description: 'Schema for a detailed product information sheet.',
    type: 'object',
    properties: {
      productName: { type: 'string' },
      tagline: { type: 'string', description: 'A catchy tagline for the product.' },
      description: {
        type: 'string',
        description: 'A compelling and detailed description of the product.',
      },
      features: {
        type: 'array',
        items: { type: 'string' },
        description: 'A list of key features and benefits as bullet points.',
      },
      specifications: {
        type: 'object',
        additionalProperties: { type: 'string' },
        description: 'A dictionary of technical specifications (e.g., { \"Dimension\": \"10x20cm\" }).',
      },
    },
    required: ['productName', 'description', 'features'],
  },
  null,
  2
);

// Schema for music composition ideas
export const MUSIC_COMPOSITION_SCHEMA = JSON.stringify(
  {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'Music Composition Idea',
    description: 'Schema for generating a structured musical idea, including lyrics, chords, and arrangement suggestions.',
    type: 'object',
    properties: {
      title: { type: 'string', description: 'A potential title for the song.' },
      mood: { type: 'string', description: 'The overall mood and feeling of the song (e.g., melancholic, upbeat, epic).' },
      tempo: { type: 'string', description: 'Suggested tempo in BPM or descriptive terms (e.g., 120 BPM, slow, allegro).' },
      key: { type: 'string', description: 'Suggested musical key (e.g., C Major, A minor).' },
      chordProgression: {
        type: 'object',
        properties: {
          verse: { type: 'string', description: 'e.g., Am - G - C - F' },
          chorus: { type: 'string', description: 'e.g., C - G - Am - F' },
          bridge: { type: 'string' },
        },
        required: ['verse', 'chorus'],
      },
      structure: {
        type: 'array',
        items: { type: 'string' },
        description: 'The song structure, e.g., [\"Verse 1\", \"Chorus\", \"Verse 2\"]',
      },
      lyrics: {
        type: 'object',
        properties: {
          verse1: { type: 'string' },
          chorus: { type: 'string' },
          verse2: { type: 'string' },
          bridge: { type: 'string' },
        },
        required: ['verse1', 'chorus'],
      },
      instrumentationSuggestion: {
        type: 'string',
        description: 'A description of suggested instruments (e.g., acoustic guitar, piano, strings, synth pads).',
      },
    },
    required: ['title', 'mood', 'chordProgression', 'structure', 'lyrics', 'instrumentationSuggestion'],
  },
  null,
  2
);
