import React, { useEffect, useState } from 'react';
import { Search, Star, ExternalLink, Code, Shield, Brain, Gamepad2, Globe, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getProfile, getRepositories, getLanguages, getRepoReadme } from './services/github';

const projectDescriptions = {
  'Prey-vs-Predator': 'A reinforcement-learning survival sim where a prey agent learns when to hide, scout, and outmaneuver a team of hunters.',
  'Gold-Trading': 'An LSTM forecasting experiment that turns MetaTrader gold data into time-series signals and tests how well neural nets can read market momentum.',
  'Clip-Creator': 'A local AI video pipeline that finds the sharpest moment in a long video, cuts it into a vertical short, and burns in styled captions.',
  'Anonymizer': 'A data-cleaning toolkit for turning messy cybersecurity training exports into anonymized, analysis-ready datasets.',
  'Drone-Control': 'A hands-on drone control stack combining Arduino motor commands, WiFi endpoints, and computer vision experiments.',
  'Copilot-Wannabe': 'An open-source meeting assistant experiment that separates speakers, transcribes conversations, and turns raw audio into usable notes.',
  'Translator-AI': 'A local-first document translator for PowerPoint, Word, and PDFs that keeps formatting intact while using an LLM for the language work.',
  'Strategy_Game': 'A civilization-style strategy prototype focused on map control, turn-based systems, and the foundations of a deeper 4X game loop.',
  'T-Platformer': 'A fast-paced platformer prototype built around tight movement, responsive controls, and a game feel that rewards precision.',
  'Brocard': 'A personal website project shaped around a clean presentation, custom visuals, and a more polished digital identity.'
};

const getRepoDescription = (repo) =>
  projectDescriptions[repo.name] || repo.description || 'A private project with more details coming soon.';

const App = () => {
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterLang, setFilterLang] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [repoReadme, setRepoReadme] = useState('');
  const [loadingReadme, setLoadingReadme] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [profileData, reposData] = await Promise.all([
        getProfile(),
        getRepositories()
      ]);
      setProfile(profileData);
      setRepos(reposData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleRepoClick = async (repo) => {
    setSelectedRepo(repo);
    setLoadingReadme(true);
    
    const readme = await getRepoReadme(repo.owner.login, repo.name);
    
    // Fallback custom resume for Prey vs Predator if no README is found on GitHub yet
    if (!readme && (repo.name.toLowerCase().includes('prey') || repo.name.toLowerCase().includes('radar') || repo.name.toLowerCase().includes('game'))) {
      setRepoReadme(`# Prey vs Predator: Teaching AI to Survive\n\nHey there! Welcome to **Prey vs Predator**, a passion project where I explore Reinforcement Learning by dropping an AI into a high-stakes game of hide-and-seek. \n\nAt its core, this is a custom-built grid simulation where an AI "Prey" tries to survive against a team of autonomous "Hunters." It's been a fantastic playground for diving deep into neural networks and emergent behaviors!\n\n## The Game of Cat and Mouse\n\nThe environment is a 10x10 grid, and the rules are simple: survive for 50 turns.\n\n- **The Hunters**: These guys are relentless. They roam the map with a limited line of sight, popping flares to light up the dark. If they spot the prey, they instantly switch from wandering to aggressively hunting it down using pathfinding.\n- **The Prey (Our AI)**: This is the brain of the operation! It can move around, stay still, or use a "smell" ability to sense nearby danger. It has to manage its movement points carefully to outmaneuver the hunters.\n\n## The Brains Behind the Operation\n\nTo teach the Prey how to survive, I built a **Deep Q-Network (DQN)** from scratch using **PyTorch**. \n\n- **How it "Sees" the World**: Instead of just giving it a picture of the grid, I feed the neural network a 27-number "state vector." This tells the AI exactly where it is, how far away the hunters are, whether it's been spotted, and where the active flares are.\n- **The Neural Net**: It's a solid 3-layer setup (with 256 neurons each). I added some Dropout layers in there to make sure the AI actually *learns* strategies rather than just memorizing paths.\n- **Learning from Mistakes**: Getting caught is a huge deal (a penalty of -300 points!), while surviving the full 50 turns gives a massive reward. The AI uses "experience replay" to look back at its past games and figure out what it did right (and wrong).\n\n## Seeing it in Action\n\nTraining numbers are great, but seeing the AI juke a hunter is even better. I built a custom visualizer using **Tkinter** that lets me watch the games play out in real-time. It's incredibly satisfying to watch the green Prey dot learn to perfectly weave through a maze of angry red Hunters!`);
    } else if (!readme && (repo.name.toLowerCase().includes('rnn') || repo.name.toLowerCase().includes('gold') || repo.name.toLowerCase().includes('forecast'))) {
      setRepoReadme(`# RNN Gold Price Forecaster\n\nWelcome to my **Gold Price Forecasting** project! This repository explores the application of Recurrent Neural Networks (RNNs) and Long Short-Term Memory (LSTM) architectures to predict future financial market movements based on historical gold prices.\n\n## The Objective\n\nFinancial markets are notoriously noisy and volatile. The goal here is to train deep learning models to identify underlying patterns in historical sequences (like moving averages and candlestick data) to predict future price points—specifically targeting the "high" of the next time interval.\n\n## The Brains Behind the Operation\n\nI built and experimented with several model architectures using **TensorFlow** and **Keras**:\n\n- **Data Processing**: The models ingest datasets containing up to 50,000 historical rows. I heavily utilize \`MinMaxScaler\` to normalize the data, ensuring the neural network doesn't get overwhelmed by massive price variances.\n- **Sequence Generation**: The data is chopped up into rolling sequences (e.g., 24 or 48 time-steps per sequence). This provides the LSTM layers with the necessary context to understand short-term trends.\n- **The Neural Net**: The core architecture relies on stacked **LSTM Layers** (often 64 units feeding into 32 units). I incorporated **Dropout layers (10-20%)** to aggressively combat overfitting—a massive challenge in financial forecasting.\n- **Optimization**: The network optimizes for Mean Squared Error (MSE) using the standard Adam optimizer, with \`ModelCheckpoint\` callbacks to perfectly save the weights during the epoch with the lowest validation loss.\n\n## What I Learned\n\nPredicting the market is hard! While the LSTM is excellent at recognizing immediate momentum and tracking Exponential Moving Averages (EMA), the project really highlighted the importance of robust data preprocessing and the limitations of relying purely on past price action.`);
    } else if (!readme && (repo.name.toLowerCase().includes('clip') || repo.name.toLowerCase().includes('short') || repo.name.toLowerCase().includes('creator'))) {
      setRepoReadme(`# Clip Creator\n\nThis is a tool I built to automate the process of turning long-form videos into short-form social media content, the kind of clips you'd see on TikTok or YouTube Shorts. The whole pipeline, from transcription to final subtitled video, runs with a single button click.\n\n## How It Works\n\nDrop in a video, hit the button, and the tool handles everything automatically in a sequential pipeline:\n\n1. **Transcription with Whisper**: First, OpenAI's Whisper model runs locally on the video and generates a full timestamped transcript. You can choose the model size (tiny to large) depending on how much accuracy vs. speed you need.\n2. **AI Clip Selection**: The transcript is then fed to a locally-running **Llama 3.1** model (via LM Studio). The LLM reads through the transcript and picks out the single most engaging scene, returning its start and end timestamps. Importantly, it keeps track of previous suggestions so it never picks the same scene twice.\n3. **Auto Captioning**: A second LLM call generates a fitting TikTok-style caption for that specific moment in the video.\n4. **Video Extraction and Reformatting**: Using **MoviePy**, the tool cuts out the selected segment and automatically reformats it to a vertical 9:16 format (1080x1920) ready for Shorts or TikTok.\n5. **Subtitle Burning**: Finally, **FFmpeg** burns the subtitles directly into the video using a custom style (Bangers font, cyan color) so they're always visible—no separate subtitle file needed.\n\n## The Tech Stack\n\nThis is a fully local, privacy-first pipeline. Nothing gets sent to any external API:\n\n- **Whisper** for speech-to-text transcription\n- **Llama 3.1 (8B) via LM Studio** for intelligent clip selection and captioning\n- **MoviePy** for video editing and reformatting\n- **FFmpeg** for subtitle burning\n- **Tkinter** for the simple desktop GUI\n\nThe whole thing runs in a background thread so the UI doesn't freeze while it's processing.`);
    } else if (!readme && (repo.name.toLowerCase().includes('drone') || repo.name.toLowerCase().includes('motor') || repo.name.toLowerCase().includes('arduino'))) {
      setRepoReadme(`# Drone Control System\n\nThis project is a custom drone control system built from the ground up, combining embedded firmware on an Arduino with a computer vision model trained on real-world image data. The goal was to build a drone that could receive wireless commands and, ultimately, react intelligently to what it sees.\n\n## The Hardware Layer — Arduino Firmware\n\nThe drone's brain runs on an Arduino R4 WiFi. Rather than relying on a dedicated remote control, I flashed it with custom firmware that spins up a lightweight HTTP web server over a local WiFi network. This means the drone can be commanded by any device on the network — a phone, a laptop, a Python script — just by hitting a URL.\n\n- **Motor Control**: Three ESCs (Electronic Speed Controllers) are managed via PWM signals through the Arduino's Servo library. Each motor can be individually addressed, which is the foundation for directional control.\n- **Command Endpoints**: The server listens for simple HTTP GET requests like \`/up\`, \`/down\`, and \`/off\`, translating each into precise microsecond PWM values sent to the ESCs.\n- **Static IP**: The Arduino is configured with a fixed local IP address so it's always reachable on the network without any discovery step.\n\n## The Vision Layer — CNN Image Classifier\n\nOn top of the hardware control, I trained a Convolutional Neural Network (CNN) using **TensorFlow/Keras** to give the drone situational awareness through a camera feed.\n\n- **Architecture**: A sequential CNN with three Conv2D + MaxPooling blocks (16 → 32 → 64 filters) feeding into a 128-neuron dense layer, trained on high-resolution 1280x720 images.\n- **Data Augmentation**: To make the model robust to real-world conditions, the training pipeline applies random shifts, shearing, zooming, and horizontal flips on the fly.\n- **Regularization**: L2 regularization is applied at every convolutional layer to prevent overfitting on the relatively small dataset.\n- **Live Inference**: A separate script captures frames directly from the drone's camera using **OpenCV** and feeds them to the trained model for real-time classification.\n\n## What I Learned\n\nThis project was a deep dive into the full stack of embedded systems and machine learning. Getting the WiFi server stable enough for real-time motor commands, and then layering computer vision on top of it, was a genuinely challenging and rewarding engineering problem.`);
    } else if (!readme && (repo.name.toLowerCase().includes('copilot') || repo.name.toLowerCase().includes('wannabe') || repo.name.toLowerCase().includes('meeting'))) {
      setRepoReadme(`# Copilot Wannabe\n\nCopilot Wannabe is a personal attempt at building an AI meeting assistant — something that can listen to a real conversation, figure out who's talking, transcribe what they said, and then make sense of it all. Think of it as a lightweight version of tools like Otter.ai, but built from scratch with open-source models.\n\n## What It Does\n\nThe core idea is simple: feed it a recording of a meeting or conversation, and get back a clean, speaker-attributed transcript that an AI can then analyze or summarize.\n\n## How It Works — The Pipeline\n\nThe project is built around two complementary technologies working together:\n\n**1. Speaker Diarization (Who's talking?)**\n\nThis is the hard part. Using **NVIDIA NeMo's** pretrained speaker embedding model (\`speakerdiarization_en_telephony\`), the pipeline extracts a unique voice "fingerprint" for each segment of audio. These embeddings are then grouped using **Agglomerative Clustering** with cosine distance to figure out how many distinct speakers there are.\n\nTo go beyond just "Speaker 1, Speaker 2," I implemented a speaker matching system: you can register known speakers by name, and the model will compare any new voice against those references, assigning a real name if the cosine similarity is close enough (threshold: 0.5).\n\n**2. Speech-to-Text (What are they saying?)**\n\nOnce we know who's talking, **OpenAI's Whisper** (large model) transcribes the actual words. I also experimented with **pyannote** as an alternative diarization backend and integrated **SpeechBrain's Sepformer** for audio source separation on noisier recordings.\n\n## The Tech Stack\n\n- **NVIDIA NeMo** for speaker embeddings and diarization\n- **OpenAI Whisper** (large) for transcription\n- **pyannote.audio** as an alternative diarization pipeline\n- **SpeechBrain** for audio source separation\n- **scikit-learn** for Agglomerative Clustering\n- **torchaudio** for audio loading and processing\n\n## Why "Wannabe"?\n\nHonestly, because it's ambitious. Building reliable speaker diarization that works across different recording conditions is genuinely difficult. This project is as much about understanding the limits of current open-source audio AI as it is about building something useful.`);
    } else if (!readme && (repo.name.toLowerCase().includes('anon') || repo.name.toLowerCase().includes('preparator') || repo.name.toLowerCase().includes('cybersec'))) {
      setRepoReadme(`# Anonymizer — Cybersecurity Training Data Preparator\n\nThis project is a data preparation and analysis pipeline built around real corporate cybersecurity training records. The goal is to process, consolidate, and visualize employee security awareness data to make it ready for downstream analysis or model training — all while keeping the underlying data clean and structured.\n\n## The Problem It Solves\n\nCorporate training data tends to come in messy formats: multiple CSV exports, inconsistent encodings, and scattered across different files. Before any meaningful analysis or model training can happen, this raw data needs to be wrangled into a single, reliable dataset.\n\n## What It Does\n\n**1. Dataset Consolidation (fuser)**\n\nThe first component handles the tedious reality of working with multi-file exports. It scans a directory of CSV files, automatically detects each file's character encoding using \`chardet\` (crucial for handling French-language corporate data), and fuses them all into a single consolidated dataset. No more manually specifying encodings or losing rows to silent decode errors.\n\n**2. Cybersecurity Training Analytics**\n\nOnce the data is clean, the pipeline digs into the actual training records. Built with **pandas**, **matplotlib**, and **seaborn**, it produces a suite of visualizations to understand the dataset before using it for anything else:\n\n- **Topic participation rates**: Which cybersecurity topics (phishing, data protection, etc.) employees have actually completed, as a percentage of the workforce.\n- **Department-level breakdown**: A stacked bar chart showing training completion across different departments.\n- **Phishing awareness over time**: A time-series view of how phishing training has progressed month by month.\n- **Manager impact analysis**: How different managers correlate with their teams' overall security training engagement.\n\n## Why This Matters\n\nUnderstanding your data before training a model on it is half the battle. This toolset ensures the training data is complete, correctly encoded, and meaningfully distributed — so any downstream model actually learns from signal, not noise.`);
    } else if (!readme && (repo.name.toLowerCase().includes('translat') || repo.name.toLowerCase().includes('translator'))) {
      setRepoReadme(`# Translator-AI\n\nTranslator-AI is a full-stack document translation system that takes real office files — PowerPoint presentations, Word documents, PDFs — and translates them into any target language using a locally-running LLM, while preserving all the original formatting.\n\nThis isn't just a "call an API and replace the text" script. The challenge here was making sure that after translation, the documents still looked right — fonts, layout, tables, text boxes and all.\n\n## What It Can Translate\n\n- **PowerPoint (.pptx)**: Handles text frames, tables, and floating text boxes throughout every slide. After translation, it auto-fits text back into shapes and normalizes punctuation artifacts (like stray spaces around French angle quotes).\n- **Word Documents (.docx / .doc)**: Full paragraph and inline shape translation. It even handles legacy \`.doc\` files by converting them through an intermediary format before processing.\n- **PDFs**: Text is extracted and fed directly to the translation model as context.\n\n## The Translation Engine\n\nAll translation runs locally through **Llama 3.1 (8B)** via LM Studio — no external API keys, no data leaving the machine. The model is prompted to be smart about it: it leaves abbreviations, technical terms, and proper nouns untouched, and only returns the translated text with no commentary.\n\n## The Cloud Backend\n\nFor heavier workloads, the project includes a **Flask web server** that offloads translation jobs to a dedicated **Azure Virtual Machine** over SSH. The workflow is:\n\n1. The user uploads a file through a web UI.\n2. The Flask server manages a queue — admin users can jump ahead.\n3. Once the Azure VM is confirmed running (checked via the Azure Management API), the file is sent over SFTP using \`paramiko\`.\n4. The VM processes the translation and writes the result to a dedicated output folder.\n5. The server polls until the translated file appears, then retrieves it via SFTP and streams it back to the user.\n\n## The Tech Stack\n\n- **python-pptx** and **python-docx** for document manipulation\n- **win32com** for deep PowerPoint and Word automation\n- **Llama 3.1 via LM Studio** for local AI translation\n- **Flask + Flask-CORS** for the web backend\n- **paramiko** for SSH/SFTP file transfer\n- **Azure SDK** for VM lifecycle management`);
    } else {
      setRepoReadme(readme || '> No README.md found for this repository.');
    }
    setLoadingReadme(false);
  };

  const categorizeRepo = (repo) => {
    const lang = (repo.language || '').toLowerCase();
    const desc = (repo.description || '').toLowerCase();
    
    if (['python', 'jupyter notebook'].includes(lang) || desc.includes('ml') || desc.includes('machine learning') || desc.includes('ai') || desc.includes('artificial intelligence') || desc.includes('data')) return 'ML Projects';
    if (['c#', 'c++', 'gdscript'].includes(lang) || desc.includes('game') || desc.includes('unity') || desc.includes('unreal') || desc.includes('godot')) return 'Game Projects';
    
    // Default to Websites for JS, TS, HTML, CSS, or anything else unless it strongly matches ML/Game
    return 'Websites';
  };

  const ignoredRepos = ['SmartHouse', 'desktop-tutorial', 'Bot', 'mongol', 'learn_git', 'Patches', 'Paris2', 'Exercice_timer'];
  
  const categoryFilteredRepos = repos.filter(repo => {
    if (ignoredRepos.includes(repo.name)) return false;
    if (selectedCategory && categorizeRepo(repo) !== selectedCategory) return false;
    return true;
  });

  const languages = getLanguages(categoryFilteredRepos);
  
  const filteredRepos = categoryFilteredRepos.filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(search.toLowerCase()) || 
                          getRepoDescription(repo).toLowerCase().includes(search.toLowerCase());
    const matchesLang = filterLang === 'all' || repo.language === filterLang;
    return matchesSearch && matchesLang;
  });

  if (loading) {
    return (
      <div className="loader-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Decrypting your private portfolio...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="bg-blur blur-1"></div>
      <div className="bg-blur blur-2"></div>

      <header className="header glass">
        <div className="profile-section">
          <div className="avatar-container">
            <img src={profile?.avatar_url} alt="Profile" className="avatar" />
            <div className="avatar-ring"></div>
          </div>
          <div className="profile-info">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {profile?.name || profile?.login}
            </motion.h1>
            <p className="bio">{profile?.bio || 'Private Repository Resume'}</p>
          </div>
        </div>

        <div className="stats-dashboard">
          <div className="stat-card glass">
            <span className="stat-value">{repos.length}</span>
            <span className="stat-label">Total Repos</span>
          </div>
          <div className="stat-card glass">
            <span className="stat-value">{repos.filter(r => r.private).length}</span>
            <span className="stat-label">Private</span>
          </div>
          <div className="stat-card glass">
            <span className="stat-value">{Object.keys(languages).length}</span>
            <span className="stat-label">Languages</span>
          </div>
        </div>
      </header>

      <main className="main-content">
        {!selectedCategory ? (
          <div className="category-grid">
            <div className="category-card glass" onClick={() => setSelectedCategory('ML Projects')}>
              <Brain size={48} className="category-icon" />
              <h2 className="category-title">ML Projects</h2>
              <p className="category-desc">AI experiments, data tools, and models built to solve practical problems.</p>
            </div>
            <div className="category-card glass" onClick={() => setSelectedCategory('Game Projects')}>
              <Gamepad2 size={48} className="category-icon" />
              <h2 className="category-title">Game Projects</h2>
              <p className="category-desc">Playable prototypes built around systems, controls, and game feel.</p>
            </div>
            <div className="category-card glass" onClick={() => setSelectedCategory('Websites')}>
              <Globe size={48} className="category-icon" />
              <h2 className="category-title">Websites</h2>
              <p className="category-desc">Web experiences with cleaner interfaces and stronger presentation.</p>
            </div>
          </div>
        ) : selectedRepo ? (
          <div className="repo-details-view glass" style={{ padding: '2rem', animation: 'fadeIn 0.3s ease-in-out' }}>
            <button className="back-button" onClick={() => setSelectedRepo(null)}>
              <ArrowLeft size={18} />
              Back to {selectedCategory}
            </button>
            <div className="repo-details-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-glass)' }}>
              <div>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{selectedRepo.name}</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{getRepoDescription(selectedRepo)}</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a href={selectedRepo.html_url} target="_blank" rel="noopener noreferrer" className="meta-item glass" style={{ padding: '0.5rem 1rem', textDecoration: 'none', color: 'var(--text-primary)' }}>
                  <ExternalLink size={16} style={{ color: 'var(--accent-primary)' }} />
                  <span>View on GitHub</span>
                </a>
              </div>
            </div>
            
            <div className="repo-details-content">
              {loadingReadme ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                  <div className="spinner"></div>
                </div>
              ) : (
                <div className="markdown-body">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {repoReadme}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <button className="back-button" onClick={() => { setSelectedCategory(null); setSearch(''); setFilterLang('all'); }}>
              <ArrowLeft size={18} />
              Back to Categories
            </button>

            <div className="controls">
              <div className="search-container">
                <Search className="search-icon" />
                <input 
                  type="text" 
                  id="repo-search" 
                  placeholder={`Search ${selectedCategory}...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="filter-container">
                <select 
                  id="lang-filter" 
                  className="glass"
                  style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-glass)', padding: '0.75rem', borderRadius: 'var(--radius-md)', outline: 'none' }}
                  value={filterLang}
                  onChange={(e) => setFilterLang(e.target.value)}
                >
                  <option value="all">All Languages</option>
                  {Object.keys(languages).sort().map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            </div>

            <motion.div 
              className="repo-grid"
              layout
            >
              <AnimatePresence>
                {filteredRepos.map((repo, index) => (
                  <motion.div 
                    key={repo.id}
                    className="repo-card glass"
                    onClick={() => handleRepoClick(repo)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="repo-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="repo-name">{repo.name}</span>
                        {repo.private && <Shield size={14} style={{ color: 'var(--accent-secondary)' }} title="Private" />}
                      </div>
                      <div className="repo-badge">{repo.private ? 'Private' : 'Public'}</div>
                    </div>
                    
                    <p className="repo-desc">
                      {getRepoDescription(repo)}
                    </p>

                    <div className="repo-footer">
                      <div className="repo-meta">
                        {repo.language && (
                          <div className="meta-item">
                            <Code size={14} />
                            <span>{repo.language}</span>
                          </div>
                        )}
                        <div className="meta-item">
                          <Star size={14} />
                          <span>{repo.stargazers_count}</span>
                        </div>
                      </div>
                      <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="meta-item" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </main>

      <footer className="footer" style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <p>&copy; {new Date().getFullYear()} GitHub Resume. Securely rendered from private data.</p>
      </footer>
    </div>
  );
};

export default App;
