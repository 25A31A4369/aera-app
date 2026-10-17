// AERA Translation System
// Supports English, Telugu, Telugu + English, Hindi, and Hindi + English

export type SupportedLanguage = "en" | "te" | "te-en" | "hi" | "hi-en";

export interface LanguageOption {
  code: SupportedLanguage;
  label: string; // Exact name and native script as requested
  nativeName: string;
  englishName: string;
  description: string;
  samplePhrase: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    code: "en",
    label: "English",
    nativeName: "English",
    englishName: "English",
    description: "",
    samplePhrase: "",
  },
  {
    code: "te",
    label: "తెలుగు",
    nativeName: "తెలుగు",
    englishName: "Telugu",
    description: "",
    samplePhrase: "",
  },
  {
    code: "te-en",
    label: "తెలుగు + English",
    nativeName: "తెలుగు + English",
    englishName: "Telugu + English",
    description: "",
    samplePhrase: "",
  },
  {
    code: "hi",
    label: "हिन्दी",
    nativeName: "हिन्दी",
    englishName: "Hindi",
    description: "",
    samplePhrase: "",
  },
  {
    code: "hi-en",
    label: "हिन्दी + English",
    nativeName: "हिन्दी + English",
    englishName: "Hindi + English",
    description: "",
    samplePhrase: "",
  },
];

export const translations = {
  // App Identity
  app_name: {
    en: "AERA",
    te: "ఏరా (AERA)",
    "te-en": "AERA",
    hi: "एरा (AERA)",
    "hi-en": "AERA",
  },
  tagline: {
    en: "Find Shade. Find Relief.",
    te: "నీడను కనుగొనండి. ఉపశమనం పొందండి.",
    "te-en": "Shade కనుగొనండి. Relief పొందండి.",
    hi: "छांव ढूँढें. राहत पाएं।",
    "hi-en": "Shade ढूँढें. Relief पाएं।",
  },
  hero_subtitle: {
    en: "Drinking water, shade and rest spots for outdoor workers, with honest freshness labels.",
    te: "ఎండలో పనిచేసే కార్మికుల కోసం తాగునీరు, నీడ మరియు విశ్రాంతి ప్రదేశాలు — నిజాయితీ సమాచారంతో.",
    "te-en": "Outdoor workers కోసం Drinking water, shade మరియు rest spots — తాజా updates తో.",
    hi: "धूप में काम करने वाले कामगारों के लिए पीने का पानी, छांव और विश्राम स्थल — सही जानकारी के साथ।",
    "hi-en": "Outdoor workers के लिए Drinking water, shade और rest spots — ताज़ा status के साथ।",
  },

  // Welcome Screen
  welcome_title: {
    en: "Welcome to AERA",
    te: "AERA కి స్వాగతం",
    "te-en": "Welcome to AERA",
    hi: "AERA में आपका स्वागत है",
    "hi-en": "Welcome to AERA",
  },
  welcome_desc: {
    en: "Find clean drinking water, tree shade, and cool resting places during hot weather across India.",
    te: "భారతదేశంలో తీవ్రమైన ఎండలో స్వచ్ఛమైన తాగునీరు, చెట్ల నీడ మరియు చల్లని విశ్రాంతి ప్రదేశాలను కనుగొనండి.",
    "te-en":
      "India లో hot weather లో clean drinking water, tree shade మరియు cool rest spots కనుగొనండి.",
    hi: "भारत में भीषण गर्मी के दौरान स्वच्छ पेयजल, पेड़ों की छांव और ठंडे विश्राम स्थल खोजें।",
    "hi-en":
      "India में hot weather के दौरान clean drinking water, tree shade और cool rest spots खोजें।",
  },
  get_started: {
    en: "Get Started",
    te: "ప్రారంభించండి",
    "te-en": "Get Started",
    hi: "शुरू करें",
    "hi-en": "Get Started",
  },

  // Language Selection Screen
  choose_language_title: {
    en: "Choose your language",
    te: "మీ భాషను ఎంచుకోండి",
    "te-en": "మీ Language ఎంచుకోండి",
    hi: "अपनी भाषा चुनें",
    "hi-en": "अपनी Language चुनें",
  },
  choose_language_subtitle: {
    en: "Select how you would like to read AERA. You can change this anytime in Settings.",
    te: "AERA ని ఏ భాషలో చదవాలనుకుంటున్నారో ఎంచుకోండి. సెట్టింగ్స్‌లో ఎప్పుడైనా మార్చుకోవచ్చు.",
    "te-en":
      "AERA ని ఎలా చదవాలనుకుంటున్నారో select చేయండి. Settings లో ఎప్పుడైనా change చేసుకోవచ్చు.",
    hi: "AERA को किस भाषा में पढ़ना चाहते हैं, चुनें। इसे सेटिंग्स में कभी भी बदल सकते हैं।",
    "hi-en":
      "AERA को किस भाषा में पढ़ना चाहते हैं select करें। Settings में कभी भी change कर सकते हैं।",
  },
  continue_button: {
    en: "Continue",
    te: "కొనసాగించండి",
    "te-en": "Continue చేయండి",
    hi: "आगे बढ़ें",
    "hi-en": "Continue करें",
  },
  change_language: {
    en: "Change language",
    te: "భాషను మార్చండి",
    "te-en": "Language మార్చండి",
    hi: "भाषा बदलें",
    "hi-en": "Language change करें",
  },
  skip_to_explore: {
    en: "Skip to explore places",
    te: "స్థలాలను నేరుగా చూడండి",
    "te-en": "Direct గా Places explore చేయండి",
    hi: "सीधे स्थान देखें",
    "hi-en": "Directly Places explore करें",
  },

  // Authentication - Common & Status
  auth_backend_status_title: {
    en: "Authentication Backend Status",
    te: "ప్రామాణీకరణ బ్యాకెండ్ స్థితి",
    "te-en": "Authentication Backend Status",
    hi: "प्रमाणीकरण बैकएंड स्थिति",
    "hi-en": "Authentication Backend Status",
  },
  auth_backend_awaiting: {
    en: "Supabase authentication backend is awaiting configuration (Next Phase). Real credentials will authenticate once environment variables are connected.",
    te: "Supabase ప్రామాణీకరణ బ్యాకెండ్ ఇంకా కాన్ఫిగర్ కావాల్సి ఉంది (తదుపరి దశ). పర్యావరణ వేరియబుల్స్ జోడించిన తర్వాత నిజమైన ఖాతాలు పనిచేస్తాయి.",
    "te-en":
      "Supabase authentication backend ఇంకా configure కావాలి (Next Phase). Environment variables connect అయ్యాక real accounts activate అవుతాయి.",
    hi: "Supabase प्रमाणीकरण बैकएंड अभी कॉन्फ़िगर होना बाकी है (अगला चरण)। पर्यावरण चर कनेक्ट होने पर वास्तविक खाते सक्रिय होंगे।",
    "hi-en":
      "Supabase authentication backend अभी configure होना बाकी है (Next Phase)। Environment variables connect होने पर real accounts active होंगे।",
  },
  auth_backend_connected: {
    en: "Supabase authentication backend connected.",
    te: "Supabase ప్రామాణీకరణ బ్యాకెండ్ అనుసంధానించబడింది.",
    "te-en": "Supabase authentication backend connected.",
    hi: "Supabase प्रमाणीकरण बैकएंड कनेक्ट है।",
    "hi-en": "Supabase authentication backend connected है।",
  },
  continue_as_guest: {
    en: "Continue as guest",
    te: "అతిథిగా కొనసాగించండి",
    "te-en": "Guest గా continue అవ్వండి",
    hi: "अतिथि के रूप में जारी रखें",
    "hi-en": "Guest बनकर continue करें",
  },
  browse_freely_note: {
    en: "Browse freely. Sign in to save places and submit community reports.",
    te: "ఉచితంగా చూడండి. స్థలాలను సేవ్ చేయడానికి మరియు రిపోర్ట్‌లు ఇవ్వడానికి సైన్ ఇన్ చేయండి.",
    "te-en": "ఫ్రీగా చూడండి. Places save చేయడానికి మరియు reports ఇవ్వడానికి Sign in అవ్వండి.",
    hi: "आसानी से ब्राउज़ करें। स्थान सुरक्षित रखने और रिपोर्ट देने के लिए साइन इन करें।",
    "hi-en": "Freely browse करें। Places save करने और report देने के लिए Sign in करें।",
  },

  // Sign In
  sign_in_title: {
    en: "Sign in",
    te: "సైన్ ఇన్",
    "te-en": "Sign in అవ్వండి",
    hi: "साइन इन",
    "hi-en": "Sign in करें",
  },
  email_label: {
    en: "Email address",
    te: "ఈమెయిల్ చిరునామా",
    "te-en": "Email address",
    hi: "ईमेल पता",
    "hi-en": "Email address",
  },
  email_placeholder: {
    en: "name@example.com",
    te: "name@example.com",
    "te-en": "name@example.com",
    hi: "name@example.com",
    "hi-en": "name@example.com",
  },
  password_label: {
    en: "Password",
    te: "పాస్‌వర్డ్",
    "te-en": "Password",
    hi: "पासवर्ड",
    "hi-en": "Password",
  },
  password_placeholder: {
    en: "Enter your password",
    te: "మీ పాస్‌వర్డ్ నమోదు చేయండి",
    "te-en": "మీ Password enter చేయండి",
    hi: "अपना पासवर्ड दर्ज करें",
    "hi-en": "अपना Password enter करें",
  },
  show_password: {
    en: "Show password",
    te: "పాస్‌వర్డ్ చూపించు",
    "te-en": "Password చూపించు",
    hi: "पासवर्ड दिखाएं",
    "hi-en": "Password दिखाएं",
  },
  hide_password: {
    en: "Hide password",
    te: "పాస్‌వర్డ్ దాచు",
    "te-en": "Password దాచు",
    hi: "पासवर्ड छुपाएं",
    "hi-en": "Password छुपाएं",
  },
  sign_in_button: {
    en: "Sign in",
    te: "సైన్ ఇన్ చేయండి",
    "te-en": "Sign in అవ్వండి",
    hi: "साइन इन करें",
    "hi-en": "Sign in करें",
  },
  signing_in: {
    en: "Signing in…",
    te: "సైన్ ఇన్ అవుతోంది…",
    "te-en": "Sign in అవుతోంది…",
    hi: "साइन इन हो रहा है…",
    "hi-en": "Sign in हो रहा है…",
  },
  dont_have_account: {
    en: "Don't have an account?",
    te: "ఖాతా లేదా?",
    "te-en": "Account లేదా?",
    hi: "खाता नहीं है?",
    "hi-en": "Account नहीं है?",
  },
  create_account_link: {
    en: "Create account",
    te: "కొత్త ఖాతా తెరవండి",
    "te-en": "Account create చేయండి",
    hi: "नया खाता बनाएं",
    "hi-en": "Account बनाएं",
  },
  forgot_password_link: {
    en: "Forgot password?",
    te: "పాస్‌వర్డ్ మర్చిపోయారా?",
    "te-en": "Password మర్చిపోయారా?",
    hi: "पासवर्ड भूल गए?",
    "hi-en": "Password भूल गए?",
  },

  // Create Account
  create_account_title: {
    en: "Create account",
    te: "కొత్త ఖాతా తెరవండి",
    "te-en": "కొత్త Account create చేయండి",
    hi: "खाता बनाएं",
    "hi-en": "नया Account बनाएं",
  },
  create_account_subtitle: {
    en: "Join the community helping workers find shelter and drinking water.",
    te: "కార్మికులకు నీడ మరియు తాగునీరు అందించే సమాజంలో చేరండి.",
    "te-en": "Workers కి shade & drinking water చూపించే community లో join అవ్వండి.",
    hi: "कामगारों के लिए पानी और छांव खोजने वाले समुदाय से जुड़ें।",
    "hi-en": "Workers के लिए shade & drinking water ढूंढने वाली community से जुड़ें।",
  },
  name_label: {
    en: "Full name",
    te: "పూర్తి పేరు",
    "te-en": "Full Name",
    hi: "पूरा नाम",
    "hi-en": "Full Name",
  },
  name_placeholder: {
    en: "e.g. Ramesh Kumar",
    te: "ఉదా. రమేష్ కుమార్",
    "te-en": "e.g. Ramesh Kumar",
    hi: "उदा. रमेश कुमार",
    "hi-en": "e.g. Ramesh Kumar",
  },
  confirm_password_label: {
    en: "Confirm password",
    te: "పాస్‌వర్డ్ నిర్ధారించండి",
    "te-en": "Password confirm చేయండి",
    hi: "पासवर्ड की पुष्टि करें",
    "hi-en": "Password confirm करें",
  },
  confirm_password_placeholder: {
    en: "Re-enter your password",
    te: "పాస్‌వర్డ్‌ను మళ్లీ నమోదు చేయండి",
    "te-en": "Password మళ్ళీ enter చేయండి",
    hi: "पासवर्ड दोबारा दर्ज करें",
    "hi-en": "Password दोबारा enter करें",
  },
  password_hint: {
    en: "Must be at least 8 characters",
    te: "కనీసం 8 అక్షరాలు ఉండాలి",
    "te-en": "కనీసం 8 characters ఉండాలి",
    hi: "कम से कम 8 अक्षर होने चाहिए",
    "hi-en": "कम से कम 8 characters होने चाहिए",
  },
  create_account_button: {
    en: "Create account",
    te: "ఖాతా సృష్టించండి",
    "te-en": "Account create చేయండి",
    hi: "खाता बनाएं",
    "hi-en": "Account बनाएं",
  },
  creating_account: {
    en: "Creating account…",
    te: "ఖాతా సృష్టించబడుతోంది…",
    "te-en": "Account create అవుతోంది…",
    hi: "खाता बन रहा है…",
    "hi-en": "Account create हो रहा है…",
  },
  already_have_account: {
    en: "Already have an account?",
    te: "ఇప్పటికే ఖాతా ఉందా?",
    "te-en": "Already account ఉందా?",
    hi: "पहले से खाता है?",
    "hi-en": "Already account है?",
  },
  sign_in_link: {
    en: "Sign in",
    te: "సైన్ ఇన్ చేయండి",
    "te-en": "Sign in అవ్వండి",
    hi: "साइन इन करें",
    "hi-en": "Sign in करें",
  },

  // Password Reset
  reset_password_title: {
    en: "Reset password",
    te: "పాస్‌వర్డ్ రీసెట్",
    "te-en": "Password reset చేయండి",
    hi: "पासवर्ड रीसेट करें",
    "hi-en": "Password reset करें",
  },
  reset_password_subtitle: {
    en: "Enter your registered email address and we will send you a link to reset your password.",
    te: "మీ నమోదిత ఈమెయిల్ ఇవ్వండి, పాస్‌వర్డ్ మార్చడానికి లింక్ పంపుతాము.",
    "te-en": "మీ registered Email ఇవ్వండి, password reset link పంపుతాము.",
    hi: "अपना पंजीकृत ईमेल दर्ज करें, हम पासवर्ड रीसेट करने का लिंक भेजेंगे।",
    "hi-en": "अपना registered Email दर्ज करें, हम password reset link भेजेंगे।",
  },
  send_reset_link: {
    en: "Send reset link",
    te: "రీసెట్ లింక్ పంపండి",
    "te-en": "Reset link పంపండి",
    hi: "रीसेट लिंक भेजें",
    "hi-en": "Reset link भेजें",
  },
  sending_reset_link: {
    en: "Sending link…",
    te: "లింక్ పంపుతున్నాము…",
    "te-en": "Link send అవుతోంది…",
    hi: "लिंक भेजा जा रहा है…",
    "hi-en": "Link send हो रहा है…",
  },
  back_to_sign_in: {
    en: "Back to sign in",
    te: "తిరిగి సైన్ ఇన్‌కు",
    "te-en": "Sign in కి తిరిగి వెళ్ళండి",
    hi: "साइन इन पर वापस जाएं",
    "hi-en": "Sign in पर वापस जाएं",
  },
  reset_instructions_sent: {
    en: "If an account exists with this email, instructions have been sent.",
    te: "ఈ ఈమెయిల్‌తో ఖాతా ఉంటే, సూచనలు పంపబడ్డాయి.",
    "te-en": "ఈ Email తో account ఉంటే, instructions send చేయబడ్డాయి.",
    hi: "यदि इस ईमेल से कोई खाता मौजूद है, तो निर्देश भेज दिए गए हैं।",
    "hi-en": "अगर इस Email से account मौजूद है, तो instructions send कर दिए गए हैं।",
  },

  // Validation Messages
  val_email_required: {
    en: "Please enter your email address",
    te: "దయచేసి ఈమెయిల్ చిరునామాను నమోదు చేయండి",
    "te-en": "దయచేసి Email address enter చేయండి",
    hi: "कृपया अपना ईमेल पता दर्ज करें",
    "hi-en": "कृपया अपना Email address enter करें",
  },
  val_email_invalid: {
    en: "Please enter a valid email address",
    te: "దయచేసి సరైన ఈమెయిల్ చిరునామాను నమోదు చేయండి",
    "te-en": "దయచేసి valid email address enter చేయండి",
    hi: "कृपया एक वैध ईमेल पता दर्ज करें",
    "hi-en": "कृपया valid email address दर्ज करें",
  },
  val_password_required: {
    en: "Please enter your password",
    te: "దయచేసి పాస్‌వర్డ్‌ను నమోదు చేయండి",
    "te-en": "దయచేసి Password enter చేయండి",
    hi: "कृपया पासवर्ड दर्ज करें",
    "hi-en": "कृपया Password enter करें",
  },
  val_password_min: {
    en: "Password must be at least 8 characters",
    te: "పాస్‌వర్డ్ కనీసం 8 అక్షరాలు ఉండాలి",
    "te-en": "Password కనీసం 8 characters ఉండాలి",
    hi: "पासवर्ड कम से कम 8 अक्षरों का होना चाहिए",
    "hi-en": "Password कम से कम 8 characters का होना चाहिए",
  },
  val_name_required: {
    en: "Please enter your full name",
    te: "దయచేసి మీ పూర్తి పేరు నమోదు చేయండి",
    "te-en": "దయచేసి మీ Full Name enter చేయండి",
    hi: "कृपया अपना पूरा नाम दर्ज करें",
    "hi-en": "कृपया अपना Full Name दर्ज करें",
  },
  val_password_mismatch: {
    en: "Passwords do not match",
    te: "పాస్‌వర్డ్‌లు సరిపోలడం లేదు",
    "te-en": "Passwords match అవ్వడం లేదు",
    hi: "पासवर्ड मेल नहीं खा रहे हैं",
    "hi-en": "Passwords match नहीं हो रहे हैं",
  },

  // Main App Navigation
  nav_explore: {
    en: "Explore",
    te: "అన్వేషించండి",
    "te-en": "Explore",
    hi: "खोजें",
    "hi-en": "Explore",
  },
  nav_saved: {
    en: "Saved",
    te: "సేవ్ చేసినవి",
    "te-en": "Saved",
    hi: "सुरक्षित",
    "hi-en": "Saved",
  },
  nav_history: {
    en: "History",
    te: "చరిత్ర",
    "te-en": "History",
    hi: "इतिहास",
    "hi-en": "History",
  },
  nav_report: {
    en: "Report",
    te: "నివేదిక",
    "te-en": "Report",
    hi: "रिपोर्ट",
    "hi-en": "Report",
  },
  nav_profile: {
    en: "Profile",
    te: "ప్రొఫైల్",
    "te-en": "Profile",
    hi: "प्रोफाइल",
    "hi-en": "Profile",
  },

  // Filter Categories
  filter_all: {
    en: "All Places",
    te: "అన్ని ప్రదేశాలు",
    "te-en": "All Places",
    hi: "सभी स्थान",
    "hi-en": "All Places",
  },
  filter_water: {
    en: "Drinking Water",
    te: "తాగునీరు",
    "te-en": "Drinking Water",
    hi: "पीने का पानी",
    "hi-en": "Drinking Water",
  },
  filter_shade: {
    en: "Shade",
    te: "నీడ",
    "te-en": "Shade",
    hi: "छांव",
    "hi-en": "Shade",
  },
  filter_rest: {
    en: "Rest Areas",
    te: "విశ్రాంతి ప్రదేశాలు",
    "te-en": "Rest Areas",
    hi: "विश्राम स्थल",
    "hi-en": "Rest Areas",
  },

  // Explore & Facility Card
  search_placeholder: {
    en: "Search water, shade, or rest spots…",
    te: "నీరు, నీడ లేదా విశ్రాంతి స్థలాలను వెతకండి…",
    "te-en": "Water, shade లేదా rest spots వెతకండి…",
    hi: "पानी, छांव या विश्राम स्थल खोजें…",
    "hi-en": "Water, shade या rest spots search करें…",
  },
  loc_use_location: {
    en: "Use location",
    te: "లొకేషన్ ఉపయోగించండి",
    "te-en": "Location use చేయండి",
    hi: "स्थान का उपयोग करें",
    "hi-en": "Location use करें",
  },
  loc_locating: {
    en: "Locating…",
    te: "లొకేషన్ గుర్తిస్తోంది…",
    "te-en": "Locating…",
    hi: "स्थान खोजा जा रहा है…",
    "hi-en": "Locating…",
  },
  loc_sorted: {
    en: "Sorted by distance from your location.",
    te: "మీ ప్రస్తుత స్థానం నుండి దూరం ప్రకారం క్రమబద్ధీకరించబడింది.",
    "te-en": "మీ location నుండి distance ప్రకారం sort చేయబడింది.",
    hi: "आपके वर्तमान स्थान से दूरी के अनुसार क्रमबद्ध।",
    "hi-en": "आपकी location से distance के अनुसार sorted.",
  },
  loc_prompt: {
    en: "Share location to see distance to nearest spots.",
    te: "సమీప స్థలాల దూరం తెలుసుకోవడానికి లొకేషన్ అనుమతించండి.",
    "te-en": "Nearest spots distance చూడటానికి Location share చేయండి.",
    hi: "नज़दीकी स्थानों की दूरी देखने के लिए स्थान साझा करें।",
    "hi-en": "Nearest spots की distance देखने के लिए Location share करें।",
  },
  trust_recent: {
    en: "Recently confirmed",
    te: "ఇటీవల నిర్ధారించబడింది",
    "te-en": "Recently confirmed",
    hi: "हाल ही में सत्यापित",
    "hi-en": "Recently confirmed",
  },
  trust_stale: {
    en: "Needs Reconfirmation",
    te: "పునః నిర్ధారణ అవసరం",
    "te-en": "Needs Reconfirmation",
    hi: "पुनः पुष्टि आवश्यक",
    "hi-en": "Needs Reconfirmation",
  },
  trust_uncertain: {
    en: "Uncertain status",
    te: "అనిశ్చిత పరిస్థితి",
    "te-en": "Uncertain status",
    hi: "अनिश्चित स्थिति",
    "hi-en": "Uncertain status",
  },
  btn_directions: {
    en: "Get directions",
    te: "దారి చూడండి",
    "te-en": "Directions చూడండి",
    hi: "दिशा-निर्देश देखें",
    "hi-en": "Directions देखें",
  },
  btn_report_problem: {
    en: "Report a problem",
    te: "సమస్యను నివేదించండి",
    "te-en": "Problem Report చేయండి",
    hi: "समस्या दर्ज करें",
    "hi-en": "Problem report करें",
  },
  btn_back_explore: {
    en: "Back to Explore",
    te: "అన్వేషణకు తిరిగి వెళ్లండి",
    "te-en": "Explore కి తిరిగి వెళ్లండి",
    hi: "खोज पर वापस जाएं",
    "hi-en": "Explore पर वापस जाएं",
  },
  save_button: {
    en: "Save",
    te: "సేవ్",
    "te-en": "Save చేయండి",
    hi: "सुरक्षित करें",
    "hi-en": "Save करें",
  },
  saved_button: {
    en: "Saved",
    te: "సేవ్ చేయబడింది",
    "te-en": "Saved",
    hi: "सुरक्षित है",
    "hi-en": "Saved",
  },

  // Settings & Profile
  settings_title: {
    en: "Settings & Preferences",
    te: "సెట్టింగ్‌లు & ప్రాధాన్యతలు",
    "te-en": "Settings & Preferences",
    hi: "सेटिंग्स और प्राथमिकताएं",
    "hi-en": "Settings & Preferences",
  },
  current_language_label: {
    en: "Current language",
    te: "ప్రస్తుత భాష",
    "te-en": "Current Language",
    hi: "वर्तमान भाषा",
    "hi-en": "Current Language",
  },
  profile_guest_title: {
    en: "Browsing as guest",
    te: "అతిథిగా బ్రౌజ్ చేస్తున్నారు",
    "te-en": "Guest గా browse చేస్తున్నారు",
    hi: "अतिथि के रूप में ब्राउज़ कर रहे हैं",
    "hi-en": "Guest के रूप में browse कर रहे हैं",
  },
  profile_guest_body: {
    en: "You have full access to explore water and shade spots. Sign in to save favourites and report status.",
    te: "మీరు నీరు మరియు నీడ స్థలాలను పూర్తిగా చూడవచ్చు. ఇష్టమైన వాటిని భద్రపరచడానికి మరియు స్థితిని నివేదించడానికి సైన్ ఇన్ చేయండి.",
    "te-en":
      "మీరు water & shade spots ని freely explore చేయవచ్చు. Places save చేయడానికి & status report చేయడానికి Sign in అవ్వండి.",
    hi: "आप पानी और छांव के स्थानों को स्वतंत्र रूप से देख सकते हैं। पसंदीदा सुरक्षित करने और रिपोर्ट करने के लिए साइन इन करें।",
    "hi-en":
      "आप water & shade spots freely explore कर सकते हैं। Places save करने और report करने के लिए Sign in करें।",
  },
  sign_out_button: {
    en: "Sign out",
    te: "సైన్ అవుట్",
    "te-en": "Sign out అవ్వండి",
    hi: "साइन आउट",
    "hi-en": "Sign out करें",
  },

  // Map & View Toggle
  view_list: {
    en: "List",
    te: "జాబితా",
    "te-en": "List",
    hi: "सूची",
    "hi-en": "List",
  },
  view_map: {
    en: "Map",
    te: "మ్యాప్",
    "te-en": "Map",
    hi: "मानचित्र",
    "hi-en": "Map",
  },
  map_error_title: {
    en: "Map temporarily unavailable",
    te: "మ్యాప్ అందుబాటులో లేదు",
    "te-en": "Map temporarily unavailable",
    hi: "मानचित्र अस्थायी रूप से अनुपलब्ध है",
    "hi-en": "Map temporarily unavailable",
  },
  map_error_desc: {
    en: "Could not load interactive tiles. You can still explore all spots in List view.",
    te: "మ్యాప్ లోడ్ కాలేదు. మీరు జాబితా వ్యూ ద్వారా స్థలాలను చూడవచ్చు.",
    "te-en": "Map tiles load కాలేదు. మీరు List view ద్వారా places చూడవచ్చు.",
    hi: "मानचित्र लोड नहीं हो सका। आप सूची दृश्य में सभी स्थान देख सकते हैं।",
    "hi-en": "Map load नहीं हो सका। आप List view में spots explore कर सकते हैं।",
  },

  // Demo Login
  demo_account_title: {
    en: "Try Demo Account",
    te: "డెమో ఖాతాను ప్రయత్నించండి",
    "te-en": "Demo Account ప్రయత్నించండి",
    hi: "डेमो खाता आज़माएं",
    "hi-en": "Demo Account आज़माएं",
  },
  demo_account_desc: {
    en: "Test AERA with proposed demo credentials. Fill the fields and press Sign In.",
    te: "సూచించిన డెమో ఆధారాలతో AERAని పరీక్షించండి. వివరాలు నింపి సైన్ ఇన్ నొక్కండి.",
    "te-en": "Proposed demo credentials తో AERA test చేయండి. Fill చేసి Sign In నొక్కండి.",
    hi: "प्रस्तावित डेमो क्रेडेंशियल के साथ AERA का परीक्षण करें। विवरण भरें और साइन इन दबाएं।",
    "hi-en": "Proposed demo credentials से AERA test करें। Fill करके Sign In दबाएं।",
  },
  fill_demo_creds: {
    en: "Fill Demo Credentials",
    te: "డెమో వివరాలు నింపండి",
    "te-en": "Demo Credentials Fill చేయండి",
    hi: "डेमो क्रेडेंशियल भरें",
    "hi-en": "Demo Credentials भरें",
  },

  // Start Over / Restart Option
  start_over_title: {
    en: "Start Over",
    te: "మొదటి నుండి ప్రారంభించండి",
    "te-en": "Start Over చేయండి",
    hi: "फिर से शुरू करें",
    "hi-en": "Start Over करें",
  },
  start_over_desc: {
    en: "Restart the onboarding flow from Language Selection without losing saved places.",
    te: "సేవ్ చేసిన స్థలాలు కోల్పోకుండా భాష ఎంపిక నుండి ప్రయాణాన్ని మళ్లీ ప్రారంభించండి.",
    "te-en": "Saved places lose అవ్వకుండా Language Selection నుండి restart చేయండి.",
    hi: "सुरक्षित स्थानों को खोए बिना भाषा चयन से पुनः आरंभ करें।",
    "hi-en": "Saved places lose किए बिना Language Selection से restart करें।",
  },
  start_over_confirm_title: {
    en: "Restart AERA Flow?",
    te: "AERA ప్రయాణాన్ని మళ్లీ ప్రారంభించాలా?",
    "te-en": "AERA Flow Restart చేయాలా?",
    hi: "क्या आप AERA प्रवाह पुनः आरंभ करना चाहते हैं?",
    "hi-en": "AERA Flow Restart करना चाहते हैं?",
  },
  start_over_confirm_body: {
    en: "This will clear temporary search and filter state, and return you to Language Selection. Your saved places and reports remain safe.",
    te: "ఇది తాత్కాలిక శోధన మరియు ఫిల్టర్‌లను తొలగించి, మిమ్మల్ని భాష ఎంపికకు తీసుకెళ్తుంది. మీ సేవ్ చేసిన స్థలాలు సురక్షితంగా ఉంటాయి.",
    "te-en":
      "ఇది temporary search & filters ని clear చేసి Language Selection కి పంపుతుంది. మీ saved places & reports safe గా ఉంటాయి.",
    hi: "यह अस्थायी खोज और फ़िल्टर साफ़ करेगा और आपको भाषा चयन पर ले जाएगा। आपके सुरक्षित स्थान सुरक्षित रहेंगे।",
    "hi-en":
      "यह temporary search और filters clear करेगा और आपको Language Selection पर ले जाएगा। आपके saved places safe रहेंगे।",
  },
  restart_signout: {
    en: "Restart & Sign Out",
    te: "రీస్టార్ట్ & సైన్ అవుట్",
    "te-en": "Restart & Sign Out",
    hi: "रीस्टार्ट और साइन आउट",
    "hi-en": "Restart & Sign Out",
  },
  restart_keep_signed_in: {
    en: "Restart (Keep Signed In)",
    te: "రీస్టార్ట్ (లాగిన్‌లో ఉండండి)",
    "te-en": "Restart (Signed in గా ఉండండి)",
    hi: "रीस्टार्ट (साइन इन रहें)",
    "hi-en": "Restart (Signed In रहें)",
  },
  cancel: {
    en: "Cancel",
    te: "రద్దు చేయండి",
    "te-en": "Cancel",
    hi: "रद्द करें",
    "hi-en": "Cancel",
  },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, lang: SupportedLanguage): string {
  const item = translations[key];
  if (!item) return key;
  return item[lang] || item["en"] || key;
}
