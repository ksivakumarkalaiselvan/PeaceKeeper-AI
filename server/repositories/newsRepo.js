const SheetRepository = require('./SheetRepository');

const initialNews = [
  {
    id: 'nws_001',
    title: 'Unconfirmed reports claim immediate truce declared in Eastern Front',
    sourceUrl: 'https://social-wire-news.net/claim-truce-8912',
    content: 'Viral social media posts assert an emergency armistice was signed behind closed doors, but official observers report ongoing active shelling.',
    submittedBy: 'usr_obs01',
    verified: false,
    fakeNewsScore: 88,
    sentimentScore: -0.65,
    relatedRegion: 'Ukraine',
    createdAt: '2026-07-28T11:00:00.000Z'
  },
  {
    id: 'nws_002',
    title: 'UN Envoy requests urgent humanitarian corridor expansion in Sudan',
    sourceUrl: 'https://global-peace-bulletin.org/news/sudan-humanitarian-corridor',
    content: 'Special representative urges all warring factions to adhere to safe-zone protocols to permit food and medical relief convoy access.',
    submittedBy: 'usr_admin01',
    verified: true,
    fakeNewsScore: 8,
    sentimentScore: -0.25,
    relatedRegion: 'Sudan',
    createdAt: '2026-07-27T15:30:00.000Z'
  },
  {
    id: 'nws_003',
    title: 'Increased naval activity logged in international waters of East Asia',
    sourceUrl: 'https://maritime-defense-watch.com/east-asia-transit-log',
    content: 'Satellite and transponder logs confirm simultaneous deployment of surface vessel task groups across international maritime corridors.',
    submittedBy: 'usr_obs01',
    verified: true,
    fakeNewsScore: 12,
    sentimentScore: -0.40,
    relatedRegion: 'Taiwan Strait',
    createdAt: '2026-07-26T09:20:00.000Z'
  }
];

class NewsRepository extends SheetRepository {
  constructor() {
    super('news', initialNews);
  }
}

module.exports = new NewsRepository();
