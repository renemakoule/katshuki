"use client";

import { useState } from 'react';

// Define interfaces for our form data
interface LogoParams {
  companyName: string;
  slogan: string;
  industry: string;
  style: string;
}

interface FlyerParams {
  eventName: string;
  eventDate: string;
  location: string;
  description: string;
  targetAudience: string;
  style: string;
}

interface CvParams {
  fullName: string;
  jobTitle: string;
  tone: string;
  keyAchievements: string;
  experienceSummary: string;
}

// New interfaces for additional asset types
interface AdvertisementParams {
  product: string;
  targetAudience: string;
  keyMessage: string;
  style: string;
}

interface MenuParams {
  restaurantName: string;
  menuType: 'Restaurant' | 'Cafe' | 'Bar' | 'Snack' | 'IceCreamShop';
  cuisine: string;
  style: string;
  items: string;
}

interface ProfilePictureParams {
  subject: string;
  style: string;
  mood: string;
  colors: string;
}

interface CardParams {
  cardType: 'Business' | 'Birthday' | 'Postcard';
  occasion: string;
  recipient: string;
  message: string;
  style: string;
}

interface WantedPosterParams {
  subject: string;
  reason: string;
  reward: string;
  style: string;
}

interface SocialPostParams {
  topic: string;
  platform: 'Instagram' | 'Twitter' | 'Facebook' | 'LinkedIn';
  tone: string;
  callToAction: string;
}

interface LetterParams {
  letterType: 'CoverLetter' | 'Internship' | 'JobApplication';
  senderInfo: string;
  recipientInfo: string;
  context: string;
  tone: string;
}

interface ProductSheetParams {
  productName: string;
  keyFeatures: string;
  targetAudience: string;
  tone: string;
}

interface MusicCompositionParams {
  genre: string;
  mood: string;
  theme: string;
  instruments: string;
}

type AssetType = 
  | 'logo'
  | 'flyer'
  | 'cv'
  | 'advertisement'
  | 'menu'
  | 'profile_picture'
  | 'card'
  | 'wanted_poster'
  | 'social_post'
  | 'letter'
  | 'product_sheet'
  | 'music_composition';

export function CreativeStudio() {
  const [assetType, setAssetType] = useState<AssetType>('logo');
  const [formData, setFormData] = useState<Partial<
    LogoParams &
    FlyerParams &
    CvParams &
    AdvertisementParams &
    MenuParams &
    ProfilePictureParams &
    CardParams &
    WantedPosterParams &
    SocialPostParams &
    LetterParams &
    ProductSheetParams &
    MusicCompositionParams
  >>({});
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    // The 'useCase' is determined by the asset type
        const textUseCases: AssetType[] = ['cv', 'social_post', 'letter', 'product_sheet', 'music_composition'];
    const useCase = textUseCases.includes(assetType) ? 'text-generation' : 'image-generation';

    try {
      const res = await fetch('/api/create-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assetType,
          ...formData,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderFormFields = () => {
    const commonInputClasses = "w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all";
    const commonTextareaClasses = `${commonInputClasses} min-h-[100px]`;

    switch (assetType) {
      case 'logo':
        return (
          <>
            <input name="companyName" placeholder="Company Name" onChange={handleInputChange} className={commonInputClasses} required />
            <input name="slogan" placeholder="Slogan (optional)" onChange={handleInputChange} className={commonInputClasses} />
            <input name="industry" placeholder="Industry" onChange={handleInputChange} className={commonInputClasses} required />
            <input name="style" placeholder="Visual Style (e.g., modern, minimalist)" onChange={handleInputChange} className={commonInputClasses} required />
          </>
        );
      case 'flyer':
        return (
          <>
            <input name="eventName" placeholder="Event Name" onChange={handleInputChange} className={commonInputClasses} required />
            <input name="eventDate" placeholder="Event Date" onChange={handleInputChange} className={commonInputClasses} required />
            <input name="location" placeholder="Location" onChange={handleInputChange} className={commonInputClasses} required />
            <textarea name="description" placeholder="Description" onChange={handleInputChange} className={commonTextareaClasses} required />
            <input name="targetAudience" placeholder="Target Audience" onChange={handleInputChange} className={commonInputClasses} required />
            <input name="style" placeholder="Visual Style" onChange={handleInputChange} className={commonInputClasses} required />
          </>
        );
      case 'cv':
        return (
          <>
            <input name="fullName" placeholder="Full Name" onChange={handleInputChange} className={commonInputClasses} required />
            <input name="jobTitle" placeholder="Job Title" onChange={handleInputChange} className={commonInputClasses} required />
            <input name="tone" placeholder="Tone (e.g., professional, creative)" onChange={handleInputChange} className={commonInputClasses} required />
            <textarea name="keyAchievements" placeholder="Key Achievements (bullet points)" onChange={handleInputChange} className={commonTextareaClasses} required />
            <textarea name="experienceSummary" placeholder="Experience Summary" onChange={handleInputChange} className={commonTextareaClasses} required />
          </>
        );
      case 'advertisement':
        return (
          <>
            <input name="product" placeholder="Product/Service to promote" onChange={handleInputChange} className={commonInputClasses} required />
            <input name="targetAudience" placeholder="Target Audience" onChange={handleInputChange} className={commonInputClasses} required />
            <textarea name="keyMessage" placeholder="Key Message" onChange={handleInputChange} className={commonTextareaClasses} required />
            <input name="style" placeholder="Visual Style (e.g., vibrant, corporate)" onChange={handleInputChange} className={commonInputClasses} required />
          </>
        );
      case 'menu':
        return (
          <>
            <input name="restaurantName" placeholder="Restaurant/Cafe Name" onChange={handleInputChange} className={commonInputClasses} required />
            <select name="menuType" onChange={handleInputChange} className={commonInputClasses} required>
              <option value="">Select Menu Type</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Cafe">Cafe</option>
              <option value="Bar">Bar</option>
              <option value="Snack">Snack</option>
              <option value="IceCreamShop">Ice Cream Shop</option>
            </select>
            <input name="cuisine" placeholder="Cuisine Type (e.g., Italian, French)" onChange={handleInputChange} className={commonInputClasses} required />
            <input name="style" placeholder="Visual Style (e.g., rustic, modern)" onChange={handleInputChange} className={commonInputClasses} required />
            <textarea name="items" placeholder="Example items (one per line)" onChange={handleInputChange} className={commonTextareaClasses} required />
          </>
        );
      case 'profile_picture':
        return (
          <>
            <input name="subject" placeholder="Subject (e.g., a female astronaut)" onChange={handleInputChange} className={commonInputClasses} required />
            <input name="style" placeholder="Art Style (e.g., anime, photorealistic, fantasy)" onChange={handleInputChange} className={commonInputClasses} required />
            <input name="mood" placeholder="Mood (e.g., joyful, mysterious)" onChange={handleInputChange} className={commonInputClasses} required />
            <input name="colors" placeholder="Color Palette (e.g., pastel, neon)" onChange={handleInputChange} className={commonInputClasses} required />
          </>
        );
      case 'card':
        return (
          <>
            <select name="cardType" onChange={handleInputChange} className={commonInputClasses} required>
              <option value="">Select Card Type</option>
              <option value="Business">Business Card</option>
              <option value="Birthday">Birthday Card</option>
              <option value="Postcard">Postcard</option>
            </select>
            <input name="occasion" placeholder="Occasion" onChange={handleInputChange} className={commonInputClasses} required />
            <input name="recipient" placeholder="Recipient (e.g., a friend, a client)" onChange={handleInputChange} className={commonInputClasses} required />
            <textarea name="message" placeholder="Message to include" onChange={handleInputChange} className={commonTextareaClasses} />
            <input name="style" placeholder="Visual Style (e.g., elegant, playful)" onChange={handleInputChange} className={commonInputClasses} required />
          </>
        );
      case 'wanted_poster':
        return (
          <>
            <input name="subject" placeholder="Wanted Subject (e.g., a cookie thief)" onChange={handleInputChange} className={commonInputClasses} required />
            <textarea name="reason" placeholder="Reason for being wanted" onChange={handleInputChange} className={commonTextareaClasses} required />
            <input name="reward" placeholder="Reward (e.g., 1000 gold coins)" onChange={handleInputChange} className={commonInputClasses} required />
            <input name="style" placeholder="Style (e.g., old west, fantasy, sci-fi)" onChange={handleInputChange} className={commonInputClasses} required />
          </>
        );
      case 'social_post':
        return (
          <>
            <input name="topic" placeholder="Topic of the post" onChange={handleInputChange} className={commonInputClasses} required />
            <select name="platform" onChange={handleInputChange} className={commonInputClasses} required>
              <option value="">Select Platform</option>
              <option value="Instagram">Instagram</option>
              <option value="Twitter">Twitter</option>
              <option value="Facebook">Facebook</option>
              <option value="LinkedIn">LinkedIn</option>
            </select>
            <input name="tone" placeholder="Tone (e.g., informative, humorous)" onChange={handleInputChange} className={commonInputClasses} required />
            <input name="callToAction" placeholder="Call to Action (optional)" onChange={handleInputChange} className={commonInputClasses} />
          </>
        );
      case 'letter':
        return (
          <>
            <select name="letterType" onChange={handleInputChange} className={commonInputClasses} required>
              <option value="">Select Letter Type</option>
              <option value="CoverLetter">Cover Letter</option>
              <option value="Internship">Internship Application</option>
              <option value="JobApplication">Job Application</option>
            </select>
            <textarea name="senderInfo" placeholder="Your Info (Name, Contact)" onChange={handleInputChange} className={commonTextareaClasses} required />
            <textarea name="recipientInfo" placeholder="Recipient Info (Name, Company)" onChange={handleInputChange} className={commonTextareaClasses} required />
            <textarea name="context" placeholder="Context / Job Description" onChange={handleInputChange} className={commonTextareaClasses} required />
            <input name="tone" placeholder="Tone (e.g., formal, enthusiastic)" onChange={handleInputChange} className={commonInputClasses} required />
          </>
        );
      case 'product_sheet':
        return (
          <>
            <input name="productName" placeholder="Product Name" onChange={handleInputChange} className={commonInputClasses} required />
            <textarea name="keyFeatures" placeholder="Key Features (one per line)" onChange={handleInputChange} className={commonTextareaClasses} required />
            <input name="targetAudience" placeholder="Target Audience" onChange={handleInputChange} className={commonInputClasses} required />
            <input name="tone" placeholder="Tone (e.g., technical, marketing)" onChange={handleInputChange} className={commonInputClasses} required />
          </>
        );
      case 'music_composition':
        return (
          <>
            <input name="genre" placeholder="Musical Genre (e.g., Pop, Rock, Lofi)" onChange={handleInputChange} className={commonInputClasses} required />
            <input name="mood" placeholder="Mood (e.g., happy, melancholic, epic)" onChange={handleInputChange} className={commonInputClasses} required />
            <input name="theme" placeholder="Lyrical Theme (e.g., love, adventure)" onChange={handleInputChange} className={commonInputClasses} required />
            <input name="instruments" placeholder="Desired Instruments (e.g., piano, guitar)" onChange={handleInputChange} className={commonInputClasses} required />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="bg-gray-900/50 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-4xl font-bold text-center mb-2 text-white">Creative Studio</h2>
          <p className="text-center text-gray-300 mb-8">Your AI co-pilot for creation.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="assetType" className="block mb-2 font-medium text-gray-200">I want to create a...</label>
              <select id="assetType" value={assetType} onChange={(e) => setAssetType(e.target.value as AssetType)} className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                <option value="logo">Logo</option>
                <option value="flyer">Flyer</option>
                <option value="advertisement">Advertisement</option>
                <option value="menu">Menu</option>
                <option value="profile_picture">Profile Picture / Avatar</option>
                <option value="card">Card (Business, Birthday...)</option>
                <option value="wanted_poster">Wanted Poster</option>
                <optgroup label="Text Content">
                  <option value="cv">CV</option>
                  <option value="social_post">Social Media Post</option>
                  <option value="letter">Letter (Cover, Internship...)</option>
                  <option value="product_sheet">Product Sheet</option>
                </optgroup>
                <optgroup label="Creative & Music">
                  <option value="music_composition">Music Composition</option>
                </optgroup>
              </select>
            </div>
            {renderFormFields()}
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105">
              {loading ? 'Generating...' : '✨ Generate with AI'}
            </button>
          </form>
          {error && <div className="mt-6 p-4 bg-red-500/20 text-red-300 rounded-lg border border-red-500/30"><strong>Error:</strong> {error}</div>}
          {response && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4 text-white">AI Response:</h3>
              <div className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm text-gray-200 border border-white/10">
                <pre>{JSON.stringify(response, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
