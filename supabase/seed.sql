-- Lotus Lanka Tours — Seed Data

-- ─── Tours ───
INSERT INTO tours (slug, title, description, category, duration_days, max_group_size, difficulty, price_per_person, price_private, cover_image_url, includes, excludes, is_published, is_featured) VALUES
(
  'sigiriya-cultural-day-tour',
  '{"en":"Sigiriya & Dambulla Cultural Day Tour","si":"සීගිරිය සහ දඹුල්ල සංස්කෘතික දවස් චාරිකාව","ta":"சிகிரியா & டம்புல்லா கலாச்சார நாள் சுற்றுலா"}',
  '{"en":"<p>Explore the iconic Sigiriya Lion Rock fortress and the ancient Dambulla Cave Temple on this unforgettable full-day cultural tour from Colombo. Your experienced guide will bring the rich history of these UNESCO World Heritage Sites to life.</p>","si":"<p>කොළඹ සිට මෙම අමතක නොවිය හැකි සම්පූර්ණ දිනක සංස්කෘතික චාරිකාවේ දී නිකොළොස් සිගිරිය සිංහ ගල් බලකොටුව සහ පුරාණ දඹුල්ල ගුහා විහාරය ගවේෂණය කරන්න.</p>","ta":"<p>கொழும்பிலிருந்து இந்த மறக்கமுடியாத ஒரு நாள் கலாச்சார சுற்றுலாவில் சிகிரியா சிங்க பாறை கோட்டையையும் பண்டைய டம்புல்லா குகைக் கோயிலையும் ஆராயுங்கள்.</p>"}',
  'cultural', 1, 12, 'moderate', 85.00, 220.00,
  'https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?w=800',
  ARRAY['Air-conditioned vehicle','Licensed guide','Entrance fees','Bottled water','Hotel pickup & drop'],
  ARRAY['Meals','Personal expenses','Gratuities'],
  TRUE, TRUE
),
(
  'yala-safari-2day',
  '{"en":"Yala National Park 2-Day Safari","si":"යාල ජාතික උද්‍යාන 2-දින සෆාරි","ta":"யாலா தேசிய பூங்கா 2-நாள் சஃபாரி"}',
  '{"en":"<p>Experience Sri Lanka wild side on a thrilling 2-day safari at Yala National Park, home to the world highest density of leopards, as well as elephants, sloth bears, and exotic birdlife.</p>","si":"<p>ලෝකයේ ඉහළම චිතල් ඝනත්වය ඇති යාල ජාතික උද්‍යානයේ짜릿한 2-දින සෆාරි රිය ගමනකින් ශ්‍රී ලංකාවේ වන සත්ත්ව ලෝකය අත්විඳින්න.</p>","ta":"<p>உலகின் மிக அதிக சிறுத்தை அடர்த்தி கொண்ட யாலா தேசிய பூங்காவில் 2 நாள் சஃபாரியில் இலங்கையின் வனவிலங்கு உலகை அனுபவியுங்கள்.</p>"}',
  'wildlife', 2, 8, 'easy', 165.00, 420.00,
  'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800',
  ARRAY['Safari jeep','Licensed naturalist guide','2x safari drives','Accommodation (1 night)','All meals','National park fees'],
  ARRAY['Alcoholic beverages','Personal items','Tips'],
  TRUE, TRUE
),
(
  'mirissa-whale-watching',
  '{"en":"Mirissa Whale Watching & Beach Experience","si":"මිරිස්ස තල් මාළු නැරඹීම සහ වෙරළ රිය ගමන","ta":"மிரிஸ்ஸா திமிங்கல வேட்டை & கடற்கரை அனுபவம்"}',
  '{"en":"<p>Set sail from Mirissa harbor on a morning whale-watching cruise to spot blue whales, sperm whales, and spinner dolphins. Spend your afternoon relaxing on the famous crescent-shaped Mirissa beach.</p>","si":"<p>නිල් තල් මාළුන්, ස්පර්ම් තල් මාළුන් සහ ස්පිනර් ඩොල්ෆින් දකීමට උදෑසන තල් මාළු නැරඹීම ගමනකින් මිරිස්ස වරායෙන් යාත්‍රා කරන්න.</p>","ta":"<p>நீல திமிங்கிலங்கள், ஸ்பெர்ம் திமிங்கிலங்கள் மற்றும் ஸ்பின்னர் டால்பின்களை பார்க்க காலை திமிங்கல நோக்கல் சுற்றுலாவில் மிரிஸ்ஸா துறைமுகத்திலிருந்து புறப்படுங்கள்.</p>"}',
  'beach', 1, 15, 'easy', 65.00, 180.00,
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
  ARRAY['Boat trip','Licensed guide','Light breakfast','Hotel transfers'],
  ARRAY['Lunch','Snorkeling gear (rental available)'],
  TRUE, FALSE
),
(
  'ella-tea-country-3day',
  '{"en":"Ella & Tea Country 3-Day Escape","si":"එල්ල සහ තේ දේශය 3-දින ගමන","ta":"எல்லா & தேயிலை நாட்டு 3-நாள் வெளியேற்றம்"}',
  '{"en":"<p>Journey through misty mountain passes, verdant tea estates, and picturesque waterfalls on this 3-day highland retreat. Hike to Little Adams Peak at sunrise, visit a working tea factory, and relax in colonial-era bungalows.</p>","si":"<p>මෙම 3-දින කඳු රටේ නිවාඩු ගමනේ ආවරණ කඳු මාර්ග, බොහෝ තේ වතු, සහ මනොරම දිය ඇල්ල හරහා ගමන් කරන්න.</p>","ta":"<p>மூடுபனி மலை கணவாய்கள், பசுமையான தேயிலை தோட்டங்கள் மற்றும் அழகான நீர்வீழ்ச்சிகள் வழியாக இந்த 3-நாள் மலைநாட்டு ஓய்வு பயணத்தில் பயணியுங்கள்.</p>"}',
  'multiday', 3, 10, 'moderate', 195.00, 520.00,
  'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=800',
  ARRAY['Transport','2 nights accommodation','Breakfasts','Licensed guide','Train tickets (Kandy-Ella)','Tea factory visit'],
  ARRAY['Dinners','Alcoholic beverages','Personal expenses'],
  TRUE, TRUE
);

-- ─── Blog Posts ───
INSERT INTO blog_posts (slug, title, content, author, category, is_published) VALUES
(
  'best-time-to-visit-sri-lanka',
  '{"en":"Best Time to Visit Sri Lanka: A Month-by-Month Guide","si":"ශ්‍රී ලංකාවට යාමට හොඳම කාලය","ta":"இலங்கைக்கு செல்ல சிறந்த நேரம்"}',
  '{"en":"<p>Sri Lanka is a year-round destination, but timing your visit right can make a world of difference. This comprehensive guide breaks down each month to help you plan the perfect trip.</p><h2>November to April – Southwest Dry Season</h2><p>The best time for the southern and western coasts, Colombo, Kandy, and the Hill Country. Expect clear skies, calm seas, and ideal beach conditions.</p><h2>May to September – Northeast Dry Season</h2><p>The east coast shines during these months – Trincomalee, Arugam Bay, and Batticaloa offer pristine beaches and excellent surfing.</p>","si":"<p>ශ්‍රී ලංකාව සෑම වසරකම ගමනාන්ත ස්ථානයක් වේ.</p>","ta":"<p>இலங்கை ஆண்டு முழுவதும் சுற்றுலா தலமாகும்.</p>"}',
  'Lotus Lanka Team', 'Travel Tips', TRUE
),
(
  'top-10-wildlife-experiences',
  '{"en":"Top 10 Wildlife Experiences in Sri Lanka","si":"ශ්‍රී ලංකාවේ ඉහළ 10 වන වන සත්ත්ව අත්දැකීම්","ta":"இலங்கையின் சிறந்த 10 வனவிலங்கு அனுபவங்கள்"}',
  '{"en":"<p>From leopard sightings at Yala to whale watching off Mirissa, Sri Lanka punches well above its weight when it comes to wildlife encounters. Here are the top 10 experiences you should not miss.</p><p>1. Leopard safari at Yala National Park...</p>","si":"<p>ශ්‍රී ලංකාව ස්වභාව ධර්ම ප්‍රේමීන්ට ස්වර්ගයකි.</p>","ta":"<p>இலங்கை இயற்கை காதலர்களுக்கு சொர்க்கம்.</p>"}',
  'Kasun Fernando', 'Wildlife', TRUE
);

-- ─── Reviews ───
INSERT INTO reviews (tour_id, reviewer_name, reviewer_country, rating, comment, is_approved)
SELECT id, 'Sarah M.', 'United Kingdom', 5, 'Absolutely incredible experience! Our guide was knowledgeable and the Sigiriya climb was breathtaking. Highly recommend Lotus Lanka Tours!', TRUE FROM tours WHERE slug = 'sigiriya-cultural-day-tour';

INSERT INTO reviews (tour_id, reviewer_name, reviewer_country, rating, comment, is_approved)
SELECT id, 'James & Emily T.', 'Australia', 5, 'The Yala safari exceeded all our expectations. We spotted 3 leopards, a sloth bear, and countless elephants. Truly magical!', TRUE FROM tours WHERE slug = 'yala-safari-2day';

INSERT INTO reviews (tour_id, reviewer_name, reviewer_country, rating, comment, is_approved)
SELECT id, 'Priya N.', 'United States', 5, 'The Ella trip was the highlight of our Sri Lanka honeymoon. Train journey was stunning. Everything perfectly organized!', TRUE FROM tours WHERE slug = 'ella-tea-country-3day';

INSERT INTO reviews (reviewer_name, reviewer_country, rating, comment, is_approved)
VALUES ('Hans K.', 'Germany', 4, 'Very professional team, beautiful country. Lotus Lanka Tours made everything easy and stress-free.', TRUE);
